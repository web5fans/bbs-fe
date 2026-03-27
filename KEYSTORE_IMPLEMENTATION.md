# Keystore 集成总结

## 概述

本项目已从本地私钥存储迁移到 Keystore 架构。私钥不再存储在应用域名的 localStorage 中，而是通过 Keystore（独立域名）进行管理。

## 架构变化

### 之前 (Before)
```
用户 -> bbs-fe注册 -> 生成keypair -> 私钥存localStorage -> 操作需签名时直接使用本地私钥
```

### 之后 (After)
```
用户 -> Portal/me.web5.fans注册 -> 私钥存Keystore
       ↓
    用户 -> bbs-fe登录 -> 连接Keystore -> 请求Keystore签名
```

## 核心组件

### 1. KeystoreClient (`src/lib/keystore-client.ts`)

本地实现的 Keystore 客户端（非 Module Federation），通过 `window.open` 打开 Keystore 页面进行通信。

**主要方法：**
- `connect()`: 尝试与 Keystore 建立连接
- `getDIDKey()`: 获取当前激活的 DID
- `signMessage(message)`: 请求 Keystore 对消息签名
- `disconnect()`: 断开连接

**关键实现细节：**
- 使用 `postMessage` 进行跨窗口通信
- 轮询机制：打开窗口后每 100ms 尝试连接，持续 25 秒
- 请求超时：30 秒

### 2. KeystoreContext (`src/contexts/KeystoreContext.tsx`)

提供全局 Keystore 状态管理。

```typescript
interface KeystoreContextType {
  client: KeystoreClient | null;      // Keystore 客户端实例
  connected: boolean;                  // 是否已连接
  didKey: string | null;              // 当前 DID
  connect: () => Promise<void>;       // 手动连接方法
  isConnecting: boolean;              // 连接中状态
}
```

**使用方式：**
```typescript
const { client, connected, didKey, connect } = useKeystore();

// 连接 Keystore
await connect();

// 请求签名
const signature = await client.signMessage(messageBytes);
```

### 3. 状态栏图标 (`src/components/ConnectionStatusIcons/`)

右上角常驻两个状态图标：
- **钱包图标**: 显示 CKB 钱包连接状态
- **Keystore 图标**: 显示 Keystore 连接状态

点击断开状态的图标可触发连接。

## PDS Session 管理

### 问题背景

登录后需要恢复 PDS（Personal Data Server）的 session，否则调用 PDS API 时会报 `AuthMissing` 错误。

### 解决方案

在 `userInfo.ts` 中实现 session 恢复：

```typescript
// 登录成功后恢复 PDS session
await getPDSClient().resumeSession({
  accessJwt: userInfoRes.accessJwt,
  refreshJwt: userInfoRes.refreshJwt,
  did: userInfoRes.did,
  handle: userInfoRes.handle,
  active: true,
});

// 页面初始化时也恢复 session
if (hasToken.accessJwt && hasToken.refreshJwt) {
  await getPDSClient().resumeSession({...});
}
```

## 存储结构变化

### TokenStorageType

```typescript
// Before
{
  did: string;
  walletAddress: string;
  signKey: string;  // 私钥直接存储
}

// After
{
  did: string;
  walletAddress: string;
  signingKeyDid: string;  // 只存DID，不存私钥
  accessJwt?: string;     // PDS访问令牌
  refreshJwt?: string;    // PDS刷新令牌
}
```

## 关键文件修改

### 1. 登录页面 (`src/app/register-login/index.tsx`)

- 简化注册流程，引导用户到 Portal 注册
- 实现 Keystore 连接 + 自动登录
- 防止重复登录：使用 `useRef` 标志位

### 2. 用户状态管理 (`src/store/userInfo.ts`)

- `web5Login`: 添加 PDS session 恢复
- `initialize`: 页面刷新时恢复 session
- `writeProfile`: 自动创建默认 profile

### 3. PDS 操作 (`src/app/posts/utils.ts`)

所有签名操作改为通过 Keystore：

```typescript
// Before
const keyPair = await Secp256k1Keypair.import(signKey);
const sig = await keyPair.sign(encoded);

// After
const sig = await client.signMessage(encoded);
```

### 4. 自动保存草稿 (`src/hooks/useAutoSaveDraft.ts`)

- 添加 `client` 和 `didKey` 参数
- 调用前检查 Keystore 连接状态

## UI 状态指示

### 连接状态组件 (`src/components/ConnectionStatus/`)

在页面顶部显示连接状态横幅：
- 钱包未连接时显示"连接钱包"按钮
- Keystore 未连接时显示"打开 Keystore"按钮

## 已知问题和解决方案

### 1. 登录后反复调用 createSession

**原因**: useEffect 依赖项变化导致重复触发

**解决**: 添加 `useRef` 标志位确保只执行一次

### 2. 点赞/发帖报 `Cannot read properties of undefined (reading 'signMessage')`

**原因**: 调用 `postsWritesPDSOperation` 时未传递 `client` 和 `didKey`

**解决**: 所有调用点添加参数检查

### 3. `preDirectWrites` 400 Bad Request

**原因**: PDS session 未恢复，请求缺少认证信息

**解决**: 登录和页面初始化时调用 `resumeSession()`

### 4. 个人中心首次加载报 500

**原因**: `writeProfile` 调用时未传入 `client` 和 `didKey`

**解决**: 在 `useCurrentUser` hook 中封装 `writeProfile`，自动从 store 获取参数

## 开发注意事项

1. **始终检查 Keystore 连接状态** before 调用签名相关操作
2. **传递 client 和 didKey** 给所有需要签名的函数
3. **正确处理 PDS session** 恢复和刷新
4. **防止重复登录** 使用标志位保护

## 参考链接

- Keystore 项目: `modules/apps/keystore`
- 原始迁移文档: `switch-keystore.md`
