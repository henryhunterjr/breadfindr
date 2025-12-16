import { useState, useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';

// Detect if running in an in-app browser (Facebook, Instagram, Messenger, etc.)
function isInAppBrowser(): boolean {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Check for common in-app browser indicators
  const inAppIndicators = [
    'FBAN',      // Facebook App
    'FBAV',      // Facebook App Version
    'FB_IAB',    // Facebook In-App Browser
    'FBIOS',     // Facebook iOS
    'FB4A',      // Facebook for Android
    'Instagram', // Instagram
    'Messenger', // Facebook Messenger
    'Twitter',   // Twitter
    'Line',      // Line app
    'KAKAOTALK', // KakaoTalk
    'Snapchat',  // Snapchat
    'Pinterest', // Pinterest
    'LinkedIn',  // LinkedIn
  ];

  return inAppIndicators.some(indicator => ua.includes(indicator));
}

// Get the current URL for opening in external browser
function getExternalBrowserUrl(): string {
  const url = window.location.href;

  // For iOS, we can use a special URL scheme to open in Safari
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    // Use x-safari-https:// scheme or just return the URL
    return url;
  }

  // For Android, intent:// can be used but regular URL usually works
  return url;
}

export default function InAppBrowserPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if we're in an in-app browser and haven't dismissed
    const wasDismissed = sessionStorage.getItem('inAppBrowserDismissed');
    if (isInAppBrowser() && !wasDismissed) {
      setShowPrompt(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
    sessionStorage.setItem('inAppBrowserDismissed', 'true');
  };

  const handleOpenInBrowser = () => {
    const url = getExternalBrowserUrl();

    // Try different methods to open in external browser
    // Method 1: For Android, try intent
    if (/Android/.test(navigator.userAgent)) {
      const intentUrl = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
      window.location.href = intentUrl;

      // Fallback after a short delay
      setTimeout(() => {
        window.open(url, '_system');
      }, 500);
    } else {
      // For iOS and others, open in new tab (which often triggers Safari)
      window.open(url, '_blank');
    }
  };

  if (!showPrompt || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 shadow-lg">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            For the best experience, open in your browser
          </p>
          <p className="text-xs text-blue-100 mt-0.5">
            Some features may not work in this app's browser
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleOpenInBrowser}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-blue-600 font-semibold rounded-lg text-sm hover:bg-blue-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-blue-500 rounded-lg transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
