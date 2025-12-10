import S from './index.module.scss'
import { useState } from "react";
import cx from "classnames";

function Tabs<T>(props: {
  tabItems: {
    name: string
    value?: T
    onClick?: () => void
  }[]
  onChange?: (value: T | number) => void
  children: React.ReactNode
  classnames?: {
    wrap?: string
    tabs?: string
    tabItem?: string
    content?: string
  }
  tabsExtra?: React.ReactNode
}){
  const { tabItems, onChange, classnames, tabsExtra } = props;
  const [activeTab, setActiveTab] = useState<T | number>(tabItems[0].value || 0)

  return <div className={cx(S.wrap, classnames?.wrap)}>
    <div className={cx(S.tabs, classnames?.tabs)}>
      {tabItems.map((tab, index) => {
        const value = tab.value || index
        return <span
          key={index}
          onClick={() => {
            setActiveTab(value)
            onChange?.(value)
          }}
          className={cx(activeTab === value ? S.active : "", classnames?.tabItem)}
        >{tab.name}</span>
      })}

      {tabsExtra}
    </div>
    <div className={cx(S.content, classnames?.content)}>
      {props.children}
    </div>
  </div>
}

export default Tabs;