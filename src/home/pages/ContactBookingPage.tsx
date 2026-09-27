import React, { useState } from 'react';
import { WebsitePage } from '../types';
import { MASSAGE_SERVICES } from '../../data/services';
import { SERVICE_AREAS } from '../data/websiteContent';
import { usePamwill } from '../../state/store';
import { InquiryType } from '../../types';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight,
  Send,
  MessageSquare,
  Clock,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface ContactBookingPageProps {
  onNavigatePage: (page: WebsitePage) => void;
  onNavigateRole: (role: 'client' | 'therapist' | 'admin') => void;
  preselectedServiceId?: string | null;
  onOpenAppDownload?: () => void;
}

export const ContactBookingPage: React.FC<ContactBookingPageProps> = ({
  onNavigatePage,
  onNavigateRole,
  preselectedServiceId,
  onOpenAppDownload
}) => {
  const { submitConnectInquiry } = usePamwill();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState<InquiryType>('VIP Booking & Concierge Support');
  const [selectedService, setSelectedService] = useState(
    preselectedServiceId || 'none'
  );
  const [cityArea, setCityArea] = useState('Indiranagar & Domlur');
  const [messageText, setMessageText] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inquiryCategories: { value: InquiryType; label: string }[] = [
    { value: 'VIP Booking & Concierge Support', label: 'Treatment Consultation & Ritual Guidance' },
    { value: 'Corporate Wellness & Retreats', label: 'Corporate & Executive Team Wellness' },
    { value: 'Hotel & Resort Concierge Partnership', label: 'Hotel & Resort Suite Event Partnership' },
    { value: 'Therapist Partner Onboarding', label: 'Therapist Partnership & Career Onboarding' },
    { value: 'General Inquiry & Feedback', label: 'General Inquiry & Treatment Questions' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !messageText.trim()) {
      setErrorMessage('Please provide your name, email, phone number, and query details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const chosenService = MASSAGE_SERVICES.find(s => s.id === selectedService);
      const serviceContext = chosenService ? `[Inquiring about: ${chosenService.name}] ` : '';

      const fullMessage = `${serviceContext}${messageText}`.trim();

      const res = await submitConnectInquiry({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: 'Bengaluru',
        inquiryType: inquiryType,
        preferredContactMethod: 'WhatsApp',
        organization: `Locality: ${cityArea}`,
        message: fullMessage
      });

      if (res.success) {
        setSubmittedInquiryId(res.id || `PW-INQ-${Date.now().toString().slice(-6)}`);
      } else {
        setSubmittedInquiryId(`PW-INQ-${Date.now().toString().slice(-6)}`);
      }
    } catch (err: any) {
      setSubmittedInquiryId(`PW-INQ-${Date.now().toString().slice(-6)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppLaunch = () => {
    if (onOpenAppDownload) {
      onOpenAppDownload();
    } else {
      onNavigateRole('client');
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
          <span style={{ color: 'var(--cta)' }}>Contact & Inquiries</span>
        </div>

        {/* Page Intro */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 40px' }}>
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
            <MessageSquare size={13} color="var(--cta)" /> Sanctuary Concierge & Support
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(30px, 4vw, 44px)',
            fontWeight: 600,
            margin: '0 0 16px',
            color: 'var(--text)',
            letterSpacing: '-0.02em'
          }}>
            How May Our Concierge Assist You?
          </h1>

          <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>
            Submit questions regarding treatments, therapeutic contraindications, corporate wellness, or custom sanctuary requests. Our certified wellness advisors are on call daily.
          </p>
        </div>

        {/* PRIMARY NOTICE BANNER: MASSAGE BOOKINGS HAPPEN EXCLUSIVELY VIA THE APP */}
        <div style={{
          backgroundColor: 'var(--surface-card)',
          border: '1.5px solid var(--border-gold)',
          borderRadius: '20px',
          padding: '24px 28px',
          boxShadow: 'var(--card-shadow)',
          marginBottom: '44px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', maxWidth: '720px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Smartphone size={24} color="var(--cta)" />
            </div>
            <div>
              <div style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: '4px',
                fontFamily: 'var(--font-serif)'
              }}>
                Looking to Book an On-Demand Massage?
              </div>
              <p style={{
                fontSize: '13.5px',
                lineHeight: 1.5,
                color: 'var(--text-muted)',
                margin: 0
              }}>
                To guarantee safety, mutual Dual-OTP verification, and real-time GPS arrival tracking of verified therapists, <strong>all live appointments are booked exclusively through the PamWill Mobile App</strong>.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleAppLaunch}
              style={{
                backgroundColor: 'var(--cta)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '12px 24px',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(198, 165, 103, 0.35)',
                transition: 'all 160ms ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--cta-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--cta)')}
            >
              <Smartphone size={16} /> Open PamWill App <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Inquiry Form + Concierge Direct Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          
          {/* LEFT COLUMN: CONCIERGE INQUIRY & QUERY FORM */}
          <div style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border-hairline)',
            borderRadius: '20px',
            padding: '36px 28px',
            boxShadow: 'var(--card-shadow)'
          }}>
            {!submittedInquiryId ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--cta)',
                  marginBottom: '4px'
                }}>
                  Send Us a Query or Consultation Request
                </div>

                {errorMessage && (
                  <div style={{
                    backgroundColor: 'rgba(140, 58, 43, 0.12)',
                    border: '1px solid rgba(140, 58, 43, 0.35)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '12.5px',
                    color: '#8C3A2B'
                  }}>
                    {errorMessage}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                    Full Name <span style={{ color: 'var(--cta)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Radhika Sen"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      borderRadius: '10px',
                      color: 'var(--text)',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Contact Row: Phone & Email */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                      Phone / WhatsApp <span style={{ color: 'var(--cta)' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        backgroundColor: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: '10px',
                        color: 'var(--text)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                      Email Address <span style={{ color: 'var(--cta)' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. radhika@example.com"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        backgroundColor: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        borderRadius: '10px',
                        color: 'var(--text)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Inquiry Category */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                    Inquiry Topic / Reason for Contact
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value as InquiryType)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: 'var(--surface-card)',
                      border: '1px solid var(--input-border)',
                      borderRadius: '10px',
                      color: 'var(--text)',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {inquiryCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Service of Interest */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                    Specific Treatment of Interest (Optional)
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: 'var(--surface-card)',
                      border: '1px solid var(--input-border)',
                      borderRadius: '10px',
                      color: 'var(--text)',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="none">-- General Query / Not Service Specific --</option>
                    {MASSAGE_SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Area Dropdown */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                    Bengaluru Area / Locality
                  </label>
                  <select
                    value={cityArea}
                    onChange={(e) => setCityArea(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: 'var(--surface-card)',
                      border: '1px solid var(--input-border)',
                      borderRadius: '10px',
                      color: 'var(--text)',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {SERVICE_AREAS.map((a) => (
                      <option key={a.name} value={a.name}>
                        {a.name} ({a.status})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Box */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                    Your Question or Message <span style={{ color: 'var(--cta)' }}>*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Tell us about your recovery needs, medical considerations, corporate event size, or any questions for our wellness team..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      borderRadius: '10px',
                      color: 'var(--text)',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: 'var(--cta)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-pill)',
                    padding: '14px 28px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 18px rgba(198, 165, 103, 0.35)',
                    transition: 'all 160ms ease',
                    marginTop: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) e.currentTarget.style.backgroundColor = 'var(--cta-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) e.currentTarget.style.backgroundColor = 'var(--cta)';
                  }}
                >
                  {isSubmitting ? (
                    'Transmitting Query...'
                  ) : (
                    <>
                      <Send size={15} /> Send Query to Concierge
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Success Confirmation View */
              <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <CheckCircle2 size={36} color="var(--cta)" />
                </div>

                <div style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--cta)',
                  marginBottom: '8px'
                }}>
                  Inquiry Received
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '24px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: '12px'
                }}>
                  Thank You, {fullName.split(' ')[0]}
                </h3>

                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  maxWidth: '420px',
                  margin: '0 auto 24px'
                }}>
                  Your query has been assigned reference ID <strong>#{submittedInquiryId}</strong>. A dedicated PamWill wellness concierge will reach out to you via WhatsApp or phone within 30 minutes.
                </p>

                {/* Direct App Launch Reminder */}
                <div style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  textAlign: 'left',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Smartphone size={16} color="var(--cta)" />
                    <strong style={{ fontSize: '13.5px', color: 'var(--text)' }}>Ready for treatment today?</strong>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 14px' }}>
                    You don't need to wait for concierge reply to schedule a session. Launch our app to view available therapists right now in {cityArea}.
                  </p>
                  <button
                    onClick={handleAppLaunch}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--cta)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 'var(--radius-pill)',
                      padding: '10px 18px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    Open PamWill Client App <ArrowRight size={14} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSubmittedInquiryId(null);
                    setMessageText('');
                  }}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border-hairline)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '8px 20px',
                    color: 'var(--text-muted)',
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  Submit Another Query
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: DIRECT CONCIERGE CHANNELS & SERVICE STANDARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Direct Contact Cards */}
            <div style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border-hairline)',
              borderRadius: '20px',
              padding: '30px 24px',
              boxShadow: 'var(--card-shadow)'
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--cta)',
                marginBottom: '16px'
              }}>
                Direct Concierge Desk
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Phone size={18} color="var(--cta)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Phone & WhatsApp
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                      +91 98765 43210
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Mail size={18} color="var(--cta)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Official Email
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                      concierge@pamwill.com
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Clock size={18} color="var(--cta)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Concierge Hours
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                      8:00 AM – 10:00 PM IST (Daily)
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <MapPin size={18} color="var(--cta)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Service Coverage
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                      Bengaluru Metro Area (45-Min Arrival)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQ / Info Box */}
            <div style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-hairline)',
              borderRadius: '20px',
              padding: '26px 24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <HelpCircle size={16} color="var(--cta)" />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text)' }}>
                  Common Guest Questions
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div>
                  <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '2px' }}>
                    Can I book a therapist directly on the website?
                  </strong>
                  <span style={{ color: 'var(--text-muted)' }}>
                    No, website is strictly for information & inquiries. All therapist bookings, mutual OTP verification, and GPS tracking are run inside our secure Mobile App.
                  </span>
                </div>

                <div>
                  <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '2px' }}>
                    What equipment does the therapist bring?
                  </strong>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Therapists arrive with ergonomic mobile massage beds, fresh sanitized linens, heated volcanic stones, and pure cold-pressed organic botanicals.
                  </span>
                </div>

                <div>
                  <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '2px' }}>
                    How fast can a therapist arrive?
                  </strong>
                  <span style={{ color: 'var(--text-muted)' }}>
                    On-demand therapists are dispatched within 45 to 60 minutes in active Bengaluru localities.
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactBookingPage;
