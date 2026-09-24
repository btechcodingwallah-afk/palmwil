import React, { useState } from 'react';
import { 
   X, 
   Sparkles, 
   CheckCircle2, 
   Send, 
   Briefcase, 
   MapPin, 
   User, 
   Phone, 
   Mail, 
   MessageSquare,
   Building,
   Compass,
   PhoneCall,
   Clock,
   ExternalLink
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { InquiryType } from '../../types';
import { COMPANY_INFO } from '../../config/env';

interface ConnectWithUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectWithUsModal: React.FC<ConnectWithUsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { submitConnectInquiry } = usePamwill();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [inquiryType, setInquiryType] = useState<InquiryType>('Hotel & Resort Concierge Partnership');
  const [organization, setOrganization] = useState('');
  const [preferredMethod, setPreferredMethod] = useState<'WhatsApp' | 'Phone Call' | 'Email'>('WhatsApp');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields (Name, Email, Phone, and Inquiry Message).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitConnectInquiry({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city,
        inquiryType,
        organization: organization.trim() || undefined,
        preferredContactMethod: preferredMethod,
        message: message.trim()
      });

      setSubmitting(false);
      if (res.success) {
        setSubmittedId(res.id);
      }
    } catch (err: any) {
      setSubmitting(false);
      setErrorMsg(err.message || 'Failed to submit inquiry. Please try again or message our concierge directly.');
    }
  };

  const handleResetAndClose = () => {
    setSubmittedId(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setOrganization('');
    setMessage('');
    setErrorMsg(null);
    onClose();
  };

  const inquiryCategories: { type: InquiryType; label: string; desc: string; icon: string }[] = [
    { 
      type: 'Hotel & Resort Concierge Partnership', 
      label: 'Hotels & Resorts', 
      desc: 'In-room guest luxury spa amenities',
      icon: '🏨'
    },
    { 
      type: 'Corporate Wellness & Retreats', 
      label: 'Corporate & Offsites', 
      desc: 'Executive wellness & team retreats',
      icon: '🏢'
    },
    { 
      type: 'Therapist Partner Onboarding', 
      label: 'Therapist Network', 
      desc: 'Join our elite verified practitioner team',
      icon: '✨'
    },
    { 
      type: 'VIP Booking & Concierge Support', 
      label: 'VIP & Bespoke Concierge', 
      desc: 'Private estate or custom event booking',
      icon: '👑'
    },
    { 
      type: 'General Inquiry & Feedback', 
      label: 'General / Press', 
      desc: 'Inquiries, media, or partnerships',
      icon: '💬'
    }
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(8, 7, 6, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }} 
      onClick={handleResetAndClose}
    >
      <div
        style={{
          backgroundColor: '#171411',
          border: '1px solid rgba(169, 129, 47, 0.4)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 70px rgba(0,0,0,0.85), 0 0 50px rgba(169, 129, 47, 0.15)',
          color: '#FAF8F5',
          position: 'relative',
          padding: '36px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#B0A89F',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.color = '#B0A89F';
          }}
          aria-label="Close Modal"
        >
          <X size={18} />
        </button>

        {submittedId ? (
          /* SUCCESS CONFIRMATION STATE */
          <div style={{ textAlign: 'center', padding: '30px 10px 10px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(76, 107, 79, 0.18)',
              border: '2px solid #5A8F60',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 0 35px rgba(90, 143, 96, 0.35)'
            }}>
              <CheckCircle2 size={44} color="#72BB7A" />
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '999px',
              backgroundColor: 'rgba(169, 129, 47, 0.15)',
              border: '1px solid rgba(169, 129, 47, 0.35)',
              color: '#D4AF37',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              <Sparkles size={12} /> Inquiry Received & Logged
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '28px',
              fontWeight: 700,
              color: '#FAF8F5',
              marginBottom: '10px'
            }}>
              Thank You, {fullName.split(' ')[0]}!
            </h2>

            <p style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: '#B0A89F',
              maxWidth: '520px',
              margin: '0 auto 24px'
            }}>
              Your inquiry regarding <strong style={{ color: '#E8D298' }}>{inquiryType}</strong> has been transmitted directly to our executive concierge desk. We will reach back via <strong style={{ color: '#E8D298' }}>{preferredMethod}</strong> within 2 hours.
            </p>

            {/* Reference Badge */}
            <div style={{
              backgroundColor: '#1E1A16',
              border: '1px solid rgba(169, 129, 47, 0.25)',
              borderRadius: '16px',
              padding: '16px 20px',
              maxWidth: '440px',
              margin: '0 auto 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#887E74', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Inquiry Reference ID
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#E8D298', letterSpacing: '0.04em' }}>
                  {submittedId}
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: '#5A8F60',
                backgroundColor: 'rgba(90, 143, 96, 0.12)',
                padding: '4px 10px',
                borderRadius: '8px'
              }}>
                <Clock size={13} /> SLA: &lt;2 Hours
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/${(COMPANY_INFO.whatsapp || COMPANY_INFO.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi PamWill Concierge, I just submitted an inquiry (${submittedId}) regarding ${inquiryType}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                <PhoneCall size={16} /> Instant WhatsApp Concierge <ExternalLink size={14} />
              </a>

              <button
                onClick={handleResetAndClose}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FAF8F5',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          /* IN-BUILT LUXURY FORM */
          <div>
            {/* Header Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              backgroundColor: 'rgba(169, 129, 47, 0.12)',
              border: '1px solid rgba(169, 129, 47, 0.3)',
              color: '#D4AF37',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              <Sparkles size={12} /> Direct Concierge & Partnerships
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '26px',
              fontWeight: 700,
              color: '#FAF8F5',
              marginBottom: '8px',
              letterSpacing: '-0.02em'
            }}>
              Connect With PamWill
            </h2>

            <p style={{
              fontSize: '14px',
              color: '#B0A89F',
              lineHeight: 1.5,
              marginBottom: '24px'
            }}>
              Whether you are a luxury resort exploring spa amenities, a corporate looking for wellness retreats, or a certified therapist seeking to join our sovereign network — share your details below and our leadership team will respond promptly.
            </p>

            {errorMsg && (
              <div style={{
                backgroundColor: 'rgba(204, 75, 75, 0.15)',
                border: '1px solid rgba(204, 75, 75, 0.4)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#FF8A8A',
                fontSize: '13px',
                marginBottom: '20px'
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Category Selector Chips */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#D4AF37',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '10px'
                }}>
                  What are you inquiring about? *
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '8px'
                }}>
                  {inquiryCategories.map(cat => {
                    const isSelected = inquiryType === cat.type;
                    return (
                      <div
                        key={cat.type}
                        onClick={() => setInquiryType(cat.type)}
                        style={{
                          backgroundColor: isSelected ? 'rgba(169, 129, 47, 0.18)' : '#1E1A16',
                          border: isSelected ? '1.5px solid #D4AF37' : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '15px' }}>{cat.icon}</span>
                          <span style={{
                            fontSize: '13px',
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? '#FAF8F5' : '#D0C9C0'
                          }}>
                            {cat.label}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: isSelected ? '#E8D298' : '#887E74' }}>
                          {cat.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Name & Email Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#B0A89F',
                    marginBottom: '6px'
                  }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} color="#887E74" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Oberoi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#1E1A16',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '12px',
                        padding: '12px 14px 12px 40px',
                        color: '#FAF8F5',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#B0A89F',
                    marginBottom: '6px'
                  }}>
                    Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} color="#887E74" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                    <input
                      type="email"
                      required
                      placeholder="concierge@grandresort.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#1E1A16',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '12px',
                        padding: '12px 14px 12px 40px',
                        color: '#FAF8F5',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Phone, City & Organization */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#B0A89F',
                    marginBottom: '6px'
                  }}>
                    Phone / WhatsApp *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={15} color="#887E74" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98221 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#1E1A16',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '12px',
                        padding: '12px 14px 12px 40px',
                        color: '#FAF8F5',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#B0A89F',
                    marginBottom: '6px'
                  }}>
                    City *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={15} color="#887E74" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#1E1A16',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '12px',
                        padding: '12px 14px 12px 40px',
                        color: '#FAF8F5',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Goa">Goa</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Pune">Pune</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Other">Other City</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#B0A89F',
                    marginBottom: '6px'
                  }}>
                    Organization / Hotel (Optional)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building size={15} color="#887E74" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                    <input
                      type="text"
                      placeholder="e.g. The Oberoi Grand"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#1E1A16',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '12px',
                        padding: '12px 14px 12px 40px',
                        color: '#FAF8F5',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#B0A89F',
                  marginBottom: '8px'
                }}>
                  Preferred Way to Connect
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {(['WhatsApp', 'Phone Call', 'Email'] as const).map(method => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPreferredMethod(method)}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: '10px',
                        backgroundColor: preferredMethod === method ? 'rgba(169, 129, 47, 0.2)' : '#1E1A16',
                        border: preferredMethod === method ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                        color: preferredMethod === method ? '#FAF8F5' : '#887E74',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {method === 'WhatsApp' ? '💬 WhatsApp' : method === 'Phone Call' ? '📞 Phone Call' : '✉️ Email'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message / Project Scope */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#B0A89F',
                  marginBottom: '6px'
                }}>
                  Message / Requirements Overview *
                </label>
                <div style={{ position: 'relative' }}>
                  <MessageSquare size={15} color="#887E74" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your requirements, dates, locations, or partnership ideas in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#1E1A16',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      padding: '12px 14px 12px 40px',
                      color: '#FAF8F5',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '15px 24px',
                    backgroundColor: submitting ? '#6A562B' : 'var(--accent-gold, #A9812F)',
                    color: '#FAF8F5',
                    border: 'none',
                    borderRadius: '14px',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 24px rgba(169, 129, 47, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Send size={16} />
                  {submitting ? 'Transmitting Inquiry...' : 'Submit Inquiry to PamWill Concierge'}
                </button>
              </div>

              {/* Trust Badge */}
              <div style={{
                textAlign: 'center',
                fontSize: '12px',
                color: '#887E74',
                marginTop: '4px'
              }}>
                🔒 Direct encrypted concierge routing • Response guaranteed within 2 business hours
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
