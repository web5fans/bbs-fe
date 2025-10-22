import S from './index.module.scss'
import CardWindow from "@/components/CardWindow";
import FaceIcon from "@/assets/login/multiDid/face.svg";
import Button from "@/components/Button";
import React from "react";
import cx from "classnames";

const PageNoAuth = (props: {
  title: string
  buttonProps: {
    text: string
    onClick: () => void
  }
  titleClassName?: string
}) => {
  const { title, buttonProps, titleClassName } = props;

  return <CardWindow wrapClassName={S.wrap}>
    <div className={S.content}>
      <FaceIcon className={S.faceIcon} />
      <p className={cx(S.title, titleClassName)}>{title}</p>
      <Button
        type={'primary'}
        className={S.button}
        onClick={buttonProps?.onClick}>{buttonProps?.text}</Button>
    </div>
  </CardWindow>
}

export default PageNoAuth;