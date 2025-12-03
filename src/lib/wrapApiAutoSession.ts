import getPDSClient from "@/lib/pdsClient";

export default async function sessionWrapApi<T>(callback: () => Promise<T>): Promise<T> {
  try {
    const result =  await callback()
    return result
  } catch (error) {
    if (error.message.includes('Token has expired')) {
      // showGlobalToast({
      //   title: '登录信息已过期，请重新刷新页面',
      //   icon: 'error'
      // })
      await getPDSClient().sessionManager.refreshSession()
      return await callback()
    }
    throw error
  }
}