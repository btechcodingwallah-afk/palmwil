import React, { useState } from 'react';
import { 
  Sparkles, 
  Smartphone, 
  Download, 
  Star, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  QrCode,
  Heart,
  TrendingUp
} from 'lucide-react';
import { triggerAppDownload, APP_DOWNLOADS } from '../../config/env';

interface HeroSectionProps {
  onNavigateRole: (role: 'client' | 'therapist' | 'admin') => void;
  onOpenQr: (type: 'patient' | 'therapist') => void;
  onShowToast: (msg: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigateRole,
  onOpenQr,
  onShowToast,
}) => {
  const [activeAudience, setActiveAudience] = useState<'patient' | 'therapist'>('patient');

  return (
    <section style={{
      position: 'relative',
      padding: '70px 24px 90px',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(169, 129, 47, 0.22), rgba(16, 14, 12, 0) 70%), #100E0C',
      color: '#FAF8F5',
    }}>
      {/* Subtle ambient light accents */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(169, 129, 47, 0.12) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '48px',
        alignItems: 'center'
      }} className="hero-grid">
        
        {/* Left Column: Headline, Description & CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Eyebrow Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(169, 129, 47, 0.14)',
            border: '1px solid rgba(169, 129, 47, 0.35)',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 16px',
            width: 'fit-content',
            boxShadow: '0 2px 12px rgba(169, 129, 47, 0.15)'
          }}>
            <Sparkles size={14} color="var(--accent-gold)" />
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--accent-gold-light)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              India's Premier On-Demand Luxury Spa
            </span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(36px, 5.5vw, 60px)',
            lineHeight: 1.12,
            fontWeight: 600,
            color: '#FAF8F5',
            margin: 0,
            letterSpacing: '-0.025em'
          }}>
            Five-Star Spa Therapy, <br />
            <span style={{
              background: 'linear-gradient(135deg, #F9F2E6 20%, #D4AF37 70%, #A9812F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontStyle: 'italic'
            }}>
              Delivered To Your Sanctuary.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '16px',
            lineHeight: 1.65,
            color: '#D4C9BC',
            maxWidth: '580px',
            margin: 0
          }}>
            Indulge in certified Swedish, Deep Tissue, Ayurvedic, and signature therapies in the comfort of your home or hotel. Certified therapists arrive equipped with sterilized massage tables, organic oils, and soothing acoustics.
          </p>

          {/* Dual Audience Toggle Box */}
          <div style={{
            backgroundColor: 'rgba(28, 24, 20, 0.85)',
            border: '1px solid rgba(169, 129, 47, 0.25)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
            marginTop: '8px'
          }}>
            <div style={{
              display: 'flex',
              backgroundColor: '#161310',
              padding: '4px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid #332B22',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setActiveAudience('patient')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  backgroundColor: activeAudience === 'patient' ? 'var(--accent-gold)' : 'transparent',
                  color: activeAudience === 'patient' ? '#FFFFFF' : '#BAAE9E',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 200ms ease'
                }}
              >
                <Heart size={15} /> For Patients & Clients
              </button>

              <button
                onClick={() => setActiveAudience('therapist')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  backgroundColor: activeAudience === 'therapist' ? 'var(--accent-gold)' : 'transparent',
                  color: activeAudience === 'therapist' ? '#FFFFFF' : '#BAAE9E',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 200ms ease'
                }}
              >
                <TrendingUp size={15} /> For Certified Therapists
              </button>
            </div>

            {/* Audience Details & Buttons */}
            {activeAudience === 'patient' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '13px', color: '#BDB3A6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="var(--accent-gold)" />
                  <span>Verified 5-star therapists • Real-time GPS tracking • Direct cashless checkout</span>
                </div>

                {/* 2 Download Options: Play Store & App Store (both trigger demo download for client apk) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  
                  {/* Google Play Store Demo Download */}
                  <button
                    onClick={() => triggerAppDownload('patient', 'playstore', onShowToast)}
                    style={storeButtonStyle}
                    title="Download PamWill Patient App demo APK (Google Play option)"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.609 1.814L13.793 12 3.61 22.186c-.365-.366-.61-.926-.61-1.686V3.5c0-.76.245-1.32.609-1.686zM15.207 13.414l2.793 2.793-12.87 7.429 10.077-10.222zM15.207 10.586L5.13 .364 18 7.793l-2.793 2.793zM16.621 12l3.447-3.447c.54-.54.932-.303.932.447v6c0 .75-.392.987-.932.447L16.621 12z"/>
                      </svg>
                      <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                        <div style={{ fontSize: '10px', color: '#9E9284', textTransform: 'uppercase' }}>Demo Download</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#FAF8F5' }}>Google Play</div>
                      </div>
                    </div>
                    <Download size={14} color="var(--accent-gold)" />
                  </button>

                  {/* Apple App Store Demo Download */}
                  <button
                    onClick={() => triggerAppDownload('patient', 'appstore', onShowToast)}
                    style={storeButtonStyle}
                    title="Download PamWill Patient App demo package (Apple App Store option)"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.85.94-2.94-1 .04-2.19.67-2.87 1.46-.57.65-1.07 1.74-.94 2.8 1.11.09 2.24-.54 2.87-1.32z"/>
                      </svg>
                      <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                        <div style={{ fontSize: '10px', color: '#9E9284', textTransform: 'uppercase' }}>Demo Download</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#FAF8F5' }}>App Store</div>
                      </div>
                    </div>
                    <Download size={14} color="var(--accent-gold)" />
                  </button>

                  {/* QR Scan Button */}
                  <button
                    onClick={() => onOpenQr('patient')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#26211C',
                      border: '1px solid #3E362E',
                      color: '#FAF8F5',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    title="Scan QR Code to install directly on phone"
                  >
                    <QrCode size={16} color="var(--accent-gold)" /> QR Scan
                  </button>
                </div>

                {/* Direct Simulator Switcher Link */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                  <button
                    onClick={() => onNavigateRole('client')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-gold-light)',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px'
                    }}
                  >
                    Want to test right now? Launch Interactive Patient Web App <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '13px', color: '#BDB3A6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={15} color="#4C6B4F" />
                  <span>Keep up to 85% revenue • Instant weekly payouts • Emergency SOS & verified guests</span>
                </div>

                {/* 2 Download Options: Play Store & App Store (both trigger demo download for therapist apk) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  
                  {/* Google Play Store Demo Download */}
                  <button
                    onClick={() => triggerAppDownload('therapist', 'playstore', onShowToast)}
                    style={storeButtonStyle}
                    title="Download PamWill Therapist Partner App demo APK (Google Play option)"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.609 1.814L13.793 12 3.61 22.186c-.365-.366-.61-.926-.61-1.686V3.5c0-.76.245-1.32.609-1.686zM15.207 13.414l2.793 2.793-12.87 7.429 10.077-10.222zM15.207 10.586L5.13 .364 18 7.793l-2.793 2.793zM16.621 12l3.447-3.447c.54-.54.932-.303.932.447v6c0 .75-.392.987-.932.447L16.621 12z"/>
                      </svg>
                      <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                        <div style={{ fontSize: '10px', color: '#9E9284', textTransform: 'uppercase' }}>Partner App Demo</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#FAF8F5' }}>Google Play</div>
                      </div>
                    </div>
                    <Download size={14} color="#4C6B4F" />
                  </button>

                  {/* Apple App Store Demo Download */}
                  <button
                    onClick={() => triggerAppDownload('therapist', 'appstore', onShowToast)}
                    style={storeButtonStyle}
                    title="Download PamWill Therapist Partner App demo package (Apple App Store option)"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.85.94-2.94-1 .04-2.19.67-2.87 1.46-.57.65-1.07 1.74-.94 2.8 1.11.09 2.24-.54 2.87-1.32z"/>
                      </svg>
                      <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                        <div style={{ fontSize: '10px', color: '#9E9284', textTransform: 'uppercase' }}>Partner App Demo</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#FAF8F5' }}>App Store</div>
                      </div>
                    </div>
                    <Download size={14} color="#4C6B4F" />
                  </button>

                  {/* QR Scan Button */}
                  <button
                    onClick={() => onOpenQr('therapist')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#26211C',
                      border: '1px solid #3E362E',
                      color: '#FAF8F5',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    title="Scan QR Code to install therapist partner app on phone"
                  >
                    <QrCode size={16} color="var(--accent-gold)" /> QR Scan
                  </button>
                </div>

                {/* Direct Simulator Switcher Link */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                  <button
                    onClick={() => onNavigateRole('therapist')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-gold-light)',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px'
                    }}
                  >
                    Explore Therapist Console & Earnings Simulator <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Visual Device Showcase & Trust Cards */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Glowing back aura */}
          <div style={{
            position: 'absolute',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(169, 129, 47, 0.35) 0%, rgba(169, 129, 47, 0) 70%)',
            filter: 'blur(40px)',
            zIndex: 0
          }} />

          {/* Luxury Frame Mockup */}
          <div style={{
            width: '100%',
            maxWidth: '360px',
            height: '520px',
            backgroundColor: '#171411',
            borderRadius: '36px',
            border: '8px solid #2A241D',
            boxShadow: '0 30px 80px rgba(0,0,0,0.85), 0 0 40px rgba(169, 129, 47, 0.25)',
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Phone Screen Mock Header */}
            <div style={{
              height: '36px',
              backgroundColor: '#1F1B16',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{ width: '80px', height: '14px', backgroundColor: '#100E0C', borderRadius: 'var(--radius-pill)' }} />
            </div>

            {/* Screen Content Preview */}
            <div style={{
              flex: 1,
              padding: '20px 18px',
              backgroundColor: '#FAF8F5',
              color: '#1F1B16',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              overflowY: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-gold)', fontWeight: 700 }}>
                    Sanctuary Near You
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600 }}>
                    Welcome to PamWill
                  </div>
                </div>
                <img
                  src="/assets/pamwill-icon.png"
                  alt="Pamwill"
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
              </div>

              {/* Sample Service Mini Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                border: '1px solid #ECE4D8'
              }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    backgroundColor: '#F3EDE2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)',
                    fontWeight: 700
                  }}>
                    ✨
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1F1B16' }}>
                      Swedish Relaxing Massage
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B6259' }}>
                      60 / 90 Mins • Lavender Oils
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-gold)', marginTop: '4px' }}>
                      ₹1,699
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Live Therapist Tracker Mini Card */}
              <div style={{
                backgroundColor: '#191613',
                color: '#FAF8F5',
                borderRadius: '16px',
                padding: '14px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#A9812F', fontWeight: 700, textTransform: 'uppercase' }}>
                    ● Therapist On The Way
                  </span>
                  <span style={{ fontSize: '11px', color: '#C5BCB1' }}>18 min</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>
                  Aarav Sharma (Certified Master)
                </div>
                <div style={{ fontSize: '11px', color: '#9E9284', marginTop: '2px' }}>
                  ⭐️ 4.98 (340 sessions) • Sterilized Kit Ready
                </div>
              </div>

              {/* Book Now Button Mock */}
              <div style={{
                marginTop: 'auto',
                backgroundColor: '#1F1B16',
                color: '#FFFFFF',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: 600
              }}>
                Instant Doorstep Booking
              </div>
            </div>
          </div>

          {/* Floating Trust Badge 1 (Rating) */}
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '-20px',
            backgroundColor: '#1E1A16',
            border: '1px solid rgba(169, 129, 47, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 14px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 2
          }} className="floating-badge">
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(169, 129, 47, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)'
            }}>
              <Star size={16} fill="var(--accent-gold)" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#FAF8F5' }}>4.96 / 5.0</div>
              <div style={{ fontSize: '11px', color: '#9E9284' }}>14,500+ Verified Reviews</div>
            </div>
          </div>

          {/* Floating Trust Badge 2 (Safety Verified) */}
          <div style={{
            position: 'absolute',
            bottom: '50px',
            right: '-15px',
            backgroundColor: '#1E1A16',
            border: '1px solid rgba(76, 107, 79, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '10px 14px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 2
          }} className="floating-badge">
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(76, 107, 79, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--status-success)'
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#FAF8F5' }}>100% Vetted</div>
              <div style={{ fontSize: '11px', color: '#9E9284' }}>Aadhaar & Police Screened</div>
            </div>
          </div>
        </div>

      </div>

      {/* KPI Metric Strip */}
      <div style={{
        maxWidth: '1240px',
        margin: '60px auto 0',
        padding: '24px 30px',
        backgroundColor: '#161310',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid #2B251E',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        alignItems: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
            45 Mins
          </div>
          <div style={{ fontSize: '12px', color: '#9E9284', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>
            Average Doorstep Arrival
          </div>
        </div>

        <div style={{ textAlign: 'center', borderLeft: '1px solid #2A241D', borderRight: '1px solid #2A241D' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
            100%
          </div>
          <div style={{ fontSize: '12px', color: '#9E9284', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>
            Certified & Insured Therapists
          </div>
        </div>

        <div style={{ textAlign: 'center', borderRight: '1px solid #2A241D' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
            8+ Cities
          </div>
          <div style={{ fontSize: '12px', color: '#9E9284', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>
            Bengaluru, Mumbai, Delhi & more
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 700, color: '#4C6B4F' }}>
            Up to 85%
          </div>
          <div style={{ fontSize: '12px', color: '#9E9284', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>
            Therapist Partner Revenue Share
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 960px) {
          .hero-grid {
            grid-template-columns: 1.15fr 0.85fr !important;
          }
        }
        @media (max-width: 600px) {
          .floating-badge {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

const storeButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '14px',
  backgroundColor: '#211D18',
  border: '1px solid #3A3228',
  borderRadius: 'var(--radius-md)',
  padding: '10px 16px',
  cursor: 'pointer',
  transition: 'all 150ms ease',
  color: '#FAF8F5'
};
