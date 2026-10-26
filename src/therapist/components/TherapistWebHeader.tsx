import React, { useState } from 'react';
import { 
  LayoutDashboard, Calendar, DollarSign, Trophy, ShoppingBag, 
  User, MessageSquare, Power, Bell, Menu, X, ArrowLeft, Shield 
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
    setCurrentRole 
  } = usePamwill();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Sanctuary Dashboard', icon: <LayoutDashboard size={14} /> },
    { id: 'bookings', label: 'Active Jobs', icon: <Calendar size={14} /> },
    { id: 'earnings', label: 'Earnings & Payouts', icon: <DollarSign size={14} /> },
    { id: 'daily-goal', label: 'Daily 10-Goal', icon: <Trophy size={14} /> },
    { id: 'store', label: 'Supplies Store', icon: <ShoppingBag size={14} /> },
    { id: 'profile', label: 'Credentials & KYC', icon: <User size={14} /> },
    { id: 'chat', label: 'Patient Chat', icon: <MessageSquare size={14} /> }
  ];

  const handleNavClick = (id: string) => {
    setTherapistSubRoute(id);
    setMobileMenuOpen(false);
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
                  color: roleBadge.color,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {roleBadge.short}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#B5ABA0' }}>
                {displayName || 'Partner Practitioner'}
              </div>
            </div>
          </div>

          {/* Online / Offline Toggle Switch */}
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
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
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
        </div>
      </div>
    </header>
  );
};
