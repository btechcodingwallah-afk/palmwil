import React, { useState } from 'react';
import { 
  Trophy, Sparkles, CheckCircle2, Lock, ArrowRight, ArrowLeft, 
  Coins, Zap, RefreshCw, AlertCircle, Award 
} from 'lucide-react';
import { usePamwill } from '../../state/store';

export const DailyGoalGameView: React.FC = () => {
  const { currentTherapist, dailyGoalCount, setTherapistSubRoute } = usePamwill();
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [claimedJackpot, setClaimedJackpot] = useState(false);

  const TARGET_GOAL = 10;
  const BONUS_PER_PATIENT = 100;
  const currentProgress = dailyGoalCount;
  const progressPercent = Math.min(100, Math.round((currentProgress / TARGET_GOAL) * 100));
  const currentBonus = currentProgress * BONUS_PER_PATIENT;
  const canClaim = currentProgress >= TARGET_GOAL && !claimedJackpot;

  const milestones = [
    { step: 1, label: 'First Patient of Day', bonus: '₹100 Bonus', coins: 20 },
    { step: 2, label: 'Morning Rhythm', bonus: '₹200 Bonus', coins: 40 },
    { step: 3, label: '3-Patient Milestone', bonus: '₹300 + Bronze Ribbon', coins: 75, special: true },
    { step: 4, label: 'Mid-Day Momentum', bonus: '₹400 Bonus', coins: 100 },
    { step: 5, label: 'Halfway Hero (5 Patients)', bonus: '₹500 + Silver Badge', coins: 150, special: true },
    { step: 6, label: 'Afternoon Flow', bonus: '₹600 Bonus', coins: 180 },
    { step: 7, label: 'Evening Surge', bonus: '₹700 Bonus', coins: 220 },
    { step: 8, label: 'Master Healer (8 Patients)', bonus: '₹800 + Gold Star', coins: 300, special: true },
    { step: 9, label: 'Penultimate Session', bonus: '₹900 Bonus', coins: 350 },
    { step: 10, label: 'GRAND 10-PATIENT JACKPOT', bonus: '₹1,000 Cash + Sovereign Crown', coins: 500, special: true, jackpot: true }
  ];

  const handleClaimJackpot = () => {
    setCelebrationOpen(true);
    setClaimedJackpot(true);
  };

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      {/* Back button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setTherapistSubRoute('dashboard')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: 'var(--accent-gold)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0
          }}
        >
          <ArrowLeft size={16} /> Back to Sanctuary Dashboard
        </button>
      </div>

      {/* Hero Quest Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1A1612 0%, #2A2218 50%, #15120E 100%)',
        borderRadius: '24px',
        padding: '36px',
        border: '1px solid rgba(169, 129, 47, 0.45)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        marginBottom: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        <div style={{ maxWidth: '620px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(169, 129, 47, 0.2)',
            border: '1px solid rgba(169, 129, 47, 0.4)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '11px',
            fontWeight: 800,
            color: 'var(--accent-gold-light)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '12px'
          }}>
            <Trophy size={14} /> Practitioner Gamified Daily Challenge
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '32px',
            fontWeight: 700,
            color: '#FAF8F5',
            margin: '0 0 10px 0',
            lineHeight: 1.2
          }}>
            Daily 10-Patient Quest & ₹1,000 Jackpot
          </h1>

          <p style={{ fontSize: '14px', color: '#B5ABA0', lineHeight: 1.6, margin: 0 }}>
            Deliver healing care to 10 patrons today. Earn ₹100 extra payout bonus for every completed sitting, culminating in a ₹1,000 cash bonus + 500 PamCoins jackpot!
          </p>
        </div>

        {/* Progress Circular/Badge Summary */}
        <div style={{
          backgroundColor: '#1E1914',
          border: '1px solid rgba(169, 129, 47, 0.35)',
          borderRadius: '20px',
          padding: '20px 28px',
          textAlign: 'center',
          minWidth: '200px'
        }}>
          <div style={{ fontSize: '12px', color: '#9E9284', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Today's Progress
          </div>
          <div style={{ fontSize: '42px', fontWeight: 900, color: 'var(--accent-gold)', margin: '4px 0' }}>
            {currentProgress}<span style={{ fontSize: '24px', color: '#8F8274' }}>/{TARGET_GOAL}</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#FAF8F5' }}>
            ₹{currentBonus} Bonus Earned
          </div>
        </div>
      </div>

      {/* Progress Bar & Actions */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '24px',
        border: '1px solid var(--border-hairline)',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Daily Quest Completion: {progressPercent}%
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {TARGET_GOAL - currentProgress > 0 ? `${TARGET_GOAL - currentProgress} more to unlock ₹1,000 Grand Jackpot` : 'Quest Completed!'}
          </div>
        </div>

        {/* Track Bar */}
        <div style={{
          height: '14px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-pill)',
          overflow: 'hidden',
          marginBottom: '20px',
          border: '1px solid var(--border-hairline)'
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, var(--accent-gold) 0%, #E5A93C 100%)',
            borderRadius: 'var(--radius-pill)',
            transition: 'width 300ms ease'
          }} />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'flex-end' }}>

          <button
            onClick={handleClaimJackpot}
            disabled={!canClaim}
            style={{
              padding: '12px 28px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: canClaim ? 'var(--accent-gold)' : claimedJackpot ? 'var(--status-success)' : '#2C2620',
              color: canClaim || claimedJackpot ? '#FFFFFF' : '#8F8274',
              border: 'none',
              fontSize: '14px',
              fontWeight: 800,
              cursor: canClaim ? 'pointer' : 'default',
              boxShadow: canClaim ? '0 8px 24px rgba(169, 129, 47, 0.45)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Trophy size={16} />
            {claimedJackpot ? '✓ ₹1,000 Jackpot Claimed' : canClaim ? 'Claim ₹1,000 Cash Jackpot Now!' : 'Reach 10 Patients to Claim Jackpot'}
          </button>
        </div>
      </div>

      {/* 10-Step Interactive Ladder */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
        10-Step Milestone Roadmap
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {milestones.map(m => {
          const isDone = currentProgress >= m.step;
          const isNext = currentProgress === m.step - 1;

          return (
            <div
              key={m.step}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                border: m.jackpot 
                  ? '2px solid var(--accent-gold)' 
                  : isDone 
                  ? '1px solid rgba(76, 175, 80, 0.35)' 
                  : isNext 
                  ? '1px solid rgba(169, 129, 47, 0.3)' 
                  : '1px solid var(--border-hairline)',
                padding: '16px 20px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                opacity: !isDone && !isNext ? 0.6 : 1,
                boxShadow: m.jackpot ? '0 8px 24px rgba(169, 129, 47, 0.25)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isDone ? 'var(--status-success)' : isNext ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isDone ? <CheckCircle2 size={20} /> : m.step}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Patient #{m.step}: {m.label}
                    </span>
                    {m.special && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        backgroundColor: m.jackpot ? 'var(--accent-gold)' : 'rgba(169, 129, 47, 0.2)',
                        color: m.jackpot ? '#fff' : 'var(--accent-gold-light)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        textTransform: 'uppercase'
                      }}>
                        {m.jackpot ? 'JACKPOT' : 'Milestone'}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Reward: <strong style={{ color: 'var(--accent-gold)' }}>{m.bonus}</strong> • +{m.coins} PamCoins
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isDone ? (
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={15} /> Completed
                  </span>
                ) : isNext ? (
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={14} /> Current Target
                  </span>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Lock size={14} /> Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Celebration Modal */}
      {celebrationOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 13, 11, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '20px'
        }}
        onClick={() => setCelebrationOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#1E1914',
              borderRadius: '28px',
              border: '2px solid var(--accent-gold)',
              padding: '40px 32px',
              maxWidth: '480px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 24px 60px rgba(169, 129, 47, 0.4)'
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(169, 129, 47, 0.2)',
              border: '2px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <Trophy size={42} color="var(--accent-gold)" />
            </div>

            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '28px',
              fontWeight: 800,
              color: '#FAF8F5',
              margin: '0 0 10px 0'
            }}>
              VICTORY! ₹1,000 JACKPOT UNLOCKED
            </h2>

            <p style={{ fontSize: '14px', color: '#B5ABA0', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              Masterful dedication, {currentTherapist?.fullName || 'Practitioner'}! You successfully attended 10 sanctuary patrons today. Your <strong>₹1,000 cash bonus + 500 PamCoins</strong> have been credited to your withdrawal wallet.
            </p>

            <button
              onClick={() => {
                setCelebrationOpen(false);
                setTherapistSubRoute('earnings');
              }}
              className="btn-gold"
              style={{ width: '100%', padding: '14px', fontSize: '15px' }}
            >
              View Payout Balance in Earnings &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
