import S from './index.module.scss'
import { ChangeEvent, useRef, useState } from "react";
import { useToast } from "@/provider/toast";
import { DotLoading } from "@/components/Loading";
import EditIcon from '@/assets/posts/edit.svg'
import { handleImageUpload } from "@/lib/tiptap-utils";
import useCurrentUser from "@/hooks/useCurrentUser";
import cx from "classnames";

const UploadSectionAvatar = ({ avatarUrl, changeLogo, classNames }: {
  avatarUrl?: string
  changeLogo: (url: string) => void
  classNames?: { wrap?: string, avatar?: string, info?: string }
}) => {
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState(avatarUrl)
  const uploadInputRef = useRef<HTMLInputElement>(null)

  const { userProfile } = useCurrentUser()

  const toast = useToast()

  const uploadFile = async (file: File) => {
    setUploading(true)
    try {
      const url = await handleImageUpload(file, userProfile?.did || '')
      changeLogo(url)
      setUrl(url)
      setUploading(false)
    } catch (e) {
      setUploading(false)
      toast({
        title: '头像上传失败，图片最大为5M',
        icon: 'error',
      })
    }
  }

  const uploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    const reader = new FileReader()
    // 获取base64格式字符串文件内容
    reader.readAsDataURL(file)
    reader.onload = function(data) {
      const img = new window.Image();
      const result = data?.target?.result;
      if (typeof result === "string") {
        img.src = result;
      }
      img.onload = function() {
        console.log(img.width, img.height)
        if (img.width > 400 || img.height > 400) {
          toast({
            title: '头像上传失败，请重新上传图片为400*400之内尺寸',
            icon: 'error',
          })
          return
        }

        uploadFile(file)
      }
    }
  }

  return <div className={cx(S.uploadWrap, classNames?.wrap)}>
    <div className={cx(S.uploadAvatar, classNames?.avatar)}>
      {uploading ? <div className={S.loading}>
        上传中
        <DotLoading />
      </div> : <img
        src={url || '/assets/section-iconx2.png'}
        alt=""
      />}
    </div>
    <div className={cx(S.uploadInfo, classNames?.info)}>
      <p
        className={S.edit}
        onClick={() => uploadInputRef.current?.click()}
      >
        <EditIcon className={S.icon} />
        编辑头像
      </p>
      <p className={S.message}>（请上传400*400之内尺寸以保证图片清晰）</p>
    </div>

    <input
      type={'file'}
      ref={uploadInputRef}
      hidden
      accept={"image/*"}
      onChange={uploadChange}
    />
  </div>
}

export default UploadSectionAvatar;