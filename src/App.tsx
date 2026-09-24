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
  const { currentRole, setCurrentRole, deviceFrame, authModalOpen, setAuthModalOpen, authMode } = usePamwill();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: currentRole === 'admin' ? 'var(--bg-primary)' : '#100E0C',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: currentRole === 'home' ? 'flex-start' : 'center',
      position: 'relative',
      overflowX: 'hidden'
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
            /* Responsive Full Screen Mobile Container */
            <div style={{
              width: '100%',
              maxWidth: '440px',
              minHeight: '100vh',
              backgroundColor: 'var(--bg-primary)',
              boxShadow: '0 0 40px rgba(0,0,0,0.5)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              paddingBottom: '70px'
            }}>
              {currentRole === 'client' && <ClientAppRoot />}
              {currentRole === 'therapist' && <TherapistAppRoot />}
            </div>
          )}
        </div>
      )}

      {/* Floating Return to Website Button when viewing app simulator */}
      {currentRole !== 'home' && (
        <button
          onClick={() => setCurrentRole('home')}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 9999,
            backgroundColor: '#1E1A16',
            color: '#FAF8F5',
            border: '1px solid rgba(169, 129, 47, 0.5)',
            borderRadius: 'var(--radius-pill)',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(0,0,0,0.8), 0 0 20px rgba(169, 129, 47, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 150ms ease'
          }}
          title="Return to PamWill Official Website"
        >
          <ArrowLeft size={16} color="var(--accent-gold)" /> Back to PamWill Home
        </button>
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
