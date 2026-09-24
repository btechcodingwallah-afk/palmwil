import React, { useState } from 'react';
import { 
  User, ShieldCheck, MapPin, Heart, PhoneCall, 
  ChevronRight, LogOut, Sparkles, Check, Edit3, 
  Crown, ShieldAlert, Clock, Compass, Phone
} from 'lucide-react';
import { usePamwill } from '../../state/store';

export const ClientProfileView: React.FC = () => {
  const { user, updateUser, setAuthModalOpen, setAuthMode, setAuthTargetRole, logout } = usePamwill();
  const [editing, setEditing] = useState(false);
  const [liveLocationSharing, setLiveLocationSharing] = useState(true);

  // Form states
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [medicalConditions, setMedicalConditions] = useState(user.medicalConditions.join(', '));
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyContact.phone);
  const [emergencyName, setEmergencyName] = useState(user.emergencyContact.name);

  const handleSave = () => {
    updateUser({
      name,
      phone,
      medicalConditions: medicalConditions.split(',').map(s => s.trim()).filter(Boolean),
      emergencyContact: {
        ...user.emergencyContact,
        name: emergencyName,
        phone: emergencyPhone
      }
    });
    setEditing(false);
  };

  return (
    <div style={{
      padding: '20px 20px 48px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      backgroundColor: 'var(--bg-primary)'
    }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--accent-gold)' }}>Personal Sanctuary</span>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '24px',
            fontWeight: 600,
            margin: '4px 0 0 0',
            color: 'var(--text-primary)'
          }}>
            Patron Profile
          </h1>
        </div>
        {user.isAuthenticated && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--status-success)',
            backgroundColor: 'rgba(52, 168, 83, 0.08)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid rgba(52, 168, 83, 0.2)'
          }}>
            <ShieldCheck size={13} /> Verified
          </span>
        )}
      </div>

      {/* ================= HERO PATRON CARD ================= */}
      {user.isAuthenticated ? (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1px solid rgba(169, 129, 47, 0.2)',
          boxShadow: '0 8px 30px rgba(31, 27, 22, 0.06)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Subtle gold decorative gradient bar */}
          <div style={{
            height: '4px',
            background: 'linear-gradient(90deg, var(--accent-gold-light), var(--accent-gold), var(--accent-gold-hover))'
          }} />

          <div style={{ padding: '24px 20px 20px 20px' }}>
            {/* Patron Main Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  minWidth: '64px',
                  minHeight: '64px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2.5px solid var(--accent-gold)',
                  boxShadow: '0 4px 16px rgba(169, 129, 47, 0.25)',
                  backgroundColor: 'var(--accent-gold-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  ) : (
                    <span style={{
                      fontSize: '22px',
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 700,
                      color: 'var(--accent-gold-hover)'
                    }}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>

                {/* Gold Check Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}>
                  <Check size={11} color="#FFFFFF" strokeWidth={3} />
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '20px',
                    fontWeight: 600,
                    margin: 0,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {user.name}
                  </h2>
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'var(--accent-gold-light)',
                  color: 'var(--accent-gold-hover)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  margin: '4px 0 6px 0'
                }}>
                  <Crown size={11} />
                  <span>{user.membershipTier ? `${user.membershipTier.toUpperCase()} SOVEREIGN` : 'PATRON'}</span>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {user.phone} • {user.city}
                </div>
              </div>
            </div>

            {/* Quick Sanctuary Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              padding: '12px 10px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-gold-hover)' }}>
                  {user.membershipCredits || 2}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Sessions Left
                </div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-hairline)', borderRight: '1px solid var(--border-hairline)' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Gold
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Tier Status
                </div>
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--status-success)' }}>
                  Active
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  SOS Safety
                </div>
              </div>
            </div>

            {/* Actions: Sanctuary Onboarding, Switch & Sign Out */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-hairline)', paddingTop: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  onClick={() => {
                    setAuthTargetRole('client');
                    setAuthMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="btn-gold"
                  style={{
                    padding: '7px 14px',
                    fontSize: '11px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Sparkles size={13} /> Edit Sanctuary Onboarding
                </button>

                <button
                  onClick={logout}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(140, 58, 43, 0.25)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '6px 14px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--status-error)',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                >
                  <LogOut size={12} /> Sign Out
                </button>
              </div>

              <button
                onClick={() => {
                  setAuthTargetRole('client');
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: '2px 0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Compass size={12} /> Switch / Relink Google Account
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Unauthenticated State */
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          padding: '28px 20px',
          textAlign: 'center',
          border: '1px solid var(--border-hairline)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-gold-light)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px'
          }}>
            <User size={28} color="var(--accent-gold-hover)" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', margin: '0 0 6px 0' }}>
            Enter PamWill Sanctuary
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '300px', margin: '0 auto 18px auto', lineHeight: 1.5 }}>
            Sign in with Google or Phone OTP to access private bespoke reservations, certified practitioners, and sovereign credits.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => {
                setAuthTargetRole('client');
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="btn-gold"
              style={{ width: '100%', padding: '14px', fontSize: '14px', boxShadow: '0 4px 14px rgba(169, 129, 47, 0.25)' }}
            >
              Sign In with Google or Mobile OTP →
            </button>
            <button
              onClick={() => {
                setAuthTargetRole('client');
                setAuthMode('register');
                setAuthModalOpen(true);
              }}
              className="btn-secondary"
              style={{ width: '100%', padding: '11px', fontSize: '12px' }}
            >
              Start Patron Sanctuary Onboarding →
            </button>
          </div>
        </div>
      )}

      {/* ================= HEALTH & PREFERENCES CARD ================= */}
      <div className="card-luxury" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={16} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '16px', margin: 0, fontWeight: 600 }}>Health Profile & Preferences</h3>
          </div>
          <button
            onClick={() => {
              if (editing) handleSave();
              else setEditing(true);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-gold)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {editing ? (
              <span style={{ color: 'var(--status-success)' }}>Save Changes ✓</span>
            ) : (
              <>
                <Edit3 size={12} /> Edit Details
              </>
            )}
          </button>
        </div>

        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>FULL NAME</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>PHONE NUMBER</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>MEDICAL CONDITIONS / NOTES (FOR PRACTITIONER SAFETY)</label>
              <textarea
                rows={2}
                value={medicalConditions}
                onChange={e => setMedicalConditions(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', paddingBottom: '8px', borderBottom: '1px solid var(--border-hairline)' }}>
              <span>Gender & Age:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{user.gender}, {user.age} yrs</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', paddingBottom: '8px', borderBottom: '1px solid var(--border-hairline)' }}>
              <span>Specialist Preference:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{user.preferredTherapistGender}</strong>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Recorded Health Sensitivities:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {user.medicalConditions && user.medicalConditions.length > 0 ? (
                  user.medicalConditions.map((cond, idx) => (
                    <span key={idx} style={{
                      fontSize: '11px',
                      backgroundColor: 'var(--bg-secondary)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--border-hairline)',
                      color: 'var(--text-primary)'
                    }}>
                      • {cond}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>None recorded. All pressure gradients permitted.</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= SAFETY CENTER & SOS SETUP ================= */}
      <div className="card-luxury" style={{ padding: '20px', borderLeft: '4px solid var(--status-error)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <ShieldAlert size={18} color="var(--status-error)" />
          <h3 style={{ fontSize: '16px', margin: 0, color: 'var(--text-primary)' }}>Safety Center & SOS Dispatch</h3>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
          PamWill tracks every verified appointment with hospital-grade security. Tapping SOS instantaneously transmits encrypted GPS coordinates to designated family and response teams.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-hairline)' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Emergency Contact</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {user.emergencyContact.name} ({user.emergencyContact.relationship}) • {user.emergencyContact.phone}
            </div>
          </div>
          <span style={{
            fontSize: '11px',
            color: 'var(--status-success)',
            fontWeight: 600,
            backgroundColor: 'rgba(52, 168, 83, 0.08)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-pill)'
          }}>
            Active ✓
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Live Location Sharing</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Real-time telemetry shared with concierge dispatch during active session
            </div>
          </div>
          <input
            type="checkbox"
            checked={liveLocationSharing}
            onChange={e => setLiveLocationSharing(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* ================= SAVED SANCTUARIES ================= */}
      <div className="card-luxury" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <MapPin size={16} color="var(--accent-gold)" />
          <h3 style={{ fontSize: '16px', margin: 0, fontWeight: 600 }}>Saved Sanctuaries & Addresses</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {user.savedAddresses.map(addr => (
            <div key={addr.id} style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              padding: '10px 12px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin size={15} color="var(--accent-gold)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 600 }}>{addr.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '1px' }}>{addr.address}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 24/7 WHATSAPP CONCIERGE ================= */}
      <a
        href="https://wa.me/919811044219"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-hairline)',
          textDecoration: 'none',
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(52, 168, 83, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <PhoneCall size={18} color="var(--status-success)" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>PamWill Sovereign Concierge</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Live WhatsApp assistance 24/7 for appointments</div>
          </div>
        </div>
        <ChevronRight size={16} color="var(--text-muted)" />
      </a>

    </div>
  );
};
