import React from 'react';
import { 
  Download, 
  Smartphone, 
  Sparkles, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Star 
} from 'lucide-react';
import { triggerAppDownload, APP_DOWNLOADS } from '../../config/env';

interface DownloadSectionProps {
  onNavigateRole: (role: 'client' | 'therapist' | 'admin') => void;
  onOpenQr: (type: 'patient' | 'therapist') => void;
  onShowToast: (msg: string) => void;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({
  onNavigateRole,
  onOpenQr,
  onShowToast,
}) => {
  return (
    <section id="downloads" style={{
      padding: '90px 24px',
      backgroundColor: '#100E0C',
      color: '#FAF8F5',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(169, 129, 47, 0.12)',
            border: '1px solid rgba(169, 129, 47, 0.3)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--accent-gold-light)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '12px'
          }}>
            <Download size={14} color="var(--accent-gold)" /> App Download Center
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 600,
            margin: '0 0 16px',
            color: '#FAF8F5'
          }}>
            Get The PamWill Applications
          </h2>
          <p style={{ fontSize: '15px', color: '#BDB3A6', lineHeight: 1.6, margin: 0 }}>
            Available for both clients and practitioners. Download official test packages now or scan the QR code to install directly to your Android/iOS mobile device.
          </p>
        </div>

        {/* 2 Distinguished Cards: Patient App & Therapist App */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '32px'
        }}>
          
          {/* Card 1: Patient / Client App */}
          <div style={{
            backgroundColor: '#171411',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(169, 129, 47, 0.35)',
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(169, 129, 47, 0.15)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--accent-gold-light)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              width: 'fit-content',
              marginBottom: '16px'
            }}>
              For Wellness Seekers
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <img
                src="/assets/pamwill-icon.png"
                alt="PamWill Patient App"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  border: '1px solid rgba(169, 129, 47, 0.4)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                }}
              />
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: '#FAF8F5', margin: 0 }}>
                  PamWill Patient App
                </h3>
                <div style={{ fontSize: '13px', color: '#9E9284', marginTop: '2px' }}>
                  Client Edition • Version 1.0 (Demo APK)
                </div>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#C5BCB1', lineHeight: 1.6, marginBottom: '20px' }}>
              Book five-star certified massage therapy to your residence in 60 seconds. Track your therapist's arrival live, specify preferences, and pay securely.
            </p>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#D4C9BC' }}>
                <CheckCircle2 size={16} color="var(--accent-gold)" /> Instant doorstep booking with live ETA
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#D4C9BC' }}>
                <CheckCircle2 size={16} color="var(--accent-gold)" /> 100% verified & background-screened therapists
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#D4C9BC' }}>
                <CheckCircle2 size={16} color="var(--accent-gold)" /> In-app Razorpay & UPI seamless payment
              </div>
            </div>

            {/* 2 Store Download Buttons (Both download patient apk demo) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                
                {/* Play Store Option */}
                <button
                  onClick={() => triggerAppDownload('patient', 'playstore', onShowToast)}
                  style={downloadButtonStyle}
                  title="Download Patient App for Android (Demo APK)"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186c-.365-.366-.61-.926-.61-1.686V3.5c0-.76.245-1.32.609-1.686zM15.207 13.414l2.793 2.793-12.87 7.429 10.077-10.222zM15.207 10.586L5.13 .364 18 7.793l-2.793 2.793zM16.621 12l3.447-3.447c.54-.54.932-.303.932.447v6c0 .75-.392.987-.932.447L16.621 12z"/>
                  </svg>
                  <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                    <div style={{ fontSize: '10px', color: '#9E9284', textTransform: 'uppercase' }}>Demo Download</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#FAF8F5' }}>Google Play</div>
                  </div>
                </button>

                {/* App Store Option */}
                <button
                  onClick={() => triggerAppDownload('patient', 'appstore', onShowToast)}
                  style={downloadButtonStyle}
                  title="Download Patient App for iOS (Demo APK)"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.85.94-2.94-1 .04-2.19.67-2.87 1.46-.57.65-1.07 1.74-.94 2.8 1.11.09 2.24-.54 2.87-1.32z"/>
                  </svg>
                  <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                    <div style={{ fontSize: '10px', color: '#9E9284', textTransform: 'uppercase' }}>Demo Download</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#FAF8F5' }}>App Store</div>
                  </div>
                </button>
              </div>

              {/* QR Scan & Interactive Demo row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px' }}>
                <button
                  onClick={() => onOpenQr('patient')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-gold-light)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <QrCode size={15} /> Scan QR for Mobile Install
                </button>

                <button
                  onClick={() => onNavigateRole('client')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    color: '#BAAE9E',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Try in Browser <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Therapist Partner App */}
          <div style={{
            backgroundColor: '#171411',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(76, 107, 79, 0.4)',
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(76, 107, 79, 0.2)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--status-success)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              width: 'fit-content',
              marginBottom: '16px'
            }}>
              For Certified Therapists
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(76, 107, 79, 0.2)',
                border: '1px solid rgba(76, 107, 79, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
              }}>
                <img
                  src="/assets/pamwill-icon.png"
                  alt="PamWill Therapist App"
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: '#FAF8F5', margin: 0 }}>
                  PamWill Therapist Partner App
                </h3>
                <div style={{ fontSize: '13px', color: '#9E9284', marginTop: '2px' }}>
                  Provider Edition • Version 1.0 (Demo APK)
                </div>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#C5BCB1', lineHeight: 1.6, marginBottom: '20px' }}>
              Accept high-value booking requests, navigate seamlessly to client premises, manage your availability schedule, and request instant weekly bank transfers.
            </p>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#D4C9BC' }}>
                <CheckCircle2 size={16} color="var(--status-success)" /> Keep 80–85% revenue + 100% customer tips
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#D4C9BC' }}>
                <CheckCircle2 size={16} color="var(--status-success)" /> Weekly bank & UPI payouts with zero processing delay
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#D4C9BC' }}>
                <CheckCircle2 size={16} color="var(--status-success)" /> 24/7 dedicated in-app SOS safety hotline
              </div>
            </div>

            {/* 2 Store Download Buttons (Both download therapist apk demo) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                
                {/* Play Store Option */}
                <button
                  onClick={() => triggerAppDownload('therapist', 'playstore', onShowToast)}
                  style={downloadButtonStyle}
                  title="Download Therapist Partner App for Android (Demo APK)"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186c-.365-.366-.61-.926-.61-1.686V3.5c0-.76.245-1.32.609-1.686zM15.207 13.414l2.793 2.793-12.87 7.429 10.077-10.222zM15.207 10.586L5.13 .364 18 7.793l-2.793 2.793zM16.621 12l3.447-3.447c.54-.54.932-.303.932.447v6c0 .75-.392.987-.932.447L16.621 12z"/>
                  </svg>
                  <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                    <div style={{ fontSize: '10px', color: '#9E9284', textTransform: 'uppercase' }}>Demo Download</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#FAF8F5' }}>Google Play</div>
                  </div>
                </button>

                {/* App Store Option */}
                <button
                  onClick={() => triggerAppDownload('therapist', 'appstore', onShowToast)}
                  style={downloadButtonStyle}
                  title="Download Therapist Partner App for iOS (Demo APK)"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.85.94-2.94-1 .04-2.19.67-2.87 1.46-.57.65-1.07 1.74-.94 2.8 1.11.09 2.24-.54 2.87-1.32z"/>
                  </svg>
                  <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                    <div style={{ fontSize: '10px', color: '#9E9284', textTransform: 'uppercase' }}>Demo Download</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#FAF8F5' }}>App Store</div>
                  </div>
                </button>
              </div>

              {/* QR Scan & Interactive Demo row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px' }}>
                <button
                  onClick={() => onOpenQr('therapist')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--status-success)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <QrCode size={15} /> Scan QR for Mobile Install
                </button>

                <button
                  onClick={() => onNavigateRole('therapist')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    color: '#BAAE9E',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Try Partner Portal <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

const downloadButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  backgroundColor: '#211D18',
  border: '1px solid #3A3228',
  borderRadius: 'var(--radius-md)',
  padding: '12px 14px',
  cursor: 'pointer',
  transition: 'all 150ms ease',
  color: '#FAF8F5'
};
