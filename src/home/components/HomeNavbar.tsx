import React, { useState } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  ExternalLink, 
  Smartphone, 
  Briefcase, 
  ShieldCheck, 
  ChevronDown, 
  Download 
} from 'lucide-react';
import { COMPANY_INFO, CONNECT_WITH_US_FORM_URL } from '../../config/env';
import { usePamwill } from '../../state/store';

interface HomeNavbarProps {
  onNavigateRole: (role: 'client' | 'therapist' | 'admin') => void;
}

export const HomeNavbar: React.FC<HomeNavbarProps> = ({ onNavigateRole }) => {
  const { setConnectModalOpen, setClientHomeMode } = usePamwill();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(20, 18, 15, 0.88)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(169, 129, 47, 0.18)',
      transition: 'all 200ms ease'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo & Tag */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        >
          <img
            src="/assets/pamwill-icon.png"
            alt="PamWill Emblem"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              boxShadow: '0 0 20px rgba(169, 129, 47, 0.35)',
              border: '1px solid rgba(169, 129, 47, 0.4)'
            }}
          />
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#FAF8F5',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              PamWill
              <span style={{
                fontSize: '10px',
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                color: 'var(--accent-gold-light)',
                backgroundColor: 'rgba(169, 129, 47, 0.2)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                Luxe
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#9E9284', letterSpacing: '0.02em' }}>
              On-Demand Spa & Wellness Sanctuary
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '24px'
        }} className="desktop-nav">
          <button
            onClick={() => {
              setClientHomeMode('spa');
              onNavigateRole('client');
            }}
            style={{
              ...navLinkStyle,
              color: 'var(--accent-gold-light)',
              fontWeight: 700
            }}
          >
            Spa & Massage
          </button>
          <button
            onClick={() => {
              setClientHomeMode('physio');
              onNavigateRole('client');
            }}
            style={{
              ...navLinkStyle,
              color: '#2DD4BF',
              fontWeight: 700
            }}
          >
            Physiotherapy (Dr.)
          </button>
          <button
            onClick={() => onNavigateRole('therapist')}
            style={{
              ...navLinkStyle,
              color: '#6EE7B7',
              fontWeight: 700
            }}
          >
            Therapist Portal
          </button>
          <button
            onClick={() => scrollToSection('treatments')}
            style={navLinkStyle}
          >
            Treatments
          </button>
          <button
            onClick={() => scrollToSection('safety')}
            style={navLinkStyle}
          >
            Safety
          </button>
          <button
            onClick={() => scrollToSection('downloads')}
            style={navLinkStyle}
          >
            Downloads
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            style={navLinkStyle}
          >
            Company
          </button>
        </nav>

        {/* Action Buttons: Portals & Connect */}
        <div style={{ display: 'none', alignItems: 'center', gap: '10px' }} className="desktop-actions">
          
          {/* Patient Portal CTA */}
          <button
            onClick={() => onNavigateRole('client')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(169, 129, 47, 0.45)',
              backgroundColor: 'rgba(25, 22, 19, 0.95)',
              color: 'var(--accent-gold-light)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
          >
            <Smartphone size={14} color="var(--accent-gold)" /> Patient App & Store
          </button>

          {/* Therapist Partner Portal CTA */}
          <button
            onClick={() => onNavigateRole('therapist')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(110, 231, 183, 0.35)',
              backgroundColor: 'rgba(20, 28, 22, 0.85)',
              color: '#6EE7B7',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
          >
            <Briefcase size={14} color="#6EE7B7" /> Therapist Partner Portal
          </button>

          {/* Connect With Us Button -> Opens In-Built Concierge Form */}
          <button
            onClick={() => setConnectModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--accent-gold)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(169, 129, 47, 0.35)',
              transition: 'all 200ms ease'
            }}
            title="Connect With Us / Concierge Inquiries"
          >
            <Sparkles size={13} /> Connect With Us
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: '#FAF8F5',
            padding: '8px',
            cursor: 'pointer'
          }}
          className="mobile-toggle"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#171411',
          borderTop: '1px solid #2C2620',
          padding: '20px 24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <button onClick={() => scrollToSection('patients')} style={mobileNavLinkStyle}>For Patients</button>
          <button onClick={() => scrollToSection('therapists')} style={mobileNavLinkStyle}>For Therapists</button>
          <button onClick={() => scrollToSection('treatments')} style={mobileNavLinkStyle}>Signature Treatments</button>
          <button onClick={() => scrollToSection('safety')} style={mobileNavLinkStyle}>Gold Safety Standards</button>
          <button onClick={() => scrollToSection('downloads')} style={mobileNavLinkStyle}>Download Apps</button>
          <button onClick={() => scrollToSection('contact')} style={mobileNavLinkStyle}>Company Information</button>

          <hr style={{ borderColor: '#2E2720', margin: '4px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateRole('client');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#26211C',
                border: '1px solid #3E362E',
                color: '#FAF8F5',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Smartphone size={16} color="var(--accent-gold)" /> Open Patient Web Portal & Store
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateRole('therapist');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(20, 28, 22, 0.85)',
                border: '1px solid rgba(110, 231, 183, 0.35)',
                color: '#6EE7B7',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Briefcase size={16} color="#6EE7B7" /> Open Therapist Partner Portal
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setConnectModalOpen(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '13px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--accent-gold)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                marginTop: '4px'
              }}
            >
              <Sparkles size={15} /> Connect With Us
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

const navLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#C7BEB1',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  padding: '6px 0',
  transition: 'color 150ms ease',
};

const mobileNavLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#FAF8F5',
  fontSize: '16px',
  fontWeight: 500,
  textAlign: 'left',
  cursor: 'pointer',
  padding: '8px 0',
};

const dropdownItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 12px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'transparent',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 150ms ease',
  width: '100%'
};
