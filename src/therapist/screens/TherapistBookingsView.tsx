import React, { useState } from 'react';
import { 
  Navigation, CheckCircle2, Phone, MapPin, Clock, 
  Calendar, Shield, Play, CheckCheck, AlertCircle, 
  KeyRound, Sparkles, X, Check, DollarSign, Star 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { Booking, BookingStatus } from '../../types';
import { PamwillMap } from '../../components/map/PamwillMap';

interface TherapistBookingsViewProps {
  selectedBooking?: Booking | null;
  onClearSelectedBooking?: () => void;
}

export const TherapistBookingsView: React.FC<TherapistBookingsViewProps> = ({
  selectedBooking,
  onClearSelectedBooking
}) => {
  const { bookings, updateBookingStatus, currentTherapist, verifyStartOtp, verifyEndOtp, setActiveTherapistTab } = usePamwill();
  const [activeSubTab, setActiveSubTab] = useState<'Active' | 'Calendar'>('Active');

  // OTP Verification Modals State
  const [startOtpModalOpen, setStartOtpModalOpen] = useState(false);
  const [enteredStartOtp, setEnteredStartOtp] = useState('');
  const [startOtpError, setStartOtpError] = useState<string | null>(null);

  const [endOtpModalOpen, setEndOtpModalOpen] = useState(false);
  const [enteredEndOtp, setEnteredEndOtp] = useState('');
  const [endOtpError, setEndOtpError] = useState<string | null>(null);

  const [celebrationModalOpen, setCelebrationModalOpen] = useState(false);
  const [completedPayoutAmt, setCompletedPayoutAmt] = useState(0);

  // Working hours calendar state
  const [workingDays, setWorkingDays] = useState({
    Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false
  });

  const myBookings = bookings.filter(b => b.therapistId === currentTherapist.id || !b.therapistId);
  const liveSelected = selectedBooking ? bookings.find(b => b.id === selectedBooking.id) : null;
  const currentActiveJob = liveSelected || myBookings.find(b => 
    b.status === 'Accepted' || b.status === 'On the Way' || b.status === 'Arrived' || b.status === 'Service Started'
  ) || selectedBooking || myBookings[0];

  const handleNextStatus = (booking: Booking) => {
    if (booking.status === 'Pending' || booking.status === 'Accepted') {
      updateBookingStatus(booking.id, 'On the Way');
    } else if (booking.status === 'On the Way') {
      updateBookingStatus(booking.id, 'Arrived');
    } else if (booking.status === 'Arrived') {
      setEnteredStartOtp('');
      setStartOtpError(null);
      setStartOtpModalOpen(true);
    } else if (booking.status === 'Service Started') {
      setEnteredEndOtp('');
      setEndOtpError(null);
      setEndOtpModalOpen(true);
    }
  };

  const handleVerifyStartOtp = () => {
    if (!currentActiveJob) return;
    if (!enteredStartOtp.trim()) {
      setStartOtpError('Please enter the 4-digit code shown on the client screen.');
      return;
    }
    const res = verifyStartOtp(currentActiveJob.id, enteredStartOtp.trim());
    if (res.success) {
      setStartOtpModalOpen(false);
      setEnteredStartOtp('');
      setStartOtpError(null);
    } else {
      setStartOtpError(res.error || 'Invalid start OTP.');
    }
  };

  const handleVerifyEndOtp = () => {
    if (!currentActiveJob) return;
    if (!enteredEndOtp.trim()) {
      setEndOtpError('Please enter the 4-digit Completion OTP from the client.');
      return;
    }
    const res = verifyEndOtp(currentActiveJob.id, enteredEndOtp.trim());
    if (res.success) {
      const payout = currentActiveJob.therapistPayout;
      setCompletedPayoutAmt(payout);
      setEndOtpModalOpen(false);
      setEnteredEndOtp('');
      setEndOtpError(null);
      setCelebrationModalOpen(true);
    } else {
      setEndOtpError(res.error || 'Invalid completion OTP.');
    }
  };

  const getNextActionLabel = (status: BookingStatus) => {
    switch (status) {
      case 'Pending':
      case 'Accepted':
        return { label: 'Start Traveling (Mark On the Way)', icon: Navigation };
      case 'On the Way':
        return { label: 'I Have Arrived at Location', icon: MapPin };
      case 'Arrived':
        return { label: 'Start Session (Enter Client Start OTP)', icon: Play };
      case 'Service Started':
        return { label: 'End Session (Verify Client Completion OTP)', icon: CheckCheck };
      default:
        return { label: 'Session Completed', icon: CheckCircle2 };
    }
  };

  const resolveBookingCoords = (job: Booking) => {
    if (job.liveLocation?.latitude && job.liveLocation?.longitude) {
      return {
        lat: job.liveLocation.latitude,
        lng: job.liveLocation.longitude,
        accuracy: job.liveLocation.accuracy || 6,
        isLive: true
      };
    }
    const svcLoc = (job.service as any)?.liveLocation;
    if (svcLoc?.latitude && svcLoc?.longitude) {
      return {
        lat: svcLoc.latitude,
        lng: svcLoc.longitude,
        accuracy: svcLoc.accuracy || 6,
        isLive: true
      };
    }
    if (typeof job.address === 'string') {
      const match = job.address.match(/(\d+(?:\.\d+)?)\s*°?\s*N[,\s]+(\d+(?:\.\d+)?)\s*°?\s*E/i);
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
  };

  const action = currentActiveJob ? getNextActionLabel(currentActiveJob.status) : null;
  const activeJobCoords = currentActiveJob ? resolveBookingCoords(currentActiveJob) : { lat: 28.4595, lng: 77.0945, accuracy: 6, isLive: false };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      
      {/* Sub Tabs */}
      <div style={{
        display: 'flex',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-pill)',
        padding: '4px',
        border: '1px solid var(--border-hairline)'
      }}>
        <button
          onClick={() => setActiveSubTab('Active')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: activeSubTab === 'Active' ? 'var(--bg-surface)' : 'transparent',
            color: activeSubTab === 'Active' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Active Job Workflow
        </button>
        <button
          onClick={() => setActiveSubTab('Calendar')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: activeSubTab === 'Calendar' ? 'var(--bg-surface)' : 'transparent',
            color: activeSubTab === 'Calendar' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Availability Calendar
        </button>
      </div>

      {activeSubTab === 'Active' ? (
        currentActiveJob ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Active Job Card */}
            <div className="card-luxury" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span className="eyebrow" style={{ fontSize: '10px' }}>Booking #{currentActiveJob.id}</span>
                  <h3 style={{ fontSize: '18px', margin: '2px 0' }}>{currentActiveJob.service.name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    🕒 {currentActiveJob.durationMin} Min • {currentActiveJob.scheduledDate} at {currentActiveJob.scheduledTime}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-gold-hover)' }}>
                    ₹{currentActiveJob.therapistPayout}
                  </span>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Net Payout</div>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--accent-gold-light)',
                color: 'var(--accent-gold-hover)',
                fontSize: '11px',
                fontWeight: 700,
                marginBottom: '14px'
              }}>
                <span>Status: {currentActiveJob.status.toUpperCase()}</span>
              </div>

              {/* Client & Destination Details */}
              <div style={{
                padding: '12px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>Client:</strong> {currentActiveJob.customerName}
                  </div>
                  <a
                    href={`tel:${currentActiveJob.customerPhone}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--accent-gold-hover)',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    <Phone size={13} /> Call Patron
                  </a>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>Address ({currentActiveJob.locationType}):</strong>
                    {(currentActiveJob.liveLocation || activeJobCoords.isLive) && (
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        backgroundColor: 'var(--status-success-bg)',
                        color: 'var(--status-success)',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-pill)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        🛰️ LIVE GPS ATTACHED
                      </span>
                    )}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {currentActiveJob.address}
                  </div>
                  {(() => {
                    const destLat = activeJobCoords.lat;
                    const destLng = activeJobCoords.lng;
                    const accuracy = activeJobCoords.accuracy;
                    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;

                    return (
                      <>
                        {/* GPS Coordinates Badge */}
                        <div style={{
                          marginTop: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          backgroundColor: 'var(--status-success-bg)',
                          border: '1px solid var(--status-success)',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600 }}>
                            GPS: {destLat.toFixed(4)}° N, {destLng.toFixed(4)}° E (±{accuracy}m)
                          </div>
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(mapsUrl, '_blank', 'noopener,noreferrer');
                            }}
                            style={{
                              fontSize: '11px',
                              color: 'var(--accent-gold-hover)',
                              fontWeight: 700,
                              textDecoration: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Navigate in Maps ↗
                          </a>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {currentActiveJob.specialNotes && (
                  <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '6px', color: 'var(--accent-gold-hover)' }}>
                    <strong>Special Client Instructions:</strong> "{currentActiveJob.specialNotes}"
                  </div>
                )}
              </div>

              {/* Turn-by-Turn Navigation Preview — Tap to open directions */}
              {(() => {
                const destLat = activeJobCoords.lat;
                const destLng = activeJobCoords.lng;
                const accuracy = activeJobCoords.accuracy;
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;

                const handleOpenDirections = (e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(mapsUrl, '_blank', 'noopener,noreferrer');
                };

                return (
                  <>
                    {/* Live Route Map Preview */}
                    <div style={{
                      height: '165px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      position: 'relative',
                      border: '1px solid var(--border-hairline)',
                      marginTop: '14px',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <PamwillMap
                        mode="preview"
                        height="100%"
                        sanctuaryCoords={[destLat, destLng]}
                        sanctuaryAddress={currentActiveJob.address}
                        sanctuaryType={currentActiveJob.locationType}
                        therapistCoords={
                          currentTherapist.currentLocation 
                            ? [currentTherapist.currentLocation.latitude, currentTherapist.currentLocation.longitude] 
                            : undefined
                        }
                        therapistName={currentTherapist.fullName}
                        therapistPhoto={currentTherapist.photoUrl}
                        bookingStatus={currentActiveJob.status}
                        accuracy={accuracy}
                      />

                      <button
                        type="button"
                        onClick={handleOpenDirections}
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          zIndex: 400,
                          backgroundColor: 'var(--accent-gold)',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <Navigation size={12} /> Live Turn-by-Turn ↗
                      </button>
                    </div>

                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleOpenDirections}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '12px',
                        marginTop: '10px',
                        backgroundColor: '#1a73e8',
                        color: '#ffffff',
                        borderRadius: 'var(--radius-md)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 10px rgba(26, 115, 232, 0.3)',
                        transition: 'background-color 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1557b0'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1a73e8'; }}
                    >
                      <Navigation size={16} /> Open Directions in Google Maps ↗
                    </a>
                  </>
                );
              })()}

              {/* Primary Operational Action Button (Large 48px+ tap target) */}
              {action && currentActiveJob.status !== 'Service Completed' && (
                <button
                  onClick={() => handleNextStatus(currentActiveJob)}
                  className="btn-gold"
                  style={{
                    width: '100%',
                    minHeight: '52px',
                    fontSize: '15px',
                    fontWeight: 700,
                    marginTop: '16px',
                    boxShadow: '0 4px 16px rgba(169, 129, 47, 0.4)'
                  }}
                >
                  <action.icon size={18} /> {action.label}
                </button>
              )}

              {currentActiveJob.status === 'Service Completed' && (
                <div style={{
                  marginTop: '16px',
                  padding: '14px',
                  backgroundColor: 'var(--status-success-bg)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--status-success)',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '13px'
                }}>
                  ✓ Session Fully Completed! Payout credited to your wallet balance.
                </div>
              )}
            </div>

          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={36} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
            <h3 style={{ fontSize: '16px' }}>No Active Job Right Now</h3>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              Ensure your status is set to <strong>Online</strong> on the dashboard to receive incoming requests.
            </p>
          </div>
        )
      ) : (
        /* Availability Calendar View */
        <div className="card-luxury" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '17px', marginBottom: '6px' }}>Working Schedule & Hours</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Configure days you are open to accept on-demand bookings in your serviceable districts.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {Object.entries(workingDays).map(([day, active]) => (
              <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-primary)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{day}</span>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={e => setWorkingDays({ ...workingDays, [day]: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-gold)' }}
                />
              </div>
            ))}
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              DAILY OPERATING WINDOW
            </label>
            <input
              type="text"
              value={currentTherapist.workingHours}
              readOnly
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-hairline)',
                fontSize: '13px',
                backgroundColor: 'var(--bg-secondary)'
              }}
            />
          </div>
        </div>
      )}

      {/* START OTP VERIFICATION MODAL */}
      {startOtpModalOpen && currentActiveJob && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(18, 16, 14, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '380px',
            width: '100%',
            padding: '24px',
            border: '1px solid var(--border-hairline)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            <button
              onClick={() => { setStartOtpModalOpen(false); setStartOtpError(null); }}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <KeyRound size={16} color="var(--accent-gold-hover)" />
              </div>
              <span className="eyebrow" style={{ margin: 0 }}>Arrival Verification</span>
            </div>

            <h3 style={{ fontSize: '18px', margin: '4px 0 8px 0', color: 'var(--text-primary)' }}>
              Start Sanctuary Session
            </h3>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Please ask <strong>{currentActiveJob.customerName}</strong> for the <strong>4-digit Session Start OTP</strong> displayed on their PamWill app screen.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                ENTER 4-DIGIT START OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={enteredStartOtp}
                onChange={e => {
                  setEnteredStartOtp(e.target.value.replace(/\D/g, ''));
                  setStartOtpError(null);
                }}
                placeholder="e.g. 4821"
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '22px',
                  fontWeight: 700,
                  letterSpacing: '8px',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-md)',
                  border: startOtpError ? '2px solid var(--status-error)' : '1px solid var(--border-hairline)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {startOtpError && (
              <div style={{
                padding: '10px 12px',
                backgroundColor: 'rgba(217, 83, 79, 0.15)',
                border: '1px solid var(--status-error)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--status-error)',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{startOtpError}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setStartOtpModalOpen(false); setStartOtpError(null); }}
                className="btn-secondary"
                style={{ flex: 1, padding: '12px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyStartOtp}
                className="btn-gold"
                style={{ flex: 1.5, padding: '12px', fontSize: '13px', fontWeight: 700 }}
              >
                Verify & Begin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* END OTP & COMPLETION VERIFICATION MODAL */}
      {endOtpModalOpen && currentActiveJob && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(18, 16, 14, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '390px',
            width: '100%',
            padding: '24px',
            border: '1px solid var(--border-hairline)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            <button
              onClick={() => { setEndOtpModalOpen(false); setEndOtpError(null); }}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCheck size={16} color="var(--accent-gold-hover)" />
              </div>
              <span className="eyebrow" style={{ margin: 0 }}>Session Seal & Payout</span>
            </div>

            <h3 style={{ fontSize: '18px', margin: '4px 0 8px 0', color: 'var(--text-primary)' }}>
              Complete Sanctuary Session
            </h3>

            {/* Client Review Status Banner */}
            {currentActiveJob.review ? (
              <div style={{
                padding: '10px 12px',
                backgroundColor: 'var(--status-success-bg)',
                border: '1px solid var(--status-success)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '14px',
                fontSize: '12px',
                color: 'var(--status-success)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Star size={15} fill="var(--status-success)" />
                <span>Client submitted rating (★ {currentActiveJob.review.overallRating}/5)! Completion OTP generated.</span>
              </div>
            ) : (
              <div style={{
                padding: '10px 12px',
                backgroundColor: 'rgba(212, 163, 89, 0.12)',
                border: '1px solid var(--accent-gold)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '14px',
                fontSize: '12px',
                color: 'var(--accent-gold-hover)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Clock size={15} style={{ flexShrink: 0 }} />
                <span>Client is prompted to rate this session first on their screen. Once submitted, their app displays the OTP.</span>
              </div>
            )}

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Enter the <strong>4-digit Completion OTP</strong> provided by <strong>{currentActiveJob.customerName}</strong> to finalize the booking and release your <strong>₹{currentActiveJob.therapistPayout}</strong> earnings into your wallet.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                CLIENT COMPLETION OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={enteredEndOtp}
                onChange={e => {
                  setEnteredEndOtp(e.target.value.replace(/\D/g, ''));
                  setEndOtpError(null);
                }}
                placeholder="e.g. 7392"
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '22px',
                  fontWeight: 700,
                  letterSpacing: '8px',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-md)',
                  border: endOtpError ? '2px solid var(--status-error)' : '1px solid var(--border-hairline)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {endOtpError && (
              <div style={{
                padding: '10px 12px',
                backgroundColor: 'rgba(217, 83, 79, 0.15)',
                border: '1px solid var(--status-error)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--status-error)',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{endOtpError}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setEndOtpModalOpen(false); setEndOtpError(null); }}
                className="btn-secondary"
                style={{ flex: 1, padding: '12px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyEndOtp}
                className="btn-gold"
                style={{ flex: 1.5, padding: '12px', fontSize: '13px', fontWeight: 700 }}
              >
                Verify & Credit Payout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SESSION COMPLETED CELEBRATION & PAYOUT MODAL */}
      {celebrationModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(18, 16, 14, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            maxWidth: '380px',
            width: '100%',
            padding: '28px 24px',
            border: '2px solid var(--accent-gold)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              border: '2px solid var(--accent-gold)'
            }}>
              <Sparkles size={32} color="var(--accent-gold-hover)" />
            </div>

            <span className="eyebrow" style={{ color: 'var(--accent-gold-hover)' }}>Ceremony Complete</span>
            <h2 style={{ fontSize: '22px', margin: '4px 0 8px 0', color: 'var(--text-primary)' }}>
              Session Sealed!
            </h2>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              The client OTP has been validated and the session has concluded with full luxury protocol.
            </p>

            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-hairline)',
              marginBottom: '22px'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Credited to Virtual Wallet
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--status-success)', margin: '4px 0' }}>
                +₹{completedPayoutAmt}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Total Wallet Balance: <span style={{ color: 'var(--text-primary)' }}>₹{currentTherapist.walletBalance}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setCelebrationModalOpen(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: '12px', fontSize: '13px' }}
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setCelebrationModalOpen(false);
                  setActiveTherapistTab('earnings');
                }}
                className="btn-gold"
                style={{ flex: 1.2, padding: '12px', fontSize: '13px', fontWeight: 700 }}
              >
                View Earnings ↗
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
