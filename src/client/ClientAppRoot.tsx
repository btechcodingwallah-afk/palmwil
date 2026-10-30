import React, { useState, useEffect } from 'react';
import { 
  Home, Calendar, MessageSquare, User, ShoppingBag, 
  X, Clock, ChevronRight, ChevronLeft, ShieldCheck, AlertCircle, Sparkles 
} from 'lucide-react';
import { usePamwill } from '../state/store';
import { ClientWebHeader } from './components/ClientWebHeader';
import { ClientHomeView } from './screens/ClientHomeView';
import { ClientBookingsView } from './screens/ClientBookingsView';
import { ClientChatView } from './screens/ClientChatView';
import { ClientProfileView } from './screens/ClientProfileView';
import { ClientStoreView } from './screens/ClientStoreView';
import { ClientCartView } from './screens/ClientCartView';
import { ClientCheckoutView } from './screens/ClientCheckoutView';
import { ClientOrdersView } from './screens/ClientOrdersView';
import { ClientMembershipView } from './screens/ClientMembershipView';
import { ClientPamCoinView } from './screens/ClientPamCoinView';
import { ClientVouchersView } from './screens/ClientVouchersView';
import { ClientAddressesView } from './screens/ClientAddressesView';
import { ClientSupportView } from './screens/ClientSupportView';
import { ClientFeedbackView } from './screens/ClientFeedbackView';
import { ClientAboutView } from './screens/ClientAboutView';
import { ClientPrivacyView } from './screens/ClientPrivacyView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { BookingFlowModal } from './components/BookingFlowModal';
import { LiveBookingStatusView } from './components/LiveBookingStatusView';
import { ClientBottomNav } from './components/ClientBottomNav';
import { MassageService, Booking, Product } from '../types';

