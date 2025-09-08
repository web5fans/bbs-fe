import S from './index.module.scss'
import InfoCard from "@/app/user-center/components/InfoCard";

const BBSDataOther = (props: {
  postsCount?: string
  commentCount?: string
}) => {
  const { postsCount = '0', commentCount = '0' } = props;

  return <div className={S.container}>
    <p className={S.header}>
      <span>BBS 数据</span>
    </p>
    <InfoCard className={S.card}>
      <div className={S.data}>
        <p>
          <span>{postsCount}</span>
          <span>帖子</span>
        </p>
        <p>
          <span>{commentCount}</span>
          <span>回帖</span>
        </p>
      </div>
    </InfoCard>
  </div>
}

export default BBSDataOther;