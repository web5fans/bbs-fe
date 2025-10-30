import S from './index.module.scss'
import Select from "@/app/posts/publish/(components)/Select";
import DatePicker from "@/components/DatePicker";
import DateRange from "@/app/section/fund/[sectionId]/_components/Tabs/Flow/components/DateRange";

const Flow = () => {
  return <div className={S.wrap}>
    <div>
      {/*<Select renderItem={} onChange={} />*/}
      <span>本月</span>
      <span>上月</span>
      <span>自定义</span>
      <DateRange
        onSearch={() => {
          alert('seasch')
        }}
      />
    </div>
  </div>
}

export default Flow;