export const ClientAppRoot: React.FC = () => {
  const { 
    clientSubRoute,
    setClientSubRoute,
    setCurrentRole,
    bookings,
    activeTrackingBookingId,
    setActiveTrackingBookingId,
    deviceFrame
  } = usePamwill();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDetailService, setSelectedDetailService] = useState<MassageService | null>(null);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);

  // Dynamically prioritize any active in-progress booking
  const inProgressJob = bookings.find(b => 
    ['Accepted', 'On the Way', 'Arrived', 'Service Started'].includes(b.status)
  );
  const activeTrackingBooking = (activeTrackingBookingId ? bookings.find(b => b.id === activeTrackingBookingId) : null) || inProgressJob || bookings[0];

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
  }, [clientSubRoute]);

  const handleStartBookingForService = (service: MassageService) => {
    setSelectedDetailService(service);
    setBookingModalOpen(true);
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
      
      {/* Responsive Client Header with Navigation, City Selector, and Cart Icon */}
      <ClientWebHeader onOpenBookingFlow={() => setBookingModalOpen(true)} />

      {/* Main Content Area with padding for bottom navigation */}
      <main className="client-main-content" style={{ flex: 1, position: 'relative' }}>
        
        {/* Back navigation for profile subroutes */}
        {['membership', 'pamcoin', 'vouchers', 'orders', 'addresses', 'support', 'feedback', 'about', 'privacy'].includes(clientSubRoute) && (
          <div style={{
            width: '100%',
            maxWidth: '100%',
            margin: '0 auto',
            padding: '14px 32px 0 32px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setClientSubRoute('profile')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: '#A9812F',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <ChevronLeft size={16} /> Back to Patron Profile
            </button>
          </div>
        )}

        {/* Live Session Tracking */}
        {clientSubRoute === 'tracking' && activeTrackingBooking ? (
          <LiveBookingStatusView
            booking={activeTrackingBooking}
            onBack={() => setClientSubRoute('bookings')}
            onOpenChat={() => setClientSubRoute('chat')}
          />
        ) : clientSubRoute === 'store' ? (
          <ClientStoreView onOpenProductDetail={p => setSelectedDetailProduct(p)} />
        ) : clientSubRoute === 'cart' ? (
          <ClientCartView />
        ) : clientSubRoute === 'checkout' ? (
          <ClientCheckoutView />
        ) : clientSubRoute === 'orders' ? (
          <ClientOrdersView />
        ) : clientSubRoute === 'membership' ? (
          <ClientMembershipView />
        ) : clientSubRoute === 'pamcoin' ? (
          <ClientPamCoinView />
        ) : clientSubRoute === 'vouchers' ? (
          <ClientVouchersView />
        ) : clientSubRoute === 'addresses' ? (
          <ClientAddressesView />
        ) : clientSubRoute === 'support' ? (
          <ClientSupportView />
        ) : clientSubRoute === 'feedback' ? (
          <ClientFeedbackView />
        ) : clientSubRoute === 'about' ? (
          <ClientAboutView />
        ) : clientSubRoute === 'privacy' ? (
          <ClientPrivacyView />
        ) : clientSubRoute === 'bookings' ? (
          <ClientBookingsView
            onTrackBooking={bookingId => {
              setActiveTrackingBookingId(bookingId);
              setClientSubRoute('tracking');
            }}
            onRebook={b => {
              setSelectedDetailService(b.service);
              setBookingModalOpen(true);
            }}
          />
        ) : clientSubRoute === 'chat' ? (
          <div style={{ maxWidth: '960px', margin: '16px auto', height: 'calc(100vh - 175px)', padding: '0 16px' }}>
            <ClientChatView />
          </div>
        ) : clientSubRoute === 'profile' ? (
          <ClientProfileView />
        ) : (
          /* Default: Treatment Catalog & Home */
          <ClientHomeView
            onSelectService={s => setSelectedDetailService(s)}
            onOpenBookingFlow={() => setBookingModalOpen(true)}
            onSwitchToTherapist={() => setCurrentRole('therapist')}
            onOpenLiveTracking={bookingId => {
              setActiveTrackingBookingId(bookingId);
              setClientSubRoute('tracking');
            }}
          />
        )}
      </main>

      {/* Service Detail Drawer / Modal */}
      {selectedDetailService && !bookingModalOpen && clientSubRoute !== 'tracking' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(18, 16, 14, 0.75)',
          backdropFilter: 'blur(10px)',
          zIndex: 2050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setSelectedDetailService(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              width: '100%',
              maxWidth: '540px',
              maxHeight: '90vh',
              borderRadius: '24px',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-elevated)',
              position: 'relative'
            }}
          >
            {/* Full-bleed Service Image */}
            <div style={{ position: 'relative', height: '240px', width: '100%' }}>
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
                  backgroundColor: 'rgba(0,0,0,0.6)',
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

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--text-primary)' }}>{selectedDetailService.name}</h2>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    ₹{Math.min(...Object.values(selectedDetailService.basePricePerDuration))}
                  </span>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>starting price</div>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                {selectedDetailService.description}
              </p>

              {/* Benefits Section */}
              <div style={{ marginBottom: '16px' }}>
                <span className="eyebrow" style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                  Therapeutic Benefits
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedDetailService.benefits.map((b, i) => (
                    <div key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--status-success)', fontWeight: 800 }}>✓</span> {b}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contraindications Warning */}
              {selectedDetailService.contraindications.length > 0 && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '14px',
                  marginBottom: '20px',
                  border: '1px solid rgba(239, 68, 68, 0.25)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-error)', marginBottom: '4px' }}>
                    <AlertCircle size={14} />
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                      Medical Contraindications
                    </span>
                  </div>
                  <ul style={{ fontSize: '12px', color: 'var(--status-error)', paddingLeft: '18px', margin: 0, lineHeight: 1.4 }}>
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
                Proceed to Book This Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Luxury Bottom Navigation Bar */}
      <ClientBottomNav />

      {/* Product Detail Modal */}
      {selectedDetailProduct && (
        <ProductDetailModal
          product={selectedDetailProduct}
          onClose={() => setSelectedDetailProduct(null)}
        />
      )}

      {/* 6-Step Booking Stepper Modal */}
      {bookingModalOpen && (
        <BookingFlowModal
          initialService={selectedDetailService || undefined}
          onClose={() => setBookingModalOpen(false)}
          onSuccess={newBooking => {
            setBookingModalOpen(false);
            setSelectedDetailService(null);
            setActiveTrackingBookingId(newBooking.id);
            setClientSubRoute('tracking');
          }}
        />
      )}

      <style>{`
        .client-main-content {
          padding-bottom: 76px;
        }
        @media (min-width: 768px) {
          .client-main-content {
            padding-bottom: 30px !important;
          }
        }
      `}</style>
    </div>
  );
};
