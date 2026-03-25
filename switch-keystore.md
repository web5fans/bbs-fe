# key存储切换至keystore

## 现状
用户在注册DID的时候会生成一个keypair，私钥（sign key）目前的实现会被存在浏览器的localstorage中，当前网站的域名下。

但是该DID是可以登录多个应用的，用户如果要登录别的应用，就需要在本应用中导出，然后再导入到别的应用中。

我们后来实现了 keystore，可以认为是一个简单的web钱包。提供私钥保管，以及获取公钥，签名，验签等接口。

它将私钥（sign key）存储在keystore的域名下，虽然依然是保存在浏览器的localstorage中，但是它是独立于应用的。

这样用户在不同应用中切换就无需进行导入导出操作了。

而且应用无法直接访问私钥，会更安全。

## keystore 架构分析

### 核心组件

1. **KeystoreClient** (`src/KeystoreClient.ts`)
   - 通过iframe嵌入keystore域名下的`bridge.html`
   - 使用postMessage与keystore进行跨域通信
   - 提供以下主要方法：
     - `connect()`: 初始化iframe连接，超时5秒，带重试机制
     - `getDIDKey()`: 获取当前激活的signing key的DID (did:key格式)
     - `signMessage(message: Uint8Array)`: 请求keystore对消息进行签名，返回签名结果
     - `verifySignature(didKey, message, signature)`: 验证签名
     - `disconnect()`: 清理iframe和事件监听

2. **Bridge** (`src/bridge.ts`)
   - 运行在keystore域名下的iframe中
   - 维护origin白名单，只有白名单中的域名可以调用
   - 实际执行签名操作（调用crypto模块）
   - 私钥始终保存在keystore域名的localStorage中

3. **存储层** (`src/utils/storage.ts`)
   - `web5_keystore_state`: 存储keys列表和activeKeyId
   - `web5_keystore_origin_whitelist`: 自定义白名单
   - 默认白名单包含：`https://www.bbsfans.dev`, `https://console.web5.fans`, `https://me.web5.fans`等

4. **加密层** (`src/utils/crypto.ts`)
   - 使用`@atproto/crypto`的`Secp256k1Keypair`
   - 支持Secp256k1密钥对的生成、导入、签名、验证

### 通信流程

```
bbs-fe (应用域名)
  ↓ postMessage
KeystoreClient
  ↓ iframe.src
keystore.web5.fans/bridge.html (keystore域名)
  ↓ 直接访问
localStorage (keystore域名下)
```

## Portal使用参考

Portal通过Module Federation引入keystore模块：

```typescript
// vite.config.ts 配置
federation({
  remotes: {
    keystore: 'http://localhost:3001/assets/remoteEntry.js',
  }
})

// remotes.d.ts 类型声明
declare module 'keystore/KeystoreClient' {
  export class KeystoreClient {
    constructor(bridgeUrl: string);
    connect(): Promise<void>;
    getDIDKey(): Promise<string>;
    signMessage(message: Uint8Array): Promise<Uint8Array>;
  }
}
```

使用方式：
```typescript
// 1. 初始化Client
const client = new KeystoreClient(KEY_STORE_BRIDGE_URL);
await client.connect();

// 2. 获取DID Key
const didKey = await client.getDIDKey();

// 3. 请求签名（不接触私钥）
const signature = await client.signMessage(messageBytes);
```

## bbs-fe 当前实现分析

### 当前signKey存储方式

```typescript
// src/lib/storage.ts
const ACCESS_TOKEN_STORE_KEY = '@bbs:client';

export type TokenStorageType = {
  did: string
  walletAddress: string
  signKey: string  // 私钥直接存储
}

// 直接存储在localStorage
storage.setToken({ did, signKey, walletAddress });
```

### 当前签名调用点

需要修改的文件（共11个）：

