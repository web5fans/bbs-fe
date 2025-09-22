import S from './index.module.scss'
import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { decryptData } from "@/lib/encrypt";
import { QRCODE_TIME_ENCRYPT_KEY } from "@/constant/constant";
import { QRCodeDataType } from "@/app/user-center/_components/KeyQRCodeModal/QRCodeStep";

const Scan = (props: {
  getScanData: (data: string) => void
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [errMessage, setErrMessage] = useState('')

  useEffect(() => {
    let animationId: number;
    let stream: MediaStream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", true);
          videoRef.current.play();
        }
        scan();
      } catch (err) {
        console.log("Error accessing camera: ", err);
      }
    };

    const scan = () => {
      if (videoRef.current?.readyState !== videoRef.current?.HAVE_ENOUGH_DATA) {
        animationId = requestAnimationFrame(scan)
        return
      }
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {

          const flag = validateQrCode(code.data);
          if (!flag) animationId = requestAnimationFrame(scan);

        } else {
          animationId = requestAnimationFrame(scan);
        }
      } else {
        animationId = requestAnimationFrame(scan);
      }
    };

    startCamera();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const validateQrCode = async (code: string) => {
    const decodeData = await decryptData(code, QRCODE_TIME_ENCRYPT_KEY)
    if (decodeData === 'error') {
      setErrMessage('密钥不正确')
      return false
    }
    const obj = JSON.parse(decodeData) as QRCodeDataType

    const timeout = obj.timestamp < new Date().getTime()

    if (timeout) {
      setErrMessage('二维码已失效，请在个人中心页重新打开密钥二维码');
      return false
    }
    props.getScanData(obj.web5DidInfo)
    return true
  }

  return <div className={S.wrap}>
    <div className={S.videoWrap}>
      <video
        ref={videoRef}
        style={{ width: "100%", height: '100%', display: "block" }}
      />

    </div>
    <p className={S.message}>{errMessage ? errMessage : '请将二维码对准扫码口'}</p>
    <canvas
      ref={canvasRef}
      style={{ display: "none"}}
    />
  </div>
}

export default Scan;