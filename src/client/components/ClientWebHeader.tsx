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

  const currentCityObj = INDIAN_CITIES.find(c => 
    c.id.toLowerCase() === selectedCity?.toLowerCase() || 
    c.name.toLowerCase() === selectedCity?.toLowerCase() ||
    c.id === selectedCity?.toLowerCase().replace(/\s+/g, '-')
  );
  const displayCityName = currentCityObj 
    ? currentCityObj.name.split('(')[0].trim() 
    : (selectedCity ? selectedCity.replace(/-/g, ' ').toUpperCase() : 'Delhi');

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
      <div className="client-header-inner">
        
        {/* Left: Brand Emblem, Name, Tag & Subtitle */}
        <div 
          onClick={() => setClientSubRoute('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: 0, flexShrink: 1 }}
        >
          <img
            src="/assets/pamwill-icon.png"
            alt="Pamwill"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: '1px solid #E4DDD2',
              objectFit: 'cover',
              flexShrink: 0
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '17px',
                fontWeight: 800,
                color: '#1F1B16',
                letterSpacing: '-0.3px',
                lineHeight: 1.2
              }}>
                Pamwill
              </span>
              <span style={{
                fontSize: '8.5px',
                fontWeight: 800,
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                padding: '1.5px 6px',
                borderRadius: '10px',
                backgroundColor: '#FDF8EE',
                color: '#A9812F',
                border: '1px solid rgba(169, 129, 47, 0.3)',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                {clientHomeMode === 'physio' ? 'CLINICAL' : 'BOUTIQUE'}
              </span>
            </div>
            <div className="client-header-subtitle">
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
        <div className="client-header-right">
          
          {/* City Selector Pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="client-city-btn"
            >
              <MapPin size={13} color="#A9812F" style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap' }}>{displayCityName}</span>
              <ChevronDown size={11} color="#9A8F82" style={{ flexShrink: 0 }} />
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
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4DDD2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1F1B16',
              flexShrink: 0
            }}
            title="Shopping Cart"
          >
            <ShoppingBag size={15} color="#A9812F" />
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
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#F7EEDD',
              border: '1.5px solid #A9812F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#A9812F',
              overflow: 'hidden',
              padding: 0,
              flexShrink: 0
            }}
            title="My Profile"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#A9812F' }}>
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
