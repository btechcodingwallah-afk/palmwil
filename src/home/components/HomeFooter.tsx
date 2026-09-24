import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Smartphone, 
  Briefcase, 
  Lock,
  MessageCircle,
  GraduationCap
} from 'lucide-react';
import { COMPANY_INFO, CONNECT_WITH_US_FORM_URL, SOCIAL_LINKS } from '../../config/env';
import { usePamwill } from '../../state/store';

interface HomeFooterProps {
  onNavigateRole: (role: 'client' | 'therapist' | 'admin') => void;
}

export const HomeFooter: React.FC<HomeFooterProps> = ({ onNavigateRole }) => {
  const { setTrainingModalOpen, setConnectModalOpen } = usePamwill();
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact" style={{
      backgroundColor: '#0D0B0A',
      borderTop: '1px solid #29221A',
      color: '#BDB3A6',
      padding: '80px 24px 40px'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Main Footer Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '60px'
        }}>
          
          {/* Column 1: Brand & Bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src="/assets/pamwill-icon.png"
                alt="PamWill"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid rgba(169, 129, 47, 0.4)'
                }}
              />
              <div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: '#FAF8F5' }}>
                  PamWill
                </span>
                <div style={{ fontSize: '11px', color: 'var(--accent-gold-light)', letterSpacing: '0.04em' }}>
                  LUXURY WELLNESS MARKETPLACE
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#9E9284', margin: 0 }}>
              {COMPANY_INFO.tagline}. Delivering certified, accredited therapists and five-star mobile spa setups directly to residences, suites, and private villas.
            </p>

            {/* Social Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              {SOCIAL_LINKS.instagram && (
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={socialIconStyle}
                  aria-label="Instagram"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              )}
              {SOCIAL_LINKS.linkedin && (
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={socialIconStyle}
                  aria-label="LinkedIn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect width="4" height="12" x="2" y="9"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              )}
              {SOCIAL_LINKS.twitter && (
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={socialIconStyle}
                  aria-label="Twitter"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                </a>
              )}
              {COMPANY_INFO.whatsapp && (
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={socialIconStyle}
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={16} />
                </a>
              )}
            </div>

            {/* CIN number if present */}
            {COMPANY_INFO.cin && (
              <div style={{ fontSize: '11px', color: '#6B6259', marginTop: '4px' }}>
                CIN: {COMPANY_INFO.cin}
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={columnTitleStyle}>Quick Navigation</h4>
            <ul style={footerListStyle}>
              <li>
                <button onClick={() => scrollToSection('patients')} style={footerLinkBtnStyle}>
                  For Patients & Clients
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('therapists')} style={footerLinkBtnStyle}>
                  For Therapists & Practitioners
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('treatments')} style={footerLinkBtnStyle}>
                  Signature Therapy Menu
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('safety')} style={footerLinkBtnStyle}>
                  The Gold Safety Standard
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('downloads')} style={footerLinkBtnStyle}>
                  App Download Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTrainingModalOpen(true)}
                  style={{
                    ...footerLinkBtnStyle,
                    color: 'var(--accent-gold-light)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600
                  }}
                >
                  <GraduationCap size={14} color="var(--accent-gold)" /> Apply for Training & Internship
                </button>
              </li>
              <li>
                <button
                  onClick={() => setConnectModalOpen(true)}
                  style={{ ...footerLinkBtnStyle, color: 'var(--accent-gold-light)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles size={13} color="var(--accent-gold)" /> Connect With Us (Inquiries)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Live Interactive Simulators */}
          <div>
            <h4 style={columnTitleStyle}>Interactive Web Demos</h4>
            <p style={{ fontSize: '12px', color: '#887B6D', marginBottom: '12px' }}>
              Explore the full PamWill ecosystem right in your web browser:
            </p>
            <ul style={footerListStyle}>
              <li>
                <button
                  onClick={() => onNavigateRole('client')}
                  style={{ ...footerLinkBtnStyle, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Smartphone size={13} color="var(--accent-gold)" /> Client Web Application
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateRole('therapist')}
                  style={{ ...footerLinkBtnStyle, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Briefcase size={13} color="var(--status-success)" /> Therapist Partner Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Registered Company & Contact Details (from .env) */}
          <div>
            <h4 style={columnTitleStyle}>Company & Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              
              {/* Address */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={16} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#D4C9BC', lineHeight: 1.5 }}>
                  {COMPANY_INFO.address}
                </span>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={16} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                <a href={`tel:${COMPANY_INFO.phone}`} style={{ color: '#D4C9BC', textDecoration: 'none' }}>
                  {COMPANY_INFO.phone}
                </a>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={16} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                <a href={`mailto:${COMPANY_INFO.email}`} style={{ color: '#D4C9BC', textDecoration: 'none' }}>
                  {COMPANY_INFO.email}
                </a>
              </div>

              {/* Operating Hours */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Clock size={16} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#A3988B', lineHeight: 1.4 }}>
                  {COMPANY_INFO.operatingHours}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Legal & Safety Strip */}
        <div style={{
          borderTop: '1px solid #1F1A15',
          paddingTop: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '12px',
          color: '#7E7366'
        }}>
          <div>
            © {currentYear} {COMPANY_INFO.name}. All rights reserved.
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms & Conditions</span>
            <span>•</span>
            <span>Therapist Code of Conduct</span>
            <span>•</span>
            <span>Safety Protocols</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

const columnTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-serif)',
  fontSize: '17px',
  fontWeight: 600,
  color: '#FAF8F5',
  margin: '0 0 18px',
  letterSpacing: '-0.01em'
};

const footerListStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const footerLinkBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#A3988B',
  fontSize: '13px',
  textAlign: 'left',
  cursor: 'pointer',
  padding: 0,
  transition: 'color 150ms ease'
};

const socialIconStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: '#1E1A16',
  border: '1px solid #332B22',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#BAAE9E',
  textDecoration: 'none',
  transition: 'all 150ms ease'
};
