import S from "./index.module.scss";
import cx from 'classnames'

const DashedDivide = (props: {
  className?: string;
}) => {
  return <p className={cx(S.divide, props.className)}>
    <svg
      width="100%"
    >
      <line
        x1="0"
        y1="1"
        x2="100%"
        y2="1"
      />
    </svg>
  </p>
}

export default DashedDivide;