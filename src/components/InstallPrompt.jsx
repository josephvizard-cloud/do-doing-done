import { useState, useEffect } from 'react';
import { font, colors } from '../config/styles';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(standalone);

    // Check iOS
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    setIsIos(ios);

    // Listen for Android/Chrome install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Don't show if already installed or dismissed
  if (isStandalone || dismissed) return null;

  // Don't show if no install option available
  if (!deferredPrompt && !isIos) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDismissed(true);
      setDeferredPrompt(null);
    }
  };

  return (
    <div style={{
      position: 'fixed', bottom: 16, left: 16, right: 16,
      maxWidth: 388, margin: '0 auto',
      background: colors.navy, borderRadius: 16,
      padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      zIndex: 200,
      animation: 'slideUp 0.4s ease',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: `linear-gradient(135deg, ${colors.orange}, #FF8A5C)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 20 }}>⚡</span>
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: font }}>
          {isIos ? 'Add to Home Screen' : 'Install App'}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
          {isIos ? 'Tap Share → Add to Home Screen' : 'Get quick access from your home screen'}
        </p>
      </div>

      {!isIos && (
        <button onClick={handleInstall} style={{
          background: colors.orange, border: 'none', borderRadius: 10,
          padding: '8px 16px', color: '#fff', fontSize: 13, fontWeight: 700,
          cursor: 'pointer', fontFamily: font, whiteSpace: 'nowrap',
        }}>
          Install
        </button>
      )}

      <button onClick={() => setDismissed(true)} style={{
        background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
        fontSize: 18, cursor: 'pointer', padding: '0 4px', lineHeight: 1,
      }}>
        ×
      </button>
    </div>
  );
}
