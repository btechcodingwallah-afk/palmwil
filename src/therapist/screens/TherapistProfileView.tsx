import React from 'react';
import { ShieldCheck, Award, FileText, MapPin, Globe, Clock, CheckCircle } from 'lucide-react';
import { usePamwill } from '../../state/store';

export const TherapistProfileView: React.FC = () => {
  const { currentTherapist, logoutTherapist, setAuthTargetRole, setAuthMode, setAuthModalOpen } = usePamwill();

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <span className="eyebrow">Practitioner Credentials</span>
        <h2 style={{ fontSize: '24px', margin: 0 }}>My Professional Profile</h2>
      </div>

      {/* Practitioner Card */}
      <div className="card-luxury" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <img
          src={currentTherapist.photoUrl}
          alt={currentTherapist.fullName}
          style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-gold)' }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h3 style={{ fontSize: '18px', margin: 0 }}>{currentTherapist.fullName}</h3>
            <ShieldCheck size={18} color="var(--status-success)" />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {currentTherapist.phone} • {currentTherapist.email}
          </div>
          <span style={{
            display: 'inline-block',
            marginTop: '6px',
            fontSize: '10px',
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success)',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 'var(--radius-pill)'
          }}>
            VERIFIED & BACKGROUND CHECKED
          </span>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
            <button
              onClick={() => {
                setAuthTargetRole('therapist');
                setAuthMode('register');
                setAuthModalOpen(true);
              }}
              className="btn-gold"
              style={{ padding: '6px 12px', fontSize: '11px' }}
            >
              Verification Dossier
            </button>
            <button
              onClick={() => {
                setAuthTargetRole('therapist');
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '11px' }}
            >
              Switch Account
            </button>
            <button
              onClick={logoutTherapist}
              style={{
                background: 'none',
                border: '1px solid var(--border-hairline)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                fontSize: '11px',
                color: 'var(--status-error)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Certifications & Specialties */}
      <div className="card-luxury" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Diplomas & Certifications</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {currentTherapist.certifications.map((cert, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <Award size={15} color="var(--accent-gold)" />
              <span>{cert}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Serviceable Locations & Languages */}
      <div className="card-luxury" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            <MapPin size={14} color="var(--accent-gold)" /> SERVICEABLE METROS
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>
            Delhi NCR (Gurugram / Noida), Jaipur
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            <Globe size={14} color="var(--accent-gold)" /> LANGUAGES SPOKEN
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>
            {currentTherapist.languages.join(', ')}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            <Clock size={14} color="var(--accent-gold)" /> OPERATING TIMINGS
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>
            {currentTherapist.workingHours} (Mon - Sat)
          </div>
        </div>
      </div>

      {/* Uploaded Documents Preview */}
      <div className="card-luxury" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Verified Credentials on File</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {currentTherapist.documents.map(doc => (
            <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={15} color="var(--accent-gold)" />
                <span>{doc.title}</span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--status-success)', fontWeight: 600 }}>Verified ✓</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
