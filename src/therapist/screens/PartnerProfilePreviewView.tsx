import React, { useState } from 'react';
import { 
  User, ShieldCheck, Award, MapPin, Star, CheckCircle2, 
  ArrowRight, Phone, Mail, Navigation, Sparkles, Building, Lock,
  ChevronDown, HelpCircle, DollarSign, Clock, Shield, UserCheck, ExternalLink
} from 'lucide-react';
import { usePamwill } from '../../state/store';

export const PartnerProfilePreviewView: React.FC = () => {
  const { setAuthTargetRole, setAuthMode, setAuthModalOpen, setTherapistSubRoute } = usePamwill();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleOpenRegister = () => {
    setAuthTargetRole('therapist');
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  const handleOpenLogin = () => {
    setAuthTargetRole('therapist');
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      padding: '24px 20px 120px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px'
    }}>
      {/* 1. TOP HEADER BANNER (HIGH CONTRAST & LUXURY OBSIDIAN) */}
      <div style={{
        padding: '32px 28px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #1C1814 0%, #2A231C 50%, #15120F 100%)',
        border: '1px solid rgba(212, 163, 89, 0.35)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
        color: '#FAF8F5'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sparkles size={16} color="var(--accent-gold)" />
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--accent-gold)'
          }}>
            PRACTITIONER HUB & CREDENTIAL PORTFOLIO
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(24px, 4vw, 34px)',
          fontWeight: 700,
          margin: '0 0 10px 0',
          color: '#FAF8F5',
          lineHeight: 1.2
        }}>
          Partner Sanctuary & Profile Hub
        </h1>

        <p style={{
          fontSize: '14px',
          color: '#D8D1C7',
          margin: '0 0 24px 0',
          lineHeight: 1.6,
          maxWidth: '720px'
        }}>
          Welcome to the Pamwill Partner Collective. Sign in to access your live practitioner dashboard, customize your Google Maps travel perimeter, and manage daily payouts. Or apply to start receiving luxury appointments in your area.
        </p>

        {/* Dual Primary Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleOpenLogin}
            style={{
              padding: '12px 24px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'transparent',
              color: '#FAF8F5',
              border: '1.5px solid var(--accent-gold)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(212, 163, 89, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <UserCheck size={16} color="var(--accent-gold)" />
            <span>Sign In to Existing Account</span>
          </button>

          <button
            onClick={handleOpenRegister}
            style={{
              padding: '12px 26px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--accent-gold)',
              color: '#15120F',
              border: 'none',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(212, 163, 89, 0.4)',
              transition: 'transform 120ms ease'
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <Sparkles size={16} />
            <span>Apply as Therapist / Spa (5 Min)</span>
          </button>
        </div>
      </div>

      {/* 2. DUAL FAST ACTION CARDS: SIGN IN OR REGISTER */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {/* Card 1: Existing Login */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid var(--border-hairline)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'var(--accent-gold-light)',
              color: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <UserCheck size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
              Existing Partner Sign In
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Already registered? Sign in with your phone or Google account to access your live schedule, active jobs, client chat, and daily wallet withdrawals.
            </p>
          </div>

          <button
            onClick={handleOpenLogin}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--text-primary)',
              color: '#FAF8F5',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>Access Your Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Card 2: New Partner Registration */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          padding: '24px',
          border: '1.5px solid rgba(212, 163, 89, 0.4)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(76, 175, 80, 0.15)',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <Sparkles size={22} color="var(--accent-gold)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                New Therapist or Spa Partner
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Join 1,200+ verified specialists. Enjoy <strong>0% commission for 30 days</strong>, instant daily UPI payouts, and custom Google Maps service area setup.
            </p>
          </div>

          <button
            onClick={handleOpenRegister}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--accent-gold)',
              color: '#15120F',
              border: 'none',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>Apply Now (5 Minutes)</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 3. SHOWCASE: WHAT YOUR VERIFIED LUXURY PROFILE LOOKS LIKE */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '22px',
        padding: '28px',
        border: '1px solid var(--border-hairline)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '22px' }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--accent-gold)' }}>PATRON-FACING SHOWCASE</span>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '4px 0 0 0', color: 'var(--text-primary)' }}>
              What Your Verified Profile Looks Like to Clients
            </h2>
          </div>
          <span style={{
            fontSize: '11px',
            color: 'var(--status-success)',
            backgroundColor: 'rgba(76, 175, 80, 0.12)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 700
          }}>
            ✓ Elite Tier Certified
          </span>
        </div>

        {/* Profile Card Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          padding: '20px',
          borderRadius: '16px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-hairline)',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
            alt="Verified Therapist"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2.5px solid var(--accent-gold)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
            }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '21px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Pooja Sharma
              </h3>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--accent-gold)',
                backgroundColor: 'var(--accent-gold-light)',
                border: '1px solid rgba(212, 163, 89, 0.4)',
                padding: '2px 10px',
                borderRadius: 'var(--radius-pill)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ShieldCheck size={12} /> CIDESCO Master
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '6px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              flexWrap: 'wrap'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 700 }}>
                <Star size={14} fill="#F59E0B" /> 4.96 (42 VIP Reviews)
              </span>
              <span>•</span>
              <span>6 Years Experience</span>
              <span>•</span>
              <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>✓ Police & Identity Verified</span>
            </div>
          </div>
        </div>

        {/* Credential Attributes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '16px',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-hairline)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)', marginBottom: '4px' }}>
              <Navigation size={15} />
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Google Maps Base</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              DLF Cyber City / Golf Course Rd
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              10 km Active Operating Perimeter
            </div>
          </div>

          <div style={{
            padding: '16px',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-hairline)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)', marginBottom: '4px' }}>
              <Award size={15} />
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Certifications</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              CIDESCO & ITEC Level 4 Sports
            </div>
            <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '2px', fontWeight: 600 }}>
              ✓ Clinical Board Verified
            </div>
          </div>

          <div style={{
            padding: '16px',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-hairline)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)', marginBottom: '4px' }}>
              <DollarSign size={15} />
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Settlement Route</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Direct UPI / HDFC Bank
            </div>
            <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '2px', fontWeight: 600 }}>
              ✓ Auto 30-Min Post-Service
            </div>
          </div>
        </div>

        {/* Sample Verified Patron Review */}
        <div style={{
          padding: '16px 20px',
          borderRadius: '14px',
          backgroundColor: 'rgba(212, 163, 89, 0.08)',
          border: '1px solid rgba(212, 163, 89, 0.25)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <Star size={18} fill="var(--accent-gold)" color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Verified Patron Testimonial: </strong>
            "Pooja arrived punctually with heated organic oils and pristine linens. Her deep tissue technique for my chronic cervical strain was outstanding. Highly recommend her to anyone looking for clinic-grade luxury therapy."
            <div style={{ fontSize: '11px', color: 'var(--accent-gold)', marginTop: '4px', fontWeight: 700 }}>
              — Ananya K., DLF Phase 5 (Verified Gold Patron)
            </div>
          </div>
        </div>
      </div>

      {/* 4. FREQUENTLY ASKED QUESTIONS SHORTCUT */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '22px',
        padding: '24px 28px',
        border: '1px solid var(--border-hairline)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Partner Onboarding & Account FAQs
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Common questions about credentials, Google Maps radius, and payments.
            </p>
          </div>

          <button
            onClick={() => setTherapistSubRoute('faqs')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-gold)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0
            }}
          >
            <span>View All FAQs</span>
            <ExternalLink size={13} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            {
              id: 1,
              q: 'How do I adjust my Google Maps operating perimeter after joining?',
              a: 'Once logged into your dashboard, visit the Profile tab and tap "Adjust Service Base". You can drag your pin anywhere on Google Maps and choose a 5 km, 10 km, or 15 km perimeter. You will only receive client booking alerts within that radius.'
            },
            {
              id: 2,
              q: 'Can Spa Centers or Clinics manage a team of multiple therapists?',
              a: 'Yes! Spa owners can register their establishment, add certified therapists under one master account, dispatch fleet members to client locations, or accept in-sanctuary appointments at your premises with centralized payouts.'
            },
            {
              id: 3,
              q: 'When and how can I withdraw my wallet earnings?',
              a: 'Earnings are automatically eligible for payout right after session completion. You can also tap "Request Payout" anytime on your dashboard to trigger an instant UPI transfer directly to your registered bank account.'
            }
          ].map(item => (
            <div
              key={item.id}
              style={{
                borderRadius: '12px',
                border: '1px solid var(--border-hairline)',
                backgroundColor: expandedFaq === item.id ? 'var(--bg-secondary)' : 'transparent',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}
              >
                <span>{item.q}</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: expandedFaq === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 150ms ease',
                    color: 'var(--accent-gold)'
                  }}
                />
              </button>
              {expandedFaq === item.id && (
                <div style={{
                  padding: '0 16px 14px 16px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5
                }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PartnerProfilePreviewView;
