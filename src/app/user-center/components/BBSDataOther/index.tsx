import S from './index.module.scss'
import InfoCard from "@/app/user-center/components/InfoCard";

const BBSDataOther = (props: {
  postsCount?: string
  replyCount?: string
}) => {
  const { postsCount = '0', replyCount = '0' } = props;

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
          <span>{replyCount}</span>
          <span>回帖</span>
        </p>
      </div>
    </InfoCard>
  </div>
}

export default BBSDataOther;