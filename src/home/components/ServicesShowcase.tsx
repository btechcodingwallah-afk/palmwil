import React, { useState } from 'react';
import { MASSAGE_SERVICES } from '../../data/services';
import { Sparkles, Clock, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { MassageService } from '../../types';

interface ServicesShowcaseProps {
  onNavigateRole: (role: 'client' | 'therapist' | 'admin') => void;
}

export const ServicesShowcase: React.FC<ServicesShowcaseProps> = ({ onNavigateRole }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter categories
  const categories = ['All', 'Relaxation & Wellness', 'Therapeutic', 'Luxury & Spa'];
  
  const filteredServices = selectedCategory === 'All'
    ? MASSAGE_SERVICES.slice(0, 6)
    : MASSAGE_SERVICES.filter(s => s.category === selectedCategory).slice(0, 6);

  return (
    <section id="treatments" style={{
      padding: '90px 24px',
      backgroundColor: '#100E0C',
      color: '#FAF8F5'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
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
            <Sparkles size={13} color="var(--accent-gold)" /> Curated Therapy Menu
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 600,
            margin: '0 0 16px',
            color: '#FAF8F5'
          }}>
            Signature Spa Rituals & Clinical Therapies
          </h2>
          <p style={{ fontSize: '15px', color: '#BDB3A6', margin: 0 }}>
            Every session is performed using heated volcanic stones, hypoallergenic organic cold-pressed botanicals, and bespoke pressure techniques.
          </p>

          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '28px'
          }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-pill)',
                  border: selectedCategory === cat ? '1px solid var(--accent-gold)' : '1px solid #332B22',
                  backgroundColor: selectedCategory === cat ? 'rgba(169, 129, 47, 0.2)' : '#191613',
                  color: selectedCategory === cat ? 'var(--accent-gold-light)' : '#A3988B',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '28px'
        }}>
          {filteredServices.map(service => {
            const minDuration = service.durationOptionsMin[0];
            const startingPrice = service.basePricePerDuration[minDuration] || 1699;

            return (
              <div
                key={service.id}
                style={{
                  backgroundColor: '#171411',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid #2D251D',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 200ms ease, border-color 200ms ease',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                }}
              >
                {/* Service Card Image / Header */}
                <div style={{
                  position: 'relative',
                  height: '180px',
                  backgroundColor: '#26211C',
                  overflow: 'hidden'
                }}>
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.85)'
                    }}
                    onError={(e) => {
                      // Fallback gradient if external image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(16, 14, 12, 0.85)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--accent-gold-light)',
                    border: '1px solid rgba(169, 129, 47, 0.3)'
                  }}>
                    {service.category}
                  </div>

                  {service.popularTag && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'var(--accent-gold)',
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '11px',
                      fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                    }}>
                      {service.popularTag}
                    </div>
                  )}

                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50px',
                    background: 'linear-gradient(to top, #171411, transparent)'
                  }} />
                </div>

                {/* Service Card Body */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#FAF8F5',
                      margin: 0
                    }}>
                      {service.name}
                    </h3>
                  </div>

                  <p style={{
                    fontSize: '13px',
                    color: '#BDB3A6',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {service.description}
                  </p>

                  {/* Duration Options */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Clock size={14} color="#9E9284" />
                    <span style={{ fontSize: '12px', color: '#9E9284' }}>Available Durations:</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {service.durationOptionsMin.map(m => (
                        <span
                          key={m}
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: '#241F1A',
                            border: '1px solid #3A3127',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            color: '#D4C9BC'
                          }}
                        >
                          {m}m
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Benefits Preview */}
                  <div style={{ marginBottom: '20px', flex: 1 }}>
                    {service.benefits.slice(0, 2).map((b, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#C5BCB1', marginBottom: '4px' }}>
                        <Check size={13} color="var(--accent-gold)" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer: Price & Booking Action */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid #2B241C'
                  }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#9E9284', textTransform: 'uppercase' }}>Starts at</span>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
                        ₹{startingPrice.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateRole('client')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 16px',
                        backgroundColor: '#26201A',
                        border: '1px solid #423629',
                        borderRadius: 'var(--radius-pill)',
                        color: '#FAF8F5',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                    >
                      Book in App <ArrowRight size={13} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
