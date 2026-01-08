import S from './index.module.scss'
import Avatar from "@/components/Avatar";
import { useInfiniteScroll } from "ahooks";
import server from "@/server";
import { Ref, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import remResponsive from "@/lib/rem-responsive";
import MouseToolTip from "@/components/MouseToolTip";
import { useRouter } from "next/navigation";
import { eventBus } from "@/lib/EventBus";
import { formatLinkParam } from "@/lib/postUriHref";

export type LikeListRef = { reloadLikeList: () => void }

const LikeList = (props: {
  uri: string
  componentRef?: Ref<LikeListRef>
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const gridRefCols = useRef<number>(null)

  const router = useRouter()

  const { data: likeList, loading, loadingMore, loadMore, noMore, reload } = useInfiniteScroll(async (prevData) => {

    const { nextCursor, rows } = prevData || {};

    if (prevData && !nextCursor) {
      return {
        list: [],
        nextCursor: '',
        rows: rows + 1
      }
    }

    const pagedData = await server('/like/list', 'POST', {
      to: props.uri,
      limit: 34,
      cursor: nextCursor,
    })

    const { likes, cursor } = pagedData || {};

    return {
      list: likes ?? [],
      nextCursor: cursor,
      rows: rows ? rows + 1 : 2
    };
  }, {
    // isNoMore: d => !d?.nextCursor,
  });

  useImperativeHandle(props.componentRef, () => {
    return {
      reloadLikeList: () => {
        if (showAvatars.length === (likeList?.list?.length || 0)) {
          reload()
        }
      }
    }
  })

  useEffect(() => {
    const f = (uri: string) => {
      console.log('uri', uri)
      console.log('props.uri', props.uri)
      if (showAvatars.length === (likeList?.list?.length || 0) && uri === props.uri) {
        reload()
      }
    }
    eventBus.subscribe('post-like-list-refresh', f)

    return () => {
      eventBus.unsubscribe('post-like-list-refresh', f)
    }
  }, []);

  const calculateCols = () => {
    if (!ref.current) return
    const width = ref.current.clientWidth
    const padding = getComputedStyle(ref.current).padding.replace('px', '')
    const contentWidth = width - padding * 2

    const div = document.createElement("div");
    div.style.width = remResponsive(14)
    div.style.marginRight = remResponsive(6)
    document.body.append(div)

    const avatarWidth = div.clientWidth
    const colGap = getComputedStyle(div).marginRight.replace('px', '')

    document.body.removeChild(div)

    const cols = Math.floor((contentWidth + parseFloat(colGap)) / (avatarWidth + parseFloat(colGap)));

    gridRefCols.current = cols;
  }

  useEffect(() => {
    calculateCols()
  }, []);

  const showAvatars = useMemo(() => {
    if (!likeList || !gridRefCols.current) return [];

    const allData = likeList.list
    const nums = likeList.rows * gridRefCols.current
    if (allData.length > nums) {
      return allData.slice(0, nums - 2)
    }
    return allData
  }, [likeList])

  return <div style={{ height: showAvatars.length === 0 ? 0 : 'auto' }} className={S.wrap}>
    <div
      className={S.detail}
      ref={ref}
    >
      <div className={S.inner}>
        {
          showAvatars.map((info) => {
            const href = `/user-center/${formatLinkParam(info.author?.did)}`
            const name = info.author.displayName || ''
            const tips = info.author.handle ? name?.[0]?.toUpperCase() + name.slice(1) : '该用户已注销'

            return <MouseToolTip
              message={tips}
              tipClassName={'!w-auto'}
            >
              <a onClick={() => {
                if (info.author.handle) {
                  router.push(href)
                  return
                }
              }}>
                <Avatar
                  nickname={info.author.displayName}
                  className={S.avatar}
                />
              </a>
            </MouseToolTip>
          })
        }
        {(showAvatars.length !== (likeList?.list?.length || 0)) && <p
          className={S.loadMore}
          onClick={loadMore}
        >加载更多详情
        </p>}
      </div>
    </div>
  </div>
}

export default LikeList;