import React from 'react';
import { PamwillProvider, usePamwill } from './state/store';
import { RoleDeviceSwitcher } from './shell/RoleDeviceSwitcher';
import { ClientAppRoot } from './client/ClientAppRoot';
import { TherapistAppRoot } from './therapist/TherapistAppRoot';
import { AdminConsoleRoot } from './admin/AdminConsoleRoot';
import { PamwillHomePage } from './home/PamwillHomePage';
import { AuthModal } from './auth/AuthModal';
import { ArrowLeft, Home } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    deviceFrame, 
    setDeviceFrame, 
    navigateTo, 
    authModalOpen, 
    setAuthModalOpen, 
    authMode 
  } = usePamwill();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: currentRole === 'admin' ? 'var(--bg-primary)' : currentRole === 'home' ? 'var(--background)' : '#100E0C',
      color: currentRole === 'home' ? 'var(--text)' : '#FAF8F5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: currentRole === 'home' ? 'flex-start' : 'center',
      position: 'relative',
      overflowX: 'hidden',
      transition: 'background-color 200ms ease, color 200ms ease'
    }}>
      {/* 1. Official Landing / Home Page */}
      {currentRole === 'home' && (
        <PamwillHomePage onNavigateRole={setCurrentRole} />
      )}

      {/* 2. Admin Console: Rendered as Full Desktop Web App */}
      {currentRole === 'admin' && (
        <div style={{ width: '100%', height: '100vh' }}>
          <AdminConsoleRoot />
        </div>
      )}

      {/* 3. Mobile Applications: Client App or Therapist App */}
      {(currentRole === 'client' || currentRole === 'therapist') && (
        <div style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: deviceFrame === 'phone' ? '28px 16px' : '0'
        }}>
          {deviceFrame === 'phone' ? (
            /* Photorealistic Mobile Device Frame */
            <div className="phone-viewport">
              <div className="phone-notch" />
              <div className="phone-screen">
                {currentRole === 'client' && <ClientAppRoot />}
                {currentRole === 'therapist' && <TherapistAppRoot />}
              </div>
            </div>
          ) : (
            /* Responsive Full Screen Web Portal Container */
            <div style={{
              width: '100%',
              minHeight: '100vh',
              backgroundColor: 'var(--bg-primary)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {currentRole === 'client' && <ClientAppRoot />}
              {currentRole === 'therapist' && <TherapistAppRoot />}
            </div>
          )}
        </div>
      )}



      {/* Global Authentication & Multi-Role Onboarding Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PamwillProvider>
      <AppContent />
    </PamwillProvider>
  );
};

export default App;
