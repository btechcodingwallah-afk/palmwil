import React from 'react';
import { 
  Download, 
  Smartphone, 
  Sparkles, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Star,
  UserCheck,
  Stethoscope
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
      backgroundColor: 'var(--background, #100E0C)',
      color: 'var(--text, #FAF8F5)',
      position: 'relative',
      borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.06))',
      transition: 'background-color 200ms ease, color 200ms ease'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 52px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(198, 165, 103, 0.12)',
            border: '1px solid rgba(198, 165, 103, 0.35)',
            borderRadius: 'var(--radius-pill)',
            padding: '5px 16px',
            fontSize: '11.5px',
            fontWeight: 700,
            color: 'var(--cta, #C6A567)',
            textTransform: 'uppercase',
            letterSpacing: '0.09em',
            marginBottom: '14px'
          }}>
            <Download size={14} color="var(--cta, #C6A567)" /> Dedicated Mobile Applications
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 600,
            margin: '0 0 16px',
            color: 'var(--text, #FAF8F5)',
            letterSpacing: '-0.02em'
          }}>
            Download PamWill for Seekers & Practitioners
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted, #BDB3A6)', lineHeight: 1.6, margin: 0 }}>
            PamWill operates separate high-performance native applications tailored for clients and registered therapists. Download the official latest APK releases directly or scan with your camera to install instantly.
          </p>
        </div>

        {/* 2 Distinguished Cards: Patient App & Therapist App */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '32px'
        }}>
          
          {/* Card 1: Patient / Client App */}
          <div style={{
            backgroundColor: 'var(--surface-card, #171411)',
            borderRadius: '24px',
            border: '1px solid var(--border-gold, rgba(198, 165, 103, 0.35))',
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: 'var(--card-shadow, 0 16px 40px rgba(0,0,0,0.5))',
            transition: 'transform 200ms ease, box-shadow 200ms ease'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(198, 165, 103, 0.15)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--cta, #C6A567)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              width: 'fit-content',
              marginBottom: '18px'
            }}>
              <UserCheck size={13} /> For Wellness Seekers
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <img
                src="/assets/pamwill-icon.png"
                alt="PamWill Patient App"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  border: '1.5px solid var(--border-gold, #C6A567)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                  flexShrink: 0
                }}
              />
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: 'var(--text, #FAF8F5)', margin: 0 }}>
                  PamWill Patient App
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--text-muted, #9E9284)', marginTop: '3px' }}>
                  Client Edition • Version 1.0.0 (Direct APK • 92.3 MB)
                </div>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-muted, #C5BCB1)', lineHeight: 1.6, marginBottom: '22px' }}>
              Book certified luxury massage rituals to your residence in 60 seconds. View verified therapist profiles, track real-time therapist GPS arrival, and pay seamlessly via Razorpay & UPI.
            </p>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text, #D4C9BC)' }}>
                <CheckCircle2 size={16} color="var(--cta, #C6A567)" style={{ flexShrink: 0 }} /> Instant doorstep dispatch with live ETA tracking
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text, #D4C9BC)' }}>
                <CheckCircle2 size={16} color="var(--cta, #C6A567)" style={{ flexShrink: 0 }} /> 100% police-cleared, certified master therapists
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text, #D4C9BC)' }}>
                <CheckCircle2 size={16} color="var(--cta, #C6A567)" style={{ flexShrink: 0 }} /> Start & end session dual-OTP verification for total safety
              </div>
            </div>

            {/* Primary Direct Download APK Button */}
            <button
              onClick={() => triggerAppDownload('patient', 'playstore', onShowToast)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '14px',
                backgroundColor: 'var(--cta, #C6A567)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(198, 165, 103, 0.4)',
                transition: 'all 160ms ease',
                marginBottom: '12px'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              title="Download Patient APK directly to your device"
            >
              <Download size={18} /> Download Patient APK (92.3 MB)
            </button>

            {/* 2 Store Options & QR Scan */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <button
                onClick={() => triggerAppDownload('patient', 'playstore', onShowToast)}
                style={storeBtnStyle}
                title="Download Patient App via Google Play option"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186c-.365-.366-.61-.926-.61-1.686V3.5c0-.76.245-1.32.609-1.686zM15.207 13.414l2.793 2.793-12.87 7.429 10.077-10.222zM15.207 10.586L5.13 .364 18 7.793l-2.793 2.793zM16.621 12l3.447-3.447c.54-.54.932-.303.932.447v6c0 .75-.392.987-.932.447L16.621 12z"/>
                </svg>
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div style={{ fontSize: '9.5px', color: 'var(--text-muted, #9E9284)', textTransform: 'uppercase' }}>Install Package</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700 }}>Google Play</div>
                </div>
              </button>

              <button
                onClick={() => triggerAppDownload('patient', 'appstore', onShowToast)}
                style={storeBtnStyle}
                title="Download Patient App via App Store option"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.85.94-2.94-1 .04-2.19.67-2.87 1.46-.57.65-1.07 1.74-.94 2.8 1.11.09 2.24-.54 2.87-1.32z"/>
                </svg>
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div style={{ fontSize: '9.5px', color: 'var(--text-muted, #9E9284)', textTransform: 'uppercase' }}>Install Package</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700 }}>App Store</div>
                </div>
              </button>
            </div>

            {/* QR Scan & Interactive Demo row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-hairline, rgba(255,255,255,0.06))'
            }}>
              <button
                onClick={() => onOpenQr('patient')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--cta, #C6A567)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <QrCode size={15} /> Scan QR with Camera
              </button>

              <button
                onClick={() => onNavigateRole('client')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted, #BAAE9E)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Try Web Simulator <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 2: Therapist Partner App */}
          <div style={{
            backgroundColor: 'var(--surface-card, #171411)',
            borderRadius: '24px',
            border: '1px solid rgba(62, 123, 82, 0.4)',
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: 'var(--card-shadow, 0 16px 40px rgba(0,0,0,0.5))',
            transition: 'transform 200ms ease, box-shadow 200ms ease'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(62, 123, 82, 0.18)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#5BB377',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              width: 'fit-content',
              marginBottom: '18px'
            }}>
              <Stethoscope size={13} /> For Certified Practitioners
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(62, 123, 82, 0.2)',
                border: '1.5px solid #3E7B52',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                flexShrink: 0
              }}>
                <img
                  src="/assets/pamwill-icon.png"
                  alt="PamWill Therapist App"
                  style={{ width: '42px', height: '42px', borderRadius: '50%' }}
                />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: 'var(--text, #FAF8F5)', margin: 0 }}>
                  PamWill Therapist App
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--text-muted, #9E9284)', marginTop: '3px' }}>
                  Provider Edition • Version 1.0.0 (Direct APK • 90.5 MB)
                </div>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-muted, #C5BCB1)', lineHeight: 1.6, marginBottom: '22px' }}>
              Accept high-value booking dispatches, navigate to client premises, manage daily slots, and withdraw verified earnings directly to your bank account weekly.
            </p>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text, #D4C9BC)' }}>
                <CheckCircle2 size={16} color="#5BB377" style={{ flexShrink: 0 }} /> Keep 80–85% revenue + 100% of customer tips
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text, #D4C9BC)' }}>
                <CheckCircle2 size={16} color="#5BB377" style={{ flexShrink: 0 }} /> Fast weekly bank & UPI payouts with zero processing cut
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text, #D4C9BC)' }}>
                <CheckCircle2 size={16} color="#5BB377" style={{ flexShrink: 0 }} /> 24/7 dedicated in-app SOS safety hotline & verified client IDs
              </div>
            </div>

            {/* Primary Direct Download APK Button */}
            <button
              onClick={() => triggerAppDownload('therapist', 'playstore', onShowToast)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '14px',
                backgroundColor: '#3E7B52',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(62, 123, 82, 0.4)',
                transition: 'all 160ms ease',
                marginBottom: '12px'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              title="Download Therapist Partner APK directly to your device"
            >
              <Download size={18} /> Download Therapist APK (90.5 MB)
            </button>

            {/* 2 Store Options & QR Scan */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <button
                onClick={() => triggerAppDownload('therapist', 'playstore', onShowToast)}
                style={storeBtnStyle}
                title="Download Therapist Partner App via Google Play option"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186c-.365-.366-.61-.926-.61-1.686V3.5c0-.76.245-1.32.609-1.686zM15.207 13.414l2.793 2.793-12.87 7.429 10.077-10.222zM15.207 10.586L5.13 .364 18 7.793l-2.793 2.793zM16.621 12l3.447-3.447c.54-.54.932-.303.932.447v6c0 .75-.392.987-.932.447L16.621 12z"/>
                </svg>
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div style={{ fontSize: '9.5px', color: 'var(--text-muted, #9E9284)', textTransform: 'uppercase' }}>Install Package</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700 }}>Google Play</div>
                </div>
              </button>

              <button
                onClick={() => triggerAppDownload('therapist', 'appstore', onShowToast)}
                style={storeBtnStyle}
                title="Download Therapist Partner App via App Store option"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.85.94-2.94-1 .04-2.19.67-2.87 1.46-.57.65-1.07 1.74-.94 2.8 1.11.09 2.24-.54 2.87-1.32z"/>
                </svg>
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div style={{ fontSize: '9.5px', color: 'var(--text-muted, #9E9284)', textTransform: 'uppercase' }}>Install Package</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700 }}>App Store</div>
                </div>
              </button>
            </div>

            {/* QR Scan & Interactive Demo row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-hairline, rgba(255,255,255,0.06))'
            }}>
              <button
                onClick={() => onOpenQr('therapist')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: '#5BB377',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <QrCode size={15} /> Scan QR with Camera
              </button>

              <button
                onClick={() => onNavigateRole('therapist')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted, #BAAE9E)',
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
    </section>
  );
};

const storeBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  backgroundColor: 'var(--surface, #211D18)',
  border: '1px solid var(--border-hairline, rgba(255,255,255,0.1))',
  borderRadius: '12px',
  padding: '10px 12px',
  cursor: 'pointer',
  transition: 'all 150ms ease',
  color: 'var(--text, #FAF8F5)'
};

export default DownloadSection;
