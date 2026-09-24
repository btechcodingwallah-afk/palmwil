import React, { useState } from 'react';
import { 
  Heart, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Smartphone, 
  Download, 
  ArrowRight, 
  Check, 
  QrCode,
  Award
} from 'lucide-react';
import { triggerAppDownload } from '../../config/env';

interface DualAudienceSectionProps {
  onNavigateRole: (role: 'client' | 'therapist' | 'admin') => void;
  onOpenQr: (type: 'patient' | 'therapist') => void;
  onShowToast: (msg: string) => void;
}

export const DualAudienceSection: React.FC<DualAudienceSectionProps> = ({
  onNavigateRole,
  onOpenQr,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'patient' | 'therapist'>('patient');

  return (
    <section id="patients" style={{
      padding: '90px 24px',
      backgroundColor: '#14110E',
      borderTop: '1px solid #28211A',
      borderBottom: '1px solid #28211A',
      color: '#FAF8F5'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Section Header */}
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
            Tailored Experiences
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 600,
            margin: '0 0 16px',
            color: '#FAF8F5'
          }}>
            Designed For Healing Seekers & Master Practitioners
          </h2>
          <p style={{ fontSize: '15px', color: '#BDB3A6', lineHeight: 1.6, margin: 0 }}>
            PamWill bridges India's discerning clientele with certified massage therapists through specialized, world-class mobile software experiences.
          </p>

          {/* Large Tab Switcher */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: '#1E1A16',
            padding: '6px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid #382F24',
            marginTop: '32px'
          }}>
            <button
              onClick={() => setActiveTab('patient')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                backgroundColor: activeTab === 'patient' ? 'var(--accent-gold)' : 'transparent',
                color: activeTab === 'patient' ? '#FFFFFF' : '#BAAE9E',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
            >
              <Heart size={16} /> For Patients & Clients
            </button>

            <button
              id="therapists"
              onClick={() => setActiveTab('therapist')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                backgroundColor: activeTab === 'therapist' ? 'var(--accent-gold)' : 'transparent',
                color: activeTab === 'therapist' ? '#FFFFFF' : '#BAAE9E',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
            >
              <TrendingUp size={16} /> For Therapists & Partners
            </button>
          </div>
        </div>

        {/* Dynamic Audience Presentation */}
        {activeTab === 'patient' ? (
          /* PATIENT VIEW */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'stretch'
          }}>
            {/* Feature 1 */}
            <div style={featureCardStyle}>
              <div style={featureIconContainer('gold')}>
                <Sparkles size={22} color="var(--accent-gold)" />
              </div>
              <h3 style={featureTitleStyle}>Five-Star Hotel Sanctuary at Home</h3>
              <p style={featureDescriptionStyle}>
                Never travel through traffic after a relaxing massage. Our therapists bring high-grade portable tables, single-use sterilized linens, organic botanical oils, and ambient music to transform your space.
              </p>
              <ul style={featureListStyle}>
                <li><Check size={14} color="var(--accent-gold)" /> Hospital-grade sanitized linens & headrest covers</li>
                <li><Check size={14} color="var(--accent-gold)" /> Cold-pressed organic almond, jojoba, & sesame oils</li>
                <li><Check size={14} color="var(--accent-gold)" /> Heated stone & aromatherapy enhancers included</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div style={featureCardStyle}>
              <div style={featureIconContainer('gold')}>
                <Award size={22} color="var(--accent-gold)" />
              </div>
              <h3 style={featureTitleStyle}>100% Certified Master Practitioners</h3>
              <p style={featureDescriptionStyle}>
                Only the top 8% of applicants join our network. Each therapist possesses accredited trade certifications, minimum 3+ years luxury spa experience, and extensive anatomical knowledge.
              </p>
              <ul style={featureListStyle}>
                <li><Check size={14} color="var(--accent-gold)" /> Verified certifications in Swedish, Deep Tissue, Thai, Ayurveda</li>
                <li><Check size={14} color="var(--accent-gold)" /> Comprehensive criminal background and police verification</li>
                <li><Check size={14} color="var(--accent-gold)" /> Gender-matched therapist preference guaranteed</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div style={featureCardStyle}>
              <div style={featureIconContainer('gold')}>
                <Clock size={22} color="var(--accent-gold)" />
              </div>
              <h3 style={featureTitleStyle}>Live GPS Arrival & Transparent Ease</h3>
              <p style={featureDescriptionStyle}>
                Book within 60 seconds. Track your therapist's route in real time. Transparent upfront pricing with zero surge fees and cashless UPI / credit card payments backed by Razorpay.
              </p>
              <ul style={featureListStyle}>
                <li><Check size={14} color="var(--accent-gold)" /> Arrival in as fast as 45 minutes or scheduled in advance</li>
                <li><Check size={14} color="var(--accent-gold)" /> Live route mapping with ETA countdown</li>
                <li><Check size={14} color="var(--accent-gold)" /> 100% cashless, transparent pricing without hidden fees</li>
              </ul>
            </div>

            {/* Patient Action & Download Banner */}
            <div style={{
              gridColumn: '1 / -1',
              backgroundColor: '#1E1A16',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(169, 129, 47, 0.3)',
              padding: '36px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              marginTop: '12px'
            }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', fontWeight: 700 }}>
                  Ready to Unwind?
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600, color: '#FAF8F5', margin: '6px 0' }}>
                  Download the PamWill Patient App
                </h3>
                <p style={{ fontSize: '14px', color: '#BDB3A6', margin: 0 }}>
                  Select your treatment, choose duration & therapist preferences, and book in 60 seconds.
                </p>
              </div>

              {/* Patient Download CTA Buttons (Playstore & Appstore demo downloads) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => triggerAppDownload('patient', 'playstore', onShowToast)}
                  style={bannerDownloadBtnStyle}
                  title="Download Google Play demo APK for patients"
                >
                  <Download size={16} color="var(--accent-gold)" /> Play Store Demo (APK)
                </button>

                <button
                  onClick={() => triggerAppDownload('patient', 'appstore', onShowToast)}
                  style={bannerDownloadBtnStyle}
                  title="Download App Store demo APK for patients"
                >
                  <Download size={16} color="var(--accent-gold)" /> App Store Demo (APK)
                </button>

                <button
                  onClick={() => onOpenQr('patient')}
                  style={{
                    backgroundColor: '#26211C',
                    border: '1px solid #3E362E',
                    color: '#FAF8F5',
                    padding: '11px 16px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <QrCode size={16} /> QR Scan
                </button>

                <button
                  onClick={() => onNavigateRole('client')}
                  style={{
                    backgroundColor: 'var(--accent-gold)',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '11px 20px',
                    borderRadius: 'var(--radius-pill)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Launch Web App <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* THERAPIST VIEW */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'stretch'
          }}>
            {/* Therapist Feature 1 */}
            <div style={featureCardStyle}>
              <div style={featureIconContainer('green')}>
                <DollarSign size={22} color="var(--status-success)" />
              </div>
              <h3 style={featureTitleStyle}>Highest Earnings in the Industry</h3>
              <p style={featureDescriptionStyle}>
                Take home up to 80%–85% of every service fee. Zero predatory cuts or hidden deductions. 100% of client cash and in-app tips go straight to your wallet.
              </p>
              <ul style={featureListStyle}>
                <li><Check size={14} color="var(--status-success)" /> Average earnings of ₹45,000 – ₹95,000+ monthly</li>
                <li><Check size={14} color="var(--status-success)" /> Weekly guaranteed payouts directly via UPI / NEFT</li>
                <li><Check size={14} color="var(--status-success)" /> Direct wallet payout requests with instant admin processing</li>
              </ul>
            </div>

            {/* Therapist Feature 2 */}
            <div style={featureCardStyle}>
              <div style={featureIconContainer('green')}>
                <ShieldCheck size={22} color="var(--status-success)" />
              </div>
              <h3 style={featureTitleStyle}>Dedicated SOS & Safety Guarantee</h3>
              <p style={featureDescriptionStyle}>
                Your safety and dignity are absolute non-negotiables. We enforce strict client identity checks, live route tracking, and a 24/7 dedicated emergency safety dispatch team.
              </p>
              <ul style={featureListStyle}>
                <li><Check size={14} color="var(--status-success)" /> In-app one-touch emergency SOS with local dispatch integration</li>
                <li><Check size={14} color="var(--status-success)" /> Strict Zero-Tolerance client conduct and cancellation policy</li>
                <li><Check size={14} color="var(--status-success)" /> On-duty accidental medical & travel insurance cover</li>
              </ul>
            </div>

            {/* Therapist Feature 3 */}
            <div style={featureCardStyle}>
              <div style={featureIconContainer('green')}>
                <Calendar size={22} color="var(--status-success)" />
              </div>
              <h3 style={featureTitleStyle}>Full Autonomy & Schedule Freedom</h3>
              <p style={featureDescriptionStyle}>
                Be your own master. Choose when to work, set your preferred service radius, and toggle online or offline with a single tap. Free starter kits and training provided.
              </p>
              <ul style={featureListStyle}>
                <li><Check size={14} color="var(--status-success)" /> Work flexible shifts — full-time, weekends, or evening hours</li>
                <li><Check size={14} color="var(--status-success)" /> Free professional therapist travel kit & linen replenishment</li>
                <li><Check size={14} color="var(--status-success)" /> Regular masterclasses & advanced massage technique workshops</li>
              </ul>
            </div>

            {/* Therapist Action & Download Banner */}
            <div style={{
              gridColumn: '1 / -1',
              backgroundColor: '#1E1A16',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(76, 107, 79, 0.4)',
              padding: '36px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              marginTop: '12px'
            }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--status-success)', fontWeight: 700 }}>
                  Elevate Your Career
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600, color: '#FAF8F5', margin: '6px 0' }}>
                  Download the PamWill Therapist Partner App
                </h3>
                <p style={{ fontSize: '14px', color: '#BDB3A6', margin: 0 }}>
                  Receive nearby client booking requests, navigate with built-in GPS, and withdraw weekly earnings.
                </p>
              </div>

              {/* Therapist Download CTA Buttons (Playstore & Appstore demo downloads) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => triggerAppDownload('therapist', 'playstore', onShowToast)}
                  style={bannerDownloadBtnStyle}
                  title="Download Google Play partner demo APK for therapists"
                >
                  <Download size={16} color="var(--status-success)" /> Play Store Demo (APK)
                </button>

                <button
                  onClick={() => triggerAppDownload('therapist', 'appstore', onShowToast)}
                  style={bannerDownloadBtnStyle}
                  title="Download App Store partner demo APK for therapists"
                >
                  <Download size={16} color="var(--status-success)" /> App Store Demo (APK)
                </button>

                <button
                  onClick={() => onOpenQr('therapist')}
                  style={{
                    backgroundColor: '#26211C',
                    border: '1px solid #3E362E',
                    color: '#FAF8F5',
                    padding: '11px 16px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <QrCode size={16} /> QR Scan
                </button>

                <button
                  onClick={() => onNavigateRole('therapist')}
                  style={{
                    backgroundColor: '#4C6B4F',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '11px 20px',
                    borderRadius: 'var(--radius-pill)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Launch Partner Portal <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

const featureCardStyle: React.CSSProperties = {
  backgroundColor: '#1B1713',
  borderRadius: 'var(--radius-xl)',
  border: '1px solid #2F261E',
  padding: '30px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 200ms ease, border-color 200ms ease',
  boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
};

const featureIconContainer = (color: 'gold' | 'green'): React.CSSProperties => ({
  width: '48px',
  height: '48px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: color === 'gold' ? 'rgba(169, 129, 47, 0.15)' : 'rgba(76, 107, 79, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px'
});

const featureTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-serif)',
  fontSize: '20px',
  fontWeight: 600,
  color: '#FAF8F5',
  margin: '0 0 10px'
};

const featureDescriptionStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#BDB3A6',
  lineHeight: 1.6,
  margin: '0 0 20px',
  flex: 1
};

const featureListStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  fontSize: '13px',
  color: '#D4C9BC'
};

const bannerDownloadBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '11px 16px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: '#26211C',
  border: '1px solid #3E362E',
  color: '#FAF8F5',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer'
};
