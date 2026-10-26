import React, { useState } from 'react';
import { 
  Star, Heart, Sparkles, CheckCircle2, ArrowLeft, ThumbsUp, 
  Coins, MessageSquare 
} from 'lucide-react';
import { usePamwill } from '../../state/store';

export const ClientFeedbackView: React.FC = () => {
  const { bookings, addPamCoins, setClientSubRoute } = usePamwill();
  const [rating, setRating] = useState<number>(5);
  const [cleanliness, setCleanliness] = useState<number>(5);
  const [punctuality, setPunctuality] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tipAmount, setTipAmount] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const availableTags = [
    'Exceptional Pressure',
    'Punctual & Polite',
    'Deeply Relaxing',
    'Doctor-Level Knowledge',
    'Aromatic Ambience',
    'Spotless Hygiene'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addPamCoins(50, 'Session Review Reward');
    setTimeout(() => {
      setSubmitted(false);
      setClientSubRoute('bookings');
    }, 2500);
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setClientSubRoute('bookings')}
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
            padding: 0,
            marginBottom: '6px'
          }}
        >
          <ArrowLeft size={15} /> Back to Bookings
        </button>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0
        }}>
          Patron Experience & Feedback
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Your honest impressions ensure PamWill standards stay peerless. Earn 50 PamCoins upon submission.
        </p>
      </div>

      {submitted ? (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1px solid rgba(76, 175, 80, 0.4)',
          padding: '48px 24px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(76, 175, 80, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <CheckCircle2 size={36} color="var(--status-success)" />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            Gratitude from PamWill
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
            Thank you for elevating our community. <strong>+50 PamCoins</strong> have been deposited directly into your Treasury.
          </p>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Redirecting to your booking ledger...
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1px solid var(--border-hairline)',
          padding: '32px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          
          {/* Overall Rating */}
          <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: '1px solid var(--border-hairline)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Overall Sanctuary Experience
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    transition: 'transform 150ms ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Star
                    size={36}
                    fill={star <= rating ? '#E5A93C' : 'transparent'}
                    color={star <= rating ? '#E5A93C' : 'var(--border-hairline)'}
                  />
                </button>
              ))}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-gold)', marginTop: '8px' }}>
              {rating === 5 ? 'Celestial & Flawless' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : 'Could Be Improved'}
            </div>
          </div>

          {/* Detailed Criteria */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Hygiene & Sterilization
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCleanliness(s)}
                    style={{
                      flex: 1,
                      padding: '6px 0',
                      borderRadius: '8px',
                      border: cleanliness === s ? '1px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                      backgroundColor: cleanliness === s ? 'var(--accent-gold)' : 'transparent',
                      color: cleanliness === s ? '#fff' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {s}★
                  </button>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Punctuality & Arrival
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPunctuality(s)}
                    style={{
                      flex: 1,
                      padding: '6px 0',
                      borderRadius: '8px',
                      border: punctuality === s ? '1px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                      backgroundColor: punctuality === s ? 'var(--accent-gold)' : 'transparent',
                      color: punctuality === s ? '#fff' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {s}★
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Compliment Tags */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
              What stood out most?
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {availableTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-pill)',
                      border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                      backgroundColor: isSelected ? 'rgba(169, 129, 47, 0.15)' : 'var(--bg-secondary)',
                      color: isSelected ? 'var(--accent-gold-light)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Therapist Tip Option */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Add a Gratuity / Tip for Practitioner (100% goes to therapist)
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Reward dedicated craftsmanship and therapeutic care.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[50, 100, 200, 500].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTipAmount(tipAmount === amt ? null : amt)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-pill)',
                    border: tipAmount === amt ? '1px solid var(--status-success)' : '1px solid var(--border-hairline)',
                    backgroundColor: tipAmount === amt ? 'rgba(76, 175, 80, 0.15)' : 'var(--bg-secondary)',
                    color: tipAmount === amt ? 'var(--status-success)' : 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Comments Box */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Detailed Review & Notes
            </div>
            <textarea
              rows={3}
              placeholder="Tell other patrons and our clinical director about your experience..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-hairline)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-gold"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
          >
            Submit Feedback & Collect +50 PamCoins
          </button>
        </form>
      )}
    </div>
  );
};
