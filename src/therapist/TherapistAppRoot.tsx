import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, DollarSign, MessageSquare, 
  User, Bell, Shield, Trophy, ShoppingBag, X 
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
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);

  // Derive the active job from live bookings state to avoid stale snapshots
  const selectedBookingForWorkflow = selectedBookingIdForWorkflow 
    ? bookings.find(b => b.id === selectedBookingIdForWorkflow) || null 
    : null;

  const isApproved = isTherapistLoggedIn && currentTherapist?.status === 'Approved';
  const isUnderReview = isTherapistLoggedIn && currentTherapist?.status !== 'Approved';

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    scrollToTop();
    const rafId = requestAnimationFrame(scrollToTop);
    const t = setTimeout(scrollToTop, 50);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t);
    };
  }, [therapistSubRoute]);

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
      <TherapistWebHeader onOpenVerificationModal={() => setShowVerificationModal(true)} />

      {/* Main Tab Screen Content */}
      <main style={{ flex: 1, position: 'relative', paddingBottom: '80px' }}>
        {/* =========================================================================
            1. EXPLORATION / GUEST / UNDER REVIEW PARTNER MODE:
            Never block with full-screen gate! Show app features, live job radar,
            perks, earnings simulator, comprehensive FAQs, and let the partner explore.
            ========================================================================= */}
        {!isApproved ? (
          therapistSubRoute === 'bookings' ? (
            <PartnerBookingsPreviewView onOpenVerificationModal={() => setShowVerificationModal(true)} />
          ) : therapistSubRoute === 'earnings' ? (
            <TherapistEarningsView />
          ) : therapistSubRoute === 'profile' ? (
            <PartnerProfilePreviewView onOpenVerificationModal={() => setShowVerificationModal(true)} />
          ) : (
            /* Default for 'dashboard' or 'faqs': Interactive Discovery, Live Radar, Simulator & FAQs */
            <PartnerDiscoveryView onOpenVerificationModal={() => setShowVerificationModal(true)} />
          )
        ) : (
          /* =========================================================================
             2. AUTHENTICATED / OPERATIONAL MODE FOR APPROVED PARTNERS:
             Show live dispatch dashboard, incoming jobs, real earnings,
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

      {/* Verification Details Modal for Practitioners Under Review */}
      {showVerificationModal && isUnderReview && currentTherapist && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowVerificationModal(false)}
        >
          <div 
            style={{
              maxWidth: '540px',
              width: '100%',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '24px',
              border: '1px solid rgba(212, 163, 89, 0.4)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVerificationModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#FAF8F5',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              title="Close and return to portal exploration"
            >
              <X size={18} />
            </button>

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
          </div>
        </div>
      )}

    </div>
  );
};
export default TherapistAppRoot;
