import React from 'react';
import { Mail, MessageCircle, ExternalLink, Sparkles, Building, Briefcase, HelpCircle } from 'lucide-react';
import { CONNECT_WITH_US_FORM_URL, COMPANY_INFO } from '../../config/env';

export const ConnectBanner: React.FC = () => {
  return (
    <section id="connect" style={{
      padding: '70px 24px',
      backgroundColor: '#14110E',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        <div style={{
          background: 'linear-gradient(135deg, rgba(38, 32, 26, 0.95) 0%, rgba(22, 19, 15, 0.95) 100%)',
          borderRadius: '32px',
          border: '1px solid rgba(169, 129, 47, 0.35)',
          padding: '48px 40px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
          position: 'relative',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '36px',
          alignItems: 'center'
        }} className="connect-grid">
          
          {/* Subtle gold glow behind card */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(169, 129, 47, 0.25) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }} />

          {/* Left: Text & Inquiry Types */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(169, 129, 47, 0.15)',
              border: '1px solid rgba(169, 129, 47, 0.3)',
              borderRadius: 'var(--radius-pill)',
              padding: '4px 14px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--accent-gold-light)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '14px'
            }}>
              <Sparkles size={13} color="var(--accent-gold)" /> Direct Consultation & Partnerships
            </div>

            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              fontWeight: 600,
              color: '#FAF8F5',
              lineHeight: 1.25,
              margin: '0 0 14px'
            }}>
              Have Questions or Custom Requirements? <br />
              <span style={{ color: 'var(--accent-gold-light)', fontStyle: 'italic' }}>
                Connect With Our Leadership Team
              </span>
            </h2>

            <p style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: '#C7BEB1',
              maxWidth: '620px',
              margin: '0 0 24px'
            }}>
              Whether you are an aspiring therapist partner, seeking corporate wellness packages, inquiring about hotel & resort integrations, or need dedicated booking support — we would love to hear from you.
            </p>

            {/* Category pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <div style={tagBadgeStyle}>
                <Briefcase size={13} color="var(--accent-gold)" /> Therapist Onboarding
              </div>
              <div style={tagBadgeStyle}>
                <Building size={13} color="var(--accent-gold)" /> Hotel & Luxury Villa Tie-ups
              </div>
              <div style={tagBadgeStyle}>
                <Sparkles size={13} color="var(--accent-gold)" /> Corporate Wellness Programs
              </div>
              <div style={tagBadgeStyle}>
                <HelpCircle size={13} color="var(--accent-gold)" /> General & VIP Inquiries
              </div>
            </div>
          </div>

          {/* Right: The Prominent "Connect With Us" Button */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#191512',
            padding: '32px 28px',
            borderRadius: '24px',
            border: '1px solid #332B22',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'rgba(169, 129, 47, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)',
              marginBottom: '16px'
            }}>
              <MessageCircle size={26} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: '#FAF8F5', margin: '0 0 8px' }}>
              Quick Contact Form
            </h3>
            <p style={{ fontSize: '13px', color: '#9E9284', margin: '0 0 20px', lineHeight: 1.5 }}>
              Fill in our official form and a PamWill concierge or partner manager will get back to you within 2 hours.
            </p>

            {/* Official Connect With Us Button -> Links to Google Form from .env */}
            <a
              href={CONNECT_WITH_US_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '14px 28px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--accent-gold)',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(169, 129, 47, 0.4)',
                transition: 'all 200ms ease'
              }}
              title="Open Google Form in a new tab"
            >
              Connect With Us <ExternalLink size={16} />
            </a>

            <div style={{ fontSize: '11px', color: '#7E7366', marginTop: '14px' }}>
              Direct email: <a href={`mailto:${COMPANY_INFO.email}`} style={{ color: 'var(--accent-gold-light)', textDecoration: 'none' }}>{COMPANY_INFO.email}</a>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (min-width: 900px) {
          .connect-grid {
            grid-template-columns: 1.35fr 0.85fr !important;
          }
        }
      `}</style>
    </section>
  );
};

const tagBadgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: '#231E19',
  border: '1px solid #3A3127',
  padding: '6px 12px',
  borderRadius: 'var(--radius-pill)',
  fontSize: '12px',
  color: '#D4C9BC'
};
