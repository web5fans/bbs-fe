# Keystore 迁移实施完成总结

## 已完成的工作

### 1. 基础架构搭建
- ✅ 安装 `@module-federation/nextjs-mf` 依赖
- ✅ 配置 `next.config.ts` 添加 Module Federation
- ✅ 创建 `src/types/keystore.d.ts` 类型声明
- ✅ 创建 `src/contexts/KeystoreContext.tsx` 全局状态管理
- ✅ 在 `layout.tsx` 中添加 `KeystoreProvider`

### 2. 存储结构修改
- ✅ 修改 `src/lib/storage.ts`: 移除 `signKey`，添加 `signingKeyDid` 和 JWT tokens
- ✅ 更新 `src/store/userInfo.ts`:
  - 添加 `keystoreClient` 和 `keystoreDidKey` 状态
  - 添加 `setKeystoreContext` 方法
  - 修改 `web5Login` 接收 client 和 didKey 参数
  - 修改 `writeProfile` 接收 client 和 didKey 参数
  - 更新 `initialize` 方法支持自动登录

### 3. 签名代码迁移
- ✅ 重写 `src/lib/signing-key.ts`: 使用 KeystoreClient 签名
- ✅ 修改 `src/lib/user-account.ts`: 登录和删除账号使用 Keystore
- ✅ 修改 `src/app/posts/utils.ts`: 发帖/编辑/管理操作使用 Keystore
- ✅ 修改 `src/hooks/useAutoSaveDraft.ts`: 草稿操作使用 Keystore

### 4. 所有调用点更新
以下文件已更新为使用 `useKeystore` hook 并传递 `client` 和 `didKey`:

#### 发帖相关
- ✅ `src/app/posts/publish/page.tsx`
- ✅ `src/app/posts/publish/(components)/DraftModal/index.tsx`
- ✅ `src/app/posts/[postId]/_components/PostLike/index.tsx`
- ✅ `src/app/posts/[postId]/_components/ReplyModal/index.tsx`
- ✅ `src/app/posts/[postId]/_components/PostDiscuss/index.tsx`
- ✅ `src/app/posts/edit/[uri]/page.tsx`

#### 打赏/捐赠
- ✅ `src/app/posts/[postId]/_components/PostItem/_components/Donate/TipModal.tsx`
- ✅ `src/app/section/fund/[sectionId]/_components/DonateModal/index.tsx`

#### 管理员操作
- ✅ `src/app/posts/[postId]/_components/Permission/index.tsx`
- ✅ `src/app/posts/[postId]/_components/PostItem/_components/SwitchPostHideOrOpen/index.tsx`
- ✅ `src/app/section/[sectionId]/manage/_components/tabs/HiddenReply/index.tsx`
- ✅ `src/app/section/[sectionId]/manage/_components/tabs/Notice/UnShelfConfirm.tsx`
- ✅ `src/app/section/[sectionId]/manage/_components/tabs/HiddenComments/index.tsx`
- ✅ `src/app/section/[sectionId]/manage/_components/tabs/HiddenPosts/index.tsx`
- ✅ `src/app/section/[sectionId]/manage/_components/EditInfoModal/index.tsx`
- ✅ `src/app/section/[sectionId]/manage/_components/tabs/Notice/NoticeModal/index.tsx`

#### 后台管理
- ✅ `src/app/property-manage/_components/FundInfo/AddWhiteList.tsx`
- ✅ `src/app/property-manage/_components/AppointModerator/index.tsx`
- ✅ `src/app/property-manage/_components/AppointAdmin/index.tsx`
- ✅ `src/app/property-manage/_components/CreateNewSection/index.tsx`
- ✅ `src/app/property-manage/_components/TabContents/SectionAdmin/index.tsx`
- ✅ `src/app/property-manage/_components/TabContents/AdminTeam/index.tsx`
- ✅ `src/app/property-manage/_components/TabContents/Notice/UnShelfConfirm.tsx`
- ✅ `src/app/property-manage/_components/TabContents/Section/index.tsx`

### 5. 删除注册相关代码
- ✅ 删除 `src/hooks/useCreateAccount.ts`
- ✅ 删除 `Steps` 目录（注册步骤组件）
- ✅ 删除 `ImportDid` 目录（导入功能）
- ✅ 删除 `KeyQRCodeModal` 目录（导出二维码）
- ✅ 删除 `ExportWeb5DidModal` 目录（导出功能）
- ✅ 重写 `src/app/register-login/index.tsx`:
  - 简化登录页面
  - 引导用户去 Portal 注册
  - 通过 Keystore 登录
- ✅ 更新 `src/app/user-center/_components/BBSDataSelf/index.tsx`: 移除导出/导入功能引用
- ✅ 添加登录页面样式 `src/app/register-login/index.module.scss`

## 新的用户流程

```
新用户:
访问 bbs-fe → 点击登录 → 提示"去 Portal 注册" → Portal 注册 → 私钥存 Keystore → 回到 bbs-fe 登录 → 正常使用

老用户:
访问 bbs-fe → 点击登录 → 连接 Keystore 验证 → 正常使用
```

## 存储变化

```typescript
// Before
{ did, walletAddress, signKey }

// After
{ 
  did, 
  walletAddress, 
  signingKeyDid,  // signing key 的 DID
  accessJwt,      // PDS access token
  refreshJwt      // PDS refresh token
}
```

## 使用 Keystore 的模式

```typescript
import { useKeystore } from "@/contexts/KeystoreContext";

function MyComponent() {
  const { client, didKey, connected, isLoading } = useKeystore();
  
  const handleAction = async () => {
    if (!client || !didKey) {
      // 处理未连接状态
      return;
    }
    
    // 调用需要签名的函数
    await postsWritesPDSOperation({
      record: { ... },
      did: userProfile.did,
      client,    // 传递 KeystoreClient
      didKey     // 传递 signing key DID
    });
  };
  
  // ...
}
```

## 待后续工作

1. **联调测试**: 需要与 Keystore 和 Portal 服务联调测试
2. **错误处理**: 完善 Keystore 连接失败、签名失败等错误处理
3. **UI 优化**: 登录页面和 Keystore 状态提示可以进一步优化
4. **文档更新**: 更新开发文档和用户文档

## 迁移要点

1. **安全性提升**: 私钥不再存储在应用 localStorage 中，而是保存在独立的 Keystore 域名下
2. **用户体验**: 用户只需在 Portal 注册一次，即可在所有应用中使用
3. **代码复杂度**: 所有签名操作都需要通过 Keystore 进行，增加了异步调用的复杂度
4. **兼容性**: 旧版用户数据（包含 signKey）需要引导用户重新通过 Keystore 登录
