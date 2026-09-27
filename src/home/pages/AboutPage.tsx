import React from 'react';
import { WebsitePage } from '../types';
import { MASTER_THERAPISTS, TESTIMONIALS } from '../data/websiteContent';
import { 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Star, 
  Lock, 
  CheckCircle2, 
  Smartphone,
  Heart,
  Droplets,
  Activity,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

interface AboutPageProps {
  onNavigatePage: (page: WebsitePage) => void;
  onOpenAppDownload?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigatePage,
  onOpenAppDownload
}) => {
  const handleAppLaunch = () => {
    if (onOpenAppDownload) {
      onOpenAppDownload();
    } else {
      onNavigatePage('contact');
    }
  };

  return (
    <div style={{
      width: '100%',
      padding: '60px 24px 90px',
      backgroundColor: 'var(--background)',
      color: 'var(--text)',
      transition: 'background-color 200ms ease, color 200ms ease'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Breadcrumb Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => onNavigatePage('home')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
          >
            Home
          </button>
          <span>/</span>
          <span style={{ color: 'var(--cta)' }}>Why PamWill & Standards</span>
        </div>

        {/* 1. COMPANY STORY */}
        <div style={{ maxWidth: '860px', margin: '0 auto 64px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--pill-bg)',
            border: '1px solid var(--pill-border)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--pill-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '14px'
          }}>
            <Sparkles size={13} color="var(--cta)" /> The PamWill Philosophy
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(30px, 4vw, 44px)',
            fontWeight: 600,
            margin: '0 0 20px',
            color: 'var(--text)',
            letterSpacing: '-0.02em'
          }}>
            Restoring Tranquility Through Uncompromising Standards
          </h1>

          <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--text)', margin: '0 0 16px' }}>
            PamWill was founded to resolve a singular dilemma: why should individuals seeking therapeutic relief endure chaotic commutes, crowded waiting lounges, or inconsistent hygiene?
          </p>

          <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
            We engineered an on-demand sanctuary platform combining hospital-grade sterilization protocols with elite clinical therapists. By delivering five-star spa equipment, heated basalt stones, and pure botanical infusions directly into private residences and executive hotels, we protect your personal sanctuary.
          </p>
        </div>

        {/* 2. THE GOLD STANDARDS & HYGIENE */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--cta)', marginBottom: '6px' }}>
              Safety & Hygiene Protocols
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
              The Four Pillars of Clinical Safety
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              {
                icon: <Award size={22} color="var(--cta)" />,
                title: '500+ Hours Accredited Vetting',
                desc: 'Government identity checks, criminal background verification, and formal CIDESCO / Kerala Ayurveda academy credential screening.'
              },
              {
                icon: <Droplets size={22} color="var(--cta)" />,
                title: 'Medical-Grade Linen Packs',
                desc: 'Every session utilizes hermetically sealed single-use face cradle covers, disposable sheets, and hypoallergenic toweling.'
              },
              {
                icon: <Lock size={22} color="var(--cta)" />,
                title: 'Dual-OTP Verification & SOS',
                desc: 'Mutual start and end OTP codes protect your session lifecycle, backed by live 24/7 GPS dispatch and rapid-response safety monitoring.'
              },
              {
                icon: <Heart size={22} color="var(--cta)" />,
                title: '100% Organic Cold-Pressed Oils',
                desc: 'Zero synthetic mineral oils or petroleum derivatives. Only pure botanical sweet almond, jojoba, and therapeutic essential essences.'
              }
            ].map((p, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border-hairline)',
                  borderRadius: '16px',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: 'var(--card-shadow)'
                }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {p.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--text-muted)', margin: 0 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. THERAPIST CREDENTIALS */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--cta)', marginBottom: '6px' }}>
              Our Practitioners
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
              Meet Certified Master Therapists
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {MASTER_THERAPISTS.map((t) => (
              <div
                key={t.id}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-hairline)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--card-shadow)'
                }}
              >
                <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(6px)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Star size={12} color="var(--cta)" fill="var(--cta)" /> {t.rating} ({t.completedSessions}+ sessions)
                  </div>
                </div>

                <div style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: 'var(--text)', margin: '0 0 4px' }}>
                    {t.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--cta)', fontWeight: 600, marginBottom: '10px' }}>
                    {t.title}
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-muted)', margin: '0 0 16px', flex: 1, fontStyle: 'italic' }}>
                    "{t.quote}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Experience: {t.experienceYears}+ years</span>
                    <span style={{ color: 'var(--cta)' }}>{t.specialties[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. BOTTOM CTA */}
        <div style={{
          textAlign: 'center',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-gold)',
          borderRadius: '20px',
          padding: '44px 24px',
          boxShadow: 'var(--card-shadow)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text)', margin: '0 0 12px' }}>
            Experience Sanctuary-Grade Care in Your Space
          </h3>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 24px' }}>
            Download the PamWill mobile application for verified therapist dispatch, or speak with our private wellness concierge.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
            <button
              onClick={handleAppLaunch}
              style={{
                backgroundColor: 'var(--cta)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '14px 32px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(198, 165, 103, 0.35)'
              }}
            >
              <Smartphone size={16} /> Get The App to Book <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigatePage('contact')}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text)',
                border: '1px solid var(--border-hairline)',
                borderRadius: 'var(--radius-pill)',
                padding: '14px 24px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <MessageSquare size={16} /> Contact Concierge
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
