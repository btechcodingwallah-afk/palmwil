import React, { useState } from 'react';
import { Sparkles, HelpCircle, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { MassageService } from '../../types';

interface ServiceQuizProps {
  services: MassageService[];
  onSelectService: (service: MassageService) => void;
}

export const ServiceQuiz: React.FC<ServiceQuizProps> = ({ services, onSelectService }) => {
  const [goal, setGoal] = useState<string | null>(null);
  const [pressure, setPressure] = useState<string | null>(null);

  const goals = [
    { id: 'stress', label: 'Melt Away Stress & Anxiety', desc: 'Gentle nervous system calming' },
    { id: 'tension', label: 'Release Deep Muscle Knots', desc: 'Desk posture & chronic stiffness' },
    { id: 'mobility', label: 'Stretch & Boost Flexibility', desc: 'Full-body yoga assisted stretches' },
    { id: 'luxurious', label: 'Ultimate Pampering & Heat', desc: 'Heated stones and herbal steam' }
  ];

  const pressures = [
    { id: 'gentle', label: 'Light & Soothing', desc: 'Rhythmic, gentle gliding' },
    { id: 'medium', label: 'Medium Firm', desc: 'Balanced pressure with thumb kneading' },
    { id: 'firm', label: 'Intense Deep Pressure', desc: 'Targeted trigger point and elbow release' }
  ];

  // Logic to find recommended service
  const getRecommendation = (): MassageService => {
    if (goal === 'tension' || pressure === 'firm') {
      const match = services.find(s => s.name.toLowerCase().includes('deep tissue'));
      if (match) return match;
    }
    if (goal === 'mobility') {
      const match = services.find(s => s.name.toLowerCase().includes('thai') || s.name.toLowerCase().includes('balinese'));
      if (match) return match;
    }
    if (goal === 'luxurious') {
      const match = services.find(s => s.name.toLowerCase().includes('stone') || s.name.toLowerCase().includes('kizhi') || s.name.toLowerCase().includes('four hands'));
      if (match) return match;
    }
    // Default recommendation: Swedish
    return services.find(s => s.name.toLowerCase().includes('swedish')) || services[0];
  };

  const recommendedService = (goal && pressure) ? getRecommendation() : null;

  return (
    <div style={{
      backgroundColor: '#161310',
      border: '1px solid rgba(169, 129, 47, 0.3)',
      borderRadius: '20px',
      padding: '36px 28px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative ambient glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '260px',
        height: '260px',
        background: 'radial-gradient(circle, rgba(169, 129, 47, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(169, 129, 47, 0.18)',
            border: '1px solid rgba(169, 129, 47, 0.35)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--accent-gold-light)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '10px'
          }}>
            <HelpCircle size={14} color="var(--accent-gold)" /> 60-Second Consultation Quiz
          </div>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '26px',
            fontWeight: 600,
            color: '#FAF8F5',
            margin: '0 0 8px'
          }}>
            Can’t Decide Which Ritual Suits You?
          </h3>
          <p style={{ fontSize: '14px', color: '#BDB3A6', margin: 0 }}>
            Select your physical recovery goal and preferred pressure to reveal your matched therapy.
          </p>
        </div>

        {/* Question 1: Goal */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '12px' }}>
            Step 1: What does your body need most today?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {goals.map(g => {
              const selected = goal === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  style={{
                    backgroundColor: selected ? 'rgba(169, 129, 47, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: selected ? '1.5px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '14px 12px',
                    color: selected ? '#FAF8F5' : '#C4B9AD',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 150ms ease'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    {g.label}
                  </div>
                  <div style={{ fontSize: '11px', color: '#8E8478' }}>
                    {g.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 2: Pressure */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-gold-light)', marginBottom: '12px' }}>
            Step 2: What is your preferred pressure intensity?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {pressures.map(p => {
              const selected = pressure === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPressure(p.id)}
                  style={{
                    backgroundColor: selected ? 'rgba(169, 129, 47, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: selected ? '1.5px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '14px 12px',
                    color: selected ? '#FAF8F5' : '#C4B9AD',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 150ms ease'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: '11px', color: '#8E8478' }}>
                    {p.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recommendation Output */}
        {recommendedService && (
          <div style={{
            backgroundColor: 'rgba(169, 129, 47, 0.12)',
            border: '1.5px solid rgba(169, 129, 47, 0.45)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <img
                src={recommendedService.imageUrl}
                alt={recommendedService.name}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  border: '1.5px solid rgba(169, 129, 47, 0.5)'
                }}
              />
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)' }}>
                  Your Perfect Match
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: '#FAF8F5' }}>
                  {recommendedService.name}
                </div>
                <div style={{ fontSize: '12.5px', color: '#BDB3A6' }}>
                  Starting at ₹{(recommendedService.basePricePerDuration[60] || 1699).toLocaleString()} • {recommendedService.category}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => {
                  setGoal(null);
                  setPressure(null);
                }}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '10px 16px',
                  fontSize: '12px',
                  color: '#A89E92',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RotateCcw size={13} /> Reset
              </button>

              <button
                onClick={() => onSelectService(recommendedService)}
                style={{
                  backgroundColor: 'var(--accent-gold)',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: 'var(--radius-pill)',
                  padding: '12px 22px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(169, 129, 47, 0.35)'
                }}
              >
                Book This Match <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
