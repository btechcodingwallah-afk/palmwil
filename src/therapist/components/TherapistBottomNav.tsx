import React from 'react';
import { 
  LayoutDashboard, Calendar, User, MessageSquare, DollarSign, HelpCircle, Sparkles 
} from 'lucide-react';
import { usePamwill } from '../../state/store';

export const TherapistBottomNav: React.FC = () => {
  const { 
    therapistSubRoute, 
    setTherapistSubRoute, 
    bookings, 
    currentTherapist, 
    isTherapistLoggedIn 
  } = usePamwill();

  const activeJobsCount = bookings.filter(b => 
    b.therapistId === currentTherapist?.id && 
    ['Accepted', 'On the Way', 'Arrived', 'Service Started'].includes(b.status)
  ).length;

  const navItems = isTherapistLoggedIn ? [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Active Jobs', icon: Calendar, badge: activeJobsCount > 0 ? activeJobsCount : undefined },
    { id: 'chat', label: 'Patient Chat', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User }
  ] : [
    { id: 'dashboard', label: 'Perks & Radar', icon: Sparkles },
    { id: 'bookings', label: 'Live Jobs', icon: Calendar },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'faqs', label: 'Partner FAQs', icon: HelpCircle },
    { id: 'profile', label: 'Join / Sign In', icon: User }
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
      boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.6)',
      height: '66px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: isTherapistLoggedIn ? '560px' : '680px',
        width: '100%',
        margin: '0 auto',
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
      }}>
        {navItems.map(item => {
          const isActive = 
            item.id === 'profile'
              ? ['profile', 'daily-goal', 'edit-profile'].includes(therapistSubRoute)
              : therapistSubRoute === item.id;
          const Icon = item.icon;

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
                gap: '4px',
                padding: '6px 6px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: isActive ? 'rgba(212, 163, 89, 0.16)' : 'transparent',
                color: isActive ? 'var(--accent-gold)' : '#A89F91',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 150ms ease'
              }}
              title={item.label}
            >
              <div style={{ 
                position: 'relative',
                transform: isActive ? 'scale(1.12)' : 'scale(1)', 
                transition: 'transform 150ms ease' 
              }}>
                <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
                {item.badge !== undefined && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 800,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #120F0C'
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span style={{
                fontSize: '10px',
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
export default TherapistBottomNav;
