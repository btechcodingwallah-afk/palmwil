import React, { useState } from 'react';
import { WebsitePage } from '../types';
import { Sparkles, Phone, Mail, Clock, MapPin, ShieldCheck, ChevronDown, GraduationCap } from 'lucide-react';
import { COMPANY_INFO } from '../../config/env';
import { usePamwill } from '../../state/store';

interface FooterProps {
  onNavigatePage: (page: WebsitePage) => void;
  onNavigateRole: (role: 'client' | 'therapist' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigatePage,
  onNavigateRole
}) => {
  const { setTrainingModalOpen } = usePamwill();
  // Mobile accordion state: default collapsed on mobile so footer is compact
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    navigation: false,
    treatments: false,
    concierge: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNav = (page: WebsitePage) => {
    onNavigatePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      backgroundColor: 'var(--footer-bg)',
      color: 'var(--footer-text)',
      borderTop: '1px solid var(--footer-border)',
      padding: '60px 24px 36px',
      position: 'relative',
      transition: 'background-color 200ms ease, border-color 200ms ease, color 200ms ease'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '40px',
        paddingBottom: '40px',
        borderBottom: '1px solid var(--footer-border)'
      }}>
        {/* Brand & Manifesto Column (Always visible) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/assets/pamwill-icon.png"
              alt="PamWill"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--border-gold)'
              }}
            />
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--footer-text)',
              letterSpacing: '-0.02em'
            }}>
              PamWill <span style={{ color: 'var(--cta)', fontSize: '13px', fontWeight: 400 }}>Luxe</span>
            </span>
          </div>

          <p style={{
            fontSize: '13.5px',
            lineHeight: 1.6,
            color: 'var(--footer-muted)',
            margin: 0
          }}>
            Bengaluru’s premier on-demand sanctuary delivering certified massage rituals, heated volcanic stones, and pure cold-pressed botanicals directly to your private doorstep.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--cta)',
            fontWeight: 500
          }}>
            <ShieldCheck size={16} color="var(--cta)" /> 100% Background-Vetted & Certified Therapists
          </div>
        </div>

        {/* Quick Links Column (Collapsible on mobile) */}
        <div>
          <button
            type="button"
            className="footer-accordion-btn"
            onClick={() => toggleSection('navigation')}
            aria-expanded={openSections.navigation}
          >
            <div style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--cta)'
            }}>
              Navigation
            </div>
            <div className="footer-accordion-icon" style={{
              transition: 'transform 0.25s ease',
              transform: openSections.navigation ? 'rotate(180deg)' : 'rotate(0deg)',
              color: 'var(--cta)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <ChevronDown size={18} />
            </div>
          </button>

          <div className={`footer-accordion-content ${openSections.navigation ? 'is-open' : ''}`}>
            <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Home', page: 'home' as WebsitePage },
                { label: 'Signature Services', page: 'services' as WebsitePage },
                { label: 'Why PamWill & Standards', page: 'about' as WebsitePage },
                { label: 'How It Works & FAQs', page: 'how-it-works' as WebsitePage },
                { label: 'Contact & Inquiries', page: 'contact' as WebsitePage }
              ].map(item => (
                <li key={item.page}>
                  <button
                    onClick={() => handleNav(item.page)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: '13.5px',
                      color: 'var(--footer-muted)',
                      cursor: 'pointer',
                      transition: 'color 150ms ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cta)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--footer-muted)')}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setTrainingModalOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '13.5px',
                    color: 'var(--cta)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600,
                    transition: 'opacity 150ms ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <GraduationCap size={14} color="var(--cta)" /> Apply for Training & Internship
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Popular Treatments Column (Collapsible on mobile) */}
        <div>
          <button
            type="button"
            className="footer-accordion-btn"
            onClick={() => toggleSection('treatments')}
            aria-expanded={openSections.treatments}
          >
            <div style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--cta)'
            }}>
              Popular Treatments
            </div>
            <div className="footer-accordion-icon" style={{
              transition: 'transform 0.25s ease',
              transform: openSections.treatments ? 'rotate(180deg)' : 'rotate(0deg)',
              color: 'var(--cta)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <ChevronDown size={18} />
            </div>
          </button>

          <div className={`footer-accordion-content ${openSections.treatments ? 'is-open' : ''}`}>
            <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'Swedish Muscular Relaxation',
                'Deep Tissue Myofascial Therapy',
                'Signature Balinese Ritual',
                'Hot Basalt Stone Healing',
                'Ayurvedic Kizhi Compress',
                'Four Hands Synchronized'
              ].map(name => (
                <li key={name}>
                  <button
                    onClick={() => handleNav('services')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: '13.5px',
                      color: 'var(--footer-muted)',
                      cursor: 'pointer',
                      transition: 'color 150ms ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cta)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--footer-muted)')}
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sanctuary Concierge Column (Collapsible on mobile) */}
        <div>
          <button
            type="button"
            className="footer-accordion-btn"
            onClick={() => toggleSection('concierge')}
            aria-expanded={openSections.concierge}
          >
            <div style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--cta)'
            }}>
              Sanctuary Concierge
            </div>
            <div className="footer-accordion-icon" style={{
              transition: 'transform 0.25s ease',
              transform: openSections.concierge ? 'rotate(180deg)' : 'rotate(0deg)',
              color: 'var(--cta)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <ChevronDown size={18} />
            </div>
          </button>

          <div className={`footer-accordion-content ${openSections.concierge ? 'is-open' : ''}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--footer-muted)' }}>
                <Phone size={15} color="var(--cta)" />
                <span>+91 98765 43210 / WhatsApp</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--footer-muted)' }}>
                <Mail size={15} color="var(--cta)" />
                <span>concierge@pamwill.com</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--footer-muted)' }}>
                <Clock size={15} color="var(--cta)" />
                <span>8:00 AM – 10:00 PM IST (Daily)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--footer-muted)' }}>
                <MapPin size={15} color="var(--cta)" />
                <span>Flagship: Bengaluru, Karnataka</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-footer Bottom Bar */}
      <div style={{
        maxWidth: '1240px',
        margin: '28px auto 0',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        fontSize: '12px',
        color: 'var(--footer-muted)'
      }}>
        <div>
          © {new Date().getFullYear()} {COMPANY_INFO.name}. All Rights Reserved. Luxury Wellness Redefined.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => onNavigateRole('client')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--footer-muted)',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={12} color="var(--cta)" /> Client App Simulator
          </button>
          <button
            onClick={() => onNavigateRole('therapist')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--footer-muted)',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Therapist Portal
          </button>
          <button
            onClick={() => onNavigateRole('admin')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--footer-muted)',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Admin Ops
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
