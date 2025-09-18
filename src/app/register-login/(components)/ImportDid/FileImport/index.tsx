import S from './index.module.scss'
import FlatBottomedCard from "@/components/FlatBottomedCard";
import UploadIcon from '@/assets/login/upload.svg'
import { ChangeEvent, useRef, useState } from "react";
import EnterPassword from "../EnterPassword";
import PINPassword from "../EnterPassword/PINPassword";
import jsQR from "jsqr";
import { decryptData } from "@/lib/encrypt";
import { QRCODE_TIME_ENCRYPT_KEY } from "@/constant/constant";
import { QRCodeDataType } from "@/app/user-center/_components/KeyQRCodeModal/QRCodeStep";
import ImportLoading from "@/app/register-login/(components)/ImportDid/FileImport/ImportLoading";
import useUserInfoStore from "@/store/userInfo";

const FileImport = (props: {
  jumpToMain: () => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileType, setFileType] = useState<'image' | 'text' | undefined>()
  const fileContentRef = useRef<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [errMessage, setErrMessage] = useState<string | undefined>()

  const [loading, setLoading] = useState(false)

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      fileContentRef.current = reader.result as string;
      setFileType('text')
    };
    reader.readAsText(file);
  }

  const readImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new window.Image();
      img.onload = function () {
        const canvas = canvasRef.current;
        if (!canvas) return
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, img.width, img.height);

        if (code) {
          validateQrCode(code.data)
        } else {
          setErrMessage("未识别到二维码");
        }
      };
      const result = event?.target?.result;
      if (typeof result === "string") {
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  }

  const validateQrCode = async (code: string) => {
    const decodeData = await decryptData(code, QRCODE_TIME_ENCRYPT_KEY)
    if (decodeData === 'error') {
      setErrMessage('密钥不正确')
      return
    }
    const obj = JSON.parse(decodeData) as QRCodeDataType

    const timeout = obj.timestamp < new Date().getTime()

    if (timeout) {
      setErrMessage('二维码已失效');
      return
    }
    fileContentRef.current = code;
    setFileType('image')
  }

  const uploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return

    setErrMessage(undefined)

    if(file.type === 'text/plain') {
      readFile(file)
    }
    if (file.type.startsWith('image/')) {
      readImage(file)
    }

  }

  const cancel = () => {
    setFileType(undefined)
    fileContentRef.current = ''
  }

  const getDidInfo = (info: string) => {
    setLoading(true)
    useUserInfoStore.getState().importUserDid(JSON.parse(info))
  }

  if (loading) {
    return <ImportLoading jumpToMain={props.jumpToMain} />
  }

  if (fileType === 'image') {
    return <PINPassword
      fileText={fileContentRef.current}
      getDidInfo={getDidInfo}
      cancel={cancel}
    />
  }
  if (fileType === 'text') {
    return <EnterPassword
      fileText={fileContentRef.current}
      getDidInfo={getDidInfo}
      cancel={cancel}
    />
  }

  return <div className={S.container}>
    <p className={S.title}>导入你的Web5 DID信息</p>
    <FlatBottomedCard className={S.card}>
      <div
        className={S.inner}
        onClick={() => inputRef.current?.click()}
      >
        <UploadIcon className={S.uploadIcon} />
        <p className={S.message}>点击上传Web5 DID信息文件或登陆二维码</p>
        <p className={S.info}>支持图片文件（密钥二维码）和.txt文件（加密字符串）</p>
      </div>
      <input
        ref={inputRef}
        name="file"
        accept={'.txt,image/jpeg,image/png,image/jpg'}
        type="file"
        style={{ display: 'none' }}
        onChange={uploadChange}
        onClick={(e) => e.stopPropagation()}
      />
    </FlatBottomedCard>

    {errMessage && <p className={S.err}>
      <img
        src={'/assets/warning.svg'}
        alt={'warning'}
      />
      {errMessage}</p>}

    <canvas
      ref={canvasRef}
      style={{ display: "none" }}
    />
  </div>
}

export default FileImport;