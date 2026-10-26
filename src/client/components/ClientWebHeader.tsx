import React, { useState } from 'react';
import { 
  ShoppingBag, MapPin, ChevronDown, User, Sparkles, Coins
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { INDIAN_CITIES } from '../../data/indianCities';

interface ClientWebHeaderProps {
  onOpenBookingFlow: () => void;
}

export const ClientWebHeader: React.FC<ClientWebHeaderProps> = ({ onOpenBookingFlow }) => {
  const { 
    clientSubRoute, 
    setClientSubRoute, 
    cartTotalCount, 
    selectedCity, 
    setSelectedCity,
    clientHomeMode,
    user,
    bookings
  } = usePamwill();

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const activeBookingsCount = bookings.filter(b =>
    ['Accepted', 'On the Way', 'Arrived', 'Service Started'].includes(b.status)
  ).length;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #EBE5DC',
      boxShadow: '0 2px 10px rgba(31, 27, 22, 0.03)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        padding: '10px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '62px'
      }}>
        
        {/* Left: Brand Emblem, Name, Tag & Subtitle */}
        <div 
          onClick={() => setClientSubRoute('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <img
            src="/assets/pamwill-icon.png"
            alt="Pamwill"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid #E4DDD2',
              objectFit: 'cover'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '18px',
                fontWeight: 800,
                color: '#1F1B16',
                letterSpacing: '-0.3px'
              }}>
                Pamwill
              </span>
              <span style={{
                fontSize: '9px',
                fontWeight: 800,
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                padding: '2px 7px',
                borderRadius: '10px',
                backgroundColor: '#FDF8EE',
                color: '#A9812F',
                border: '1px solid rgba(169, 129, 47, 0.3)'
              }}>
                {clientHomeMode === 'physio' ? 'CLINICAL' : 'BOUTIQUE'}
              </span>
            </div>
            <div style={{
              fontSize: '10px',
              fontWeight: 600,
              color: '#9A8F82',
              letterSpacing: '0.4px',
              marginTop: '1px'
            }}>
              {clientHomeMode === 'physio' ? 'DOCTOR-LED PHYSIOTHERAPY' : 'WELLNESS COMES HOME'}
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs (Visible on >= 768px screens) */}
        <nav className="desktop-client-nav" style={{
          alignItems: 'center',
          gap: '6px'
        }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'store', label: 'Store', badge: cartTotalCount > 0 ? cartTotalCount : undefined },
            { id: 'bookings', label: 'Bookings', badge: activeBookingsCount > 0 ? activeBookingsCount : undefined },
            { id: 'profile', label: 'Profile' }
          ].map(tab => {
            const isActive = tab.id === 'home'
              ? (clientSubRoute === 'home' || !['store', 'bookings', 'profile'].includes(clientSubRoute))
              : clientSubRoute === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setClientSubRoute(tab.id)}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: isActive
                    ? '#F7EEDD'
                    : 'transparent',
                  color: isActive
                    ? '#A9812F'
                    : '#6B6259',
                  fontSize: '13px',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 160ms ease'
                }}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span style={{
                    backgroundColor: '#A9812F',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '10px'
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Location Chip, Cart & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* City Selector Pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '20px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4DDD2',
                color: '#1F1B16',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(31, 27, 22, 0.04)'
              }}
            >
              <MapPin size={13} color="#A9812F" />
              <span>{selectedCity ? selectedCity.split(' ')[0] : 'Delhi'}</span>
              <ChevronDown size={12} color="#9A8F82" />
            </button>

            {cityDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '180px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4DDD2',
                borderRadius: '16px',
                padding: '6px',
                boxShadow: '0 8px 24px rgba(31, 27, 22, 0.12)',
                zIndex: 200,
                maxHeight: '260px',
                overflowY: 'auto'
              }}>
                {INDIAN_CITIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCity(c.name);
                      setCityDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      color: selectedCity === c.name ? '#A9812F' : '#1F1B16',
                      fontSize: '13px',
                      fontWeight: selectedCity === c.name ? 800 : 500,
                      cursor: 'pointer',
                      borderRadius: '8px'
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart Basket */}
          <button
            onClick={() => setClientSubRoute('cart')}
            style={{
              position: 'relative',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4DDD2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1F1B16'
            }}
            title="Shopping Cart"
          >
            <ShoppingBag size={16} color="#A9812F" />
            {cartTotalCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#A9812F',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 800,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartTotalCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => setClientSubRoute('profile')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F7EEDD',
              border: '1.5px solid #A9812F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#A9812F',
              overflow: 'hidden',
              padding: 0
            }}
            title="My Profile"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#A9812F' }}>
                {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'PW'}
              </span>
            )}
          </button>
        </div>

      </div>

      <style>{`
        .desktop-client-nav {
          display: none;
        }
        @media (min-width: 768px) {
          .desktop-client-nav {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
