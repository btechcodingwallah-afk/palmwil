import React, { useEffect, useState } from 'react';
import { X, Smartphone, Download, CheckCircle2, ShieldCheck, Sparkles, UserCheck, Stethoscope } from 'lucide-react';
import QRCode from 'qrcode';
import { APP_DOWNLOADS, triggerAppDownload } from '../../config/env';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'patient' | 'therapist';
  onShowToast?: (msg: string) => void;
  // Backward compatibility optional props
  title?: string;
  subtitle?: string;
  downloadUrl?: string;
  fileName?: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  initialType = 'patient',
  onShowToast,
  title: customTitle,
  subtitle: customSubtitle,
  downloadUrl: customDownloadUrl,
  fileName: customFileName
}) => {
  const [activeTab, setActiveTab] = useState<'patient' | 'therapist'>(initialType);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Sync activeTab when initialType changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialType);
    }
  }, [isOpen, initialType]);

  // Determine current app details based on active tab
  const isPatient = activeTab === 'patient';
  const appConfig = isPatient ? APP_DOWNLOADS.patient : APP_DOWNLOADS.therapist;
  const currentUrl = customDownloadUrl && !isPatient ? customDownloadUrl : appConfig.apkUrl;
  const currentFileName = customFileName && !isPatient ? customFileName : appConfig.fileName;
  const currentTitle = customTitle || (isPatient ? 'PamWill Patient & Client App' : 'PamWill Therapist Partner App');
  const currentSubtitle = customSubtitle || (
    isPatient
      ? 'Book certified luxury therapists to your doorstep in 60s with real-time GPS tracking and cashless payments.'
      : 'Accept high-earning booking dispatches, navigate to verified client homes, and receive instant weekly payouts.'
  );
  const fileSizeLabel = isPatient ? '92.3 MB' : '90.5 MB';
  const editionLabel = isPatient ? 'Client Edition • v1.0.0' : 'Provider Edition • v1.0.0';

  // Generate QR Code for direct APK download
  useEffect(() => {
    if (!isOpen) return;

    let fullUrl = currentUrl;
    if (typeof window !== 'undefined' && currentUrl.startsWith('/')) {
      fullUrl = `${window.location.origin}${currentUrl}`;
    }

    QRCode.toDataURL(fullUrl, {
      width: 220,
      margin: 2,
      color: {
        dark: '#14120F',
        light: '#FAF8F5'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR:', err));
  }, [isOpen, currentUrl]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = (store?: 'playstore' | 'appstore') => {
    triggerAppDownload(activeTab, store || 'playstore', onShowToast);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 9, 8, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'pamwillFadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--surface-card, #191613)',
          border: '1px solid var(--border-gold, #3E362E)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 70px rgba(0,0,0,0.85), 0 0 40px rgba(198, 165, 103, 0.15)',
          padding: '28px 24px',
          color: 'var(--text, #FAF8F5)',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted, #9E9284)',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor: 'var(--surface, #26211C)',
            transition: 'all 150ms ease'
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--cta, #C6A567)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted, #9E9284)')}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(198, 165, 103, 0.15)',
            border: '1px solid rgba(198, 165, 103, 0.35)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--cta, #C6A567)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '10px'
          }}>
            <Smartphone size={13} /> Official PamWill Applications
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(22px, 4vw, 26px)',
            fontWeight: 600,
            color: 'var(--text, #FAF8F5)',
            margin: '4px 0 6px'
          }}>
            Download Mobile Apps
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted, #BDB3A6)', margin: 0, lineHeight: 1.5 }}>
            Select your app below to scan the installation QR code or download the Android APK directly.
          </p>
        </div>

        {/* Dual Tab Switcher: Patient App vs Therapist Partner App */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          backgroundColor: 'var(--surface, #12100E)',
          padding: '6px',
          borderRadius: '16px',
          border: '1px solid var(--border-hairline, rgba(255,255,255,0.08))',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setActiveTab('patient')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 12px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 160ms ease',
              backgroundColor: isPatient ? 'var(--cta, #C6A567)' : 'transparent',
              color: isPatient ? '#FFFFFF' : 'var(--text-muted, #A09689)',
              boxShadow: isPatient ? '0 4px 14px rgba(198, 165, 103, 0.35)' : 'none'
            }}
          >
            <UserCheck size={16} /> Patient App
          </button>

          <button
            onClick={() => setActiveTab('therapist')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 12px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 160ms ease',
              backgroundColor: !isPatient ? '#3E7B52' : 'transparent',
              color: !isPatient ? '#FFFFFF' : 'var(--text-muted, #A09689)',
              boxShadow: !isPatient ? '0 4px 14px rgba(62, 123, 82, 0.4)' : 'none'
            }}
          >
            <Stethoscope size={16} /> Therapist App
          </button>
        </div>

        {/* Selected App Card & Meta */}
        <div style={{
          backgroundColor: 'var(--surface, #1C1814)',
          borderRadius: '16px',
          border: `1px solid ${isPatient ? 'rgba(198, 165, 103, 0.25)' : 'rgba(62, 123, 82, 0.35)'}`,
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <img
            src="/assets/pamwill-icon.png"
            alt={currentTitle}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              border: `1.5px solid ${isPatient ? 'var(--border-gold, #C6A567)' : '#3E7B52'}`,
              boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
              flexShrink: 0
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '10.5px',
              fontWeight: 700,
              color: isPatient ? 'var(--cta, #C6A567)' : '#5BB377',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '2px'
            }}>
              {isPatient ? 'Seeker & Client Edition' : 'Verified Practitioner Edition'}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text, #FAF8F5)',
              margin: '0 0 4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {currentTitle}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: 'var(--text-muted, #9E9284)' }}>
              <span>{editionLabel}</span>
              <span>•</span>
              <span style={{ fontWeight: 600, color: 'var(--text, #FAF8F5)' }}>{fileSizeLabel}</span>
            </div>
          </div>
        </div>

        {/* QR Code Container */}
        <div style={{
          backgroundColor: '#FAF8F5',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px',
          width: '220px',
          height: '220px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
        }}>
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`Scan to download ${currentTitle}`}
              style={{ width: '100%', height: '100%', display: 'block', borderRadius: '8px' }}
            />
          ) : (
            <span style={{ color: '#6B6259', fontSize: '12px' }}>Generating QR Code...</span>
          )}
        </div>

        {/* Quick Phone Install Instructions */}
        <div style={{
          backgroundColor: 'var(--surface, #211C17)',
          borderRadius: '12px',
          padding: '12px 14px',
          border: '1px solid var(--border-hairline, rgba(255,255,255,0.06))',
          marginBottom: '20px',
          fontSize: '12px',
          color: 'var(--text-muted, #BDB3A6)',
          lineHeight: 1.55
        }}>
          <div style={{ fontWeight: 600, color: 'var(--text, #FAF8F5)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} color={isPatient ? 'var(--cta, #C6A567)' : '#5BB377'} /> Quick Installation Steps:
          </div>
          1. Point your smartphone camera at the QR code above.<br />
          2. Tap the browser popup to download <strong>{currentFileName}</strong>.<br />
          3. Tap <em>Install</em> (allow unknown source if prompted) to launch.
        </div>

        {/* Primary Direct Download Button */}
        <button
          onClick={() => handleDownload('playstore')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '14px',
            backgroundColor: isPatient ? 'var(--cta, #C6A567)' : '#3E7B52',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--radius-pill, 9999px)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: isPatient ? '0 6px 20px rgba(198, 165, 103, 0.4)' : '0 6px 20px rgba(62, 123, 82, 0.4)',
            transition: 'all 160ms ease',
            marginBottom: '12px'
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <Download size={18} /> Direct Download {isPatient ? 'Patient' : 'Therapist'} APK ({fileSizeLabel})
        </button>

        {/* Store Links (Google Play & Apple App Store) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            onClick={() => handleDownload('playstore')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: 'var(--surface, #211D18)',
              border: '1px solid var(--border-hairline, rgba(255,255,255,0.1))',
              borderRadius: '12px',
              padding: '10px 12px',
              cursor: 'pointer',
              color: 'var(--text, #FAF8F5)',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 150ms ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.793 12 3.61 22.186c-.365-.366-.61-.926-.61-1.686V3.5c0-.76.245-1.32.609-1.686zM15.207 13.414l2.793 2.793-12.87 7.429 10.077-10.222zM15.207 10.586L5.13 .364 18 7.793l-2.793 2.793zM16.621 12l3.447-3.447c.54-.54.932-.303.932.447v6c0 .75-.392.987-.932.447L16.621 12z"/>
            </svg>
            Google Play (APK)
          </button>

          <button
            onClick={() => handleDownload('appstore')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: 'var(--surface, #211D18)',
              border: '1px solid var(--border-hairline, rgba(255,255,255,0.1))',
              borderRadius: '12px',
              padding: '10px 12px',
              cursor: 'pointer',
              color: 'var(--text, #FAF8F5)',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 150ms ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.85.94-2.94-1 .04-2.19.67-2.87 1.46-.57.65-1.07 1.74-.94 2.8 1.11.09 2.24-.54 2.87-1.32z"/>
            </svg>
            Apple App Store
          </button>
        </div>

        {/* Direct Link Tag for Fallback Download */}
        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          <a
            href={currentUrl}
            download={currentFileName}
            style={{
              fontSize: '11.5px',
              color: 'var(--text-muted, #9E9284)',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Direct browser link: {currentFileName}
          </a>
        </div>
      </div>
    </div>
  );
};

