import React, { useState } from 'react';
import { 
  Home, Calendar, MessageSquare, User, 
  X, Clock, ChevronRight, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { usePamwill } from '../state/store';
import { ClientHeader } from './components/ClientHeader';
import { ClientHomeView } from './screens/ClientHomeView';
import { ClientBookingsView } from './screens/ClientBookingsView';
import { ClientChatView } from './screens/ClientChatView';
import { ClientProfileView } from './screens/ClientProfileView';
import { BookingFlowModal } from './components/BookingFlowModal';
import { LiveBookingStatusView } from './components/LiveBookingStatusView';
import { MassageService, Booking } from '../types';

export const ClientAppRoot: React.FC = () => {
  const { 
    activeClientTab, 
    setActiveClientTab, 
    setCurrentRole,
    bookings,
    activeTrackingBookingId,
    setActiveTrackingBookingId,
    authModalOpen,
    setAuthModalOpen,
    authMode
  } = usePamwill();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDetailService, setSelectedDetailService] = useState<MassageService | null>(null);
  const [showLiveTracking, setShowLiveTracking] = useState(false);

  // Dynamically prioritize any active in-progress booking
  const inProgressJob = bookings.find(b => 
    ['Accepted', 'On the Way', 'Arrived', 'Service Started'].includes(b.status)
  );
  const activeTrackingBooking = (activeTrackingBookingId ? bookings.find(b => b.id === activeTrackingBookingId) : null) || inProgressJob || bookings[0];

  const handleStartBookingForService = (service: MassageService) => {
    setSelectedDetailService(null);
    setBookingModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
      
      {/* If Live Tracking is active, show the Live Booking Status view */}
      {showLiveTracking && activeTrackingBooking ? (
        <LiveBookingStatusView
          booking={activeTrackingBooking}
          onBack={() => setShowLiveTracking(false)}
          onOpenChat={() => {
            setShowLiveTracking(false);
            setActiveClientTab('chat');
          }}
        />
      ) : (
        <>
          {/* Header */}
          <ClientHeader />

          {/* Tab Screen Content */}
          <main style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative' }}>
            {activeClientTab === 'home' && (
              <ClientHomeView
                onSelectService={s => setSelectedDetailService(s)}
                onOpenBookingFlow={() => setBookingModalOpen(true)}
                onSwitchToTherapist={() => setCurrentRole('therapist')}
                onOpenLiveTracking={bookingId => {
                  setActiveTrackingBookingId(bookingId);
                  setShowLiveTracking(true);
                }}
              />
            )}

            {activeClientTab === 'bookings' && (
              <ClientBookingsView
                onTrackBooking={bookingId => {
                  setActiveTrackingBookingId(bookingId);
                  setShowLiveTracking(true);
                }}
                onRebook={b => {
                  setBookingModalOpen(true);
                }}
              />
            )}

            {activeClientTab === 'chat' && <ClientChatView />}
            {activeClientTab === 'profile' && <ClientProfileView />}
          </main>

          {/* Bottom 5-Tab Bar */}
          <nav className="phone-bottom-tabs">
            <button
              className={`tab-item ${activeClientTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveClientTab('home')}
            >
              <Home size={18} />
              <span>Home</span>
            </button>
            <button
              className={`tab-item ${activeClientTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveClientTab('bookings')}
            >
              <Calendar size={18} />
              <span>Bookings</span>
            </button>
            <button
              className={`tab-item ${activeClientTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveClientTab('chat')}
            >
              <MessageSquare size={18} />
              <span>Chat</span>
            </button>
            <button
              className={`tab-item ${activeClientTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveClientTab('profile')}
            >
              <User size={18} />
              <span>Profile</span>
            </button>
          </nav>
        </>
      )}

      {/* Service Detail Drawer / Modal */}
      {selectedDetailService && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(18, 16, 14, 0.65)',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}
        onClick={() => setSelectedDetailService(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-primary)',
              width: '100%',
              maxWidth: '430px',
              maxHeight: '90vh',
              borderRadius: '28px 28px 0 0',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-elevated)',
              position: 'relative'
            }}
          >
            {/* Full-bleed Service Image */}
            <div style={{ position: 'relative', height: '220px', width: '100%' }}>
              <img
                src={selectedDetailService.imageUrl}
                alt={selectedDetailService.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => setSelectedDetailService(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '16px',
                backgroundColor: 'var(--accent-gold)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 'var(--radius-pill)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                {selectedDetailService.category}
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '22px', margin: 0 }}>{selectedDetailService.name}</h2>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{Math.min(...Object.values(selectedDetailService.basePricePerDuration))}
                  </span>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>starting price</div>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                {selectedDetailService.description}
              </p>

              {/* Benefits Section */}
              <div style={{ marginBottom: '16px' }}>
                <span className="eyebrow" style={{ display: 'block', marginBottom: '6px' }}>Therapeutic Benefits</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {selectedDetailService.benefits.map((b, i) => (
                    <div key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--status-success)', fontWeight: 700 }}>✓</span> {b}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contraindications Warning */}
              {selectedDetailService.contraindications.length > 0 && (
                <div style={{
                  padding: '12px',
                  backgroundColor: 'var(--status-error-bg)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  border: '1px solid rgba(140, 58, 43, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-error)', marginBottom: '4px' }}>
                    <AlertCircle size={14} />
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                      Medical Contraindications
                    </span>
                  </div>
                  <ul style={{ fontSize: '11px', color: 'var(--status-error)', paddingLeft: '18px', margin: 0, lineHeight: 1.3 }}>
                    {selectedDetailService.contraindications.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Book Service CTA */}
              <button
                onClick={() => handleStartBookingForService(selectedDetailService)}
                className="btn-gold"
                style={{ width: '100%', padding: '14px', fontSize: '15px' }}
              >
                Book This Service Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6-Step Booking Stepper Modal */}
      {bookingModalOpen && (
        <BookingFlowModal
          initialService={selectedDetailService || undefined}
          onClose={() => setBookingModalOpen(false)}
          onSuccess={newBooking => {
            setBookingModalOpen(false);
            setActiveTrackingBookingId(newBooking.id);
            setShowLiveTracking(true);
          }}
        />
      )}

    </div>
  );
};
