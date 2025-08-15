import { useState, useEffect } from 'react';

interface DeviceInfo {
  isIOS: boolean;
  isIPad: boolean;
  isIPhone: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isTablet: boolean;
  browser: 'safari' | 'chrome' | 'firefox' | 'edge' | 'other';
  supportsInstallPrompt: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isIOS: false,
    isIPad: false,
    isIPhone: false,
    isAndroid: false,
    isMobile: false,
    isTablet: false,
    browser: 'other',
    supportsInstallPrompt: false,
    isInstalled: false,
    isStandalone: false,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    // Detect iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
                  (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isIPad = /iPad/.test(userAgent) || 
                   (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isIPhone = /iPhone/.test(userAgent);
    
    // Detect Android
    const isAndroid = /Android/.test(userAgent);
    
    // Detect mobile and tablet
    const isMobile = /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(userAgent);
    
    // Detect browser
    let browser: DeviceInfo['browser'] = 'other';
    if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
      browser = 'safari';
    } else if (/Chrome/.test(userAgent)) {
      browser = 'chrome';
    } else if (/Firefox/.test(userAgent)) {
      browser = 'firefox';
    } else if (/Edge/.test(userAgent)) {
      browser = 'edge';
    }
    
    // Check if app supports install prompt (not iOS Safari)
    const supportsInstallPrompt = !isIOS && 'onbeforeinstallprompt' in window;
    
    // Check if app is installed/standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true;
    
    // Check if app is installed (PWA)
    const isInstalled = isStandalone;

    setDeviceInfo({
      isIOS,
      isIPad,
      isIPhone,
      isAndroid,
      isMobile,
      isTablet,
      browser,
      supportsInstallPrompt,
      isInstalled,
      isStandalone,
    });
  }, []);

  return deviceInfo;
};