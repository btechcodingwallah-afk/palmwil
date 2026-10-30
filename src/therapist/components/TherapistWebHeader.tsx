import React, { useState } from 'react';
import { 
  LayoutDashboard, Calendar, DollarSign, Trophy, 
  User, MessageSquare, Power, Bell, Menu, X, ArrowLeft, Shield, Sparkles, UserCheck, HelpCircle 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { getTherapistRoleBadge, formatTherapistDisplayName } from '../../types';

export const TherapistWebHeader: React.FC = () => {
  const { 
    currentTherapist, 
    therapistSubRoute, 
    setTherapistSubRoute, 
    toggleTherapistOnline, 
    logoutTherapist, 
    setCurrentRole,
    isTherapistLoggedIn,
    setAuthTargetRole,
    setAuthMode,
    setAuthModalOpen
  } = usePamwill();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setTherapistSubRoute(id);
    setMobileMenuOpen(false);
  };

  const handleOpenLogin = () => {
    setAuthTargetRole('therapist');
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthTargetRole('therapist');
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  const roleBadge = getTherapistRoleBadge(currentTherapist?.role);
  const displayName = formatTherapistDisplayName(currentTherapist?.fullName || '', currentTherapist?.role);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(20, 18, 15, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(169, 129, 47, 0.25)',
      transition: 'all 200ms ease'
    }}>
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '0 20px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        
        {/* Left: Brand & Practitioner Role */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div 
            onClick={() => handleNavClick('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <img
              src="/assets/pamwill-icon.png"
              alt="PamWill Provider"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid rgba(169, 129, 47, 0.4)'
              }}
            />
            <div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '18px',
                fontWeight: 700,
                color: '#FAF8F5',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                PamWill
                <span style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  color: isTherapistLoggedIn ? roleBadge.color : 'var(--accent-gold)',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {isTherapistLoggedIn ? roleBadge.short : 'Partner Collective'}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#B5ABA0' }}>
                {isTherapistLoggedIn ? displayName : 'Therapist & Spa Network'}
              </div>
            </div>
          </div>

          {/* If Logged In: Online / Offline Toggle Switch */}
          {isTherapistLoggedIn && (
            <button
              onClick={() => currentTherapist?.id && toggleTherapistOnline(currentTherapist.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: currentTherapist?.isOnline ? 'rgba(76, 175, 80, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                border: currentTherapist?.isOnline ? '1px solid rgba(76, 175, 80, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                color: currentTherapist?.isOnline ? 'var(--status-success)' : '#EF4444',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                letterSpacing: '0.04em'
              }}
              title={currentTherapist?.isOnline ? 'Currently Online: Accepting incoming job alerts' : 'Offline: Not accepting assignments'}
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: currentTherapist?.isOnline ? 'var(--status-success)' : '#EF4444'
              }} />
              <span>{currentTherapist?.isOnline ? 'ONLINE • ACCEPTING' : 'OFFLINE'}</span>
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {isTherapistLoggedIn ? (
            /* Logged in state: Wallet & Logout */
            <>
              <button
                onClick={() => handleNavClick('earnings')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'rgba(169, 129, 47, 0.15)',
                  border: '1px solid rgba(169, 129, 47, 0.35)',
                  color: '#FAF8F5',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Current Payout Balance"
              >
                <DollarSign size={13} color="var(--accent-gold)" />
                <span>₹{currentTherapist?.walletBalance || 0}</span>
              </button>

              <button
                onClick={logoutTherapist}
                style={{
                  background: 'none',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '6px 14px',
                  color: '#EF4444',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            /* Unauthenticated / Guest Partner State: Motivational Join / Sign In CTAs */
            <>
              <button
                onClick={handleOpenLogin}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '7px 16px',
                  color: '#FAF8F5',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-gold)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)')}
              >
                <UserCheck size={14} />
                <span>Partner Sign In</span>
              </button>

              <button
                onClick={handleOpenRegister}
                style={{
                  padding: '7px 18px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--accent-gold)',
                  border: 'none',
                  color: '#15120F',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(212, 163, 89, 0.35)',
                  transition: 'transform 120ms ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Sparkles size={14} />
                <span>✨ Apply to Join</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default TherapistWebHeader;
