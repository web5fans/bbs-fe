'use client'

import S from './index.module.scss'
import Content from "./Content";
import Slogan from "@/app/(index)/Slogan";
import Marquee from "react-fast-marquee";
import { AnchorHTMLAttributes, useEffect, useMemo } from "react";
import cx from "classnames";
import MouseToolTip from "@/components/MouseToolTip";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function Home() {
  const { hasLoggedIn } = useCurrentUser()

  const isMobile = useMemo(() => {
    const deviceType = document.body.style.getPropertyValue('--device-type');
    return deviceType === 'mobile';
  }, [])

  return (
    <div className={S.container}>

      <div className={isMobile ? S.mobileContent : S.content} style={{ overflowX: 'hidden' }}>
        <Slogan />

        <div className={S.center}>
          <Content />
          <div className={S.fileWrap}>
            <FileDocument
              imageType={'file'}
              title={'Web5文档'}
              href={'https://www.nervos.org/zh/knowledge-base/web5-extra-decentralized'}
              target="_blank"
            />
            {hasLoggedIn && <MouseToolTip
              message={'功能正在研发中，敬请期待'}
              open
            >
              <FileDocument
                imageType={'storage'}
                title={'本地Web5数据库'}
                className={'opacity-50'}
              />
            </MouseToolTip>}
          </div>
        </div>
      </div>

      <div className={S.footer}>
        <Marquee autoFill speed={120}>
          <span style={{marginRight: 50}}>让每个字节自由而珍贵</span>
        </Marquee>
      </div>
    </div>
  );
}


function FileDocument(props: {
  title: string
  imageType: 'file' | 'storage'
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { title, imageType, ...rest } = props;

  const imgSrc = {
    file: {
      src: '/assets/home/file.svg',
      className: S.fileImg
    },
    storage: {
      src: '/assets/home/local-storage.svg',
      className: S.storageImg
    },
  }

  const imageInfo = imgSrc[imageType]

  return <a
    {...rest}
    className={cx(S.file, rest.className)}
  >
    <img
      src={imageInfo.src}
      alt=""
      className={imageInfo.className}
    />
    <span className={S.fileTitle}>{title}</span>
  </a>
}
