import S from './index.module.scss'

type ComputerProps = {
  children?: React.ReactNode;
}

const Computer = (props: ComputerProps) => {
  const { children } = props

  return <div
    className={S.wrap}
  >
    {children}
  </div>
}

export default Computer;