import React, { useState } from 'react';
import { X, Sparkles, Download, CheckCircle2, ShieldCheck, Gift, ArrowRight } from 'lucide-react';
import { WebsitePage } from '../types';

interface WellnessGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigatePage: (page: WebsitePage) => void;
}

export const WellnessGuideModal: React.FC<WellnessGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigatePage
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Trigger automatic simulated download of the wellness guide
      const guideContent = `
=====================================================
PAMWILL LUXURY WELLNESS & RESTORATION GUIDE
Exclusive Privilege Edition
=====================================================

Welcome to the PamWill Sanctuary Collective.

YOUR EXCLUSIVE FIRST-BOOKING PRIVILEGE CODE:
[ PAMWILL20 ]
* Enjoy 20% savings on your first in-home therapy session.
* Applicable across all 60, 90 & 120-minute signature rituals.

CORE PRINCIPLES OF RECOVERY:
1. Post-Session Hydration: Consume warm filtered water infused with lemon to assist lymphatic flushing.
2. Heat Maintenance: Avoid cold showers for 2 hours post hot-stone or herbal compress.
3. Ergonomic Reset: Simple spinal decompression intervals every 45 minutes of desk posture.

Book directly online or via WhatsApp Concierge: +91 98765 43210
Official Portal: https://pamwill.com
=====================================================
      `.trim();

      const blob = new Blob([guideContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'PamWill-Luxury-Wellness-Guide-Privilege.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 600);
  };

  const handleBookNow = () => {
    onClose();
    onNavigatePage('contact');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#161310',
        color: '#FAF8F5',
        borderRadius: '20px',
        border: '1px solid rgba(169, 129, 47, 0.4)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(169, 129, 47, 0.15)',
        width: '100%',
        maxWidth: '540px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FAF8F5',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div style={{ padding: '36px 32px' }}>
          {!isSubmitted ? (
            <>
              {/* Header Badge */}
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
                marginBottom: '16px'
              }}>
                <Gift size={14} color="var(--accent-gold)" /> Complimentary Curated Guide
              </div>

              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '26px',
                fontWeight: 600,
                margin: '0 0 10px',
                color: '#FAF8F5',
                letterSpacing: '-0.02em',
                lineHeight: 1.25
              }}>
                The PamWill Luxury Wellness Guide & 20% First-Booking Privilege
              </h3>

              <p style={{
                fontSize: '14px',
                color: '#BDB3A6',
                lineHeight: 1.5,
                margin: '0 0 24px'
              }}>
                Download our 28-page restorative bodywork compendium, curated by our clinical directors. Includes an exclusive <strong>20% discount code</strong> for your inaugural session.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#C4B9AD', marginBottom: '6px' }}>
                    Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Iyer"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      color: '#FAF8F5',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#C4B9AD', marginBottom: '6px' }}>
                    Email Address <span style={{ color: 'var(--accent-gold)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. maya@example.com"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      color: '#FAF8F5',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '11px',
                  color: '#8C8275'
                }}>
                  <ShieldCheck size={14} color="var(--accent-gold)" /> Instant download. Zero spam guarantee.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: 'var(--accent-gold)',
                    color: '#FAF8F5',
                    border: 'none',
                    borderRadius: 'var(--radius-pill)',
                    padding: '14px 24px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 18px rgba(169, 129, 47, 0.35)',
                    marginTop: '6px'
                  }}
                >
                  {isSubmitting ? (
                    'Preparing Your Guide...'
                  ) : (
                    <>
                      <Download size={16} /> Download Guide & Claim 20% Code
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(76, 107, 79, 0.2)',
                border: '1px solid rgba(76, 107, 79, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px'
              }}>
                <CheckCircle2 size={32} color="#7BA77E" />
              </div>

              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '24px',
                fontWeight: 600,
                margin: '0 0 8px',
                color: '#FAF8F5'
              }}>
                Guide Download Initiated!
              </h3>

              <p style={{ fontSize: '14px', color: '#BDB3A6', margin: '0 0 20px', lineHeight: 1.5 }}>
                Your guide has started downloading. Use your personal privilege voucher code during booking:
              </p>

              {/* Promo Voucher Box */}
              <div style={{
                backgroundColor: 'rgba(169, 129, 47, 0.12)',
                border: '1.5px dashed rgba(169, 129, 47, 0.5)',
                borderRadius: '12px',
                padding: '16px',
                margin: '0 0 24px'
              }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#BDB3A6', marginBottom: '4px' }}>
                  20% Off Inaugural Booking Voucher
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: 'var(--accent-gold-light)',
                  fontFamily: 'monospace'
                }}>
                  PAMWILL20
                </div>
              </div>

              <button
                onClick={handleBookNow}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: 'var(--radius-pill)',
                  padding: '14px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(169, 129, 47, 0.35)'
                }}
              >
                Apply Voucher & Book Now <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
