import S from './index.module.scss'
import MouseToolTip from "@/components/MouseToolTip";
import useMediaQuery from "@/hooks/useMediaQuery";
import cx from "classnames";
import DidInfoImg from '@/assets/user-center/did-info.svg';
import QrCodeImg from '@/assets/user-center/qrcode.svg';
import ExportWeb5DidModal from "@/components/ExportWeb5DidModal";
import KeyQRCodeModal from "@/app/user-center/_components/KeyQRCodeModal";
import FlatBottomedCard from "@/components/FlatBottomedCard";

const BBSData = (props: {
  postsCount?: string
  commentCount?: string
}) => {
  const { postsCount = '0', commentCount = '0' } = props;
  const { innerWidth } = useMediaQuery()

  const breakPoint = innerWidth < 1130;

  if (breakPoint) {
    return <div className={cx(S.container, S.breakPoint1024)}>
      <div className={S.left}>
        <p className={S.header}>BBS 数据</p>
        <DataStatistic postsCount={postsCount} commentCount={commentCount} />
      </div>
      <DataCard />
    </div>
  }

  return <div className={S.container}>
    <p className={S.header}>BBS 数据</p>
    <DataCard />
    <DataStatistic postsCount={postsCount} commentCount={commentCount} />
  </div>
}

export default BBSData;

function DataStatistic(props: { postsCount: string; commentCount: string }) {
  const { postsCount = '0', commentCount = '0' } = props;

  return <div className={S.data}>
    <p>
      <span>{postsCount}</span>
      <span>帖子</span>
    </p>
    <p>
      <span>{commentCount}</span>
      <span>回帖</span>
    </p>

    <KeyQRCodeModal>
      <MouseToolTip message={'使用可它快捷登录其他设备，请注意安全保存'}>
        <p className={S.dataItem}>
          <QrCodeImg className={S.qrcode} />
          <span>密钥二维码</span>
        </p>
      </MouseToolTip>
    </KeyQRCodeModal>

    <ExportWeb5DidModal>
      <MouseToolTip message={'导出它可快捷登录其他设备，请注意安全保存'}>
        <p className={S.dataItem}>
          <DidInfoImg className={S.didInfo} />
          <span>Web5 DID信息</span>
        </p>
      </MouseToolTip>
    </ExportWeb5DidModal>
  </div>
}

function DataCard() {
  return <FlatBottomedCard className={S.card}>
    <p className={S.title}>数据存储位置</p>
    <p className={S.location}>web5.bbs.fans</p>
    <MouseToolTip
      open
      message={'功能正在研发中，敬请期待～'}>
      <p className={S.tips}>
        <UploadIcon className={S.uploadIcon} />
        切换BBS数据储存位置
      </p>
    </MouseToolTip>
  </FlatBottomedCard>
}

function UploadIcon(props: { className?: string }) {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    className={props.className}
  >
    <g clip-path="url(#clip0_324_43440)">
      <rect
        y="6.75"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        y="7.5"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        y="8.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        y="9"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        y="9.75"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        y="10.5"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        y="11.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="3"
        y="11.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="8.25"
        y="11.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="3.75"
        y="11.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="7.5"
        y="11.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="4.5"
        y="11.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="6.75"
        y="11.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="0.75"
        y="11.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="10.5"
        y="11.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="1.5"
        y="11.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="9.75"
        y="11.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="2.25"
        y="11.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="9"
        y="11.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="5.25"
        y="11.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="6"
        y="11.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="10.5"
        y="6.75"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="10.5"
        y="7.5"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="10.5"
        y="8.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="10.5"
        y="9"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="10.5"
        y="9.75"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="10.5"
        y="10.5"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="5.25"
        y="3"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="5.25"
        y="3.75"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="5.25"
        y="4.5"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="5.25"
        y="5.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="5.25"
        y="6"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="5.25"
        y="6.75"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="5.25"
        y="7.5"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="5.25"
        y="8.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="5.25"
        y="9"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="5.25"
        y="0.75"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="4.5"
        y="1.5"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="3.75"
        y="2.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="3"
        y="3"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="2.25"
        y="3.75"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="1.5"
        y="4.5"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="6"
        y="1.5"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="6.75"
        y="2.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="7.5"
        y="3"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="8.25"
        y="3.75"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="9"
        y="4.5"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="5.25"
        y="2.25"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
      <rect
        x="5.25"
        y="1.5"
        width="0.75"
        height="0.75"
        fill="#6C6C6C"
      />
    </g>
    <defs>
      <clipPath id="clip0_324_43440">
        <rect
          width="12"
          height="12"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
}