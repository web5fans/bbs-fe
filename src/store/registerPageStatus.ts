import { create } from 'zustand'
import createSelectors from './helper/createSelector';


type Store = {
  visible: boolean
  registerAddress: string
  changeVisible: (v: boolean) => void
  setRegisterAddress: (address: string) => void
}

const useRegisterPageStatus = createSelectors(
  create<Store>((set, get) => ({
    visible: false,
    registerAddress: '',

    setRegisterAddress: (address: string) => {
      set(() => ({ registerAddress: address }))
    },

    changeVisible: (visible: boolean) => {
      set(() => ({ visible }))
    }

  })),
)

export default useRegisterPageStatus
