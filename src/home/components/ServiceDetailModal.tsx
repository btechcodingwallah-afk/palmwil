import React from 'react';
import { MassageService } from '../../types';
import { X, Clock, Check, Sparkles, AlertCircle, ShieldCheck, ArrowRight, Smartphone, MessageSquare } from 'lucide-react';

interface ServiceDetailModalProps {
  service: MassageService | null;
  onClose: () => void;
  onBookService: (service: MassageService) => void;
  onOpenAppDownload?: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookService,
  onOpenAppDownload
}) => {
  if (!service) return null;

  const defaultDuration = service.durationOptionsMin[0] || 60;
  const startingPrice = service.basePricePerDuration[defaultDuration] || 1699;

  const handleAppLaunch = () => {
    onClose();
    if (onOpenAppDownload) {
      onOpenAppDownload();
    } else {
      onBookService(service);
    }
  };

  const handleInquire = () => {
    onClose();
    onBookService(service);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'var(--surface)',
        color: 'var(--text)',
        borderRadius: '20px',
        border: '1px solid var(--border-gold)',
        boxShadow: 'var(--card-shadow), 0 25px 70px rgba(0,0,0,0.6)',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close details"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(0, 0, 0, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* Hero Image */}
        <div style={{ position: 'relative', width: '100%', height: '260px', overflow: 'hidden' }}>
          <img
            src={service.imageUrl}
            alt={service.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, var(--surface) 0%, transparent 60%)'
          }} />

          {/* Category Badge */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '24px',
            backgroundColor: 'var(--pill-bg)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--pill-border)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--pill-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            {service.category}
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px 28px 32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '28px',
                fontWeight: 600,
                color: 'var(--text)',
                margin: '0 0 6px',
                letterSpacing: '-0.02em'
              }}>
                {service.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <Clock size={15} color="var(--cta)" />
                <span>Available durations: {service.durationOptionsMin.map(d => `${d} min`).join(', ')}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                Starting From
              </div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '26px',
                fontWeight: 700,
                color: 'var(--cta)'
              }}>
                ₹{startingPrice.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Description */}
          <p style={{
            fontSize: '14.5px',
            lineHeight: 1.6,
            color: 'var(--text)',
            margin: '0 0 20px',
            opacity: 0.9
          }}>
            {service.description}
          </p>

          {/* What to Expect */}
          <div style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-hairline)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cta)', marginBottom: '10px' }}>
              Every Ritual Includes
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} color="var(--cta)" /> Ergonomic Heated Massage Bed
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} color="var(--cta)" /> Single-Use Medical-Grade Linens
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} color="var(--cta)" /> Heated Volcanic Basalt Stones
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} color="var(--cta)" /> 100% Organic Botanical Extracts
              </div>
            </div>
          </div>

          {/* App-Booking Requirement Advisory */}
          <div style={{
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--border-gold)',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <Smartphone size={20} color="var(--cta)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '2px' }}>
                Booking Exclusively on PamWill App
              </strong>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.45, display: 'block' }}>
                To ensure authenticated therapist arrival, real-time GPS tracking, and dual-OTP security, massage appointments are scheduled exclusively via our mobile application.
              </span>
            </div>
          </div>

          {/* Therapist Notes & Contraindications */}
          {service.contraindications && service.contraindications.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              backgroundColor: 'rgba(194, 137, 41, 0.1)',
              border: '1px solid rgba(194, 137, 41, 0.25)',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '12.5px',
              color: 'var(--text)',
              marginBottom: '24px'
            }}>
              <AlertCircle size={16} color="var(--cta)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Therapist Advisory:</strong> Please inform therapist if experiencing {service.contraindications.join(', ')}.
              </div>
            </div>
          )}

          {/* Action Bar: Book on App OR Inquire */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <button
              onClick={handleAppLaunch}
              style={{
                backgroundColor: 'var(--cta)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '12px 22px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(198, 165, 103, 0.35)',
                transition: 'all 160ms ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--cta-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--cta)')}
            >
              <Smartphone size={16} /> Book Ritual on App
            </button>

            <button
              onClick={handleInquire}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text)',
                border: '1px solid var(--border-hairline)',
                borderRadius: 'var(--radius-pill)',
                padding: '12px 20px',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 160ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--cta)';
                e.currentTarget.style.color = 'var(--cta)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hairline)';
                e.currentTarget.style.color = 'var(--text)';
              }}
            >
              <MessageSquare size={15} /> Inquire with Concierge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal;
