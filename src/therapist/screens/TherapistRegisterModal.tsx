import React, { useState } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Check, Upload, 
  ShieldCheck, FileText, Award, MapPin, DollarSign 
} from 'lucide-react';
import { Therapist, TherapistDocument } from '../../types';
import { dbInsertTherapist } from '../../services/supabase';
import { usePamwill } from '../../state/store';
import { INDIAN_CITIES } from '../../data/indianCities';

interface TherapistRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered: (therapist: Therapist) => void;
}

export const TherapistRegisterModal: React.FC<TherapistRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegistered
}) => {
  const { therapists } = usePamwill();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Personal
  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');

  // Step 2: Documents
  const [aadhaarUrl, setAadhaarUrl] = useState('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80');
  const [policeCertUrl, setPoliceCertUrl] = useState('https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80');

  // Step 3: Banking & Tax
  const [bankAccount, setBankAccount] = useState('HDFC Bank •••• 9102');
  const [upiId, setUpiId] = useState('');
  const [panNumber, setPanNumber] = useState('');

  // Step 4: Qualifications
  const [experienceYears, setExperienceYears] = useState(4);
  const [certifications, setCertifications] = useState(['CIDESCO International Spa Diploma', 'Deep Tissue Specialist']);
  const [languages, setLanguages] = useState(['English', 'Hindi']);

  // Step 5: Working Cities & Hours
  const [selectedCities, setSelectedCities] = useState<string[]>(['delhi-ncr']);
  const [workingHours, setWorkingHours] = useState('08:00 AM - 08:30 PM');

  if (!isOpen) return null;

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    const newId = `ther-${Date.now()}`;

    const newTherapist: Therapist = {
      id: newId,
      fullName,
      photoUrl,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email,
      status: 'Under Review',
      gender,
      rating: 0,
      reviewCount: 0,
      completedJobs: 0,
      experienceYears: Number(experienceYears),
      languages,
      availableCities: selectedCities,
      workingHours,
      isOnline: false,
      walletBalance: 0,
      bankAccount,
      upiId,
      certifications,
      documents: [
        {
          id: `doc-${newId}-1`,
          title: 'Aadhaar Card Front & Back',
          type: 'aadhaar',
          url: aadhaarUrl,
          verificationStatus: 'pending'
        },
        {
          id: `doc-${newId}-2`,
          title: 'Police Verification Clearance',
          type: 'police',
          url: policeCertUrl,
          verificationStatus: 'pending'
        }
      ]
    };

    // Insert into Supabase therapists table
    await dbInsertTherapist(newTherapist);

    setIsSubmitting(false);
    onRegistered(newTherapist);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(18, 16, 14, 0.8)',
      backdropFilter: 'blur(12px)',
      zIndex: 2200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        width: '100%',
        maxWidth: '440px',
        maxHeight: '92vh',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-phone)',
        border: '1px solid var(--border-hairline)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header with Step indicator */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <ChevronLeft size={18} />
                </button>
              )}
              <h3 style={{ fontSize: '16px', margin: 0 }}>Practitioner Application</h3>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map(s => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: s <= step ? 'var(--accent-gold)' : 'var(--border-hairline)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="eyebrow">Step 1: Identity & Contact</span>
              <h2 style={{ fontSize: '18px', margin: '2px 0 8px 0' }}>Personal Details</h2>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>FULL LEGAL NAME</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="As printed on Aadhaar"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>MOBILE NUMBER (+91)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="98XXXXXXXX"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="therapist@domain.com"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>GENDER</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {(['Female', 'Male'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        border: gender === g ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                        backgroundColor: gender === g ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Verification Documents */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <span className="eyebrow">Step 2: Trust & Compliance</span>
              <h2 style={{ fontSize: '18px', margin: '2px 0' }}>Government Clearance</h2>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-hairline)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600 }}>1. Aadhaar Card (Biometric ID)</div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 8px 0' }}>Clear scanned photo of front and back.</p>
                <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: 600 }}>✓ Sample Document Attached</span>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-hairline)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600 }}>2. State Police Clearance Certificate</div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 8px 0' }}>Valid within last 12 months for safety compliance.</p>
                <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: 600 }}>✓ Sample Document Attached</span>
              </div>
            </div>
          )}

          {/* STEP 3: Banking & Payouts */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="eyebrow">Step 3: Settlements</span>
              <h2 style={{ fontSize: '18px', margin: '2px 0' }}>Payout Details (80% Share)</h2>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>UPI ID / VPA</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="e.g. name@okaxis"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>BANK ACCOUNT & IFSC</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={e => setBankAccount(e.target.value)}
                  placeholder="e.g. ICICI Bank •••• 4102"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>PAN CARD NUMBER</label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={e => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Experience & Certifications */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="eyebrow">Step 4: Credentials</span>
              <h2 style={{ fontSize: '18px', margin: '2px 0' }}>Massage Diplomas</h2>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>YEARS OF PRACTICING EXPERIENCE</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={e => setExperienceYears(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>CERTIFICATIONS (CIDESCO, AYURVEDA, ETC.)</label>
                <input
                  type="text"
                  value={certifications.join(', ')}
                  onChange={e => setCertifications(e.target.value.split(',').map(s => s.trim()))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                />
              </div>
            </div>
          )}

          {/* STEP 5: Serviceable Cities */}
          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span className="eyebrow">Step 5: Operational Zone</span>
              <h2 style={{ fontSize: '18px', margin: '2px 0' }}>Available Metros & Hours</h2>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>PRIMARY OPERATING METRO</label>
                <select
                  value={selectedCities[0]}
                  onChange={e => setSelectedCities([e.target.value])}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                >
                  {INDIAN_CITIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.state})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>DAILY WORKING WINDOW</label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={e => setWorkingHours(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Bottom Nav */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between' }}>
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="btn-gold"
              style={{ width: '100%', padding: '12px' }}
            >
              Continue to Step {step + 1} →
            </button>
          ) : (
            <button
              onClick={handleSubmitApplication}
              disabled={isSubmitting}
              className="btn-gold"
              style={{ width: '100%', padding: '12px' }}
            >
              {isSubmitting ? 'Transmitting Application...' : 'Submit Credentials for Review ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
