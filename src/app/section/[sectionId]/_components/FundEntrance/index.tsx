import S from './index.module.scss'
import Logo from '@/assets/fund/fund.svg'
import numeral from "numeral";
import Button from "@/components/Button";
import FundDonate from "@/app/section/[sectionId]/_components/FundDonate";
import Link from "next/link";

const FundEntrance = (props: {
  sectionId: string
}) => {
  return <div className={S.wrap}>
    <Link href={`/section/fund/${props.sectionId}`} prefetch>
      <div className={S.top}>
        <div className={S.total}>
          <Logo className={S.logo} />
          <p className={S.num}>{numeral('3602388').format('0.00a')}</p>
          <span className={S.unit}>CKB</span>
        </div>
        <div className={S.toDetail}>
          <div className={S.inner}>
            <span>→</span>
            <span>版区基金详情</span>
            <span>←</span>
          </div>
        </div>
      </div>
    </Link>
    <Button
      className={S.donate}
      onClick={() => alert('click')}
    >捐赠</Button>

    <FundDonate />
  </div>
}

export default FundEntrance;