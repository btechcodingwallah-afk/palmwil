import React, { useEffect, useState } from 'react';
import { X, Smartphone, Download, CheckCircle, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  downloadUrl: string;
  fileName: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  downloadUrl,
  fileName
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    // Build absolute URL for QR scanning
    let fullUrl = downloadUrl;
    if (typeof window !== 'undefined' && downloadUrl.startsWith('/')) {
      fullUrl = `${window.location.origin}${downloadUrl}`;
    }

    QRCode.toDataURL(fullUrl, {
      width: 240,
      margin: 2,
      color: {
        dark: '#14120F',
        light: '#FAF8F5'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR:', err));
  }, [isOpen, downloadUrl]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(10, 9, 8, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} onClick={onClose}>
      <div
        style={{
          backgroundColor: '#191613',
          border: '1px solid #3E362E',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(169, 129, 47, 0.15)',
          padding: '28px',
          color: '#FAF8F5',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#9E9284',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            borderRadius: '50%',
            backgroundColor: '#26211C'
          }}
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(169, 129, 47, 0.15)',
            border: '1px solid rgba(169, 129, 47, 0.3)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 12px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--accent-gold-light)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '10px'
          }}>
            <Smartphone size={13} /> Direct Device Install
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: '#FAF8F5', margin: '4px 0' }}>
            {title}
          </h3>
          <p style={{ fontSize: '13px', color: '#BDB3A6', margin: 0 }}>
            {subtitle}
          </p>
        </div>

        {/* QR Code Container */}
        <div style={{
          backgroundColor: '#FAF8F5',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          width: '240px',
          height: '240px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
        }}>
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Scan to download APK"
              style={{ width: '100%', height: '100%', display: 'block', borderRadius: '8px' }}
            />
          ) : (
            <span style={{ color: '#6B6259', fontSize: '13px' }}>Generating QR Code...</span>
          )}
        </div>

        <div style={{
          backgroundColor: '#231E19',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          border: '1px solid #332B22',
          marginBottom: '20px',
          fontSize: '12px',
          color: '#BDB3A6',
          lineHeight: 1.5
        }}>
          <div style={{ fontWeight: 600, color: '#FAF8F5', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={14} color="var(--accent-gold)" /> Quick Phone Installation:
          </div>
          1. Point your smartphone camera at the QR code above.<br />
          2. Tap the link popup to download <strong>{fileName}</strong>.<br />
          3. When prompt appears, tap <em>Install</em> or <em>Open</em>.
        </div>

        {/* Direct Download fallback button */}
        <a
          href={downloadUrl}
          download={fileName}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '12px',
            backgroundColor: 'var(--accent-gold)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '14px',
            textDecoration: 'none',
            transition: 'background-color 150ms ease'
          }}
        >
          <Download size={16} /> Direct Download to this Device
        </a>
      </div>
    </div>
  );
};
