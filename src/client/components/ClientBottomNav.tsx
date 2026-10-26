import React from 'react';
import { Home, ShoppingBag, Calendar, User } from 'lucide-react';
import { usePamwill } from '../../state/store';

export const ClientBottomNav: React.FC = () => {
  const { clientSubRoute, setClientSubRoute, bookings, cartTotalCount } = usePamwill();

  const activeBookingsCount = bookings.filter(b =>
    ['Accepted', 'On the Way', 'Arrived', 'Service Started'].includes(b.status)
  ).length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'store', label: 'Store', icon: ShoppingBag, badge: cartTotalCount > 0 ? cartTotalCount : undefined },
    { id: 'bookings', label: 'Bookings', icon: Calendar, badge: activeBookingsCount > 0 ? activeBookingsCount : undefined },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="client-bottom-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 990,
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid #E4DDD2',
      boxShadow: '0 -4px 16px rgba(31, 27, 22, 0.05)',
      height: '66px',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
      }}>
        {navItems.map(item => {
          const isActive = 
            item.id === 'home' 
              ? (clientSubRoute === 'home' || !['store', 'bookings', 'profile'].includes(clientSubRoute))
              : clientSubRoute === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                setClientSubRoute(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '6px 12px',
                position: 'relative',
                color: isActive ? '#A9812F' : '#9A8F82',
                transition: 'all 160ms ease'
              }}
            >
              <div style={{ position: 'relative' }}>
                <Icon size={21} strokeWidth={isActive ? 2.3 : 1.8} />
                {item.badge !== undefined && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-9px',
                    backgroundColor: '#A9812F',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 800,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #FFFFFF'
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.2px'
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
