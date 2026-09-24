import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Check, X, Shield, Sparkles } from 'lucide-react';
import { Booking } from '../../types';

interface IncomingJobModalProps {
  booking: Booking;
  onAccept: (bookingId: string) => void;
  onDecline: (bookingId: string) => void;
}

export const IncomingJobModal: React.FC<IncomingJobModalProps> = ({
  booking,
  onAccept,
  onDecline
}) => {
  const [secondsLeft, setSecondsLeft] = useState(45);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onDecline(booking.id);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, booking.id, onDecline]);

  // General area only before acceptance for safety (e.g. "Golf Course Road, Sector 42")
  const generalizedArea = booking.address.split(',').slice(-2).join(', ').trim() || booking.city;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(18, 16, 14, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 1200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '380px',
        padding: '24px',
        border: '2px solid var(--accent-gold)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        position: 'relative',
        animation: 'slideUp 250ms ease'
      }}>
        {/* Countdown Timer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: 'var(--accent-gold-light)',
            color: 'var(--accent-gold-hover)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            letterSpacing: '0.08em'
          }}>
            NEW APPOINTMENT REQUEST
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '13px',
            fontWeight: 700,
            color: secondsLeft < 15 ? 'var(--status-error)' : 'var(--text-primary)'
          }}>
            <Clock size={15} />
            <span>00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}</span>
          </div>
        </div>

        {/* Payout Highlight */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '16px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-hairline)',
          marginBottom: '18px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Your Net Payout (80%)
          </span>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent-gold-hover)', margin: '2px 0' }}>
            ₹{booking.therapistPayout}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Customer Paid: ₹{booking.totalPaid} • Direct UPI Settlement
          </div>
        </div>

        {/* Service Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
          <div>
            <h3 style={{ fontSize: '18px', margin: 0 }}>{booking.service.name}</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              🕒 {booking.durationMin} Min Session • {booking.scheduledDate} at {booking.scheduledTime}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)'
          }}>
            <MapPin size={16} color="var(--accent-gold)" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>GENERAL DESTINATION</span>
                {booking.liveLocation && (
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    backgroundColor: 'var(--status-success-bg)',
                    color: 'var(--status-success)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-pill)'
                  }}>
                    🛰️ LIVE GPS ATTACHED
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                {generalizedArea} ({booking.locationType})
              </div>
            </div>
          </div>

          {booking.addOns.length > 0 && (
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              <strong>Included Add-ons:</strong> {booking.addOns.map(a => a.name).join(', ')}
            </div>
          )}

          {booking.specialNotes && (
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', backgroundColor: 'var(--accent-gold-light)', padding: '6px 10px', borderRadius: '4px' }}>
              <strong>Note:</strong> "{booking.specialNotes}"
            </div>
          )}
        </div>

        {/* Action Buttons with 48px+ tap targets */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onDecline(booking.id)}
            style={{
              flex: 1,
              minHeight: '52px',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <X size={18} /> Decline
          </button>

          <button
            onClick={() => onAccept(booking.id)}
            className="btn-gold"
            style={{
              flex: 2,
              minHeight: '52px',
              fontSize: '15px',
              fontWeight: 700,
              boxShadow: '0 4px 16px rgba(169, 129, 47, 0.4)'
            }}
          >
            <Check size={18} /> Accept Job
          </button>
        </div>
      </div>
    </div>
  );
};
