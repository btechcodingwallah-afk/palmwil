import React, { useState } from 'react';
import { 
  User, ShieldCheck, ArrowLeft, Save, CheckCircle2, 
  Upload, FileText, Building2, Phone, Mail 
} from 'lucide-react';
import { usePamwill } from '../../state/store';

export const TherapistEditProfileView: React.FC = () => {
  const { currentTherapist, setTherapistSubRoute } = usePamwill();

  const [fullName, setFullName] = useState(currentTherapist?.fullName || '');
  const [phone, setPhone] = useState(currentTherapist?.phone || '');
  const [email, setEmail] = useState(currentTherapist?.email || '');
  const [experienceYears, setExperienceYears] = useState(currentTherapist?.experienceYears?.toString() || '6');
  const [workingHours, setWorkingHours] = useState(currentTherapist?.workingHours || '08:00 AM - 08:00 PM');
  const [bankAccount, setBankAccount] = useState(currentTherapist?.bankAccount || 'HDFC Bank •••• 4091');
  const [upiId, setUpiId] = useState(currentTherapist?.upiId || 'dr.iyer@okhdfcbank');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setTherapistSubRoute('profile');
    }, 1500);
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0', padding: '20px 16px 80px', boxSizing: 'border-box' }}>
      
      {/* Back button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setTherapistSubRoute('profile')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: 'var(--accent-gold)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0
          }}
        >
          <ArrowLeft size={16} /> Back to Profile
        </button>
      </div>

      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '28px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        margin: '0 0 8px 0'
      }}>
        Edit Practitioner Credentials & KYC
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 28px 0' }}>
        Keep your professional licensing, availability schedule, and bank payout coordinates up to date.
      </p>

      {savedSuccess && (
        <div style={{
          backgroundColor: 'rgba(76, 175, 80, 0.18)',
          border: '1px solid rgba(76, 175, 80, 0.4)',
          borderRadius: '16px',
          padding: '14px',
          textAlign: 'center',
          marginBottom: '24px',
          color: 'var(--status-success)',
          fontWeight: 700,
          fontSize: '13px'
        }}>
          ✓ Practitioner profile and payout credentials updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '24px',
        border: '1px solid var(--border-hairline)',
        padding: '32px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        
        {/* Basic Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Full Name (Including Title)</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Years of Experience</label>
            <input
              type="number"
              value={experienceYears}
              onChange={e => setExperienceYears(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Contact Mobile Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Official Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Daily Operational Hours</label>
          <input
            type="text"
            value={workingHours}
            onChange={e => setWorkingHours(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {/* Banking and Payout Section */}
        <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>
            Direct Payout Banking Coordinates
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Settlement Bank Account</label>
              <input
                type="text"
                value={bankAccount}
                onChange={e => setBankAccount(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Primary UPI ID / VPA</label>
              <input
                type="text"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* KYC Documents Status */}
        <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>
            Verified Identity & Clinical Certifications
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-hairline)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={18} color="var(--status-success)" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Government Aadhaar / Photo Identity
                </span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-success)', backgroundColor: 'rgba(76, 175, 80, 0.15)', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
                VERIFIED
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-hairline)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={18} color="var(--status-success)" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  CIDESCO / IAP Physiotherapy License & Diploma
                </span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-success)', backgroundColor: 'rgba(76, 175, 80, 0.15)', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
                VERIFIED
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn-gold"
          style={{ width: '100%', padding: '14px', fontSize: '14px', marginTop: '10px' }}
        >
          <Save size={15} style={{ marginRight: '6px' }} /> Save Practitioner Profile
        </button>
      </form>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: '6px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-hairline)',
  color: 'var(--text-primary)',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box'
};