| 文件路径 | 当前用法 | 修改方式 |
|---------|---------|---------|
| `src/lib/signing-key.ts` | `Secp256k1Keypair.import(signKey)` + `keyPair.sign()` | 使用`client.signMessage()` |
| `src/lib/user-account.ts` | `Secp256k1Keypair.import(signKey)` | 使用`client.signMessage()` |
| `src/app/posts/utils.ts` | `Secp256k1Keypair.import(signKey)` + `keyPair.sign()` | 使用`client.signMessage()` |
| `src/app/posts/[postId]/.../Donate/TipModal.tsx` | `Secp256k1Keypair.import(signKey)` | 使用`client.signMessage()` |
| `src/app/section/fund/.../DonateModal/index.tsx` | `Secp256k1Keypair.import(signKey)` | 使用`client.signMessage()` |
| `src/hooks/useCreateAccount.ts` | 生成keypair并导出私钥存储 | 生成后导入keystore，不再本地存储 |

## 简化方案

**核心原则**: 用户统一到Portal注册，私钥保存在Keystore；bbs-fe只负责登录后的使用，不再处理注册和私钥存储。

### 流程变化

```
[Before]
用户 -> bbs-fe注册 -> 生成keypair -> 私钥存localStorage -> 操作需签名时直接使用本地私钥

[After]
用户 -> Portal注册 -> 生成keypair -> 私钥存Keystore
       ↓
    用户 -> bbs-fe登录 -> 连接Keystore获取签名能力 -> 操作需签名时请求Keystore签名
```

### bbs-fe职责变化

| 功能 | Before | After |
|-----|--------|-------|
| 注册 | ✅ 在bbs-fe完成 | ❌ 删除，引导去Portal |
| 私钥存储 | ✅ 存localStorage | ❌ 完全不存储 |
| 导入导出 | ✅ 支持QRCode导入导出 | ❌ 删除 |
| 登录 | ✅ 本地key验证 | ✅ 通过Keystore签名验证 |
| 发帖/打赏等签名操作 | ✅ 本地私钥签名 | ✅ 请求Keystore签名 |
| 存储信息 | did, walletAddress, signKey | did, walletAddress（signKey移除） |

## 实施方案

### 阶段1: 删除注册相关代码

#### 1.1 删除/简化文件

需要删除或大幅简化的文件：

| 文件路径 | 操作 | 说明 |
|---------|------|------|
| `src/hooks/useCreateAccount.ts` | **删除** | 完整的注册逻辑，不再需要 |
| `src/app/register-login/(components)/Steps/**` | **删除** | 注册步骤组件 |
| `src/app/register-login/(components)/ImportDid/**` | **删除** | 导入功能 |
| `src/app/user-center/_components/KeyQRCodeModal/**` | **删除** | 导出QRCode功能 |
| `src/app/register-login/index.tsx` | **简化** | 保留登录入口，删除注册UI |
| `src/components/ExportWeb5DidModal/**` | **删除** | 导出功能 |

#### 1.2 登录页面改造

`src/app/register-login/index.tsx`简化为：

```tsx
export default function LoginPage() {
  return (
    <div>
      <h1>登录到 BBS</h1>
      
      {/* 未注册用户引导 */}
      <div className="register-hint">
        <p>还没有账号？</p>
        <a 
          href="https://me.web5.fans" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          去 Portal 注册
        </a>
      </div>
      
      {/* 登录逻辑：连接Keystore验证 */}
      <LoginButton />
    </div>
  );
}
```

### 阶段2: 集成Keystore

#### 2.1 配置Module Federation

在`next.config.ts`中添加：

```typescript
const NextFederationPlugin = require('@module-federation/nextjs-mf');

module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'bbs-fe',
        remotes: {
          keystore: 'keystore@https://keystore.web5.fans/assets/remoteEntry.js',
        },
      })
    );
    return config;
  },
};
```

#### 2.2 添加类型声明

创建`src/types/keystore.d.ts`：

```typescript
declare module 'keystore/KeystoreClient' {
  export class KeystoreClient {
    constructor(bridgeUrl: string);
    connect(): Promise<void>;
    disconnect(): void;
    getDIDKey(): Promise<string>;
    signMessage(message: Uint8Array): Promise<Uint8Array>;
    verifySignature(didKey: string, message: Uint8Array, signature: Uint8Array): Promise<boolean>;
  }
}

declare module 'keystore/constants' {
  export const KEY_STORE_URL: string;
  export const KEY_STORE_BRIDGE_URL: string;
}
```

