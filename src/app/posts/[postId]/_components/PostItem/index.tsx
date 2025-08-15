'use client'

import S from './index.module.scss'
import Avatar from "@/components/Avatar";
import FeedStatistic from "@/components/FeedStatistic";
import dayjs from "dayjs";
import TipTapEditor from "@/components/TipTapEditor";
import cx from "classnames";

type PostItemProps = {
  isOriginPoster?: boolean
  postInfo: any
  floor: number
}

const PostItem = (props: PostItemProps) => {
  const { postInfo = {}, floor, isOriginPoster } = props;

  return <div className={S.wrap}>
    <div className={S.user}>
      <div className={cx(S.avatarWrap, !isOriginPoster && S.normal)}>
        <Avatar nickname={'Scvcd'} className={S.avatar} />
        <img src={'/assets/poster.png'} alt="" className={S.poster} />
      </div>
      <p className={S.title}>Skjsgdhf</p>
      <div className={S.divide} />
      <p className={S.postNum}>
        <span>发帖数量</span>
        <span>12</span>
      </p>
    </div>

    <div className={S.content}>
      <div>
        {postInfo.title && <>
          <p className={S.title}>{postInfo.title}</p>
          <div className={S.statis}>
            {postInfo.section}
            <FeedStatistic />
          </div>
        </>}

        <TipTapEditor
          initialContent={postInfo.text}
          editable={false}
          editorClassName={S.richText}
          editorWrapClassName={'!h-auto'}
        />
      </div>

      <div className={S.floor}>
        <span>{dayjs(postInfo.created).format('YYYY/MM/DD')}</span>
        <span>{floor}楼</span>
      </div>
    </div>
  </div>
}

export default PostItem;