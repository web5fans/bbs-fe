# Keystore 和钱包连接状态管理方案

## 需求
- 刷新页面或重新进入 BBS 时，检测 Keystore 和钱包的连接状态
- 如果连接断开，提示用户通过按钮重新连接
- 不自动弹窗，避免浏览器拦截

## 现状分析

### Keystore 连接
- `KeystoreContext` 管理连接状态
- 通过 `window.open()` 打开 keystore 页面
- 通过 postMessage 通信

### 钱包连接
- `@ckb-ccc/connector-react` 管理连接
- 通过 `ccc.useCcc()` 获取连接状态

## 方案设计

### 1. 连接状态检测

在 `KeystoreContext` 中添加定期检测：

```typescript
// 添加心跳检测
useEffect(() => {
  if (!connected) return
  
  const interval = setInterval(async () => {
    try {
      await client?.ping()
    } catch {
      setConnected(false)
      setDidKey(null)
    }
  }, 5000)
  
  return () => clearInterval(interval)
}, [connected, client])
```

### 2. 断开连接的 UI 提示

创建一个新的提示组件或修改现有 Header：

```typescript
// 在 Header 或全局添加连接状态提示
const ConnectionStatus = () => {
  const { connected: keystoreConnected } = useKeystore()
  const { signerInfo } = ccc.useCcc()
  
  if (keystoreConnected && signerInfo) return null
  
  return (
    <div className="connection-warning">
      {!signerInfo && <Button onClick={openWallet}>连接钱包</Button>}
      {!keystoreConnected && <Button onClick={openKeystore}>打开 Keystore</Button>}
    </div>
  )
}
```

### 3. 页面守卫更新

修改需要连接的页面的守卫逻辑：

```typescript
// 发帖页面、个人中心等
const Page = () => {
  const { connected: keystoreConnected } = useKeystore()
  const { signerInfo } = ccc.useCcc()
  
  if (!keystoreConnected || !signerInfo) {
    return <ConnectionRequiredPage />
  }
  
  return <ActualPageContent />
}
```

## 实施步骤

### 步骤 1: 添加连接状态检测
- [ ] 修改 `KeystoreContext`，添加心跳检测
- [ ] 钱包连接状态由 `@ckb-ccc/connector-react` 自动管理

### 步骤 2: 创建连接状态提示组件
- [ ] 创建 `ConnectionStatus` 组件
- [ ] 添加到 Header 或全局布局中
- [ ] 只在连接断开时显示

### 步骤 3: 更新需要连接的页面
- [ ] 发帖页面 (`posts/publish`)
- [ ] 个人中心 (`user-center`)
- [ ] 其他需要 Keystore 签名的操作

### 步骤 4: 测试验证
- [ ] 登录后刷新页面
- [ ] 关闭 Keystore 页面后检测状态
- [ ] 断开钱包后检测状态
- [ ] 点击按钮重新连接

## 具体实现

### KeystoreContext 修改

```typescript
export function KeystoreProvider({ children }: { children: ReactNode }) {
  // ... 现有代码
  
  // 添加心跳检测
  useEffect(() => {
    if (!connected || !client) return
    
    const checkConnection = async () => {
      try {
        await client.ping()
      } catch (err) {
        console.log('Keystore connection lost')
        setConnected(false)
        setDidKey(null)
      }
    }
    
    // 立即检查一次
    checkConnection()
    
    // 定期检查
    const interval = setInterval(checkConnection, 10000)
    return () => clearInterval(interval)
  }, [connected, client])
  
  // ...
}
```

### ConnectionStatus 组件

```typescript
'use client'

import { useKeystore } from '@/contexts/KeystoreContext'
import { ccc } from '@ckb-ccc/connector-react'
import Button from '@/components/Button'

export default function ConnectionStatus() {
  const { client, connected: keystoreConnected } = useKeystore()
  const { signerInfo, open: openWallet } = ccc.useCcc()
  
  const walletConnected = !!signerInfo
  
  if (keystoreConnected && walletConnected) {
    return null
  }
  
  return (
    <div className="fixed top-16 left-0 right-0 bg-yellow-50 border-b border-yellow-200 p-3 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
        <span className="text-yellow-800">
          连接已断开，请重新连接：
        </span>
        {!walletConnected && (
          <Button type="primary" size="small" onClick={openWallet}>
            连接钱包
          </Button>
        )}
        {!keystoreConnected && (
          <Button type="primary" size="small" onClick={() => client?.openTab()}>
            打开 Keystore
          </Button>
        )}
      </div>
    </div>
  )
}
```

### 添加到全局布局

在 `layout.tsx` 或 `MainContent` 中添加：

```typescript
return (
  <>
    <ConnectionStatus />
    <div className="flex flex-col">
      {props.children}
    </div>
  </>
)
```

## 注意事项

1. **不要自动弹窗** - 所有重新连接必须通过用户点击按钮
2. **区分钱包和 Keystore** - 可能只断开其中一个
3. **避免频繁检测** - 心跳间隔 10 秒左右
4. **友好提示** - 明确告诉用户需要做什么
