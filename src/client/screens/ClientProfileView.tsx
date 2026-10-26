import React, { useState } from 'react';
import { 
  Crown, Coins, MapPin, Calendar, FileText, Tag, 
  Headphones, MessageSquare, Info, Shield, RefreshCw, 
  LogOut, ChevronRight, Edit3, Camera, ShieldCheck
} from 'lucide-react';
import { usePamwill } from '../../state/store';

export const ClientProfileView: React.FC = () => {
  const { user, updateUser, bookings, setClientSubRoute, logout } = usePamwill();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Valued Patron');
  const [editPhone, setEditPhone] = useState(user?.phone || '+91 98765 43210');

  const credits = user?.membershipCredits || 0;
  const activeBookingsCount = bookings.filter(b =>
    ['Accepted', 'On the Way', 'Arrived', 'Service Started'].includes(b.status)
  ).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name: editName, phone: editPhone });
    setEditModalOpen(false);
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out of Pamwill?')) {
      logout();
    }
  };

  return (
    <div className="client-profile-container" style={{
      width: '100%',
      maxWidth: '100%',
      margin: '0 auto',
      padding: '24px 32px 40px',
      backgroundColor: '#FAF8F5',
      minHeight: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{
            fontSize: '10px',
            fontWeight: 800,
            color: '#A9812F',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            SANCTUARY CONCIERGE
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#1F1B16',
            margin: '2px 0 0 0',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '-0.5px'
          }}>
            Patron Profile
          </h1>
        </div>

        <button
          onClick={() => setEditModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4DDD2',
            padding: '7px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#A9812F',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(31, 27, 22, 0.04)'
          }}
        >
          <Edit3 size={14} color="#A9812F" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Responsive 2-Column Grid for Desktop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Column: Hero Patron Card, Membership, Account Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Hero Patron Card (Screenshots 2 & 4) */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E4DDD2',
            boxShadow: '0 4px 16px rgba(31, 27, 22, 0.04)',
            overflow: 'hidden'
          }}>
            {/* Gold top bar */}
            <div style={{ height: '4px', backgroundColor: '#A9812F' }} />

            <div style={{ padding: '20px' }}>
              {/* Top row: Avatar + Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#F7EEDD',
                    border: '2px solid #A9812F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '20px', fontWeight: 800, color: '#A9812F' }}>
                        {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'PW'}
                      </span>
                    )}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#A9812F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #FFFFFF'
                  }}>
                    <Camera size={11} color="#FFFFFF" />
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>
                    {user?.name || 'Valued Patron'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B6259', marginTop: '2px' }}>
                    {user?.email || 'patron@pamwill.com'}
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#F7EEDD',
                    color: '#A9812F',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    marginTop: '6px'
                  }}>
                    <span>🪪 PAMWILL PATRON</span>
                  </div>
                </div>
              </div>

              {/* 4 Stat columns */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                borderTop: '1px solid #F1ECE4',
                paddingTop: '14px',
                textAlign: 'center'
              }}>
                <div style={{ borderRight: '1px solid #F1ECE4' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>0</div>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: '#9A8F82', letterSpacing: '0.5px' }}>SESSIONS</div>
                </div>
                <div style={{ borderRight: '1px solid #F1ECE4' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>🪙 0</div>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: '#9A8F82', letterSpacing: '0.5px' }}>PAMCOINS</div>
                </div>
                <div style={{ borderRight: '1px solid #F1ECE4' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>Standard</div>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: '#9A8F82', letterSpacing: '0.5px' }}>TIER</div>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#4C6B4F' }}>Active</div>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: '#9A8F82', letterSpacing: '0.5px' }}>SOS SAFETY</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: SANCTUARY MEMBERSHIP (Screenshot 4) */}
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#6B6259',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              paddingLeft: '4px'
            }}>
              SANCTUARY MEMBERSHIP
            </div>

            <div
              onClick={() => setClientSubRoute('membership')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px solid #A9812F',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(169, 129, 47, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#F7EEDD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#A9812F',
                  flexShrink: 0
                }}>
                  <Crown size={20} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#1F1B16' }}>
                      Sanctuary Membership
                    </span>
                    <span style={{
                      backgroundColor: '#F7EEDD',
                      color: '#A9812F',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      {credits} Credits
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B6259', marginTop: '2px' }}>
                    Subscribe to Silver, Gold, or Platinum plans for complimentary Spa & Massage sessions
                  </div>
                </div>
              </div>

              <ChevronRight size={18} color="#9A8F82" />
            </div>
          </div>

          {/* Section: ACCOUNT ACTIONS (Screenshot 2) */}
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#6B6259',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              paddingLeft: '4px'
            }}>
              ACCOUNT ACTIONS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                onClick={() => window.location.href = '/therapist'}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><RefreshCw size={18} color="#A9812F" /></div>
                  <div style={menuTitleStyle}>Switch / Relink Account</div>
                </div>
                <ChevronRight size={16} color="#9A8F82" />
              </div>

              <button
                onClick={handleSignOut}
                style={{
                  backgroundColor: '#F9EFEF',
                  border: '1px solid rgba(140, 58, 43, 0.15)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: '#8C3A2B',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '4px'
                }}
              >
                <LogOut size={16} color="#8C3A2B" />
                <span>Sign Out of Pamwill</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Reservations & Store, Patron Care & Voice, Governance & Platform */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Section: RESERVATIONS & STORE (Screenshot 4) */}
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#6B6259',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              paddingLeft: '4px'
            }}>
              RESERVATIONS & STORE
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* PamCoin */}
              <div
                onClick={() => setClientSubRoute('pamcoin')}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><Coins size={18} color="#A9812F" /></div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={menuTitleStyle}>PamCoin</span>
                      <span style={{ backgroundColor: '#A9812F', color: '#FFFFFF', fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>
                        1 COIN = ₹1
                      </span>
                    </div>
                    <div style={menuSubStyle}>Wallet balance & 1–10% cashback reward transaction details</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ backgroundColor: '#F7EEDD', color: '#A9812F', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                    🪙 0
                  </span>
                  <ChevronRight size={16} color="#9A8F82" />
                </div>
              </div>

              {/* Saved Delivery Addresses */}
              <div
                onClick={() => setClientSubRoute('addresses')}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><MapPin size={18} color="#A9812F" /></div>
                  <div>
                    <div style={menuTitleStyle}>Saved Delivery Addresses</div>
                    <div style={menuSubStyle}>Manage delivery destinations for sanctuary orders</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9A8F82" />
              </div>

              {/* Booking History */}
              <div
                onClick={() => setClientSubRoute('bookings')}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><Calendar size={18} color="#A9812F" /></div>
                  <div>
                    <div style={menuTitleStyle}>Booking History</div>
                    <div style={menuSubStyle}>Active sessions, past rituals, and rebooking</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {activeBookingsCount > 0 && (
                    <span style={{ backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                      {activeBookingsCount} Active
                    </span>
                  )}
                  <ChevronRight size={16} color="#9A8F82" />
                </div>
              </div>

              {/* Order & Invoice History */}
              <div
                onClick={() => setClientSubRoute('orders')}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><FileText size={18} color="#A9812F" /></div>
                  <div>
                    <div style={menuTitleStyle}>Order & Invoice History</div>
                    <div style={menuSubStyle}>Tax invoices, GST receipts, and transaction records</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9A8F82" />
              </div>

              {/* Vouchers & Promos */}
              <div
                onClick={() => setClientSubRoute('vouchers')}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><Tag size={18} color="#A9812F" /></div>
                  <div>
                    <div style={menuTitleStyle}>Vouchers & Promos</div>
                    <div style={menuSubStyle}>5 privileges available for instant discount</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ backgroundColor: '#F7EEDD', color: '#A9812F', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                    5 Available
                  </span>
                  <ChevronRight size={16} color="#9A8F82" />
                </div>
              </div>
            </div>
          </div>

          {/* Section: PATRON CARE & VOICE (Screenshot 2) */}
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#6B6259',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              paddingLeft: '4px'
            }}>
              PATRON CARE & VOICE
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                onClick={() => setClientSubRoute('support')}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><Headphones size={18} color="#A9812F" /></div>
                  <div>
                    <div style={menuTitleStyle}>24/7 Concierge & Support</div>
                    <div style={menuSubStyle}>WhatsApp desk, telephone helpline, and SOS</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9A8F82" />
              </div>

              <div
                onClick={() => setClientSubRoute('feedback')}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><MessageSquare size={18} color="#A9812F" /></div>
                  <div>
                    <div style={menuTitleStyle}>Patron Experience Feedback</div>
                    <div style={menuSubStyle}>Rate therapist expertise and app suggestions</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9A8F82" />
              </div>
            </div>
          </div>

          {/* Section: GOVERNANCE & PLATFORM (Screenshot 2) */}
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#6B6259',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              paddingLeft: '4px'
            }}>
              GOVERNANCE & PLATFORM
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                onClick={() => setClientSubRoute('about')}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><Info size={18} color="#A9812F" /></div>
                  <div>
                    <div style={menuTitleStyle}>About PamWill</div>
                    <div style={menuSubStyle}>CIDESCO accreditation and hygiene standards</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9A8F82" />
              </div>

              <div
                onClick={() => setClientSubRoute('privacy')}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><Shield size={18} color="#A9812F" /></div>
                  <div>
                    <div style={menuTitleStyle}>Privacy & Security Policy</div>
                    <div style={menuSubStyle}>ISO 27001 data protection and medical confidentiality</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9A8F82" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <form
            onSubmit={handleSaveProfile}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E4DDD2',
              padding: '24px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 12px 36px rgba(0,0,0,0.2)'
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>
              Edit Patron Profile
            </h3>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#6B6259', display: 'block', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #E4DDD2',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#6B6259', display: 'block', marginBottom: '4px' }}>
                Phone Number
              </label>
              <input
                type="text"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #E4DDD2',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#F1ECE4',
                  border: 'none',
                  color: '#6B6259',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  backgroundColor: '#A9812F',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const menuCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #E4DDD2',
  padding: '14px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(31, 27, 22, 0.03)',
  transition: 'transform 120ms ease'
};

const iconWrapStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: '#F7EEDD',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const menuTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  color: '#1F1B16'
};

const menuSubStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#6B6259',
  marginTop: '2px',
  lineHeight: '14px'
};
