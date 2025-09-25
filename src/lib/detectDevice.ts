export default function detectDevice() {
  // 获取用户代理字符串
  const userAgent = navigator.userAgent;

  // 获取屏幕信息
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  // 获取设备像素比
  const pixelRatio = window.devicePixelRatio;

  // 检测触摸支持
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // 简单设备检测逻辑
  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(userAgent);
  const isTablet = /iPad|Android|Tablet|Playbook|Silk/i.test(userAgent) && !/Mobile/i.test(userAgent);

  // 更精确的设备检测
  let deviceType = 'desktop';
  let os = '未知';
  let browser = '未知';

  // 检测操作系统
  if (/Windows/i.test(userAgent)) {
    os = 'Windows';
  } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
    os = 'macOS';
  } else if (/Linux/i.test(userAgent)) {
    os = 'Linux';
  } else if (/Android/i.test(userAgent)) {
    os = 'Android';
  } else if (/iOS|iPhone|iPad|iPod/i.test(userAgent)) {
    os = 'iOS';
  }

  // 检测浏览器
  if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/Firefox/i.test(userAgent)) {
    browser = 'Firefox';
  } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
    browser = 'Safari';
  } else if (/Edg/i.test(userAgent)) {
    browser = 'Edge';
  } else if (/Opera|OPR/i.test(userAgent)) {
    browser = 'Opera';
  }

  // 高级检测：结合多种因素判断设备类型
  const screenSize = Math.min(screenWidth, screenHeight);
  const isPortrait = screenWidth < screenHeight;

  if (isMobile && isTablet) {
    deviceType = 'tablet';
  } else if (isMobile) {
    deviceType = 'mobile';
  } else if (screenSize < 768 || (screenSize < 1024 && touchSupport)) {
    deviceType = 'mobile';
  } else if (screenSize < 1024 || (screenSize >= 1024 && touchSupport)) {
    deviceType = 'tablet';
  } else {
    deviceType = 'desktop';
  }

  return {
    device: deviceType,
    os: os,
    browser: browser,
    screen: { width: screenWidth, height: screenHeight },
    pixelRatio: pixelRatio,
    touch: touchSupport,
    isPortrait
  };
}