import { UserProfileType } from "@/store/userInfo";

export default function identityLabel(tags?: UserProfileType['tags']) {
  if (!tags) return

  const admin = tags.find(t => t.admin !== undefined)
  if (admin) {
    return '论坛管理员'
  }

  const sectionAdmin = tags.find(t => !!t.owner)
  return sectionAdmin?.owner ? `${sectionAdmin?.owner}版区版主` : undefined
}