#### 2.3 创建KeystoreContext

新建`src/contexts/KeystoreContext.tsx`：

```typescript
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { KeystoreClient } from 'keystore/KeystoreClient';
import { KEY_STORE_BRIDGE_URL } from 'keystore/constants';

interface KeystoreContextType {
  client: KeystoreClient | null;
  connected: boolean;
  didKey: string | null;
  isLoading: boolean;
  error: string | null;
}

const KeystoreContext = createContext<KeystoreContextType | null>(null);

export function KeystoreProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<KeystoreClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [didKey, setDidKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initKeystore = async () => {
      try {
        const c = new KeystoreClient(KEY_STORE_BRIDGE_URL);
        setClient(c);
        
        await c.connect();
        setConnected(true);
        
        try {
          const key = await c.getDIDKey();
          setDidKey(key);
        } catch (err) {
          console.log('No active key in keystore');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect keystore');
      } finally {
        setIsLoading(false);
      }
    };

    initKeystore();

    return () => {
      client?.disconnect();
    };
  }, []);

  return (
    <KeystoreContext.Provider value={{ client, connected, didKey, isLoading, error }}>
      {children}
    </KeystoreContext.Provider>
  );
}

export function useKeystore() {
  const context = useContext(KeystoreContext);
  if (!context) {
    throw new Error('useKeystore must be used within KeystoreProvider');
  }
  return context;
}
```

### 阶段3: 修改存储结构

#### 3.1 更新TokenStorageType

修改`src/lib/storage.ts`：

```typescript
export type TokenStorageType = {
  did: string           // 用户DID（did:ckb:...）
  walletAddress: string // CKB钱包地址
  // signKey: string    // 删除：不再存储私钥
  signingKeyDid: string // 签名密钥DID（did:key:...），用于验证
  accessJwt?: string    // 可选：PDS访问token
  refreshJwt?: string   // 可选：PDS刷新token
}
```

### 阶段4: 修改签名相关代码

所有需要签名的操作都改为通过KeystoreClient请求签名。

#### 4.1 重写`src/lib/signing-key.ts`

```typescript
import { useKeystore } from "@/contexts/KeystoreContext";
import storage from "@/lib/storage";
import dayjs from "dayjs";
import * as cbor from "@ipld/dag-cbor";
import { uint8ArrayToHex } from "@/lib/dag-cbor";

export default async function getSigningKeyInfo(params?: Record<string, any>) {
  const { client, connected, didKey } = useKeystore();
  
  if (!connected || !client) {
    throw new Error('Keystore not connected');
  }
  
  if (!didKey) {
    throw new Error('No active signing key in keystore. Please register at Portal first.');
  }

  // 从localStorage获取用户DID
  const tokenInfo = storage.getToken();
  if (!tokenInfo?.did) {
    throw new Error('User not logged in');
  }

  let signed_bytes;
  let format_params;

  if (params) {
    const paramsObj = {
      ...params,
      timestamp: dayjs().utc().unix()
    };

    const encoded = cbor.encode(paramsObj);
    // 通过Keystore签名，不接触私钥
    const sig = await client.signMessage(encoded);

    signed_bytes = uint8ArrayToHex(sig);
    format_params = paramsObj;
  }

  return {
    did: tokenInfo.did,        // 用户DID（did:ckb:...）
    signing_key_did: didKey,   // 签名密钥DID（did:key:...）
    signed_bytes,
    format_params
  };
}
```

#### 4.2 修改其他签名调用点

需要修改的文件（使用Keystore签名替代本地私钥）：

| 文件路径 | 当前用法 | 修改方式 |
|---------|---------|---------|
| `src/lib/user-account.ts` | `Secp256k1Keypair.import(signKey)` | 通过context获取client.signMessage |
| `src/app/posts/utils.ts` | `Secp256k1Keypair.import(signKey)` | 通过context获取client.signMessage |
| `src/app/posts/[postId]/.../Donate/TipModal.tsx` | `Secp256k1Keypair.import(signKey)` | 通过context获取client.signMessage |
| `src/app/section/fund/.../DonateModal/index.tsx` | `Secp256k1Keypair.import(signKey)` | 通过context获取client.signMessage |

