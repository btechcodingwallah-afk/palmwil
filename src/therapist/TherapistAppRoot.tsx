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
import { TherapistBottomNav } from './components/TherapistBottomNav';
import { TherapistChatView } from './screens/TherapistChatView';
import { TherapistRegisterModal } from './screens/TherapistRegisterModal';
import { PartnerDiscoveryView } from './screens/PartnerDiscoveryView';
import { PartnerBookingsPreviewView } from './screens/PartnerBookingsPreviewView';
import { PartnerProfilePreviewView } from './screens/PartnerProfilePreviewView';
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

  // Gated access check for LOGGED IN practitioners: Unverified or Suspended practitioners see Verification Gate
  if (isTherapistLoggedIn && currentTherapist?.status !== 'Approved') {
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
        {/* =========================================================================
            1. UNAUTHENTICATED / GUEST PARTNER MODE:
            Never block with full-screen login card! Show app features, live job radar,
            perks, earnings simulator, comprehensive FAQs, and motivating CTAs.
            ========================================================================= */}
        {!isTherapistLoggedIn ? (
          therapistSubRoute === 'bookings' ? (
            <PartnerBookingsPreviewView />
          ) : therapistSubRoute === 'earnings' ? (
            <TherapistEarningsView />
          ) : therapistSubRoute === 'profile' ? (
            <PartnerProfilePreviewView />
          ) : (
            /* Default for 'dashboard' or 'faqs': Interactive Discovery, Live Radar, Simulator & FAQs */
            <PartnerDiscoveryView />
          )
        ) : (
          /* =========================================================================
             2. AUTHENTICATED / NORMAL OPERATIONAL MODE:
             Show normal operational dashboard, actual incoming jobs, real earnings,
             real client chat, and live Google Maps profile perimeter configuration.
             ========================================================================= */
          therapistSubRoute === 'daily-goal' ? (
            <DailyGoalGameView />
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
            /* Default: Sanctuary Operational Dashboard */
            <TherapistDashboardView
              onOpenBookingDetail={b => {
                setSelectedBookingIdForWorkflow(b.id);
                setTherapistSubRoute('bookings');
              }}
              onGoToEarnings={() => setTherapistSubRoute('earnings')}
            />
          )
        )}
      </main>

      {/* Luxury Fixed Bottom Navigation Bar */}
      <TherapistBottomNav />

      {/* Incoming Job Modal Popup with Audio/Visual Timer (Only active for logged-in practitioners) */}
      {isTherapistLoggedIn && incomingBookingModal && (
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
export default TherapistAppRoot;
