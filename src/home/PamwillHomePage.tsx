import React, { useState } from 'react';
import { HomeNavbar } from './components/HomeNavbar';
import { HeroSection } from './components/HeroSection';
import { DualAudienceSection } from './components/DualAudienceSection';
import { ServicesShowcase } from './components/ServicesShowcase';
import { SafetyStandardsSection } from './components/SafetyStandardsSection';
import { DownloadSection } from './components/DownloadSection';
import { ConnectBanner } from './components/ConnectBanner';
import { HomeFooter } from './components/HomeFooter';
import { QrCodeModal } from './components/QrCodeModal';
import { DownloadToast } from './components/DownloadToast';
import { TrainingApplicationModal } from './components/TrainingApplicationModal';
import { ConnectWithUsModal } from './components/ConnectWithUsModal';
import { APP_DOWNLOADS } from '../config/env';
import { usePamwill } from '../state/store';

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<{
    isOpen: boolean;
    type: 'patient' | 'therapist';
  }>({
    isOpen: false,
    type: 'patient',
  });

  const handleOpenQr = (type: 'patient' | 'therapist') => {
    setQrModal({ isOpen: true, type });
  };

  const handleCloseQr = () => {
    setQrModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleShowToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const qrConfig = qrModal.type === 'patient'
    ? {
        title: 'Scan for PamWill Patient App',
        subtitle: 'Point your phone camera to download the Android APK directly.',
        downloadUrl: APP_DOWNLOADS.patient.apkUrl,
        fileName: APP_DOWNLOADS.patient.fileName,
      }
    : {
        title: 'Scan for PamWill Therapist Partner App',
        subtitle: 'Point your phone camera to download the Partner APK directly.',
        downloadUrl: APP_DOWNLOADS.therapist.apkUrl,
        fileName: APP_DOWNLOADS.therapist.fileName,
      };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#100E0C',
      color: '#FAF8F5',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      overflowX: 'hidden'
    }}>
      {/* Home Navbar */}
      <HomeNavbar onNavigateRole={onNavigateRole} />

      {/* Hero Section */}
      <HeroSection
        onNavigateRole={onNavigateRole}
        onOpenQr={handleOpenQr}
        onShowToast={handleShowToast}
      />

      {/* Dual Audience Section (Patients & Therapists) */}
      <DualAudienceSection
        onNavigateRole={onNavigateRole}
        onOpenQr={handleOpenQr}
        onShowToast={handleShowToast}
      />

      {/* Signature Treatment Showcase */}
      <ServicesShowcase onNavigateRole={onNavigateRole} />

      {/* The Gold Safety Standard */}
      <SafetyStandardsSection />

      {/* Download Center for Both Apps */}
      <DownloadSection
        onNavigateRole={onNavigateRole}
        onOpenQr={handleOpenQr}
        onShowToast={handleShowToast}
      />

      {/* Connect With Us Spotlight Card (Google Form) */}
      <ConnectBanner />

      {/* Comprehensive Footer with Company Details from .env */}
      <HomeFooter onNavigateRole={onNavigateRole} />

      {/* QR Code Scan Modal */}
      <QrCodeModal
        isOpen={qrModal.isOpen}
        onClose={handleCloseQr}
        title={qrConfig.title}
        subtitle={qrConfig.subtitle}
        downloadUrl={qrConfig.downloadUrl}
        fileName={qrConfig.fileName}
      />

      {/* Training & Internship Application Modal */}
      <TrainingApplicationModal
        isOpen={trainingModalOpen}
        onClose={() => setTrainingModalOpen(false)}
      />

      {/* In-Built Connect With Us / Concierge Inquiries Modal */}
      <ConnectWithUsModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
      />

      {/* Download Toast Notification */}
      <DownloadToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
        subtext="Direct package download started. On live deployment, store links open automatically."
      />
    </div>
  );
};

export default PamwillHomePage;
