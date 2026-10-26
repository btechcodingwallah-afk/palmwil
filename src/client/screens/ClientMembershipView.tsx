import React, { useState } from 'react';
import { 
  Crown, Check, Sparkles, Shield, ArrowRight, Star, HeartHandshake, Zap 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { MEMBERSHIP_PLANS } from '../../data/mockData';

export const ClientMembershipView: React.FC = () => {
  const { user, updateUser, setClientSubRoute } = usePamwill();
  const [selectedPlanId, setSelectedPlanId] = useState<'silver' | 'gold' | 'platinum'>(
    user.membershipTier || 'gold'
  );
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);

  const handleSubscribe = (planId: 'silver' | 'gold' | 'platinum') => {
    updateUser({
      membershipTier: planId,
      membershipCredits: planId === 'platinum' ? 4 : planId === 'gold' ? 2 : 1
    });
    setEnrolledSuccess(true);
    setTimeout(() => setEnrolledSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      {/* Hero Header */}
      <div style={{
        textAlign: 'center',
        maxWidth: '720px',
        margin: '0 auto 40px auto'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(169, 129, 47, 0.15)',
          border: '1px solid rgba(169, 129, 47, 0.35)',
          padding: '4px 14px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--accent-gold-light)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '12px'
        }}>
          <Crown size={14} /> PamWill Luxe Sovereign Club
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '36px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: '0 0 12px 0',
          lineHeight: 1.2
        }}>
          Elevate Your Regular Sanctuary Rituals
        </h1>

        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Unlock complimentary monthly treatments, priority practitioner allocation, complimentary aromatherapy upgrades, and up to 30% flat discounts on all boutique therapies.
        </p>
      </div>

      {/* Success Banner */}
      {enrolledSuccess && (
        <div style={{
          backgroundColor: 'rgba(76, 175, 80, 0.18)',
          border: '1px solid rgba(76, 175, 80, 0.4)',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'center',
          marginBottom: '32px',
          color: 'var(--status-success)',
          fontWeight: 700,
          fontSize: '14px'
        }}>
          ✨ Congratulations! You are now an active PamWill Luxe Sovereign Member. Free treatment credits have been deposited to your account.
        </div>
      )}

      {/* Current Tier Banner if enrolled */}
      {user.membershipTier && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          border: '1px solid rgba(169, 129, 47, 0.4)',
          padding: '20px 24px',
          marginBottom: '36px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(169, 129, 47, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Crown size={24} color="var(--accent-gold)" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Your Active Tier
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-gold)' }}>
                {user.membershipTier.toUpperCase()} SANCTUARY MEMBER
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Included Free Sessions</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {user.membershipCredits || 0} Credits Available
              </div>
            </div>

            <button
              onClick={() => setClientSubRoute('booking')}
              className="btn-gold"
              style={{ padding: '10px 20px', fontSize: '13px' }}
            >
              Book with Credits
            </button>
          </div>
        </div>
      )}

      {/* 3 Tier Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '28px'
      }}>
        {MEMBERSHIP_PLANS.map(plan => {
          const isCurrent = user.membershipTier === plan.id;
          const isPopular = plan.id === 'gold';

          return (
            <div
              key={plan.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '24px',
                border: isCurrent 
                  ? '2px solid var(--accent-gold)' 
                  : isPopular 
                  ? '1px solid rgba(169, 129, 47, 0.5)' 
                  : '1px solid var(--border-hairline)',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: isPopular ? '0 12px 36px rgba(0,0,0,0.45)' : 'var(--shadow-card)',
                transform: isPopular ? 'scale(1.02)' : 'none',
                transition: 'transform 200ms ease'
              }}
            >
              {/* Popular Ribbon */}
              {isPopular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '4px 16px',
                  borderRadius: 'var(--radius-pill)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}>
                  Most Recommended
                </div>
              )}

              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                {plan.badge}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: '0 0 16px 0'
              }}>
                {plan.name}
              </h3>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ₹{plan.monthlyPrice}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ month</span>
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Zap size={18} color="var(--accent-gold)" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {plan.sessionsIncluded} Free Sanctuary Session{plan.sessionsIncluded > 1 ? 's' : ''} / month
                </span>
              </div>

              {/* Features List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', flex: 1 }}>
                {plan.features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    <Check size={16} color="var(--status-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: isCurrent ? 'var(--bg-secondary)' : isPopular ? 'var(--accent-gold)' : 'var(--bg-surface)',
                  color: isCurrent ? 'var(--text-secondary)' : isPopular ? '#FFFFFF' : 'var(--accent-gold)',
                  border: isPopular ? 'none' : '1px solid var(--accent-gold)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: isCurrent ? 'default' : 'pointer',
                  boxShadow: isPopular ? '0 8px 20px rgba(169, 129, 47, 0.4)' : 'none'
                }}
              >
                {isCurrent ? 'Current Plan Active' : `Join ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
