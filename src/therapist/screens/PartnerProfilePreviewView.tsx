import React from 'react';
import { 
  User, ShieldCheck, Award, MapPin, Star, CheckCircle2, 
  ArrowRight, Phone, Mail, Navigation, Sparkles, Building, Lock 
} from 'lucide-react';
import { usePamwill } from '../../state/store';

export const PartnerProfilePreviewView: React.FC = () => {
  const { setAuthTargetRole, setAuthMode, setAuthModalOpen } = usePamwill();

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
      maxWidth: '840px',
      margin: '0 auto',
      padding: '20px 16px 100px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Top Banner */}
      <div style={{
        padding: '24px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #1C1814 0%, #2A231C 100%)',
        border: '1px solid rgba(212, 163, 89, 0.3)',
        color: '#FFFFFF'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={16} color="var(--accent-gold)" />
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--accent-gold)' }}>
            PRACTITIONER CREDENTIAL PORTFOLIO
          </span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0' }}>
          Verified Partner Profile Preview
        </h1>
        <p style={{ fontSize: '13px', color: '#D4C8BC', margin: 0, lineHeight: 1.5 }}>
          This is how your verified luxury profile appears to high-net-worth clients across your city. Verified credentials command highest-tier bookings and tips.
        </p>
      </div>

      {/* Profile Card Mockup */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid var(--border-hairline)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
            alt="Verified Therapist"
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--accent-gold)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Pooja Sharma</h2>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--accent-gold)',
                backgroundColor: 'var(--accent-gold-light)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ShieldCheck size={12} /> CIDESCO Master
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 700 }}>
                <Star size={13} fill="#F59E0B" /> 4.96 (42 Reviews)
              </span>
              <span>•</span>
              <span>6 Years Experience</span>
              <span>•</span>
              <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>✓ Police Clearance Verified</span>
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-hairline)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Google Maps Base</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              DLF Cyber City / Phase 5
            </div>
            <div style={{ fontSize: '11px', color: 'var(--accent-gold)', marginTop: '2px' }}>
              10 km Active Perimeter
            </div>
          </div>

          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-hairline)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Certification Credentials</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              CIDESCO & ITEC Level 4
            </div>
            <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '2px' }}>
              Verified by Clinical Board
            </div>
          </div>

          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-hairline)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Instant Payout Route</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              HDFC Bank / UPI Direct
            </div>
            <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '2px' }}>
              Auto 30-Min Clearance
            </div>
          </div>
        </div>

        {/* Sign In & Sign Up Card */}
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(169, 129, 47, 0.1) 0%, rgba(212, 163, 89, 0.05) 100%)',
          border: '1.5px dashed var(--accent-gold)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-gold-light)',
            color: 'var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px auto'
          }}>
            <Lock size={20} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 6px 0' }}>
            Access or Create Your Practitioner Profile
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
            Sign in to manage your active jobs, configure your Google Maps radius, and withdraw your daily earnings. Or apply to join in 5 minutes!
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleOpenLogin}
              style={{
                padding: '11px 24px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--text-primary)',
                color: '#FAF8F5',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Sign In to Your Account
            </button>

            <button
              onClick={handleOpenRegister}
              style={{
                padding: '11px 24px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--accent-gold)',
                color: '#15120F',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Apply to Join Pamwill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PartnerProfilePreviewView;
