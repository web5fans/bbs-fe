import S from './index.module.scss'
import Select from "@/app/posts/publish/(components)/Select";
import cx from "classnames";
import DateRange from "../DateRange";

const SearchCondition = () => {
  return <div className={S.wrap}>
    <Select
      selectedValue={'1'}
      className={S.select}
      placeholder={'类型筛选'}
      onChange={() => {}}
      options={[{
        label: '分成收入',
        value: '1'
      },{
        label: '普通收入',
        value: '2'
      },{
        label: '捐赠收入',
        value: '3'
      }]}
    />
    <div className={S.dateFilter}>
      <div className={S.dateType}>
        <span className={cx(S.active)}>本月</span>
        <span>上月</span>
        <span>自定义</span>
      </div>
      <DateRange
        onSearch={() => {
          alert('seasch')
        }}
      />
    </div>
  </div>
}

export default SearchCondition;