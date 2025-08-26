import { useEffect, useState } from "react";
import { getCenterContentWidth } from "@/lib/utils";

export default function useDeviceFlex() {
  const [centerWidth, setCenterWidth] = useState(0)
  const [clientWidth, setClientWidth] = useState(0)

  useEffect(() => {
    const generateMainWidth = () => {
      const { centerWidth, clientWidth } = getCenterContentWidth()
      setCenterWidth(centerWidth)
      setClientWidth(clientWidth)
    }

    generateMainWidth()

    window.addEventListener('resize', generateMainWidth, false);
    window.addEventListener('orientationchange', generateMainWidth, false); //移动端

    return () => {
      window.removeEventListener("resize", generateMainWidth);
      window.removeEventListener("orientationchange", generateMainWidth);
    }
  }, []);

  const is768Size = clientWidth < 768

  return {
    centerWidth,
    clientWidth,
    isUseDoubleSize: !is768Size,
  }
}