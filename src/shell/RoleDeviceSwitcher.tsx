import React from 'react';
import { 
  Smartphone, Monitor, User, ShieldCheck, 
  Briefcase, RefreshCw, Home 
} from 'lucide-react';
import { usePamwill } from '../state/store';

export const RoleDeviceSwitcher: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    deviceFrame, 
    setDeviceFrame, 
    user, 
    therapists,
    currentTherapistId,
    setCurrentTherapistId,
    bookings,
    isSupabaseConnected
  } = usePamwill();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '56px',
      backgroundColor: '#191613',
      borderBottom: '1px solid #332C24',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      color: '#FAF8F5'
    }}>
      {/* Brand Badge */}
      <div 
        onClick={() => {
          setCurrentRole('home');
          setDeviceFrame('full');
        }}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <img
          src="/assets/pamwill-icon.png"
          alt="PamWill"
          style={{ width: '28px', height: '28px', borderRadius: '50%' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 600, color: '#FAF8F5' }}>
            PamWill
          </span>
          <span style={{
            fontSize: '9px',
            fontWeight: 700,
            backgroundColor: 'rgba(169, 129, 47, 0.25)',
            color: 'var(--accent-gold-light)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-pill)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            Luxe
          </span>
          <span style={{
            fontSize: '9px',
            fontWeight: 600,
            backgroundColor: isSupabaseConnected ? 'rgba(76, 107, 79, 0.25)' : 'rgba(255, 255, 255, 0.1)',
            color: isSupabaseConnected ? 'var(--status-success)' : '#D9D1C5',
            border: isSupabaseConnected ? '1px solid var(--status-success)' : '1px solid #443B32',
            padding: '2px 8px',
            borderRadius: 'var(--radius-pill)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: isSupabaseConnected ? 'var(--status-success)' : 'var(--accent-gold)'
            }} />
            {isSupabaseConnected ? 'Supabase Connected' : 'Supabase Ready'}
          </span>
        </div>
      </div>

      {/* Role Navigation Buttons */}
      <div style={{
        display: 'flex',
        backgroundColor: '#26211C',
        padding: '3px',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid #3E362E'
      }}>
        <button
          onClick={() => {
            setCurrentRole('home');
            setDeviceFrame('full');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: currentRole === 'home' ? 'var(--accent-gold)' : 'transparent',
            color: currentRole === 'home' ? '#FFFFFF' : '#BAAE9E',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 150ms ease'
          }}
        >
          <Home size={14} /> Official Home
        </button>

        <button
          onClick={() => {
            setCurrentRole('client');
            setDeviceFrame('phone');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: currentRole === 'client' ? 'var(--accent-gold)' : 'transparent',
            color: currentRole === 'client' ? '#FFFFFF' : '#BAAE9E',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 150ms ease'
          }}
        >
          <User size={14} /> 1. Client App (Customer)
        </button>

        <button
          onClick={() => {
            setCurrentRole('therapist');
            setDeviceFrame('phone');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: currentRole === 'therapist' ? 'var(--accent-gold)' : 'transparent',
            color: currentRole === 'therapist' ? '#FFFFFF' : '#BAAE9E',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 150ms ease'
          }}
        >
          <Briefcase size={14} /> 2. Therapist App (Provider)
        </button>

        <button
          onClick={() => {
            setCurrentRole('admin');
            setDeviceFrame('full');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: currentRole === 'admin' ? 'var(--accent-gold)' : 'transparent',
            color: currentRole === 'admin' ? '#FFFFFF' : '#BAAE9E',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 150ms ease'
          }}
        >
          <ShieldCheck size={14} /> 3. Admin Console (Web)
        </button>
      </div>

      {/* Simulator Actions & Frame Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        
        {/* Frame Toggle (Phone vs Full Width for mobile apps) */}
        {currentRole !== 'admin' && currentRole !== 'home' && (
          <div style={{
            display: 'flex',
            backgroundColor: '#26211C',
            padding: '2px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid #3E362E'
          }}>
            <button
              onClick={() => setDeviceFrame('phone')}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                backgroundColor: deviceFrame === 'phone' ? '#3F372E' : 'transparent',
                color: deviceFrame === 'phone' ? '#FFFFFF' : '#9E9284',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Mobile Device Frame View"
            >
              <Smartphone size={14} />
            </button>
            <button
              onClick={() => setDeviceFrame('full')}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                backgroundColor: deviceFrame === 'full' ? '#3F372E' : 'transparent',
                color: deviceFrame === 'full' ? '#FFFFFF' : '#9E9284',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Full Window View"
            >
              <Monitor size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
