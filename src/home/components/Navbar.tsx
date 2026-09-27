import React, { useState } from 'react';
import { WebsitePage } from '../types';
import { usePamwill } from '../../state/store';
import { Menu, X, Sparkles, Smartphone, ChevronRight, Sun, Moon, MessageSquare } from 'lucide-react';

interface NavbarProps {
  currentPage: WebsitePage;
  onNavigatePage: (page: WebsitePage) => void;
  onNavigateRole: (role: 'client' | 'therapist' | 'admin') => void;
  onOpenAppDownload?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigatePage,
  onNavigateRole,
  onOpenAppDownload
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { websiteTheme, toggleWebsiteTheme } = usePamwill();

  const navLinks: { label: string; page: WebsitePage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Services', page: 'services' },
    { label: 'Why PamWill', page: 'about' },
    { label: 'How It Works', page: 'how-it-works' },
    { label: 'Contact & Inquiries', page: 'contact' }
  ];

  const handleLinkClick = (page: WebsitePage) => {
    setMobileMenuOpen(false);
    onNavigatePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAppAction = () => {
    setMobileMenuOpen(false);
    if (onOpenAppDownload) {
      onOpenAppDownload();
    } else {
      onNavigateRole('client');
    }
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--nav-border)',
        transition: 'background-color 200ms ease, border-color 200ms ease'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 20px',
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          {/* Brand Logo & Tag */}
          <div
            onClick={() => handleLinkClick('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <img
              src="/assets/pamwill-icon.png"
              alt="PamWill"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1.5px solid var(--border-gold)',
                boxShadow: '0 0 16px rgba(198, 165, 103, 0.25)'
              }}
            />
            <div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '22px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                lineHeight: 1.1
              }}>
                PamWill
                <span style={{
                  fontSize: '9px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  color: 'var(--pill-text)',
                  backgroundColor: 'var(--pill-bg)',
                  border: '1px solid var(--pill-border)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>
                  Luxe
                </span>
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                letterSpacing: '0.02em',
                fontWeight: 400
              }}>
                On-Demand Spa & Clinical Recovery
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '32px'
            }}
            className="pamwill-desktop-nav"
          >
            {navLinks.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleLinkClick(item.page)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 4px',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--cta)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'color 160ms ease',
                    letterSpacing: '0.01em'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--text)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  {item.label}
                  {isActive && (
                    <span style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: 'var(--cta)',
                      borderRadius: '2px',
                      boxShadow: '0 0 10px rgba(198, 165, 103, 0.6)'
                    }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Action Buttons */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '12px'
            }}
            className="pamwill-desktop-actions"
          >
            {/* Quick Theme Toggle (Sun / Moon) */}
            <button
              onClick={toggleWebsiteTheme}
              aria-label="Toggle visual theme"
              title={websiteTheme === 'light' ? 'Switch to Nocturne Dark' : 'Switch to Minimalist Light'}
              style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--border-hairline)',
                borderRadius: '50%',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text)',
                cursor: 'pointer',
                transition: 'all 160ms ease',
                boxShadow: 'var(--card-shadow)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--cta)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hairline)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {websiteTheme === 'light' ? (
                <Moon size={18} color="var(--cta)" />
              ) : (
                <Sun size={18} color="var(--cta)" />
              )}
            </button>

            {/* Primary Action: Get The App (Since massages are booked on App) */}
            <button
              onClick={handleAppAction}
              style={{
                backgroundColor: 'var(--cta)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '10px 22px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(198, 165, 103, 0.3)',
                transition: 'all 160ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--cta-hover)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--cta)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              title="Book On-Demand Massages Exclusively via PamWill Mobile App"
            >
              <Smartphone size={15} /> Get The App
            </button>
          </div>

          {/* Mobile Hamburger & Quick Theme Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleWebsiteTheme}
              aria-label="Toggle visual theme"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-hairline)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--cta)',
                cursor: 'pointer'
              }}
              className="pamwill-mobile-toggle"
            >
              {websiteTheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-hairline)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text)',
                cursor: 'pointer',
                transition: 'background-color 150ms ease'
              }}
              className="pamwill-mobile-toggle"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '76px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--nav-bg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          zIndex: 999,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto',
          borderTop: '1px solid var(--nav-border)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--cta)',
              padding: '0 12px 12px',
              borderBottom: '1px solid var(--border-hairline)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Sanctuary Navigation</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                Theme: {websiteTheme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </div>

            {navLinks.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleLinkClick(item.page)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '48px',
                    padding: '12px 16px',
                    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                    border: isActive ? '1px solid var(--border-gold)' : '1px solid transparent',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? 'var(--cta)' : 'var(--text)',
                    fontSize: '16px',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={18} color={isActive ? 'var(--cta)' : 'var(--text-muted)'} />
                </button>
              );
            })}
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-hairline)'
          }}>
            {/* Get App To Book */}
            <button
              onClick={handleAppAction}
              style={{
                width: '100%',
                minHeight: '48px',
                backgroundColor: 'var(--cta)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(198, 165, 103, 0.35)'
              }}
            >
              <Smartphone size={17} /> Get The App to Book
            </button>

            {/* Inquire with Concierge */}
            <button
              onClick={() => handleLinkClick('contact')}
              style={{
                width: '100%',
                minHeight: '44px',
                backgroundColor: 'var(--surface-card)',
                color: 'var(--text)',
                border: '1px solid var(--border-hairline)',
                borderRadius: 'var(--radius-pill)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <MessageSquare size={14} color="var(--cta)" /> Contact Concierge with Questions
            </button>

            {/* Launch Simulator */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateRole('client');
              }}
              style={{
                width: '100%',
                minHeight: '40px',
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
                border: 'none',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={12} color="var(--cta)" /> Launch Client Booking App Simulator
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
