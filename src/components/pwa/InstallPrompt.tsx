import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Share, Smartphone } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { IOSInstallInstructions } from './IOSInstallInstructions';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  
  const deviceInfo = useDeviceDetection();

  useEffect(() => {
    // Don't show if app is already installed
    if (deviceInfo.isInstalled) {
      setShowPrompt(false);
      return;
    }

    // Handle different devices
    if (deviceInfo.supportsInstallPrompt) {
      // For devices that support beforeinstallprompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        
        // Show prompt after user interaction
        setTimeout(() => {
          setShowPrompt(true);
        }, 5000);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    } else if (deviceInfo.isIOS && deviceInfo.browser === 'safari') {
      // For iOS Safari, show after user has interacted with the app
      setTimeout(() => {
        setShowPrompt(true);
      }, 8000);
    }
  }, [deviceInfo]);

  // Don't show if dismissed recently
  useEffect(() => {
    const dismissedTime = localStorage.getItem('installPromptDismissed');
    if (dismissedTime) {
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      if (parseInt(dismissedTime) > oneDayAgo) {
        setShowPrompt(false);
      }
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Standard install prompt for supported browsers
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    } else if (deviceInfo.isIOS) {
      // Show iOS instructions
      setShowIOSInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  // Don't show if not appropriate
  if (!showPrompt || deviceInfo.isInstalled) {
    return null;
  }

  // Get appropriate content based on device
  const getPromptContent = () => {
    if (deviceInfo.isIOS) {
      return {
        icon: <Share className="h-5 w-5 text-primary" />,
        title: "Añadir a Inicio",
        description: `Instala David Burger en tu ${deviceInfo.isIPad ? 'iPad' : 'iPhone'} para acceso rápido`,
        buttonText: "Ver instrucciones",
        buttonIcon: <Smartphone className="mr-2 h-4 w-4" />
      };
    }
    
    return {
      icon: <Download className="h-5 w-5 text-primary" />,
      title: "Instalar App",
      description: "Instala David Burger para acceso rápido y funcionalidad offline",
      buttonText: "Instalar",
      buttonIcon: <Download className="mr-2 h-4 w-4" />
    };
  };

  const content = getPromptContent();

  return (
    <>
      <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm shadow-lg border-primary/20 bg-background/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {content.icon}
              <CardTitle className="text-sm">{content.title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-xs">
            {content.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button 
            onClick={handleInstall}
            className="w-full"
            size="sm"
          >
            {content.buttonIcon}
            {content.buttonText}
          </Button>
        </CardContent>
      </Card>

      <IOSInstallInstructions
        isOpen={showIOSInstructions}
        onClose={() => setShowIOSInstructions(false)}
        isIPad={deviceInfo.isIPad}
      />
    </>
  );
};