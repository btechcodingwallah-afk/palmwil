import React from 'react';
import { 
  ShieldCheck, Award, Heart, Sparkles, MapPin, CheckCircle, ArrowLeft 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { COMPANY_INFO } from '../../config/env';

export const ClientAboutView: React.FC = () => {
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
          fontSize: '32px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0
        }}>
          About PamWill Sanctuary
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          India's Premier On-Demand Luxury Wellness & Clinical Physiotherapy Ecosystem.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '24px',
        border: '1px solid var(--border-hairline)',
        padding: '36px',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '32px',
        lineHeight: 1.7,
        color: 'var(--text-secondary)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(169, 129, 47, 0.15)',
          color: 'var(--accent-gold-light)',
          fontSize: '11px',
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: 'var(--radius-pill)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '16px'
        }}>
          <Sparkles size={13} /> The PamWill Philosophy
        </div>

        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: '0 0 16px 0',
          lineHeight: 1.3
        }}>
          Restoring Harmony in the Privacy of Your Sanctuary
        </h2>

        <p style={{ marginBottom: '16px' }}>
          PamWill was born out of a profound vision: to eliminate the dissonance of stressful city commutes to high-end spas and clinical recovery centers. By orchestrating five-star hotel spa rituals and doctor-supervised physiotherapy directly into private villas, luxury residences, and executive suites, PamWill transforms personal spaces into serene holistic sanctuaries.
        </p>

        <p style={{ margin: 0 }}>
          Every therapist, Ayurvedic master, and doctor in our network is meticulously vetted, verified, and continuously trained under international CIDESCO and IAP clinical rehabilitation protocols.
        </p>
      </div>

      {/* Pillars Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-hairline)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(169, 129, 47, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Award size={22} color="var(--accent-gold)" />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            CIDESCO & IAP Certified
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Every session is administered either by licensed MPT/BPT Doctors of Physiotherapy or master spa practitioners with an average of 6+ years of 5-star resort experience.
          </p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-hairline)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(76, 175, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <ShieldCheck size={22} color="var(--status-success)" />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            Gold Safety Standard
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Dual-OTP arrival & departure verification, complete background & police checks, and 24/7 SOS safety monitoring ensure absolute peace of mind for both patrons and practitioners.
          </p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-hairline)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(147, 51, 234, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Heart size={22} color="#9333EA" />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            Pure Botanical Apothecary
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            We formulate and source pure cold-pressed sesame, virgin coconut, and wild lavender essential oils from certified organic sanctuaries in Kerala and the Himalayas.
          </p>
        </div>
      </div>

      {/* Corporate Metadata Footer */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '16px',
        padding: '20px 24px',
        border: '1px solid var(--border-hairline)',
        fontSize: '12px',
        color: 'var(--text-muted)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div>
          <strong>{COMPANY_INFO.name}</strong> • Licensed Healthcare & Wellness Marketplace
        </div>
        <div>
          Contact: {COMPANY_INFO.phone} | {COMPANY_INFO.email}
        </div>
      </div>
    </div>
  );
};
