import React from 'react';
import { 
  Calendar, MapPin, Clock, ShieldCheck, CheckCircle2, 
  ArrowRight, Sparkles, Navigation, UserCheck, AlertCircle 
} from 'lucide-react';
import { usePamwill } from '../../state/store';

interface PartnerBookingsPreviewViewProps {
  onOpenVerificationModal?: () => void;
}

export const PartnerBookingsPreviewView: React.FC<PartnerBookingsPreviewViewProps> = ({ onOpenVerificationModal }) => {
  const { currentTherapist, isTherapistLoggedIn, setAuthTargetRole, setAuthMode, setAuthModalOpen } = usePamwill();
  const isUnderReview = isTherapistLoggedIn && currentTherapist?.status !== 'Approved';

  const handleOpenRegister = () => {
    if (isUnderReview && onOpenVerificationModal) {
      onOpenVerificationModal();
      return;
    }
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
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px 16px 100px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Top Header Banner */}
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
            ASSIGNMENTS & DISPATCH RADAR
          </span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0', color: '#FAF8F5' }}>
          Real-Time Job Workflow Preview
        </h1>
        <p style={{ fontSize: '13px', color: '#D4C8BC', margin: 0, lineHeight: 1.5 }}>
          See how verified Pamwill therapists manage assignments. When you're online, nearby booking requests matching your Google Maps service radius alert you with full transparent payout details.
        </p>
      </div>

      {/* Simulated Live Dispatch Flow Demo */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '18px',
        padding: '20px',
        border: '1px solid var(--border-hairline)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#3B82F6',
              boxShadow: '0 0 10px #3B82F6'
            }} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Interactive Dispatch Simulation</span>
          </div>
          <span style={{
            fontSize: '11px',
            color: '#16A34A',
            backgroundColor: 'rgba(22, 163, 74, 0.1)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 700
          }}>
            Status: On the Way
          </span>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '14px',
          padding: '16px',
          border: '1px solid var(--border-hairline)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                90m Luxury Swedish Stress Relief
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Booking Ref: #PW-DEMO-8821
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-gold)' }}>
                ₹2,499
              </div>
              <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>
                Instant UPI Payout
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', margin: '14px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <Clock size={14} color="var(--accent-gold)" />
              <span>Slot: Today, 04:00 PM (90 Min)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <MapPin size={14} color="var(--accent-gold)" />
              <span>The Magnolias, Sector 42 (3.2 km)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#16A34A', fontWeight: 600 }}>
              <ShieldCheck size={14} />
              <span>Patron: Ananya S. (VIP Verified)</span>
            </div>
          </div>

          {/* Workflow Steps Preview */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface)',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid var(--border-hairline)',
            marginTop: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#16A34A' }}>
              <CheckCircle2 size={16} />
              <span>1. Accepted</span>
            </div>
            <div style={{ width: '20px', height: '1px', backgroundColor: 'var(--border-hairline)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--accent-gold)' }}>
              <Navigation size={16} />
              <span>2. On the Way</span>
            </div>
            <div style={{ width: '20px', height: '1px', backgroundColor: 'var(--border-hairline)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <span>3. Start OTP</span>
            </div>
            <div style={{ width: '20px', height: '1px', backgroundColor: 'var(--border-hairline)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <span>4. Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Call to Action Card */}
      <div style={{
        textAlign: 'center',
        padding: '32px 20px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '20px',
        border: '1px solid var(--border-hairline)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-gold-light)',
          color: 'var(--accent-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px auto'
        }}>
          <Calendar size={28} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0' }}>
          Ready to Receive High-Value Client Bookings?
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
          Join over 1,200+ certified specialists and luxury spa centers who receive guaranteed daily appointments within their preferred Google Maps travel zone.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleOpenRegister}
            style={{
              padding: '12px 28px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: isUnderReview ? 'rgba(212, 163, 89, 0.2)' : 'var(--accent-gold)',
              color: isUnderReview ? 'var(--accent-gold)' : '#15120F',
              border: isUnderReview ? '1.5px solid var(--accent-gold)' : 'none',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{isUnderReview ? 'Application Under Review — View Status' : 'Apply to Receive Bookings (5 Min)'}</span>
            <ArrowRight size={14} />
          </button>

          {!isUnderReview && (
            <button
              onClick={handleOpenLogin}
              style={{
                padding: '12px 22px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-hairline)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Existing Partner Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default PartnerBookingsPreviewView;
