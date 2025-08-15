import { USER_DOMAIN } from "@/constant/Network";

export function handleToNickName(handle: string = '') {
  return handle.replace(`.${USER_DOMAIN}`, '')
}