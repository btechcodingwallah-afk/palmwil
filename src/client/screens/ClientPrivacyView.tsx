import React from 'react';
import { 
  ShieldCheck, Lock, FileText, AlertTriangle, ArrowLeft 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { COMPANY_INFO } from '../../config/env';

export const ClientPrivacyView: React.FC = () => {
  const { setClientSubRoute } = usePamwill();

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setClientSubRoute('profile')}
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
            padding: 0,
            marginBottom: '6px'
          }}
        >
          <ArrowLeft size={15} /> Back to Profile
        </button>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '30px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0
        }}>
          Legal Terms, Privacy & Safety Protocols
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Last updated: October 2026 • Compliant with Indian Digital Data Protection (DPDP) Act.
        </p>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '24px',
        border: '1px solid var(--border-hairline)',
        padding: '36px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        lineHeight: 1.7,
        color: 'var(--text-secondary)',
        fontSize: '14px'
      }}>
        
        {/* Section 1 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            <Lock size={18} color="var(--accent-gold)" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
              1. Patron Privacy & Data Confidentiality
            </h2>
          </div>
          <p>
            At PamWill, we treat your home address, health disclosures, and treatment session logs with sovereign medical confidentiality. We do not sell, license, or monetize your private contact data to third-party advertising networks. Your precise residential coordinates are only revealed to your designated therapist upon booking confirmation and are encrypted end-to-end.
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            <FileText size={18} color="var(--accent-gold)" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
              2. Cancellation, Rescheduling & Refund Terms
            </h2>
          </div>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li><strong>Complimentary Rescheduling:</strong> Free unlimited rescheduling up to 2 hours before the scheduled practitioner arrival window.</li>
            <li><strong>Late Cancellation:</strong> Cancellations made within 2 hours of arrival window incur a ₹300 convenience fee to reimburse the traveling practitioner's fuel and transit time.</li>
            <li><strong>Refund Turnaround:</strong> Prepaid online amounts via Razorpay/UPI are refunded to the original payment source within 2-4 business banking days.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            <AlertTriangle size={18} color="var(--status-error)" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
              3. Medical Contraindications & Health Disclosures
            </h2>
          </div>
          <p>
            Patrons are strictly required to declare any underlying cardiovascular conditions, recent bone fractures, high-risk pregnancies, contagious dermal conditions, or deep vein thrombosis (DVT) prior to treatment commencement. PamWill certified therapists reserve the ethical right to modify or withhold contraindicated deep tissue maneuvers in the interest of patron health.
          </p>
        </div>

        {/* Section 4 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            <ShieldCheck size={18} color="var(--status-success)" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
              4. Zero-Tolerance Code of Conduct
            </h2>
          </div>
          <p>
            PamWill operates strictly as a certified therapeutic wellness and healthcare ecosystem. Any form of harassment, solicitation, or disrespect toward our practitioners will result in immediate session termination without refund, permanent platform blacklisting, and reporting to relevant civil law enforcement authorities.
          </p>
        </div>

        <div style={{
          paddingTop: '20px',
          borderTop: '1px solid var(--border-hairline)',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          For legal inquiries, grievance redressal, or data erasure requests, please contact our Legal Counsel at <strong>{COMPANY_INFO.email}</strong>.
        </div>
      </div>
    </div>
  );
};
