import { create } from 'zustand'
import createSelectors from './helper/createSelector';
import useUserInfoStore from "@/store/userInfo";
import server from "@/server";


type Store = {
  isHasUnReadNotify: boolean
  startPolling: () => void
  stopPolling: () => void
  updateUnReadNum: () => void
}

let interval: NodeJS.Timeout

const useNotify = createSelectors(
  create<Store>((set, get) => ({
    isHasUnReadNotify: false,

    startPolling: () => {
      if (interval) {
        clearInterval(interval)
      }
      get().updateUnReadNum()
      interval = setInterval(() => {
        get().updateUnReadNum()
      }, 1000 * 15)
    },

    stopPolling: () => {
      if (!interval) return
      clearInterval(interval)
    },

    updateUnReadNum: async () => {
      const userProfile = useUserInfoStore.getState().userProfile
      const num = await server<number>('/notify/unread_num', 'GET', {
        repo: userProfile?.did
      })
      set(() => ({ isHasUnReadNotify: num > 0 }))
    }

  })),
)

export default useNotify
