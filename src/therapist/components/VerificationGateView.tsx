import React from 'react';
import { ShieldAlert, Clock, CheckCircle2, AlertOctagon, FileText, ArrowRight } from 'lucide-react';
import { Therapist } from '../../types';
import { usePamwill } from '../../state/store';

interface VerificationGateViewProps {
  therapist: Therapist;
  onSwitchTherapist: (id: string) => void;
  onSwitchToAdmin: () => void;
  onOpenRegister?: () => void;
}

export const VerificationGateView: React.FC<VerificationGateViewProps> = ({
  therapist
}) => {
  const { logoutTherapist } = usePamwill();

  return (
    <div style={{
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '100%',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: therapist.status === 'Suspended' ? 'var(--status-error-bg)' : 'var(--accent-gold-light)',
          margin: '0 auto 16px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid var(--border-hairline)'
        }}>
          {therapist.status === 'Suspended' ? (
            <AlertOctagon size={36} color="var(--status-error)" />
          ) : (
            <Clock size={36} color="var(--accent-gold)" />
          )}
        </div>

        <span className="eyebrow">Trust & Compliance Gate</span>
        <h2 style={{ fontSize: '24px', margin: '6px 0' }}>
          {therapist.status === 'Under Review' && "Application Under Review"}
          {therapist.status === 'Pending' && "Awaiting Verification"}
          {therapist.status === 'Suspended' && "Practitioner Account Suspended"}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '320px', margin: '0 auto', lineHeight: 1.4 }}>
          {therapist.status === 'Under Review' && 
            "Our compliance desk is currently cross-verifying your Aadhaar biometric records and CIDESCO massage diploma. Expected turnaround: 4-6 business hours."}
          {therapist.status === 'Pending' && 
            "Your submitted documents are in queue. You will receive an SMS and WhatsApp notification upon approval."}
          {therapist.status === 'Suspended' && 
            "Your account has been temporarily restricted pending safety review. Please contact practitioner support."}
        </p>
      </div>

      {/* Uploaded Documents Status Checklist */}
      <div className="card-luxury" style={{ padding: '18px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>Submitted Credentials ({therapist.fullName})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {therapist.documents.map(doc => (
            <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} color="var(--accent-gold)" />
                <span style={{ fontWeight: 500 }}>{doc.title}</span>
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: doc.verificationStatus === 'verified' ? 'var(--status-success-bg)' : 'var(--accent-gold-light)',
                color: doc.verificationStatus === 'verified' ? 'var(--status-success)' : 'var(--accent-gold-hover)'
              }}>
                {doc.verificationStatus.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Launch-Ready Concierge Support & Sign Out */}
      <div style={{
        padding: '18px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-hairline)',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Verification Status: In Queue
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
          Our credentialing team verifies government identity within 12–24 business hours. You will receive an SMS confirmation once approved.
        </p>
        <button
          onClick={logoutTherapist}
          style={{
            background: 'none',
            border: '1px solid var(--border-hairline)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 16px',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Sign Out of Practitioner Portal
        </button>
      </div>
    </div>
  );
};
