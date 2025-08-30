import S from "./index.module.scss";
import WalletIcon from "@/assets/login/wallet.svg";
import { useEffect, useRef, useState } from "react";
import cx from "classnames";
import ellipsis from "@/lib/ellipsis";
import { useWallet } from "@/provider/WalletProvider";
import Button from "@/components/Button";
import FlatButton from "@/components/FlatButton";
import CopyText from "@/components/CopyText";

const WalletInfo = () => {
  const [popUpVis, setPopUpVis] = useState(false);

  const { address, disconnect, openSigner } = useWallet()

  const ref= useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setPopUpVis(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return <div className={S.walletWrap} ref={ref}>
    {address ? <FlatButton
      className={S.wallet}
      onClick={() => setPopUpVis(!popUpVis)}
      active={popUpVis}
    >
      {ellipsis(address)}
      <CopyText text={address} className={S.copyIcon} />
    </FlatButton> : <Button className={S.connect} onClick={openSigner}>
      <WalletIcon className={S.icon} />
      连接钱包
    </Button>}

    {address && <div className={cx(S.popup, !popUpVis && S.close)}>
      <div
        className={S.menuItem}
        onClick={() => {
          disconnect()
          setPopUpVis(!popUpVis)
        }}
      >
        断开钱包连接
      </div>
    </div>}
  </div>
}

export default WalletInfo;