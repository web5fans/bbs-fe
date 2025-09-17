import { useCountDown } from "ahooks";
import { encryptData } from "@/lib/encrypt";
import storage from "@/lib/storage";
import { memo, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import S from './index.module.scss'
import RefreshIcon from '@/assets/refresh.svg'
import { QRCODE_TIME_ENCRYPT_KEY } from "@/constant/constant";

export type QRCodeDataType = {
  timestamp: number
  web5DidInfo: string
}

const QRCodeStep = ({pinCode}: {
  pinCode: string;
}) => {
  const [targetDate, setTargetDate] = useState<number>();
  const [qrCodeStr, setQRCodeStr] = useState('');
  const [invalid, setInvalid] = useState(false);

  const [countdown] = useCountDown({
    targetDate,
    onEnd: () => {
      setInvalid(true)
    }
  });

  const generateQrCode = async () => {
    const storageInfo = storage.getToken()

    const web5DidInfo = await encryptData(JSON.stringify(storageInfo), pinCode)

    const timestamp = new Date().getTime() + 5 * 60 * 1000
    const params = {
      timestamp,
      web5DidInfo
    }

    const qrcodeStr = await encryptData(JSON.stringify(params), QRCODE_TIME_ENCRYPT_KEY)
    console.log('qrcodeStr', qrcodeStr)

    setTargetDate(timestamp)
    setQRCodeStr(qrcodeStr)
    setInvalid(false)

    // const decodeData = await decryptData(qrcodeStr, KEY)
    // console.log('decodeData', decodeData)
    //
    // const obj = JSON.parse(decodeData)
    //
    // const info = await decryptData(obj.web5DidInfo, pinCode)
    // console.log('info', info)
  }

  useEffect(() => {
    generateQrCode()
  }, []);


  return <div className={S.qrCodeStep}>
    <div className={S.codeWrap}>
      {
        qrCodeStr && <QRCodeSVG value={qrCodeStr} level={'H'} className={S.code} style={invalid ? { opacity: 0.2 } : {}} />
      }
      {invalid && <RefreshIcon
        className={S.refresh}
        onClick={generateQrCode}
      />}
    </div>
    {invalid ? <p className={S.message}>二维码失效，请点击刷新</p> : <p className={S.message}>
      请在5分钟内使用，5分钟后二维码失效
      <br />
      在此期间请妥善保存你的密钥二维码
    </p>}

  </div>
}

const MemoizeQRCode = memo(QRCodeStep)

export default MemoizeQRCode;