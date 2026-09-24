import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, ChevronRight, Star, 
  RotateCcw, ShieldCheck, X 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { Booking, BookingReview } from '../../types';

interface ClientBookingsViewProps {
  onTrackBooking: (bookingId: string) => void;
  onRebook: (booking: Booking) => void;
}

export const ClientBookingsView: React.FC<ClientBookingsViewProps> = ({
  onTrackBooking,
  onRebook
}) => {
  const { bookings, submitReview } = usePamwill();
  const [activeSegment, setActiveSegment] = useState<'Upcoming' | 'Past' | 'Cancelled'>('Upcoming');
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  // Review form state
  const [overallRating, setOverallRating] = useState(5);
  const [therapistRating, setTherapistRating] = useState(5);
  const [serviceQuality, setServiceQuality] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const upcomingBookings = bookings.filter(b => 
    b.status !== 'Service Completed' && b.status !== 'Cancelled'
  );
  const pastBookings = bookings.filter(b => b.status === 'Service Completed');
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled');

  const displayedList = 
    activeSegment === 'Upcoming' ? upcomingBookings :
    activeSegment === 'Past' ? pastBookings :
    cancelledBookings;

  const handleSaveReview = () => {
    if (!reviewBooking) return;
    submitReview(reviewBooking.id, {
      overallRating,
      therapistRating,
      serviceQuality,
      cleanliness,
      punctuality,
      comment: reviewComment,
      createdAt: 'Just now'
    });
    setReviewBooking(null);
  };

  const renderStarPicker = (val: number, setVal: (n: number) => void, label: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => setVal(star)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
          >
            <Star 
              size={16} 
              fill={star <= val ? 'var(--accent-gold)' : 'none'} 
              color={star <= val ? 'var(--accent-gold)' : 'var(--border-hairline)'} 
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <span className="eyebrow">Your Sanctuary Schedule</span>
        <h2 style={{ fontSize: '22px', margin: 0 }}>My Appointments</h2>
      </div>

      {/* Segmented Control */}
      <div style={{
        display: 'flex',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-pill)',
        padding: '4px',
        border: '1px solid var(--border-hairline)'
      }}>
        {(['Upcoming', 'Past', 'Cancelled'] as const).map(segment => (
          <button
            key={segment}
            onClick={() => setActiveSegment(segment)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: activeSegment === segment ? 'var(--bg-surface)' : 'transparent',
              color: activeSegment === segment ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: activeSegment === segment ? 600 : 500,
              boxShadow: activeSegment === segment ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
          >
            {segment} ({
              segment === 'Upcoming' ? upcomingBookings.length :
              segment === 'Past' ? pastBookings.length :
              cancelledBookings.length
            })
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {displayedList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <Calendar size={36} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
            <div style={{ fontSize: '14px', fontWeight: 600 }}>No {activeSegment.toLowerCase()} sessions</div>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Your reserved wellness ceremonies will appear here.</p>
          </div>
        ) : (
          displayedList.map(b => (
            <div key={b.id} className="card-luxury" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="eyebrow" style={{ fontSize: '10px' }}>#{b.id}</span>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      fontWeight: 600,
                      backgroundColor: 
                        b.status === 'Service Completed' ? 'var(--status-success-bg)' :
                        b.status === 'Cancelled' ? 'var(--status-error-bg)' :
                        'var(--accent-gold-light)',
                      color:
                        b.status === 'Service Completed' ? 'var(--status-success)' :
                        b.status === 'Cancelled' ? 'var(--status-error)' :
                        'var(--accent-gold-hover)'
                    }}>
                      {b.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginTop: '4px' }}>{b.service.name}</h3>
                </div>

                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{b.totalPaid}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={13} color="var(--accent-gold)" />
                  <span>{b.scheduledDate} at {b.scheduledTime} ({b.durationMin} Min)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={13} color="var(--accent-gold)" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {b.address}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                {b.status !== 'Service Completed' && b.status !== 'Cancelled' ? (
                  <button
                    onClick={() => onTrackBooking(b.id)}
                    className="btn-gold"
                    style={{ flex: 1, padding: '10px', fontSize: '12px', fontWeight: 700 }}
                  >
                    {b.status === 'Arrived' 
                      ? `🔐 Start OTP: ${b.startOtp || '4821'} • View Details →` 
                      : b.status === 'Service Started' 
                      ? (b.endOtp ? `🔐 Completion OTP: ${b.endOtp} →` : `★ Rate Session & Get End OTP →`)
                      : 'Live Status & GPS Tracking →'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onRebook(b)}
                      className="btn-secondary"
                      style={{ flex: 1, padding: '9px', fontSize: '12px' }}
                    >
                      <RotateCcw size={12} /> Rebook Session
                    </button>
                    {b.status === 'Service Completed' && (
                      <button
                        onClick={() => setReviewBooking(b)}
                        className="btn-primary"
                        style={{ flex: 1, padding: '9px', fontSize: '12px' }}
                      >
                        {b.review ? 'Review Given ★' : 'Leave Review'}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5-Star Breakdown Review Modal */}
      {reviewBooking && (
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
        onClick={() => setReviewBooking(null)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="eyebrow">Patron Feedback</span>
              <button onClick={() => setReviewBooking(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>Rate Your PamWill Experience</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {reviewBooking.service.name} with {reviewBooking.therapistName || 'Your Practitioner'}
            </p>

            <div style={{ marginBottom: '16px' }}>
              {renderStarPicker(overallRating, setOverallRating, 'Overall Bliss & Harmony')}
              {renderStarPicker(therapistRating, setTherapistRating, 'Therapist Touch & Technique')}
              {renderStarPicker(serviceQuality, setServiceQuality, 'Linen & Essential Oil Quality')}
              {renderStarPicker(cleanliness, setCleanliness, 'Sanitization & Hygiene Standard')}
              {renderStarPicker(punctuality, setPunctuality, 'Punctuality & Professionalism')}
            </div>

            <textarea
              rows={3}
              placeholder="Share your personal review or suggestions for our master therapists..."
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-hairline)',
                fontSize: '12px',
                marginBottom: '16px',
                outline: 'none',
                backgroundColor: 'var(--bg-primary)'
              }}
            />

            <button
              onClick={handleSaveReview}
              className="btn-gold"
              style={{ width: '100%' }}
            >
              Submit Verified Review
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
