import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Lock, 
  PhoneCall, 
  Flame, 
  AlertTriangle 
} from 'lucide-react';

export const SafetyStandardsSection: React.FC = () => {
  const standards = [
    {
      icon: <UserCheck size={24} color="var(--accent-gold)" />,
      title: "Rigorous 7-Step Verification",
      description: "Government Aadhaar biometric authentication, police background check, accredited massage certificate validation, and comprehensive trade skill evaluations."
    },
    {
      icon: <Sparkles size={24} color="var(--accent-gold)" />,
      title: "Hospital-Grade Hygiene Kits",
      description: "Every therapist carries hermetically sealed, single-use linens, sterile face cradle covers, sanitized silicone tools, and pharmaceutical-grade hand antiseptics."
    },
    {
      icon: <PhoneCall size={24} color="var(--accent-gold)" />,
      title: "24/7 Safety Command Center",
      description: "Real-time trip telemetry, route departure alerts, and dedicated safety managers on standby for every active home or hotel booking."
    },
    {
      icon: <AlertTriangle size={24} color="var(--accent-gold)" />,
      title: "Instant One-Touch SOS",
      description: "Discreet in-app SOS triggers emergency alerts to local security response units and sends live GPS coordinates to verified emergency contacts."
    },
    {
      icon: <Flame size={24} color="var(--accent-gold)" />,
      title: "100% Certified Organic Botanicals",
      description: "We use only pure cold-pressed almond, sesame, jojoba, and therapeutic-grade French lavender essential oils — free from parabens, mineral oils, and synthetic perfumes."
    },
    {
      icon: <Lock size={24} color="var(--accent-gold)" />,
      title: "Strict Zero-Harassment Code",
      description: "A legally binding code of conduct protects both client and therapist dignity. Any breach results in permanent expulsion and immediate legal action."
    }
  ];

  return (
    <section id="safety" style={{
      padding: '90px 24px',
      backgroundColor: '#14110E',
      borderTop: '1px solid #28211A',
      borderBottom: '1px solid #28211A',
      color: '#FAF8F5'
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
            <ShieldCheck size={14} color="var(--accent-gold)" /> The PamWill Gold Standard
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 600,
            margin: '0 0 16px',
            color: '#FAF8F5'
          }}>
            Uncompromising Safety & Pristine Hygiene
          </h2>
          <p style={{ fontSize: '15px', color: '#BDB3A6', lineHeight: 1.6, margin: 0 }}>
            Bringing luxury spa therapy into private spaces requires total trust. We set the highest safety, hygiene, and ethical standards across India.
          </p>
        </div>

        {/* 6 Standards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px'
        }}>
          {standards.map((s, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#191512',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid #2B231B',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
              }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(169, 129, 47, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {s.icon}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '19px',
                fontWeight: 600,
                color: '#FAF8F5',
                margin: 0
              }}>
                {s.title}
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#BDB3A6',
                lineHeight: 1.6,
                margin: 0
              }}>
                {s.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
