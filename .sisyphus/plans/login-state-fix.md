# 登录状态管理修复计划

## 问题诊断

### 核心问题
1. **initialize() 无法恢复登录状态** - 调用时没有传入 Keystore 客户端参数
2. **刷新页面后登录状态丢失** - store 重置后无法从 localStorage 恢复
3. **多个守卫逻辑冲突** - 页面在 initialized 完成前就执行了重定向

### 根本原因
```
当前流程（有问题）：
1. 刷新页面 → store 重置 (userInfo: undefined)
2. MainContent 调用 initialize() - 无参数
3. userInfoStore.initialize() 检查: hasToken ✓, client ✗, didKey ✗
4. 跳过 web5Login()，userInfo 保持 undefined
5. initialized = true
6. 页面守卫看到 !hasLoggedIn → 重定向到 /posts

期望流程：
1. 刷新页面 → store 重置
2. 从 localStorage 恢复基本登录信息 (did, handle)
3. initialized = true
4. 页面正常显示
5. 可选：Keystore 连接后再更新完整信息
```

## 修复方案

### 1. 修改 userInfoStore.initialize() 方法

**文件**: `src/store/userInfo.ts`

**当前代码**:
```typescript
initialize: async (client?: KeystoreClient, didKey?: string) => {
  const hasToken = storage.getToken()
  if (hasToken && client && didKey) {
    await get().web5Login(client, didKey)
  }
  // ... 设置 visitor
  set(() => ({ initialized: true, visitorId: visitor }))
},
```

**修复后代码**:
```typescript
initialize: async () => {
  const hasToken = storage.getToken()
  
  // 只要有 token，就恢复基本登录状态（不依赖 keystore）
  if (hasToken) {
    set(() => ({
      userInfo: {
        did: hasToken.did,
        handle: hasToken.did,
      } as ComAtprotoServerCreateSession.OutputSchema,
      userProfile: {
        did: hasToken.did,
        ckb_addr: hasToken.walletAddress,
        handle: hasToken.did,
      } as UserProfileType,
    }))
  }
  
  // 设置 visitor
  let visitor = localStorage.getItem(STORAGE_VISITOR)
  if (!visitor) {
    const random4Digit = Math.floor(Math.random() * 9000) + 1000;
    visitor = random4Digit.toString()
    localStorage.setItem(STORAGE_VISITOR, visitor)
  }
  
  set(() => ({ initialized: true, visitorId: visitor }))
},
```

### 2. 确保 useCurrentUser 正确计算 hasLoggedIn

**文件**: `src/hooks/useCurrentUser.ts`

**当前代码**:
```typescript
const store = useUserInfoStore()
const { userInfo, ... } = store

return {
  hasLoggedIn: !!userInfo,  // 基于 userInfo
  // ...
}
```

**检查点**: 确保 userInfo 在 initialize 后被正确设置

### 3. 检查所有页面守卫逻辑

**文件清单**:
- `src/app/user-center/page.tsx` - 已修改，需要验证
- `src/components/AuthUserLogged/index.tsx` - 已修改，需要验证
- `src/app/property-manage/page.tsx` - 检查是否需要修改
- `src/app/section/[sectionId]/manage/page.tsx` - 检查是否需要修改

**修复原则**:
1. 等待 `initialized === true` 后再判断
2. 或者使用 `storage.getToken()` 直接检查（不依赖 store）

### 4. 验证登录流程

**登录成功后的数据流**:
1. `register-login/index.tsx` 调用 `web5Login(client, didKey, did, walletAddress)`
2. `userInfoStore.web5Login()` 设置完整的 userInfo 和 userProfile
3. `storage.setToken()` 保存到 localStorage
4. 页面跳转到 /posts

**刷新后的数据流**:
1. 页面刷新，store 重置
2. `MainContent` 调用 `initialize()`
3. `initialize()` 从 localStorage 恢复基本信息
4. `initialized = true`
5. 页面正常显示

## 测试计划

### 测试用例 1: 正常登录流程
1. 打开登录弹窗
2. 连接钱包 → 打开 Keystore → 自动登录
3. 验证跳转到 /posts
4. 验证右上角显示登录状态

### 测试用例 2: 刷新页面
1. 登录后刷新页面
2. 验证登录状态保持
3. 验证可以正常访问个人中心

### 测试用例 3: 直接访问受保护页面
1. 登录后访问 /user-center
2. 验证页面正常显示，不跳转
3. 刷新后再次验证

## 实施步骤

### 步骤 1: 修改 store
- [ ] 修改 `src/store/userInfo.ts` 中的 initialize 方法
- [ ] 验证类型正确

### 步骤 2: 清理守卫逻辑
- [ ] 检查并简化 `user-center/page.tsx`
- [ ] 检查并简化 `AuthUserLogged/index.tsx`
- [ ] 检查其他使用 hasLoggedIn 的页面

### 步骤 3: 测试验证
- [ ] 执行测试用例 1
- [ ] 执行测试用例 2
- [ ] 执行测试用例 3

## 风险与回滚

**风险**: 修改登录状态核心逻辑可能影响所有页面
**回滚**: 保留当前文件备份，如果出问题可以 revert
