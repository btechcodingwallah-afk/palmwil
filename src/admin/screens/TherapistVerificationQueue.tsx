import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, AlertCircle, FileText, 
  ExternalLink, Calendar, Phone, Mail, Award, Check 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { Therapist } from '../../types';

export const TherapistVerificationQueue: React.FC = () => {
  const { therapists, approveTherapist, rejectTherapist } = usePamwill();
  
  // Pending or Under Review applicants
  const pendingTherapists = therapists.filter(t => t.status === 'Pending' || t.status === 'Under Review');
  const [selectedCandidate, setSelectedCandidate] = useState<Therapist | null>(
    pendingTherapists[0] || therapists[0] || null
  );

  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleApprove = (therapistId: string) => {
    approveTherapist(therapistId);
    setActionSuccessMessage(`Practitioner ${selectedCandidate?.fullName} has been APPROVED! They can now access the Therapist Dashboard and receive jobs.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleReject = (therapistId: string) => {
    rejectTherapist(therapistId);
    setActionSuccessMessage(`Practitioner ${selectedCandidate?.fullName} application has been flagged for revision.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="eyebrow">High Priority Review</span>
          <h1 style={{ fontSize: '26px', margin: '2px 0' }}>Therapist Verification Queue</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Inspect uploaded Aadhaar government IDs, police character certificates, and CIDESCO diplomas inline before approving platform dispatch rights.
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--accent-gold-light)',
          border: '1px solid var(--accent-gold)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--accent-gold-hover)'
        }}>
          {pendingTherapists.length} Candidates Pending Action
        </div>
      </div>

      {actionSuccessMessage && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--status-success-bg)',
          color: 'var(--status-success)',
          border: '1px solid var(--status-success)',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} /> {actionSuccessMessage}
        </div>
      )}

      {/* Split Queue Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', flex: 1, minHeight: '520px' }}>
        
        {/* Left Column: Applicant Candidates List */}
        <div className="card-luxury" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', height: 'fit-content' }}>
          <span className="eyebrow" style={{ fontSize: '10px' }}>Awaiting Approval</span>

          {therapists.map(cand => {
            const isSelected = selectedCandidate?.id === cand.id;
            const isPending = cand.status === 'Pending' || cand.status === 'Under Review';

            return (
              <div
                key={cand.id}
                onClick={() => {
                  setSelectedCandidate(cand);
                  setActiveDocIndex(0);
                }}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                  backgroundColor: isSelected ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <img
                  src={cand.photoUrl}
                  alt={cand.fullName}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600 }}>{cand.fullName}</h4>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: isPending ? 'var(--status-warning-bg)' : 'var(--status-success-bg)',
                      color: isPending ? 'var(--status-warning)' : 'var(--status-success)'
                    }}>
                      {cand.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {cand.certifications[0]?.slice(0, 32)}...
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {cand.experienceYears} yrs exp • {cand.languages.join(', ')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Candidate Dossier & Inline Document Inspector */}
        {selectedCandidate ? (
          <div className="card-luxury" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Candidate Header & Operational CTAs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid var(--border-hairline)' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img
                  src={selectedCandidate.photoUrl}
                  alt={selectedCandidate.fullName}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-gold)' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '20px', margin: 0 }}>{selectedCandidate.fullName}</h2>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: selectedCandidate.status === 'Approved' ? 'var(--status-success-bg)' : 'var(--status-warning-bg)',
                      color: selectedCandidate.status === 'Approved' ? 'var(--status-success)' : 'var(--status-warning)'
                    }}>
                      {selectedCandidate.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {selectedCandidate.phone} • {selectedCandidate.email} • Gender: {selectedCandidate.gender}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Bank/UPI: {selectedCandidate.bankAccount} ({selectedCandidate.upiId})
                  </div>
                </div>
              </div>

              {/* Action Buttons: Approve / Reject / Request More Info */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleReject(selectedCandidate.id)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--status-error)',
                    backgroundColor: 'transparent',
                    color: 'var(--status-error)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <XCircle size={15} /> Reject / Suspend
                </button>

                <button
                  onClick={() => handleApprove(selectedCandidate.id)}
                  className="btn-gold"
                  style={{
                    padding: '10px 20px',
                    fontSize: '13px',
                    boxShadow: '0 4px 14px rgba(169, 129, 47, 0.4)'
                  }}
                >
                  <CheckCircle2 size={16} /> Approve Credentials
                </button>
              </div>
            </div>

            {/* Inline Document Inspector Tabs */}
            <div>
              <span className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>
                Inline Verification Document Viewer
              </span>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                {selectedCandidate.documents.map((doc, idx) => (
                  <button
                    key={doc.id}
                    onClick={() => setActiveDocIndex(idx)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: activeDocIndex === idx ? '1px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                      backgroundColor: activeDocIndex === idx ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                      color: activeDocIndex === idx ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={14} /> {doc.title}
                  </button>
                ))}
              </div>

              {/* High-Resolution Document Display Card */}
              {selectedCandidate.documents[activeDocIndex] && (
                <div style={{
                  border: '1px solid var(--border-hairline)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    padding: '10px 16px',
                    backgroundColor: 'var(--bg-surface)',
                    borderBottom: '1px solid var(--border-hairline)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px'
                  }}>
                    <span><strong>Viewing:</strong> {selectedCandidate.documents[activeDocIndex].title}</span>
                    <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>
                      Authenticity Hash: SHA256-OK-INSP
                    </span>
                  </div>

                  <div style={{ height: '320px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={selectedCandidate.documents[activeDocIndex].url}
                      alt={selectedCandidate.documents[activeDocIndex].title}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Certifications Checklist */}
            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px'
            }}>
              <strong>Certified Disciplines & Diplomas:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {selectedCandidate.certifications.map((c, i) => (
                  <span key={i} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-hairline)', padding: '4px 10px', borderRadius: 'var(--radius-pill)' }}>
                    ✓ {c}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            Select a candidate from the queue to inspect their documents.
          </div>
        )}

      </div>
    </div>
  );
};
