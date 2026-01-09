import CreateNewSection from "../../CreateNewSection";
import S from "./index.module.scss";
import Button from "@/components/Button";
import { useBoolean } from "ahooks";

const AddNewSection = (props: {
  refresh: () => void
}) => {
  const [visible, setVisible] = useBoolean(false)

  return <>
    <Button className={S.button} onClick={setVisible.setTrue}>创建新版区</Button>

    {visible && <CreateNewSection refresh={props.refresh} onClose={setVisible.setFalse} />}
  </>
}

export default AddNewSection;