import React from 'react';
import { CheckCircle2, Download, ExternalLink, X } from 'lucide-react';

interface DownloadToastProps {
  message: string | null;
  onClose: () => void;
  subtext?: string;
}

export const DownloadToast: React.FC<DownloadToastProps> = ({ message, onClose, subtext }) => {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '28px',
      right: '28px',
      zIndex: 9999,
      backgroundColor: '#1E1A16',
      border: '1px solid #A9812F',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      maxWidth: '420px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(169, 129, 47, 0.2)',
      color: '#FAF8F5',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      animation: 'slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: 'rgba(169, 129, 47, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent-gold)',
        flexShrink: 0
      }}>
        <Download size={18} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
            App Download Initiated
          </span>
        </div>
        <p style={{ fontSize: '13px', color: '#D9D1C5', lineHeight: 1.4, margin: 0 }}>
          {message}
        </p>
        {subtext && (
          <p style={{ fontSize: '11px', color: '#9E9284', marginTop: '6px', margin: 0 }}>
            {subtext}
          </p>
        )}
      </div>

      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#9E9284',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px'
        }}
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
};
