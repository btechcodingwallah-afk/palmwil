import React, { useState } from 'react';
import { 
  Power, TrendingUp, DollarSign, Award, Clock, 
  MapPin, CheckCircle, ChevronRight, Bell, AlertCircle, ArrowUpRight 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { Booking } from '../../types';

interface TherapistDashboardViewProps {
  onOpenBookingDetail: (booking: Booking) => void;
  onGoToEarnings: () => void;
}

export const TherapistDashboardView: React.FC<TherapistDashboardViewProps> = ({
  onOpenBookingDetail,
  onGoToEarnings
}) => {
  const { 
    currentTherapist, 
    toggleTherapistOnline, 
    bookings,
    payoutRequests,
    requestPayout
  } = usePamwill();

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawUpi, setWithdrawUpi] = useState<string>(currentTherapist.upiId || 'pooja.wellness@okaxis');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter therapist's bookings
  const myUpcomingBookings = bookings.filter(b => 
    (b.therapistId === currentTherapist.id || !b.therapistId) && 
    b.status !== 'Service Completed' && 
    b.status !== 'Cancelled'
  );

  const activeJob = myUpcomingBookings.find(b => 
    b.status === 'Accepted' || b.status === 'On the Way' || b.status === 'Arrived' || b.status === 'Service Started'
  );

  // Real Completed Bookings for this therapist
  const myCompletedBookings = bookings.filter(b => 
    b.therapistId === currentTherapist.id && 
    b.status === 'Service Completed'
  );

  const now = new Date();
  const isToday = (dateStr?: string) => {
    if (!dateStr) return false;
    if (dateStr === 'Today') return true;
    const d = new Date(dateStr);
    return !isNaN(d.getTime()) && d.toDateString() === now.toDateString();
  };
  const isWithinDays = (dateStr?: string, days: number = 7) => {
    if (!dateStr) return false;
    if (dateStr === 'Today') return true;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    return (now.getTime() - d.getTime()) <= days * 86400000;
  };

  const todayBookings = myCompletedBookings.filter(b => isToday(b.createdAt || b.scheduledDate));
  const weekBookings = myCompletedBookings.filter(b => isWithinDays(b.createdAt, 7));
  const monthBookings = myCompletedBookings.filter(b => isWithinDays(b.createdAt, 30));

  const earningsToday = todayBookings.reduce((sum, b) => sum + (b.therapistPayout || 0), 0);
  const earningsWeek = weekBookings.reduce((sum, b) => sum + (b.therapistPayout || 0), 0);
  const earningsMonth = monthBookings.reduce((sum, b) => sum + (b.therapistPayout || 0), 0);

  // Real Payout Requests for this therapist
  const myPayouts = payoutRequests.filter(p => p.therapistId === currentTherapist.id);
  const pendingPayouts = myPayouts.filter(p => p.status === 'Pending');
  const pendingPayoutAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);
  const latestPaidPayout = myPayouts.find(p => p.status === 'Paid');

  const openWithdrawModal = () => {
    setWithdrawAmount(currentTherapist.walletBalance > 0 ? currentTherapist.walletBalance.toString() : '500');
    setWithdrawUpi(currentTherapist.upiId || 'pooja.wellness@okaxis');
    setWithdrawError(null);
    setWithdrawSuccessMsg(null);
    setWithdrawModalOpen(true);
  };

  const handleWithdrawal = async () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setWithdrawError('Please enter a valid amount greater than ₹0');
      return;
    }
    if (!withdrawUpi.trim() || !withdrawUpi.includes('@')) {
      setWithdrawError('Please enter a valid UPI VPA (e.g. name@upi or name@okaxis)');
      return;
    }

    setIsSubmitting(true);
    setWithdrawError(null);
    try {
      await requestPayout(currentTherapist.id, amt, withdrawUpi.trim());
      setWithdrawSuccessMsg(`✓ Payout request for ₹${amt} submitted to Admin! Direct UPI transfer will be disbursed shortly.`);
      setTimeout(() => {
        setWithdrawModalOpen(false);
        setWithdrawSuccessMsg(null);
      }, 2000);
    } catch (e) {
      setWithdrawError('Failed to submit payout request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Bar: Practitioner Info & Identity Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={currentTherapist.photoUrl}
            alt={currentTherapist.fullName}
            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-gold)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h2 style={{ fontSize: '17px', margin: 0 }}>{currentTherapist.fullName}</h2>
              <span style={{
                fontSize: '9px',
                fontWeight: 700,
                backgroundColor: 'var(--status-success-bg)',
                color: 'var(--status-success)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                APPROVED
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
              ★ {currentTherapist.rating} ({myCompletedBookings.length} completed sessions)
            </p>
          </div>
        </div>
      </div>

      {/* Pending Payout Alert Banner (If Any) */}
      {pendingPayouts.length > 0 && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(217, 119, 6, 0.1)',
          border: '1px solid #d97706',
          color: '#b45309',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px'
        }}>
          <div>
            <strong>⏳ Payout in Progress:</strong> ₹{pendingPayoutAmount} requested via UPI ({currentTherapist.upiId})
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Admin has been notified with your dynamic UPI QR code for direct bank settlement.
            </div>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-pill)', backgroundColor: '#fef3c7', color: '#92400e' }}>
            Pending Transfer
          </span>
        </div>
      )}

      {/* Latest Settled Payout Success Badge */}
      {latestPaidPayout && pendingPayouts.length === 0 && (
        <div style={{
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--status-success-bg)',
          border: '1px solid var(--status-success)',
          color: 'var(--status-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px'
        }}>
          <div>
            ✓ <strong>Last Payout Settled:</strong> ₹{latestPaidPayout.amount} deposited to {latestPaidPayout.upiId}
            {latestPaidPayout.transactionRef && (
              <span style={{ fontSize: '11px', opacity: 0.85, marginLeft: '6px' }}>
                (Ref: {latestPaidPayout.transactionRef})
              </span>
            )}
          </div>
          <span style={{ fontSize: '10px', fontWeight: 700 }}>PAID</span>
        </div>
      )}

      {/* Primary Master Online/Offline Switch */}
      <div style={{
        padding: '16px 20px',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: currentTherapist.isOnline ? 'var(--status-success-bg)' : 'var(--bg-secondary)',
        border: currentTherapist.isOnline ? '1px solid var(--status-success)' : '1px solid var(--border-hairline)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 200ms ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: currentTherapist.isOnline ? 'var(--status-success)' : 'var(--text-muted)'
          }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {currentTherapist.isOnline ? "Online & Ready for Jobs" : "Offline / On Break"}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {currentTherapist.isOnline ? "You are receiving on-demand requests in your city" : "Switch online to receive new appointments"}
            </div>
          </div>
        </div>

        <button
          onClick={() => toggleTherapistOnline(currentTherapist.id)}
          style={{
            minHeight: '48px',
            minWidth: '88px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: currentTherapist.isOnline ? 'var(--status-success)' : 'var(--text-primary)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Power size={15} />
          {currentTherapist.isOnline ? "ONLINE" : "GO ONLINE"}
        </button>
      </div>

      {/* Active In-Progress Job Card (If Any) */}
      {activeJob && (
        <div style={{
          padding: '18px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--accent-gold-light)',
          border: '2px solid var(--accent-gold)',
          boxShadow: 'var(--shadow-elevated)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              backgroundColor: 'var(--accent-gold-hover)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              letterSpacing: '0.06em'
            }}>
              ACTIVE APPOINTMENT IN PROGRESS
            </span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              ₹{activeJob.therapistPayout} Net
            </span>
          </div>

          <h3 style={{ fontSize: '17px', margin: '4px 0' }}>{activeJob.service.name}</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
            Client: {activeJob.customerName} • {activeJob.scheduledDate} at {activeJob.scheduledTime}
          </p>

          <button
            onClick={() => onOpenBookingDetail(activeJob)}
            className="btn-gold"
            style={{ width: '100%', minHeight: '48px', fontSize: '14px' }}
          >
            Manage Active Session ({activeJob.status}) →
          </button>
        </div>
      )}

      {/* Real Earnings Overview Stat Cards (Calculated from actual completed bookings) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span className="eyebrow">Real-Time Revenue & Settlements</span>
          <button
            onClick={onGoToEarnings}
            style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            Detailed Ledger →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div className="card-luxury" style={{ padding: '14px 10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Today</span>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0' }}>
              ₹{earningsToday.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '10px', color: todayBookings.length > 0 ? 'var(--status-success)' : 'var(--text-muted)', fontWeight: 600 }}>
              {todayBookings.length} {todayBookings.length === 1 ? 'Session' : 'Sessions'}
            </span>
          </div>

          <div className="card-luxury" style={{ padding: '14px 10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>This Week</span>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0' }}>
              ₹{earningsWeek.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '10px', color: weekBookings.length > 0 ? 'var(--status-success)' : 'var(--text-muted)', fontWeight: 600 }}>
              {weekBookings.length} {weekBookings.length === 1 ? 'Session' : 'Sessions'}
            </span>
          </div>

          <div className="card-luxury" style={{ padding: '14px 10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>This Month</span>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-gold-hover)', margin: '4px 0' }}>
              ₹{earningsMonth.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 600 }}>
              {monthBookings.length} {monthBookings.length === 1 ? 'Session' : 'Sessions'}
            </span>
          </div>
        </div>
      </div>

      {/* Wallet Balance & Withdrawal CTA */}
      <div style={{
        padding: '18px 20px',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--text-primary)',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontSize: '11px', color: '#D9D1C5', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Available Payout Balance
          </span>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--accent-gold-light)', margin: '2px 0' }}>
            ₹{currentTherapist.walletBalance.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#B0A89C' }}>
            Linked UPI: {currentTherapist.upiId || 'Not Linked'}
          </div>
        </div>

        <button
          onClick={openWithdrawModal}
          className="btn-gold"
          style={{ minHeight: '48px', padding: '10px 18px', fontSize: '13px' }}
        >
          Request Payout
        </button>
      </div>

      {/* Upcoming Jobs Schedule */}
      <div>
        <span className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Upcoming Schedule</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {myUpcomingBookings.length === 0 ? (
            <div className="card-luxury" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '13px', margin: 0 }}>No upcoming appointments right now.</p>
              <p style={{ fontSize: '11px', margin: '4px 0 0 0' }}>Ensure your toggle is ONLINE to receive incoming bookings.</p>
            </div>
          ) : (
            myUpcomingBookings.slice(0, 3).map(b => (
              <div
                key={b.id}
                onClick={() => onOpenBookingDetail(b)}
                className="card-luxury"
                style={{ padding: '14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-gold)' }}>#{b.id}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>• {b.scheduledDate} at {b.scheduledTime}</span>
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '2px 0' }}>{b.service.name}</h4>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    📍 {b.city} ({b.durationMin} Min)
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{b.therapistPayout}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
                    Open <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Functional Dynamic Withdrawal Modal */}
      {withdrawModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(18, 16, 14, 0.7)',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => !isSubmitting && setWithdrawModalOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '400px',
              width: '100%',
              padding: '24px',
              border: '1px solid var(--border-hairline)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
            }}
          >
            <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>Request Instant Payout</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Available Wallet Balance: <strong style={{ color: 'var(--accent-gold-hover)' }}>₹{currentTherapist.walletBalance}</strong>
            </p>

            {withdrawError && (
              <div style={{ padding: '10px 12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', borderRadius: 'var(--radius-sm)', fontSize: '12px', marginBottom: '12px', fontWeight: 500 }}>
                {withdrawError}
              </div>
            )}

            {withdrawSuccessMsg ? (
              <div style={{ padding: '16px', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '13px', fontWeight: 600, lineHeight: 1.5 }}>
                {withdrawSuccessMsg}
              </div>
            ) : (
              <>
                {/* Amount Input */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    PAYOUT AMOUNT (₹)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '16px', fontWeight: 700, color: 'var(--text-muted)' }}>₹</span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      placeholder="e.g. 1000"
                      min="1"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 28px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-hairline)',
                        backgroundColor: 'var(--bg-secondary)',
                        fontSize: '15px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Preset quick chips */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                    {currentTherapist.walletBalance > 0 && (
                      <button
                        type="button"
                        onClick={() => setWithdrawAmount(currentTherapist.walletBalance.toString())}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-hairline)',
                          backgroundColor: 'var(--bg-secondary)',
                          fontSize: '10px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          color: 'var(--accent-gold-hover)'
                        }}
                      >
                        All (₹{currentTherapist.walletBalance})
                      </button>
                    )}
                    {['500', '1000', '2000'].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setWithdrawAmount(val)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-hairline)',
                          backgroundColor: 'var(--bg-secondary)',
                          fontSize: '10px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipient & UPI VPA */}
                <div style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  fontSize: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div><strong>Recipient Doctor:</strong> {currentTherapist.fullName}</div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                      SETTLEMENT UPI VPA:
                    </label>
                    <input
                      type="text"
                      value={withdrawUpi}
                      onChange={e => setWithdrawUpi(e.target.value)}
                      placeholder="e.g. mobile@upi or name@okaxis"
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-hairline)',
                        backgroundColor: 'var(--bg-surface)',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    <strong>Platform Settlement Fee:</strong> ₹0 (Complimentary Instant Transfer)
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setWithdrawModalOpen(false)}
                    disabled={isSubmitting}
                    className="btn-secondary"
                    style={{ flex: 1, minHeight: '48px' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdrawal}
                    disabled={isSubmitting}
                    className="btn-gold"
                    style={{ flex: 1.3, minHeight: '48px', fontWeight: 700 }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Confirm Transfer'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
