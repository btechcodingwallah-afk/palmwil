import React, { useState } from 'react';
import { WebsitePage } from '../types';
import { FAQS } from '../data/websiteContent';
import { 
  Sparkles, 
  Smartphone, 
  UserCheck, 
  Home, 
  ShieldCheck, 
  CreditCard, 
  ChevronDown, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigatePage: (page: WebsitePage) => void;
  onOpenAppDownload?: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onNavigatePage,
  onOpenAppDownload
}) => {
  const [activeFaqCategory, setActiveFaqCategory] = useState<'all' | 'booking' | 'service' | 'cancellation' | 'safety'>('all');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const steps = [
    {
      step: '01',
      title: 'Select Ritual on Mobile App',
      desc: 'Open the PamWill Mobile App to browse our signature massage menu. Choose your session duration, custom botanicals, and arrival window (on-demand in 45m or scheduled up to 7 days ahead).',
      icon: <Smartphone size={22} color="var(--cta)" />
    },
    {
      step: '02',
      title: 'Therapist Matched & Verified',
      desc: 'An accredited, 5-star therapist accepts your booking. Track their live GPS transit in real-time with mutual identity authentication.',
      icon: <UserCheck size={22} color="var(--cta)" />
    },
    {
      step: '03',
      title: 'Sanctuary Setup at Your Space',
      desc: 'Your therapist arrives with an ergonomic massage bed, fresh medical-grade linen pack, heated basalt stones, and calming acoustic soundscape.',
      icon: <Home size={22} color="var(--cta)" />
    },
    {
      step: '04',
      title: 'Dual-OTP Protected Session',
      desc: 'Provide your Start OTP to initiate therapy. Melt into deep relaxation as bespoke pressure and organic essential oils release muscle knots.',
      icon: <ShieldCheck size={22} color="var(--cta)" />
    },
    {
      step: '05',
      title: 'Cashless & Gratuity-Free',
      desc: 'Share your End OTP to conclude. All rates are 100% all-inclusive with zero surge pricing, zero mandatory tipping, and effortless digital billing in-app.',
      icon: <CreditCard size={22} color="var(--cta)" />
    }
  ];

  const filteredFaqs = activeFaqCategory === 'all'
    ? FAQS
    : FAQS.filter(f => f.category === activeFaqCategory);

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  const handleAppLaunch = () => {
    if (onOpenAppDownload) {
      onOpenAppDownload();
    } else {
      onNavigatePage('contact');
    }
  };

  return (
    <div style={{
      width: '100%',
      padding: '60px 24px 90px',
      backgroundColor: 'var(--background)',
      color: 'var(--text)',
      transition: 'background-color 200ms ease, color 200ms ease'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Breadcrumb Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => onNavigatePage('home')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
          >
            Home
          </button>
          <span>/</span>
          <span style={{ color: 'var(--cta)' }}>How It Works & FAQs</span>
        </div>

        {/* Page Intro */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 60px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--pill-bg)',
            border: '1px solid var(--pill-border)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--pill-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '12px'
          }}>
            <Sparkles size={13} color="var(--cta)" /> Effortless Sanctuary Delivery
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(30px, 4vw, 44px)',
            fontWeight: 600,
            margin: '0 0 16px',
            color: 'var(--text)',
            letterSpacing: '-0.02em'
          }}>
            How PamWill Transforms Your Space in 5 Simple Steps
          </h1>

          <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>
            From mobile request to complete therapeutic rejuvenation, our end-to-end process is built around privacy, punctuality, and clinical excellence.
          </p>
        </div>

        {/* 1. STEP 1 TO 5 TIMELINE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '80px'
        }}>
          {steps.map((s, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-hairline)',
                borderRadius: '16px',
                padding: '28px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                position: 'relative',
                boxShadow: 'var(--card-shadow)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {s.icon}
                </div>
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--cta)',
                  opacity: 0.5
                }}>
                  {s.step}
                </span>
              </div>

              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text)',
                margin: 0
              }}>
                {s.title}
              </h3>

              <p style={{
                fontSize: '13px',
                lineHeight: 1.55,
                color: 'var(--text-muted)',
                margin: 0
              }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 2. FAQS SECTION */}
        <div style={{ maxWidth: '860px', margin: '0 auto 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--cta)', marginBottom: '6px' }}>
              Frequently Asked Questions
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
              Everything You Need to Know
            </h2>
          </div>

          {/* FAQ Category Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '32px'
          }}>
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'booking', label: 'App Bookings' },
              { id: 'service', label: 'Therapy & Setup' },
              { id: 'cancellation', label: 'Pricing & Policies' },
              { id: 'safety', label: 'Safety & Hygiene' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFaqCategory(cat.id as any)}
                style={{
                  backgroundColor: activeFaqCategory === cat.id ? 'var(--cta)' : 'var(--surface-card)',
                  color: activeFaqCategory === cat.id ? '#FFFFFF' : 'var(--text-muted)',
                  border: activeFaqCategory === cat.id ? '1px solid var(--cta)' : '1px solid var(--border-hairline)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '6px 16px',
                  fontSize: '12px',
                  fontWeight: activeFaqCategory === cat.id ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredFaqs.map((faq, idx) => {
              const isOpen = expandedFaqIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: isOpen ? '1px solid var(--border-gold)' : '1px solid var(--border-hairline)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    transition: 'border-color 160ms ease',
                    boxShadow: 'var(--card-shadow)'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: 'var(--text)',
                      fontSize: '15px',
                      fontWeight: 600
                    }}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      color="var(--cta)"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 200ms ease',
                        flexShrink: 0
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 20px 20px',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      color: 'var(--text-muted)',
                      borderTop: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ paddingTop: '12px' }}>
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. CTA BANNER */}
        <div style={{
          textAlign: 'center',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-gold)',
          borderRadius: '20px',
          padding: '44px 24px',
          boxShadow: 'var(--card-shadow)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text)', margin: '0 0 12px' }}>
            Ready to Begin Your Wellness Ritual?
          </h3>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 24px' }}>
            Book on-demand in seconds via our mobile app, or contact our concierge with any questions.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
            <button
              onClick={handleAppLaunch}
              style={{
                backgroundColor: 'var(--cta)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '14px 32px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(198, 165, 103, 0.35)'
              }}
            >
              <Smartphone size={16} /> Book on PamWill App <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigatePage('contact')}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text)',
                border: '1px solid var(--border-hairline)',
                borderRadius: 'var(--radius-pill)',
                padding: '14px 24px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <MessageSquare size={16} /> Speak with Concierge
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HowItWorksPage;
