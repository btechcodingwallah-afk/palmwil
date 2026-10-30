import React, { useState } from 'react';
import { 
  LayoutDashboard, Calendar, DollarSign, Trophy, 
  User, MessageSquare, Power, Bell, Menu, X, ArrowLeft, Shield, Sparkles, UserCheck, HelpCircle 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { getTherapistRoleBadge, formatTherapistDisplayName } from '../../types';

interface TherapistWebHeaderProps {
  onOpenVerificationModal?: () => void;
}

export const TherapistWebHeader: React.FC<TherapistWebHeaderProps> = ({ onOpenVerificationModal }) => {
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

  const handleNavClick = (id: string) => {
    setTherapistSubRoute(id);
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
  const isUnderReview = isTherapistLoggedIn && currentTherapist?.status !== 'Approved';

  return (
    <>
      <style>{`
        @media (max-width: 580px) {
          .therapist-header-inner {
            padding: 0 10px !important;
            height: 60px !important;
          }
          .partner-collective-badge {
            display: none !important;
          }
          .partner-subtext {
            display: none !important;
          }
          .partner-header-btn {
            padding: 6px 10px !important;
            font-size: 11px !important;
          }
          .partner-btn-text-desktop {
            display: none !important;
          }
        }
      `}</style>
      <header style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(20, 18, 15, 0.96)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(169, 129, 47, 0.25)',
        transition: 'all 200ms ease',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div 
          className="therapist-header-inner"
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            padding: '0 20px',
            height: '66px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            boxSizing: 'border-box'
          }}
        >
          {/* Left: Brand & Practitioner Role */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flexShrink: 1 }}>
            <div 
              onClick={() => handleNavClick('dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: 0 }}
            >
              <img
                src="/assets/pamwill-icon.png"
                alt="PamWill Provider"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: '1px solid rgba(169, 129, 47, 0.4)',
                  flexShrink: 0
                }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#FAF8F5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}>
                  PamWill
                  {isTherapistLoggedIn ? (
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      color: roleBadge.color,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-pill)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {roleBadge.short}
                    </span>
                  ) : (
                    <span 
                      className="partner-collective-badge"
                      style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        color: 'var(--accent-gold)',
                        backgroundColor: 'rgba(212, 163, 89, 0.15)',
                        border: '1px solid rgba(212, 163, 89, 0.3)',
                        padding: '2px 7px',
                        borderRadius: 'var(--radius-pill)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      Partner Collective
                    </span>
                  )}
                </div>
                <div 
                  className="partner-subtext"
                  style={{
                    fontSize: '10px',
                    color: '#B5ABA0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {isTherapistLoggedIn ? displayName : 'Therapist & Spa Network'}
                </div>
              </div>
            </div>

            {/* If Logged In AND Approved: Online / Offline Toggle Switch */}
            {isTherapistLoggedIn && currentTherapist?.status === 'Approved' && (
              <button
                onClick={() => currentTherapist?.id && toggleTherapistOnline(currentTherapist.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: currentTherapist?.isOnline ? 'rgba(76, 175, 80, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: currentTherapist?.isOnline ? '1px solid rgba(76, 175, 80, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                  color: currentTherapist?.isOnline ? 'var(--status-success)' : '#EF4444',
                  fontSize: '10px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
                title={currentTherapist?.isOnline ? 'Currently Online: Accepting incoming job alerts' : 'Offline: Not accepting assignments'}
              >
                <span style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: currentTherapist?.isOnline ? 'var(--status-success)' : '#EF4444'
                }} />
                <span>{currentTherapist?.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </button>
            )}
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {isTherapistLoggedIn ? (
              isUnderReview ? (
                /* Under Review State: Status indicator & Sign Out */
                <>
                  <button
                    onClick={onOpenVerificationModal}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'rgba(212, 163, 89, 0.16)',
                      border: '1px solid rgba(212, 163, 89, 0.4)',
                      color: 'var(--accent-gold)',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 150ms ease'
                    }}
                    title="Click to inspect uploaded documents and review progress"
                  >
                    <span style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-gold)'
                    }} />
                    <span>Under Review</span>
                  </button>

                  <button
                    onClick={logoutTherapist}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '5px 10px',
                      color: '#EF4444',
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                /* Approved Operational State: Wallet & Logout */
                <>
                  <button
                    onClick={() => handleNavClick('earnings')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'rgba(169, 129, 47, 0.15)',
                      border: '1px solid rgba(169, 129, 47, 0.35)',
                      color: '#FAF8F5',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap'
                    }}
                    title="Current Payout Balance"
                  >
                    <DollarSign size={12} color="var(--accent-gold)" />
                    <span>₹{currentTherapist?.walletBalance || 0}</span>
                  </button>

                  <button
                    onClick={logoutTherapist}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '5px 10px',
                      color: '#EF4444',
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Sign Out
                  </button>
                </>
              )
            ) : (
              /* Unauthenticated / Guest Partner State: Motivational Join / Sign In CTAs */
              <>
                <button
                  className="partner-header-btn"
                  onClick={handleOpenLogin}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '6px 12px',
                    color: '#FAF8F5',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    transition: 'all 150ms ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-gold)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)')}
                >
                  <UserCheck size={13} />
                  <span>
                    <span className="partner-btn-text-desktop">Partner </span>Sign In
                  </span>
                </button>

                <button
                  className="partner-header-btn"
                  onClick={handleOpenRegister}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--accent-gold)',
                    border: 'none',
                    color: '#15120F',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(212, 163, 89, 0.35)',
                    transition: 'transform 120ms ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Sparkles size={12} />
                  <span>
                    Join<span className="partner-btn-text-desktop"> Platform</span>
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
export default TherapistWebHeader;
