import React, { useState } from 'react';
import { 
  ShoppingBag, Calendar, Sparkles, User, Coins, Tag, 
  MapPin, Menu, X, ArrowLeft, ChevronDown, Package, Activity 
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
    setCurrentRole, 
    cartTotalCount, 
    pamCoins, 
    selectedCity, 
    setSelectedCity,
    clientHomeMode,
    setClientHomeMode,
    user 
  } = usePamwill();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Treatments & Home', icon: <Sparkles size={14} /> },
    { id: 'store', label: 'Sanctuary Store', icon: <ShoppingBag size={14} /> },
    { id: 'bookings', label: 'My Bookings', icon: <Calendar size={14} /> },
    { id: 'orders', label: 'Store Orders', icon: <Package size={14} /> },
    { id: 'membership', label: 'Luxe Club', icon: <Sparkles size={14} /> },
    { id: 'pamcoin', label: 'PamCoins', icon: <Coins size={14} /> },
    { id: 'vouchers', label: 'Vouchers', icon: <Tag size={14} /> },
  ];

  const handleNavClick = (id: string) => {
    setClientSubRoute(id);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(20, 18, 15, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(169, 129, 47, 0.2)',
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
        
        {/* Left: Brand Emblem & Portal Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            onClick={() => handleNavClick('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <img
              src="/assets/pamwill-icon.png"
              alt="PamWill"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid rgba(169, 129, 47, 0.4)',
                boxShadow: '0 0 16px rgba(169, 129, 47, 0.3)'
              }}
            />
            <div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '20px',
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
                  color: 'var(--accent-gold-light)',
                  backgroundColor: 'rgba(169, 129, 47, 0.2)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}>
                  Patient Portal
                </span>
              </div>
            </div>
          </div>

          {/* City Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(169, 129, 47, 0.3)',
                color: '#FAF8F5',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <MapPin size={13} color="var(--accent-gold)" />
              <span>{selectedCity}</span>
              <ChevronDown size={13} color="var(--text-muted)" />
            </button>

            {cityDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                width: '200px',
                backgroundColor: '#1E1A16',
                border: '1px solid #3E362E',
                borderRadius: '16px',
                padding: '6px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.8)',
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
                      color: selectedCity === c.name ? 'var(--accent-gold)' : '#FAF8F5',
                      fontSize: '13px',
                      fontWeight: selectedCity === c.name ? 700 : 500,
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


        </div>



        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* PamCoins Pill */}
          <button
            onClick={() => handleNavClick('pamcoin')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(229, 169, 60, 0.15)',
              border: '1px solid rgba(229, 169, 60, 0.35)',
              color: '#FAF8F5',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="View PamCoin Rewards Wallet"
          >
            <Coins size={14} color="#E5A93C" />
            <span>{pamCoins}</span>
          </button>

          {/* Shopping Basket Button with Badge */}
          <button
            onClick={() => handleNavClick('cart')}
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(169, 129, 47, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FAF8F5'
            }}
            title="Shopping Basket"
          >
            <ShoppingBag size={17} color="var(--accent-gold)" />
            {cartTotalCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--accent-gold)',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
              }}>
                {cartTotalCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <button
            onClick={() => handleNavClick('profile')}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(169, 129, 47, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FAF8F5'
            }}
            title="My Profile"
          >
            <User size={17} color="#FAF8F5" />
          </button>

          {/* Book Treatment CTA */}
          <button
            onClick={onOpenBookingFlow}
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--accent-gold)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(169, 129, 47, 0.35)'
            }}
            className="desktop-book-btn"
          >
            <Sparkles size={14} /> Book Treatment
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: '#FAF8F5',
              padding: '6px',
              cursor: 'pointer'
            }}
            className="mobile-client-toggle"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#181410',
          borderTop: '1px solid #2C2620',
          padding: '16px 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>


          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '12px',
                backgroundColor: clientSubRoute === item.id ? 'rgba(169, 129, 47, 0.15)' : 'transparent',
                border: 'none',
                color: clientSubRoute === item.id ? 'var(--accent-gold)' : '#FAF8F5',
                fontSize: '14px',
                fontWeight: clientSubRoute === item.id ? 700 : 500,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          <hr style={{ borderColor: '#2E2720', margin: '4px 0' }} />

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBookingFlow();
            }}
            className="btn-gold"
            style={{ width: '100%', padding: '12px', fontSize: '14px' }}
          >
            <Sparkles size={15} style={{ marginRight: '6px' }} /> Book Sanctuary Sitting
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setCurrentRole('home');
            }}
            style={{
              background: 'none',
              border: '1px solid #3E362E',
              color: '#B5ABA0',
              padding: '10px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '4px'
            }}
          >
            &larr; Back to PamWill Official Website
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 990px) {
          .desktop-client-nav { display: flex !important; }
          .desktop-book-btn { display: flex !important; }
          .mobile-client-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
