import React, { useState } from 'react';
import { MapPin, Bell, ChevronDown, Sparkles } from 'lucide-react';
import { usePamwill } from '../../state/store';
import { INDIAN_CITIES } from '../../data/indianCities';

export const ClientHeader: React.FC = () => {
  const { selectedCity, setSelectedCity, user, setAuthModalOpen, setAuthMode, setActiveClientTab } = usePamwill();
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentCityObj = INDIAN_CITIES.find(c => c.id === selectedCity) || INDIAN_CITIES[0];

  const filteredCities = INDIAN_CITIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header style={{
      padding: '16px 20px 12px 20px',
      backgroundColor: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-hairline)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(8px)',
      background: 'rgba(250, 248, 245, 0.95)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Brand Logo & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src="/assets/pamwill-icon.png" 
            alt="PamWill Icon" 
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border-hairline)' }} 
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ 
                fontFamily: 'var(--font-serif)', 
                fontSize: '20px', 
                fontWeight: 600, 
                letterSpacing: '-0.02em', 
                color: 'var(--text-primary)' 
              }}>
                Pamwill
              </span>
              <span style={{ 
                fontSize: '9px', 
                fontWeight: 700, 
                backgroundColor: 'var(--accent-gold-light)', 
                color: 'var(--accent-gold-hover)', 
                padding: '2px 6px', 
                borderRadius: '4px',
                letterSpacing: '0.05em'
              }}>
                BOUTIQUE
              </span>
            </div>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Wellness Comes Home
            </p>
          </div>
        </div>

        {/* Right Actions: City Selector & Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* City Selector Pill */}
          <button 
            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--text-primary)'
            }}
          >
            <MapPin size={13} color="var(--accent-gold)" />
            <span style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentCityObj.name.split(' ')[0]}
            </span>
            <ChevronDown size={12} color="var(--text-muted)" />
          </button>

          {/* User Profile / Login Trigger */}
          <button
            onClick={() => {
              if (user.isAuthenticated) {
                // When logged in, navigate straight to Profile tab!
                setActiveClientTab('profile');
              } else {
                setAuthMode('login');
                setAuthModalOpen(true);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}
            title={user.isAuthenticated ? "View My Profile & Settings" : "Click to sign in with Google or Phone OTP"}
          >
            {user.avatarUrl ? (
              <div style={{
                width: '22px',
                height: '22px',
                minWidth: '22px',
                minHeight: '22px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1.5px solid var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                />
              </div>
            ) : (
              <div style={{
                width: '22px',
                height: '22px',
                minWidth: '22px',
                minHeight: '22px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-gold-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--accent-gold-hover)',
                flexShrink: 0
              }}>
                {user.name.charAt(0)}
              </div>
            )}
            <span style={{ maxWidth: '75px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.isAuthenticated ? user.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>
        </div>
      </div>

      {/* City Dropdown Modal / Drawer */}
      {cityDropdownOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(18, 16, 14, 0.4)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: '24px 16px'
        }}
        onClick={() => setCityDropdownOpen(false)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              maxWidth: '380px',
              width: '100%',
              margin: '60px auto 0 auto',
              boxShadow: 'var(--shadow-elevated)',
              border: '1px solid var(--border-hairline)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="eyebrow">Service Coverage</span>
                <h3 style={{ fontSize: '18px', marginTop: '2px' }}>Select Your City</h3>
              </div>
              <button 
                onClick={() => setCityDropdownOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <input 
              type="text" 
              placeholder="Search Indian cities & districts..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-hairline)',
                fontSize: '13px',
                marginBottom: '12px',
                backgroundColor: 'var(--bg-primary)',
                outline: 'none'
              }}
            />

            <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredCities.map(city => {
                const isSelected = city.id === selectedCity;
                return (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city.id);
                      setCityDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? '1px solid var(--accent-gold)' : '1px solid transparent',
                      backgroundColor: isSelected ? 'var(--accent-gold-light)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: isSelected ? 600 : 500, color: 'var(--text-primary)' }}>
                        {city.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {city.state} {city.popular ? '• Popular Hub' : ''}
                      </div>
                    </div>
                    {isSelected && <Sparkles size={14} color="var(--accent-gold)" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
