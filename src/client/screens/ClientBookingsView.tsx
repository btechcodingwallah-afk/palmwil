import React from 'react';
import { 
  Calendar, MapPin, User, Settings, KeyRound, Sparkles
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { Booking } from '../../types';

interface ClientBookingsViewProps {
  onTrackBooking: (bookingId: string) => void;
  onRebook: (booking: Booking) => void;
}

const STATUS_COLOR: Record<string, string> = {
  'Pending': '#9A8F82',
  'Accepted': '#A9812F',
  'On the Way': '#2563EB',
  'Arrived': '#A9812F',
  'Service Started': '#4C6B4F',
  'Service Completed': '#4C6B4F',
  'Cancelled': '#8C3A2B',
};

const STATUS_BG: Record<string, string> = {
  'Pending': '#F1ECE4',
  'Accepted': '#F7EEDD',
  'On the Way': '#EFF6FF',
  'Arrived': '#F7EEDD',
  'Service Started': '#EDF3EE',
  'Service Completed': '#EDF3EE',
  'Cancelled': '#F9EFEF',
};

export const ClientBookingsView: React.FC<ClientBookingsViewProps> = ({
  onTrackBooking,
  onRebook
}) => {
  const { bookings, user, setClientSubRoute } = usePamwill();

  const myBookings = [...bookings].sort((a, b) => 
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  return (
    <div className="client-bookings-container" style={{
      width: '100%',
      maxWidth: '100%',
      margin: '0 auto',
      padding: '24px 32px 40px',
      backgroundColor: '#FAF8F5',
      minHeight: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#1F1B16',
            margin: 0,
            fontFamily: 'var(--font-sans)',
            letterSpacing: '-0.5px'
          }}>
            My Bookings
          </h1>
          <div style={{ fontSize: '13px', color: '#9A8F82', marginTop: '4px', fontWeight: 500 }}>
            {myBookings.length} scheduled sanctuary sessions
          </div>
        </div>

        <button
          onClick={() => setClientSubRoute('profile')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#EBE5DC',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#6B6259'
          }}
          title="Account Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Bookings List */}
      {myBookings.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E4DDD2'
        }}>
          <Calendar size={48} color="#9A8F82" style={{ margin: '0 auto 12px auto' }} />
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#1F1B16' }}>No Bookings Yet</div>
          <p style={{ fontSize: '13px', color: '#6B6259', marginTop: '4px' }}>
            Book your first wellness session from the Home tab
          </p>
          <button
            onClick={() => setClientSubRoute('home')}
            style={{
              marginTop: '16px',
              backgroundColor: '#A9812F',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Explore Treatments
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 460px), 1fr))',
          gap: '16px',
          width: '100%'
        }}>
          {myBookings.map(booking => {
            const isActive = ['Accepted', 'On the Way', 'Arrived', 'Service Started'].includes(booking.status);

            return (
              <div
                key={booking.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E4DDD2',
                  padding: '16px',
                  boxShadow: '0 4px 16px rgba(31, 27, 22, 0.04)',
                  boxSizing: 'border-box'
                }}
              >
                {/* Top Row: Title, ID, Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, marginRight: '10px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#1F1B16' }}>
                      {booking.service?.name || 'Wellness Ceremony'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9A8F82', marginTop: '2px', fontWeight: 600 }}>
                      #{booking.id}
                    </div>
                  </div>

                  <span style={{
                    backgroundColor: STATUS_BG[booking.status] || '#F1ECE4',
                    color: STATUS_COLOR[booking.status] || '#1F1B16',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap'
                  }}>
                    {booking.status}
                  </span>
                </div>

                {/* OTP Pill if Arrived */}
                {booking.status === 'Arrived' && (
                  <div style={{
                    marginTop: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#F7EEDD',
                    color: '#A9812F',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800
                  }}>
                    <KeyRound size={13} />
                    <span>Start OTP: {booking.startOtp || '4821'}</span>
                  </div>
                )}

                {/* OTP Pill if Service Started */}
                {booking.status === 'Service Started' && (
                  <div style={{
                    marginTop: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#EDF3EE',
                    color: '#4C6B4F',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800
                  }}>
                    <Sparkles size={13} />
                    <span>Completion OTP: {booking.endOtp || '5770'}</span>
                  </div>
                )}

                {/* Divider Line */}
                <div style={{
                  height: '1px',
                  backgroundColor: '#F1ECE4',
                  margin: '12px 0'
                }} />

                {/* Details Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#6B6259' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={14} color="#9A8F82" style={{ flexShrink: 0 }} />
                    <span>{booking.therapistName || 'EduNiketan Pvt. Ltd.'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="#9A8F82" style={{ flexShrink: 0 }} />
                    <span>{booking.scheduledDate} • {booking.scheduledTime}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} color="#9A8F82" style={{ flexShrink: 0 }} />
                    <span style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {booking.address}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Price & Action */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '14px',
                  paddingTop: '10px',
                  borderTop: '1px solid #FAF8F5'
                }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>
                    ₹{booking.totalPaid}
                  </div>

                  {isActive ? (
                    <button
                      onClick={() => onTrackBooking(booking.id)}
                      style={{
                        backgroundColor: '#A9812F',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(169, 129, 47, 0.35)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}
                    >
                      Track Session →
                    </button>
                  ) : (
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#9A8F82' }}>
                      Session Closed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
