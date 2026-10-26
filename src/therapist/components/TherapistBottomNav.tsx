import React from 'react';
import { 
  LayoutDashboard, Calendar, DollarSign, Trophy, 
  ShoppingBag, User, MessageSquare 
} from 'lucide-react';
import { usePamwill } from '../../state/store';

export const TherapistBottomNav: React.FC = () => {
  const { therapistSubRoute, setTherapistSubRoute } = usePamwill();

  const navItems = [
    { id: 'dashboard', label: 'Sanctuary Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'bookings', label: 'Active Jobs', icon: <Calendar size={16} /> },
    { id: 'earnings', label: 'Earnings & Payouts', icon: <DollarSign size={16} /> },
    { id: 'daily-goal', label: 'Daily 10-Goal', icon: <Trophy size={16} /> },
    { id: 'store', label: 'Supplies Store', icon: <ShoppingBag size={16} /> },
    { id: 'profile', label: 'Credentials & KYC', icon: <User size={16} /> },
    { id: 'chat', label: 'Patient Chat', icon: <MessageSquare size={16} /> }
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 990,
      backgroundColor: 'rgba(18, 15, 12, 0.96)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(212, 163, 89, 0.25)',
      boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.6)'
    }}>
      <div style={{
        maxWidth: '1040px',
        margin: '0 auto',
        padding: '6px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4px'
      }}>
        {navItems.map(item => {
          const isActive = therapistSubRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setTherapistSubRoute(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                padding: '7px 2px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: isActive ? 'rgba(212, 163, 89, 0.16)' : 'transparent',
                color: isActive ? 'var(--accent-gold)' : '#A89F91',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
              title={item.label}
            >
              <div style={{ transform: isActive ? 'scale(1.12)' : 'scale(1)', transition: 'transform 150ms ease' }}>
                {item.icon}
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: isActive ? 700 : 500,
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em'
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
