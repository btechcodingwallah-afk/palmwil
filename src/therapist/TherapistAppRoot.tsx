import React, { useState } from 'react';
import { 
  LayoutDashboard, Calendar, DollarSign, MessageSquare, 
  User, Bell, Shield 
} from 'lucide-react';
import { usePamwill } from '../state/store';
import { VerificationGateView } from './components/VerificationGateView';
import { IncomingJobModal } from './components/IncomingJobModal';
import { TherapistDashboardView } from './screens/TherapistDashboardView';
import { TherapistBookingsView } from './screens/TherapistBookingsView';
import { TherapistEarningsView } from './screens/TherapistEarningsView';
import { TherapistProfileView } from './screens/TherapistProfileView';
import { ClientChatView } from '../client/screens/ClientChatView';
import { TherapistRegisterModal } from './screens/TherapistRegisterModal';
import { TherapistAuthGatewayView } from './components/TherapistAuthGatewayView';
import { Booking } from '../types';

export const TherapistAppRoot: React.FC = () => {
  const { 
    currentTherapist, 
    setCurrentTherapistId, 
    setCurrentRole,
    activeTherapistTab, 
    setActiveTherapistTab,
    incomingBookingModal,
    setIncomingBookingModal,
    updateBookingStatus,
    therapistRegisterModalOpen,
    setTherapistRegisterModalOpen,
    registerTherapist,
    isTherapistLoggedIn,
    logoutTherapist,
    setAuthTargetRole,
    setAuthMode,
    setAuthModalOpen,
    logout,
    bookings
  } = usePamwill();

  const [selectedBookingIdForWorkflow, setSelectedBookingIdForWorkflow] = useState<string | null>(null);

  // Derive the active job from live bookings state to avoid stale snapshots
  const selectedBookingForWorkflow = selectedBookingIdForWorkflow 
    ? bookings.find(b => b.id === selectedBookingIdForWorkflow) || null 
    : null;

  // If practitioner is not logged in, show dedicated Practitioner Gateway with Login, Sign Up, and 5-Step Onboarding
  if (!isTherapistLoggedIn) {
    return <TherapistAuthGatewayView />;
  }

  // Gated access check: Unverified or Suspended practitioners CANNOT access operational dashboard
  if (currentTherapist.status !== 'Approved') {
    return (
      <div style={{ height: '100%' }}>
        <VerificationGateView
          therapist={currentTherapist}
          onSwitchTherapist={id => setCurrentTherapistId(id)}
          onSwitchToAdmin={() => setCurrentRole('admin')}
          onOpenRegister={() => {
            setAuthTargetRole('therapist');
            setAuthMode('register');
            setAuthModalOpen(true);
          }}
        />

        <TherapistRegisterModal
          isOpen={therapistRegisterModalOpen}
          onClose={() => setTherapistRegisterModalOpen(false)}
          onRegistered={newT => {
            registerTherapist(newT);
            setTherapistRegisterModalOpen(false);
          }}
        />
      </div>
    );
  }

  const handleAcceptJob = (bookingId: string) => {
    updateBookingStatus(bookingId, 'Accepted');
    setIncomingBookingModal(null);
    setActiveTherapistTab('bookings');
  };

  const handleDeclineJob = (bookingId: string) => {
    setIncomingBookingModal(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
      
      {/* App Header */}
      <header style={{
        padding: '16px 20px 12px 20px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-hairline)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        position: 'relative',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/assets/pamwill-icon.png"
            alt="PamWill"
            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
          />
          <div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600 }}>
              Pamwill Provider
            </span>
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--accent-gold-hover)', marginLeft: '6px' }}>
              PRACTITIONER PORTAL
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              setAuthTargetRole('therapist');
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            style={{
              background: 'none',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-pill)',
              padding: '4px 8px',
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            Switch
          </button>
          <button
            onClick={logoutTherapist}
            style={{
              background: 'none',
              border: '1px solid rgba(140, 58, 43, 0.25)',
              borderRadius: 'var(--radius-pill)',
              padding: '4px 8px',
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--status-error)',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Bell size={15} color="var(--text-secondary)" />
          </div>
        </div>
      </header>

      {/* Main Tab Screen Content */}
      <main style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative' }}>
        {activeTherapistTab === 'dashboard' && (
          <TherapistDashboardView
            onOpenBookingDetail={b => {
              setSelectedBookingIdForWorkflow(b.id);
              setActiveTherapistTab('bookings');
            }}
            onGoToEarnings={() => setActiveTherapistTab('earnings')}
          />
        )}

        {activeTherapistTab === 'bookings' && (
          <TherapistBookingsView
            selectedBooking={selectedBookingForWorkflow}
            onClearSelectedBooking={() => setSelectedBookingIdForWorkflow(null)}
          />
        )}

        {activeTherapistTab === 'earnings' && <TherapistEarningsView />}
        {activeTherapistTab === 'chat' && <ClientChatView />}
        {activeTherapistTab === 'profile' && <TherapistProfileView />}
      </main>

      {/* Incoming Job Modal Popup with Audio/Visual Timer */}
      {incomingBookingModal && (
        <IncomingJobModal
          booking={incomingBookingModal}
          onAccept={handleAcceptJob}
          onDecline={handleDeclineJob}
        />
      )}

      {/* 5 Bottom Operational Navigation Tabs */}
      <nav className="phone-bottom-tabs">
        <button
          className={`tab-item ${activeTherapistTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTherapistTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>
        <button
          className={`tab-item ${activeTherapistTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTherapistTab('bookings')}
        >
          <Calendar size={18} />
          <span>Active Jobs</span>
        </button>
        <button
          className={`tab-item ${activeTherapistTab === 'earnings' ? 'active' : ''}`}
          onClick={() => setActiveTherapistTab('earnings')}
        >
          <DollarSign size={18} />
          <span>Earnings</span>
        </button>
        <button
          className={`tab-item ${activeTherapistTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTherapistTab('chat')}
        >
          <MessageSquare size={18} />
          <span>Chat</span>
        </button>
        <button
          className={`tab-item ${activeTherapistTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTherapistTab('profile')}
        >
          <User size={18} />
          <span>Profile</span>
        </button>
      </nav>

      {/* Practitioner Application Modal */}
      <TherapistRegisterModal
        isOpen={therapistRegisterModalOpen}
        onClose={() => setTherapistRegisterModalOpen(false)}
        onRegistered={newT => {
          registerTherapist(newT);
          setTherapistRegisterModalOpen(false);
        }}
      />

    </div>
  );
};
