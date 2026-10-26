import React, { useState } from 'react';
import { 
  LayoutDashboard, Calendar, DollarSign, MessageSquare, 
  User, Bell, Shield, Trophy, ShoppingBag 
} from 'lucide-react';
import { usePamwill } from '../state/store';
import { TherapistWebHeader } from './components/TherapistWebHeader';
import { VerificationGateView } from './components/VerificationGateView';
import { IncomingJobModal } from './components/IncomingJobModal';
import { TherapistDashboardView } from './screens/TherapistDashboardView';
import { TherapistBookingsView } from './screens/TherapistBookingsView';
import { TherapistEarningsView } from './screens/TherapistEarningsView';
import { TherapistProfileView } from './screens/TherapistProfileView';
import { TherapistEditProfileView } from './screens/TherapistEditProfileView';
import { DailyGoalGameView } from './screens/DailyGoalGameView';
import { TherapistStoreView } from './screens/TherapistStoreView';
import { TherapistBottomNav } from './components/TherapistBottomNav';
import { TherapistChatView } from './screens/TherapistChatView';
import { TherapistRegisterModal } from './screens/TherapistRegisterModal';
import { TherapistAuthGatewayView } from './components/TherapistAuthGatewayView';
import { Booking } from '../types';

export const TherapistAppRoot: React.FC = () => {
  const { 
    currentTherapist, 
    setCurrentTherapistId, 
    setCurrentRole,
    therapistSubRoute,
    setTherapistSubRoute,
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
      <div style={{ minHeight: '100vh', width: '100%' }}>
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
    setTherapistSubRoute('bookings');
  };

  const handleDeclineJob = (bookingId: string) => {
    setIncomingBookingModal(null);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      position: 'relative'
    }}>
      
      {/* Responsive Therapist Portal Header */}
      <TherapistWebHeader />

      {/* Main Tab Screen Content */}
      <main style={{ flex: 1, position: 'relative', paddingBottom: '80px' }}>
        {therapistSubRoute === 'daily-goal' ? (
          <DailyGoalGameView />
        ) : therapistSubRoute === 'store' ? (
          <TherapistStoreView />
        ) : therapistSubRoute === 'edit-profile' ? (
          <TherapistEditProfileView />
        ) : therapistSubRoute === 'bookings' ? (
          <TherapistBookingsView
            selectedBooking={selectedBookingForWorkflow}
            onClearSelectedBooking={() => setSelectedBookingIdForWorkflow(null)}
          />
        ) : therapistSubRoute === 'earnings' ? (
          <TherapistEarningsView />
        ) : therapistSubRoute === 'chat' ? (
          <div style={{ maxWidth: '960px', margin: '16px auto', height: 'calc(100vh - 175px)', padding: '0 16px' }}>
            <TherapistChatView />
          </div>
        ) : therapistSubRoute === 'profile' ? (
          <TherapistProfileView />
        ) : (
          /* Default: Sanctuary Dashboard */
          <TherapistDashboardView
            onOpenBookingDetail={b => {
              setSelectedBookingIdForWorkflow(b.id);
              setTherapistSubRoute('bookings');
            }}
            onGoToEarnings={() => setTherapistSubRoute('earnings')}
          />
        )}
      </main>

      {/* Luxury Fixed Bottom Navigation Bar (Just like patient portal) */}
      <TherapistBottomNav />

      {/* Incoming Job Modal Popup with Audio/Visual Timer */}
      {incomingBookingModal && (
        <IncomingJobModal
          booking={incomingBookingModal}
          onAccept={handleAcceptJob}
          onDecline={handleDeclineJob}
        />
      )}

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
