import Button from "@/components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import cx from "classnames";
import ConfirmModal from "@/components/Modal/ConfirmModal";

const DiscussCancelButton = (props: {
  disabled?: boolean
  className?: string
}) => {
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  return <>
    <Button
      className={cx(props.className)}
      disabled={props.disabled}
      onClick={() => setVisible(true)}
    >取消</Button>

    <ConfirmModal
      visible={visible}
      message={'确定取消内容？取消不保留内容。有重要内容，请先备份哦！'}
      footer={{
        confirm: {
          text: '先不发了',
          onClick: () => {
            router.back()
          }
        },
        cancel: {
          text: '再想想',
          onClick: () => {
            setVisible(false)
          }
        }
      }}
    />
  </>
}

export default DiscussCancelButton;