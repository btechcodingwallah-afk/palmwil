import React, { useState, useEffect } from 'react';
import { WebsitePage } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ContactBookingPage } from './pages/ContactBookingPage';
import { WellnessGuideModal } from './components/WellnessGuideModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { TrainingApplicationModal } from './components/TrainingApplicationModal';
import { ConnectWithUsModal } from './components/ConnectWithUsModal';
import { QrCodeModal } from './components/QrCodeModal';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { MassageService } from '../types';
import { usePamwill } from '../state/store';
import { Smartphone, MessageSquare } from 'lucide-react';

interface PamwillHomePageProps {
  onNavigateRole: (role: 'client' | 'therapist' | 'admin') => void;
}

export const PamwillHomePage: React.FC<PamwillHomePageProps> = ({ onNavigateRole }) => {
  const { 
    trainingModalOpen, 
    setTrainingModalOpen,
    connectModalOpen,
    setConnectModalOpen
  } = usePamwill();

  // Read initial page from hash if present
  const getInitialPage = (): WebsitePage => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (['services', 'about', 'how-it-works', 'contact'].includes(hash)) {
      return hash as WebsitePage;
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<WebsitePage>(getInitialPage);
  const [wellnessGuideOpen, setWellnessGuideOpen] = useState(false);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<MassageService | null>(null);
  const [preselectedBookingServiceId, setPreselectedBookingServiceId] = useState<string | null>(null);
  const [appQrOpen, setAppQrOpen] = useState(false);

  // Sync hash with browser history
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['home', 'services', 'about', 'how-it-works', 'contact'].includes(hash)) {
        setCurrentPage(hash as WebsitePage);
      } else if (!hash) {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigatePage = (page: WebsitePage) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceForBooking = (service: MassageService) => {
    setSelectedServiceDetail(null);
    setPreselectedBookingServiceId(service.id);
    handleNavigatePage('contact');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      color: 'var(--text)',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      overflowX: 'hidden',
      position: 'relative',
      transition: 'background-color 200ms ease, color 200ms ease'
    }}>
      {/* 1. Global Luxury Sticky Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigatePage={handleNavigatePage}
        onNavigateRole={onNavigateRole}
        onOpenAppDownload={() => setAppQrOpen(true)}
      />

      {/* 2. Main Multi-Page Routed View */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentPage === 'home' && (
          <HomePage
            onNavigatePage={handleNavigatePage}
            onOpenWellnessGuide={() => setWellnessGuideOpen(true)}
            onSelectService={handleSelectServiceForBooking}
            onOpenAppDownload={() => setAppQrOpen(true)}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            onNavigatePage={handleNavigatePage}
            onOpenServiceDetail={(svc) => setSelectedServiceDetail(svc)}
            onSelectService={handleSelectServiceForBooking}
            onOpenAppDownload={() => setAppQrOpen(true)}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigatePage={handleNavigatePage}
            onOpenAppDownload={() => setAppQrOpen(true)}
          />
        )}

        {currentPage === 'how-it-works' && (
          <HowItWorksPage
            onNavigatePage={handleNavigatePage}
            onOpenAppDownload={() => setAppQrOpen(true)}
          />
        )}

        {currentPage === 'contact' && (
          <ContactBookingPage
            onNavigatePage={handleNavigatePage}
            onNavigateRole={onNavigateRole}
            preselectedServiceId={preselectedBookingServiceId}
            onOpenAppDownload={() => setAppQrOpen(true)}
          />
        )}
      </main>

      {/* 3. Mobile Floating Quick-Action Bar (Visible on mobile viewports only) */}
      <div
        className="pamwill-mobile-bottom-bar"
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          right: '16px',
          zIndex: 998,
          display: 'none'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px' }}>
          <button
            onClick={() => setAppQrOpen(true)}
            style={{
              backgroundColor: 'var(--cta)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '14px 16px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.45), 0 0 20px rgba(198, 165, 103, 0.4)'
            }}
          >
            <Smartphone size={15} /> Book on App
          </button>

          <button
            onClick={() => handleNavigatePage('contact')}
            style={{
              backgroundColor: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-pill)',
              padding: '14px 14px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
            }}
          >
            <MessageSquare size={14} color="var(--cta)" /> Inquire
          </button>
        </div>
      </div>

      {/* 4. Global Luxury Footer (Collapsible on Mobile) */}
      <Footer
        onNavigatePage={handleNavigatePage}
        onNavigateRole={onNavigateRole}
      />

      {/* 5. Sparsh Care Minimalist Theme Switcher (Floating) */}
      <ThemeSwitcher />

      {/* 6. PamWill App Installation & Download QR Modal */}
      <QrCodeModal
        isOpen={appQrOpen}
        onClose={() => setAppQrOpen(false)}
        title="Get PamWill Mobile App"
        subtitle="Live massage bookings, instant verified therapist dispatch, and real-time GPS tracking are managed exclusively via the PamWill mobile application."
        downloadUrl="/apks/PamWill-patient.apk"
        fileName="PamWill-patient.apk"
      />

      {/* 7. Strategic Wellness Guide Modal */}
      <WellnessGuideModal
        isOpen={wellnessGuideOpen}
        onClose={() => setWellnessGuideOpen(false)}
        onNavigatePage={handleNavigatePage}
      />

      {/* 8. Service Detail Modal */}
      <ServiceDetailModal
        service={selectedServiceDetail}
        onClose={() => setSelectedServiceDetail(null)}
        onBookService={handleSelectServiceForBooking}
        onOpenAppDownload={() => setAppQrOpen(true)}
      />

      {/* 9. Support Modals */}
      <TrainingApplicationModal
        isOpen={trainingModalOpen}
        onClose={() => setTrainingModalOpen(false)}
      />

      <ConnectWithUsModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
      />
    </div>
  );
};

export default PamwillHomePage;