**签名调用统一模式**：

```typescript
// Before
const storageInfo = storage.getToken();
const keyPair = await Secp256k1Keypair.import(storageInfo.signKey.slice(2));
const signature = await keyPair.sign(message);

// After
const { client } = useKeystore();
const signature = await client.signMessage(message);
```

### 阶段5: 登录流程改造

#### 5.1 新登录流程

```
用户访问bbs-fe
    ↓
点击"登录"
    ↓
初始化KeystoreClient（连接iframe）
    ↓
调用client.getDIDKey()获取signing key DID
    ↓
验证signing key与用户DID的绑定关系（调用后端API）
    ↓
登录成功，存储{did, walletAddress, signingKeyDid}到localStorage
```

#### 5.2 登录组件示例

```typescript
'use client';

import { useKeystore } from '@/contexts/KeystoreContext';
import storage from '@/lib/storage';
import { useState } from 'react';

export function LoginButton() {
  const { client, connected, didKey, isLoading } = useKeystore();
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!connected || !client || !didKey) {
      alert('Please make sure you have registered at Portal and have an active key in Keystore');
      return;
    }

    setLoggingIn(true);
    try {
      // 1. 获取signing key DID
      const signingKeyDid = await client.getDIDKey();
      
      // 2. 验证登录（后端需要验证signing key与用户DID的对应关系）
      const loginResult = await verifyLoginWithSigningKey(signingKeyDid);
      
      // 3. 存储应用信息（不含私钥）
      storage.setToken({
        did: loginResult.did,
        walletAddress: loginResult.ckbAddress,
        signingKeyDid: signingKeyDid,
        accessJwt: loginResult.accessJwt,
        refreshJwt: loginResult.refreshJwt,
      });
      
      // 登录成功，刷新页面或跳转
      window.location.reload();
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: ' + error.message);
    } finally {
      setLoggingIn(false);
    }
  };

  if (isLoading) return <button disabled>Loading Keystore...</button>;
  if (!connected) return <button disabled>Keystore not available</button>;
  if (!didKey) return (
    <div>
      <p>No signing key found in Keystore</p>
      <a href="https://me.web5.fans" target="_blank">Go to Portal to register</a>
    </div>
  );

  return (
    <button onClick={handleLogin} disabled={loggingIn}>
      {loggingIn ? 'Logging in...' : 'Login with Keystore'}
    </button>
  );
}
```

## 待确认问题

1. **登录验证方式**:
   - 当前登录验证需要后端配合验证signing key DID与用户DID的绑定关系
   - 后端API是否需要调整？

2. **已登录状态保持**:
   - 当前使用PDS session（accessJwt/refreshJwt）
   - 是否需要同时保持Keystore连接？

3. **Module Federation在Next.js中的配置**:
   - 需要验证`@module-federation/nextjs-mf`的配置方式
   - 可能需要调整构建配置

## 实施顺序建议

1. **第一步**: 配置Module Federation，添加KeystoreContext（不影响现有功能）
2. **第二步**: 删除注册相关代码，简化登录页面，添加Portal注册引导
3. **第三步**: 修改登录逻辑，改为通过Keystore验证
4. **第四步**: 修改所有签名调用点，使用KeystoreClient.signMessage
5. **第五步**: 删除Import/Export相关UI和逻辑
6. **第六步**: 清理localStorage中的signKey（存量用户数据）

## 关键变化总结

### 删除的功能
- 用户注册（引导到Portal）
- QRCode导入导出
- 本地私钥存储
- 注册向导相关组件

### 新增的功能
- Keystore集成（Module Federation）
- KeystoreContext（全局keystore连接管理）
- 登录时验证Keystore key

### 修改的功能
- 所有签名操作改为通过Keystore
- 存储结构（移除signKey，保留did/walletAddress/signingKeyDid）
- 登录流程（验证Keystore中的key）
