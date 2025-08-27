import { useMemo } from "react";

export default function useDeviceType() {
  const isMobile = useMemo(() => {
    const deviceType = document.body.style.getPropertyValue('--device-type');
    return deviceType === 'mobile';
  }, [])

  return {
    isMobile
  }
}