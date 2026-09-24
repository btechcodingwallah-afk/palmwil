import React, { useState, useEffect } from 'react';
import { 
  Phone, MessageSquare, AlertTriangle, ShieldCheck, 
  MapPin, Clock, CheckCircle2, ChevronRight, X, ExternalLink,
  Maximize2, Minimize2, Navigation, KeyRound, Sparkles, Star, Check 
} from 'lucide-react';
import { Booking, BookingStatus, BookingReview } from '../../types';
import { usePamwill } from '../../state/store';
import { PamwillMap } from '../../components/map/PamwillMap';

interface LiveBookingStatusViewProps {
  booking: Booking;
  onBack: () => void;
  onOpenChat: () => void;
}

export const LiveBookingStatusView: React.FC<LiveBookingStatusViewProps> = ({
  booking,
  onBack,
  onOpenChat
}) => {
  const { triggerSOS, dismissSOS, updateBookingStatus, therapists, submitClientRatingAndGenerateEndOtp, generateStartOtp } = usePamwill();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showIdModal, setShowIdModal] = useState(false);
  const [sosActive, setSosActive] = useState(booking.sosTriggered || false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [liveEta, setLiveEta] = useState<number>(booking.etaMinutes || 14);
  const [liveKm, setLiveKm] = useState<number>(2.4);

  // Rating and End OTP State
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [overallRating, setOverallRating] = useState(5);
  const [therapistRating, setTherapistRating] = useState(5);
  const [serviceQuality, setServiceQuality] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Ensure Start OTP is generated when therapist arrives
  useEffect(() => {
    if (booking.status === 'Arrived' && !booking.startOtp) {
      generateStartOtp(booking.id);
    }
  }, [booking.status, booking.startOtp, booking.id, generateStartOtp]);

  const resolvedCoords = (() => {
    if (booking.liveLocation?.latitude && booking.liveLocation?.longitude) {
      return {
        lat: booking.liveLocation.latitude,
        lng: booking.liveLocation.longitude,
        accuracy: booking.liveLocation.accuracy || 6,
        isLive: true
      };
    }
    const svcLoc = (booking.service as any)?.liveLocation;
    if (svcLoc?.latitude && svcLoc?.longitude) {
      return {
        lat: svcLoc.latitude,
        lng: svcLoc.longitude,
        accuracy: svcLoc.accuracy || 6,
        isLive: true
      };
    }
    if (typeof booking.address === 'string') {
      const match = booking.address.match(/(\d+(?:\.\d+)?)\s*°?\s*N[,\s]+(\d+(?:\.\d+)?)\s*°?\s*E/i);
      if (match) {
        return {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2]),
          accuracy: 6,
          isLive: true
        };
      }
    }
    return { lat: 28.4595, lng: 77.0945, accuracy: 6, isLive: false };
  })();

  const statuses: BookingStatus[] = [
    'Pending', 
    'Accepted', 
    'On the Way', 
    'Arrived', 
    'Service Started', 
    'Service Completed'
  ];

  const currentStatusIndex = statuses.indexOf(booking.status);

  const handleSosToggle = () => {
    if (!sosActive) {
      triggerSOS(booking.id);
      setSosActive(true);
    } else {
      dismissSOS(booking.id);
      setSosActive(false);
    }
  };

  const handleCancel = () => {
    updateBookingStatus(booking.id, 'Cancelled');
    setShowCancelModal(false);
    onBack();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      backgroundColor: 'var(--bg-primary)'
    }}>
      {/* Top Bar with SOS and Back */}
      <div style={{
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-hairline)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '14px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          ← Sanctuary
        </button>

        <div style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ fontSize: '10px' }}>Booking #{booking.id}</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {booking.service.name}
          </div>
        </div>

        {/* SOS Emergency Dispatch Button (Fixed high contrast terracotta) */}
        <button
          onClick={handleSosToggle}
          className="btn-sos"
          style={{
            backgroundColor: sosActive ? '#5c1b10' : 'var(--status-error)',
            animation: sosActive ? 'pulse-ring 1s infinite' : 'none'
          }}
        >
          <AlertTriangle size={14} color="#FFFFFF" />
          {sosActive ? 'SOS ACTIVE' : 'SOS'}
        </button>
      </div>

      {/* SOS Active Banner */}
      {sosActive && (
        <div style={{
          backgroundColor: 'var(--status-error)',
          color: '#FFFFFF',
          padding: '10px 20px',
          fontSize: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Emergency Alert Dispatched:</strong> Support & emergency contacts notified with real-time GPS.
          </div>
          <button 
            onClick={handleSosToggle} 
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
          >
            Stand Down
          </button>
        </div>
      )}

      {/* Real-time Interactive Luxury Leaflet GPS Map */}
      <div style={{
        position: 'relative',
        height: isMapExpanded ? '380px' : '220px',
        transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-hairline)'
      }}>
        <PamwillMap
          mode="tracking"
          height="100%"
          sanctuaryCoords={[
            resolvedCoords.lat,
            resolvedCoords.lng
          ]}
          sanctuaryAddress={booking.address}
          sanctuaryType={booking.locationType}
          therapistName={booking.therapistName || 'Pooja Sharma'}
          therapistPhoto={booking.therapistPhoto}
          therapistRating={booking.therapistRating || 4.96}
          bookingStatus={booking.status}
          accuracy={resolvedCoords.accuracy}
          onProgressUpdate={(remKm, etaMin) => {
            setLiveKm(remKm);
            setLiveEta(etaMin);
          }}
        />

        {/* Floating Controls: Expand/Collapse */}
        <button
          type="button"
          onClick={() => setIsMapExpanded(!isMapExpanded)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 400,
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            border: '1px solid var(--border-hairline)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          {isMapExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          {isMapExpanded ? 'Collapse' : 'Expand'}
        </button>

        {/* Floating Reassuring ETA Pill */}
        <div style={{
          position: 'absolute',
          bottom: '14px',
          left: '14px',
          zIndex: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--border-hairline)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-gold-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Clock size={16} color="var(--accent-gold-hover)" />
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              {booking.status === 'On the Way' ? 'Estimated Arrival' : 'Current Status'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {booking.status === 'On the Way' 
                ? `${liveEta} Mins (${liveKm.toFixed(1)} km)`
                : booking.status === 'Arrived' 
                ? 'Practitioner Arrived'
                : booking.status}
            </div>
          </div>
        </div>
      </div>

      {/* Main Status & Journey Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* 1. SESSION START OTP CARD (Active when Therapist Arrived) */}
        {booking.status === 'Arrived' && (
          <div className="card-luxury" style={{
            padding: '22px',
            background: 'linear-gradient(135deg, rgba(212, 163, 89, 0.18) 0%, rgba(31, 27, 22, 0.7) 100%)',
            border: '2px solid var(--accent-gold)',
            boxShadow: '0 8px 32px rgba(169, 129, 47, 0.3)',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--accent-gold-light)',
              color: 'var(--accent-gold-hover)',
              fontSize: '11px',
              fontWeight: 700,
              marginBottom: '10px'
            }}>
              <KeyRound size={13} /> PRACTITIONER AT YOUR LOCATION
            </div>

            <h3 style={{ fontSize: '18px', margin: '2px 0 6px 0', color: 'var(--text-primary)' }}>
              Session Start Security Code
            </h3>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
              Please share this <strong>4-digit OTP</strong> with <strong>{booking.therapistName || 'your practitioner'}</strong> to begin your sanctuary session:
            </p>

            {/* Glowing Digits */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '14px'
            }}>
              {(booking.startOtp || '4821').split('').map((digit, i) => (
                <div key={i} style={{
                  width: '54px',
                  height: '60px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '2px solid var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'var(--accent-gold-hover)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  letterSpacing: 0
                }}>
                  {digit}
                </div>
              ))}
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: 'var(--text-muted)'
            }}>
              <ShieldCheck size={14} color="var(--accent-gold)" />
              Practitioner must enter this code to commence therapy safely.
            </div>
          </div>
        )}

        {/* 2. SESSION IN PROGRESS & RATING / COMPLETION OTP CARD */}
        {booking.status === 'Service Started' && (
          <div className="card-luxury" style={{
            padding: '22px',
            background: 'linear-gradient(135deg, rgba(62, 123, 76, 0.15) 0%, rgba(31, 27, 22, 0.7) 100%)',
            border: '2px solid var(--status-success)',
            boxShadow: '0 8px 32px rgba(62, 123, 76, 0.25)',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--status-success-bg)',
              color: 'var(--status-success)',
              fontSize: '11px',
              fontWeight: 700,
              marginBottom: '10px'
            }}>
              <Sparkles size={13} /> CEREMONY IN PROGRESS
            </div>

            <h3 style={{ fontSize: '18px', margin: '2px 0 6px 0', color: 'var(--text-primary)' }}>
              Sanctuary Treatment Active
            </h3>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
              Your session with <strong>{booking.therapistName || 'your specialist'}</strong> is underway.
            </p>

            {/* If rating submitted: show Completion OTP */}
            {booking.review && booking.endOtp ? (
              <div style={{
                marginTop: '12px',
                padding: '16px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-hairline)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--status-success)',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                  <Star size={15} fill="var(--status-success)" />
                  Rating Recorded (★ {booking.review.overallRating}/5 Stars)!
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Please share this <strong>Completion OTP</strong> with your practitioner to safely seal your session:
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                  {booking.endOtp.split('').map((digit, i) => (
                    <div key={i} style={{
                      width: '52px',
                      height: '58px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '2px solid var(--status-success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '26px',
                      fontWeight: 800,
                      color: 'var(--status-success)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                      {digit}
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Doctor will enter this code to close the session and finalize billing.
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '12px' }}>
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="btn-gold"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '14px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(169, 129, 47, 0.4)'
                  }}
                >
                  <Star size={16} fill="#fff" /> End Session & Rate Practitioner
                </button>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Submitting your rating unlocks the Completion OTP required by the doctor to close the session.
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. SESSION COMPLETED SUMMARY */}
        {booking.status === 'Service Completed' && (
          <div className="card-luxury" style={{
            padding: '20px',
            backgroundColor: 'var(--status-success-bg)',
            border: '2px solid var(--status-success)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '4px' }}>✨</div>
            <h3 style={{ fontSize: '18px', color: 'var(--status-success)', margin: '4px 0' }}>
              Session Successfully Completed
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Thank you for trusting PamWill with your wellness ceremony.
            </p>
            {booking.review && (
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-gold-hover)' }}>
                ★ Your Rating: {booking.review.overallRating}/5 Stars
              </div>
            )}
          </div>
        )}

        {/* Status Stepper Progression */}
        <div className="card-luxury" style={{ padding: '18px' }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>Session Progression</span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
            {statuses.map((statusName, idx) => {
              const isCompleted = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              return (
                <div key={statusName} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isCurrent 
                      ? 'var(--accent-gold)' 
                      : isCompleted 
                        ? 'var(--status-success)' 
                        : 'var(--bg-secondary)',
                    border: isCurrent ? '2px solid var(--text-primary)' : '1px solid var(--border-hairline)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700
                  }}>
                    {isCompleted && !isCurrent ? '✓' : idx + 1}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: isCurrent ? 700 : isCompleted ? 600 : 400,
                      color: isCurrent ? 'var(--text-primary)' : isCompleted ? 'var(--text-secondary)' : 'var(--text-muted)'
                    }}>
                      {statusName}
                    </div>
                  </div>

                  {isCurrent && (
                    <span style={{
                      fontSize: '10px',
                      backgroundColor: 'var(--accent-gold-light)',
                      color: 'var(--accent-gold-hover)',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      letterSpacing: '0.04em'
                    }}>
                      ACTIVE
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Therapist Mini Card */}
        <div className="card-luxury" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <img 
              src={booking.therapistPhoto || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"}
              alt={booking.therapistName || "Therapist"}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-gold)' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600 }}>{booking.therapistName || 'Your Practitioner'}</h4>
                <ShieldCheck size={16} color="var(--status-success)" />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0' }}>
                CIDESCO Certified • 6 Years Exp.
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-gold)' }}>
                ★ {booking.therapistRating || 4.96} Rating (218 Sessions)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            <button
              onClick={() => setShowIdModal(true)}
              className="btn-secondary"
              style={{ flex: 1, padding: '10px', fontSize: '12px' }}
            >
              <ExternalLink size={13} /> View ID & Certs
            </button>
            <button
              onClick={onOpenChat}
              className="btn-primary"
              style={{ flex: 1, padding: '10px', fontSize: '12px' }}
            >
              <MessageSquare size={13} /> Chat with Specialist
            </button>
          </div>
        </div>

        {/* Sanctuary Address Card */}
        <div className="card-luxury" style={{ padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <MapPin size={20} color="var(--accent-gold)" />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Designated Destination ({booking.locationType})
              </div>
              {(booking.liveLocation || resolvedCoords.isLive) && (
                <span style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  backgroundColor: 'var(--status-success-bg)',
                  color: 'var(--status-success)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)'
                }}>
                  🛰️ LIVE GPS PINNED
                </span>
              )}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginTop: '2px' }}>
              {booking.address}
            </div>
            {(booking.liveLocation || resolvedCoords.isLive) && (
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Coordinates: {resolvedCoords.lat.toFixed(4)}° N, {resolvedCoords.lng.toFixed(4)}° E (±{resolvedCoords.accuracy}m)
              </div>
            )}
          </div>
        </div>

        {/* Cancellation Policy Trigger */}
        <div style={{ textAlign: 'center', margin: '8px 0 24px 0' }}>
          <button
            onClick={() => setShowCancelModal(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '12px',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Cancellation Policy & Refunds
          </button>
        </div>

      </div>

      {/* ID & Certification Modal */}
      {showIdModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(18, 16, 14, 0.7)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setShowIdModal(false)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '380px',
              width: '100%',
              padding: '24px',
              border: '1px solid var(--border-hairline)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="eyebrow">Trust & Compliance</span>
              <button onClick={() => setShowIdModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Verified Practitioner Identity</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Every PamWill therapist undergoes Aadhaar biometric verification and local police character clearance.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '10px', backgroundColor: 'var(--status-success-bg)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--status-success)' }}>
                <ShieldCheck size={16} /> Aadhaar Identity: Verified (•••• 8291)
              </div>
              <div style={{ padding: '10px', backgroundColor: 'var(--status-success-bg)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--status-success)' }}>
                <ShieldCheck size={16} /> Police Clearance: Valid & Clean Record
              </div>
              <div style={{ padding: '10px', backgroundColor: 'var(--status-success-bg)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--status-success)' }}>
                <ShieldCheck size={16} /> CIDESCO International Spa Therapy Certified
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Policy Modal */}
      {showCancelModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(18, 16, 14, 0.7)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setShowCancelModal(false)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '380px',
              width: '100%',
              padding: '24px',
              border: '1px solid var(--border-hairline)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="eyebrow" style={{ color: 'var(--status-error)' }}>Cancellation Terms</span>
              <button onClick={() => setShowCancelModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Cancel This Appointment?</h3>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div>• <strong>Before Acceptance:</strong> 100% full refund to original payment source.</div>
              <div>• <strong>Therapist On the Way:</strong> 80% refund (₹200 travel compensation allocated to therapist).</div>
              <div>• <strong>After Arrival / Session Started:</strong> No refund applicable.</div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowCancelModal(false)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                style={{
                  flex: 1,
                  backgroundColor: 'var(--status-error)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Cancel Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLIENT RATING & REVIEW MODAL */}
      {showRatingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(18, 16, 14, 0.78)',
          backdropFilter: 'blur(6px)',
          zIndex: 1250,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            maxWidth: '400px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            border: '1px solid var(--border-hairline)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowRatingModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px auto',
                border: '1px solid var(--accent-gold)'
              }}>
                <Star size={24} fill="var(--accent-gold-hover)" color="var(--accent-gold-hover)" />
              </div>

              <span className="eyebrow" style={{ color: 'var(--accent-gold-hover)' }}>Sanctuary Feedback</span>
              <h3 style={{ fontSize: '20px', margin: '4px 0 6px 0', color: 'var(--text-primary)' }}>
                Rate Your Treatment
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Please rate your session with <strong>{booking.therapistName || 'your specialist'}</strong>. Once saved, your <strong>Session Completion OTP</strong> will be displayed.
              </p>
            </div>

            {/* Overall Rating (Large Interactive Stars) */}
            <div style={{
              textAlign: 'center',
              padding: '14px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '18px',
              border: '1px solid var(--border-hairline)'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                OVERALL EXPERIENCE
              </span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'transform 0.1s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1.0)')}
                  >
                    <Star
                      size={28}
                      fill={star <= overallRating ? 'var(--accent-gold)' : 'none'}
                      color={star <= overallRating ? 'var(--accent-gold)' : 'var(--text-muted)'}
                    />
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-gold-hover)', marginTop: '6px' }}>
                {overallRating === 5 ? '★★★★★ Exceptional Sanctuary' :
                 overallRating === 4 ? '★★★★☆ Very Good' :
                 overallRating === 3 ? '★★★☆☆ Average' :
                 overallRating === 2 ? '★★☆☆☆ Needs Improvement' : '★☆☆☆☆ Poor'}
              </div>
            </div>

            {/* Category Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {[
                { label: 'Therapist Skill & Technique', val: therapistRating, setVal: setTherapistRating },
                { label: 'Hygiene & Clean Linens', val: cleanliness, setVal: setCleanliness },
                { label: 'Punctuality & Respect', val: punctuality, setVal: setPunctuality },
              ].map(cat => (
                <div key={cat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{cat.label}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => cat.setVal(s)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                      >
                        <Star
                          size={16}
                          fill={s <= cat.val ? 'var(--accent-gold)' : 'none'}
                          color={s <= cat.val ? 'var(--accent-gold)' : 'var(--border-hairline)'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Written Comments */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                COMMENTS & APPRECIATION (OPTIONAL)
              </label>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Share thoughts about the restorative atmosphere, pressure, or therapist..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-hairline)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'none'
                }}
              />
            </div>

            <button
              onClick={() => {
                const newReview: BookingReview = {
                  overallRating,
                  therapistRating,
                  serviceQuality,
                  cleanliness,
                  punctuality,
                  comment: reviewComment || 'Wonderful sanctuary ceremony.',
                  createdAt: new Date().toISOString()
                };
                submitClientRatingAndGenerateEndOtp(booking.id, newReview);
                setShowRatingModal(false);
              }}
              className="btn-gold"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(169, 129, 47, 0.4)'
              }}
            >
              <Check size={16} /> Save Rating & Reveal Completion OTP
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
