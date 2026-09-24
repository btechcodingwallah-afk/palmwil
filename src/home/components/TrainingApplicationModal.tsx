import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  BookOpen, 
  Award, 
  Briefcase, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  FileText 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { ProgramType } from '../../types';

interface TrainingApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrainingApplicationModal: React.FC<TrainingApplicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { submitTrainingApplication } = usePamwill();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [programType, setProgramType] = useState<ProgramType>('Therapist Certification Training');
  const [experienceLevel, setExperienceLevel] = useState<'Fresher / No Prior Experience' | '6 Months – 1 Year' | '1 – 3 Years' | '3+ Years'>('Fresher / No Prior Experience');
  const [availability, setAvailability] = useState<'Full-Time (3-Month Intensive)' | 'Part-Time Weekend Program' | '6-Month Apprenticeship'>('Full-Time (3-Month Intensive)');
  const [qualification, setQualification] = useState('');
  const [statement, setStatement] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please enter your full name, email, and contact phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitTrainingApplication({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city,
        programType,
        experienceLevel,
        availability,
        qualification: qualification.trim() || 'High School / Graduate',
        statement: statement.trim() || 'Enthusiastic candidate seeking structured wellness and therapy education.'
      });

      setSubmitting(false);
      if (res.success) {
        setSubmittedId(res.id);
      }
    } catch (err: any) {
      setSubmitting(false);
      setErrorMsg(err.message || 'Failed to submit application. Please try again.');
    }
  };

  const handleResetAndClose = () => {
    setSubmittedId(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setQualification('');
    setStatement('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(8, 7, 6, 0.88)',
      backdropFilter: 'blur(12px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} onClick={handleResetAndClose}>
      
      <div
        style={{
          backgroundColor: '#171411',
          border: '1px solid rgba(169, 129, 47, 0.4)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 70px rgba(0,0,0,0.85), 0 0 50px rgba(169, 129, 47, 0.15)',
          color: '#FAF8F5',
          position: 'relative',
          padding: '36px'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#A3988B',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            backgroundColor: '#231E19',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {submittedId ? (
          /* SUCCESS CONFIRMATION VIEW */
          <div style={{ textAlign: 'center', padding: '24px 10px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(76, 107, 79, 0.25)',
              border: '1px solid var(--status-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--status-success)',
              margin: '0 auto 20px'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--accent-gold-light)'
            }}>
              Application Lodged In Database
            </span>

            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '28px',
              fontWeight: 600,
              margin: '8px 0 12px',
              color: '#FAF8F5'
            }}>
              Application Received!
            </h3>

            <p style={{ fontSize: '14px', color: '#C7BEB1', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 24px' }}>
              Thank you, <strong>{fullName}</strong>. Your application for the <strong>{programType}</strong> has been saved directly to the PamWill Academy database.
            </p>

            {/* Application Token Box */}
            <div style={{
              backgroundColor: '#211C17',
              border: '1px solid #3B3226',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              maxWidth: '380px',
              margin: '0 auto 28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '11px', color: '#9E9284', textTransform: 'uppercase' }}>Reference Application ID</div>
                <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 700, color: 'var(--accent-gold-light)' }}>
                  {submittedId}
                </div>
              </div>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: 'rgba(169, 129, 47, 0.2)',
                color: 'var(--accent-gold-light)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)'
              }}>
                PENDING REVIEW
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#9E9284', margin: '0 0 28px' }}>
              Our Academic Dean and Partner Coordinator will review your details and contact you via WhatsApp / Phone at <strong>{phone}</strong> within 24–48 hours.
            </p>

            <button
              onClick={handleResetAndClose}
              style={{
                backgroundColor: 'var(--accent-gold)',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 32px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Done & Return to Site
            </button>
          </div>
        ) : (
          /* APPLICATION FORM VIEW */
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(169, 129, 47, 0.15)',
                border: '1px solid rgba(169, 129, 47, 0.3)',
                borderRadius: 'var(--radius-pill)',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--accent-gold-light)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '10px'
              }}>
                <GraduationCap size={14} color="var(--accent-gold)" /> PamWill Academy & Internships
              </div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '26px',
                fontWeight: 600,
                color: '#FAF8F5',
                margin: '0 0 6px'
              }}>
                Apply for Training & Internship
              </h2>
              <p style={{ fontSize: '13px', color: '#BDB3A6', margin: 0, lineHeight: 1.5 }}>
                Master luxury massage protocols, holistic anatomy, and boutique spa operations. Open to beginners, graduates, and practicing therapists.
              </p>
            </div>

            {errorMsg && (
              <div style={{
                backgroundColor: 'rgba(140, 58, 43, 0.2)',
                border: '1px solid #8C3A2B',
                color: '#F9A8A8',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                marginBottom: '18px'
              }}>
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Row 1: Full Name & City */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>
                    <User size={13} color="var(--accent-gold)" /> Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Sharma"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    <MapPin size={13} color="var(--accent-gold)" /> Training Location / City *
                  </label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="Bengaluru">Bengaluru (HQ Academy)</option>
                    <option value="Mumbai">Mumbai (Bandra Hub)</option>
                    <option value="Delhi NCR">Delhi NCR (South Ex)</option>
                    <option value="Hyderabad">Hyderabad (Jubilee Hills)</option>
                    <option value="Chennai">Chennai (Nungambakkam)</option>
                    <option value="Pune">Pune (Koregaon Park)</option>
                    <option value="Kolkata">Kolkata (Park Street)</option>
                    <option value="Goa">Goa (Candolim Sanctuary)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>
                    <Mail size={13} color="var(--accent-gold)" /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    <Phone size={13} color="var(--accent-gold)" /> WhatsApp / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Program Track Selection */}
              <div>
                <label style={labelStyle}>
                  <Award size={13} color="var(--accent-gold)" /> Select Program / Track *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                  {[
                    {
                      id: 'Therapist Certification Training' as ProgramType,
                      title: 'Therapist Certification Training',
                      desc: 'Swedish, Deep Tissue, Thai Stretching & certified clinical massage.'
                    },
                    {
                      id: 'Spa Operations & Wellness Internship' as ProgramType,
                      title: 'Spa Operations & Hospitality Internship',
                      desc: 'Consignment management, mobile dispatch, inventory & concierge.'
                    },
                    {
                      id: 'Ayurvedic & Holistic Apprenticeship' as ProgramType,
                      title: 'Ayurvedic & Holistic Apprenticeship',
                      desc: 'Authentic Abhyanga, Kizhi herb poultices & marma pressure.'
                    },
                    {
                      id: 'Clinical Physiotherapy Support Internship' as ProgramType,
                      title: 'Clinical Physiotherapy Support',
                      desc: 'Sports recovery, trigger point decompression & muscle rehab.'
                    }
                  ].map(prog => (
                    <div
                      key={prog.id}
                      onClick={() => setProgramType(prog.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: programType === prog.id ? 'rgba(169, 129, 47, 0.16)' : '#211C18',
                        border: programType === prog.id ? '1px solid var(--accent-gold)' : '1px solid #332B22',
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                    >
                      <div style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: programType === prog.id ? 'var(--accent-gold-light)' : '#FAF8F5',
                        marginBottom: '4px'
                      }}>
                        {prog.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9E9284', lineHeight: 1.3 }}>
                        {prog.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 3: Experience & Availability */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>
                    <Briefcase size={13} color="var(--accent-gold)" /> Prior Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={e => setExperienceLevel(e.target.value as any)}
                    style={inputStyle}
                  >
                    <option value="Fresher / No Prior Experience">Fresher / No Prior Experience</option>
                    <option value="6 Months – 1 Year">6 Months – 1 Year</option>
                    <option value="1 – 3 Years">1 – 3 Years</option>
                    <option value="3+ Years">3+ Years (Advanced Master)</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>
                    <Clock size={13} color="var(--accent-gold)" /> Program Format & Availability
                  </label>
                  <select
                    value={availability}
                    onChange={e => setAvailability(e.target.value as any)}
                    style={inputStyle}
                  >
                    <option value="Full-Time (3-Month Intensive)">Full-Time (3-Month Intensive)</option>
                    <option value="Part-Time Weekend Program">Part-Time Weekend Program</option>
                    <option value="6-Month Apprenticeship">6-Month Apprenticeship (Stipend Provided)</option>
                  </select>
                </div>
              </div>

              {/* Qualification */}
              <div>
                <label style={labelStyle}>
                  <BookOpen size={13} color="var(--accent-gold)" /> Education / Prior Certifications
                </label>
                <input
                  type="text"
                  placeholder="e.g. Higher Secondary / B.Sc / Diploma in Physiotherapy / Naturopathy"
                  value={qualification}
                  onChange={e => setQualification(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Statement */}
              <div>
                <label style={labelStyle}>
                  <FileText size={13} color="var(--accent-gold)" /> Why do you wish to join PamWill Academy?
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us briefly about your passion for healing, career goals, or why you wish to train with our luxury network..."
                  value={statement}
                  onChange={e => setStatement(e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Submit CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #3A3228',
                    color: '#BAAE9E',
                    padding: '11px 20px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 28px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 16px rgba(169, 129, 47, 0.4)',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Submitting Application...' : (
                    <>
                      Submit Application <Send size={15} />
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#D4C9BC',
  marginBottom: '6px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#201B17',
  border: '1px solid #362E25',
  borderRadius: 'var(--radius-md)',
  padding: '10px 14px',
  color: '#FAF8F5',
  fontSize: '13px',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box'
};
