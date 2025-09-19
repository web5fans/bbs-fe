import S from './uploading.module.scss'
import { DotLoading } from "@/components/Loading";

const Uploading = () => {
  return <div className={S.loading}>
    上传中<DotLoading />
  </div>
}

export default Uploading;