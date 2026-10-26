import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShieldCheck, HeartHandshake, Clock, 
  ChevronRight, ChevronLeft, Star, ArrowRight, Award, Compass, KeyRound,
  Activity, Search, X, Stethoscope, GraduationCap, CheckCircle2,
  AlertCircle, Zap, Shield, HeartPulse, UserCheck, PhoneCall
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { SERVICE_CATEGORIES } from '../../data/services';
import { PHYSIO_CONDITIONS, PHYSIO_CATEGORIES, PHYSIO_SERVICES, PHYSIO_ADD_ONS } from '../../data/physioData';
import { MassageService, PhysioCondition } from '../../types';

interface ClientHomeViewProps {
  onSelectService: (service: MassageService) => void;
  onOpenBookingFlow: () => void;
  onSwitchToTherapist: () => void;
  onOpenLiveTracking?: (bookingId: string) => void;
}

export const ClientHomeView: React.FC<ClientHomeViewProps> = ({
  onSelectService,
  onOpenBookingFlow,
  onSwitchToTherapist,
  onOpenLiveTracking
}) => {
  const { 
    services, 
    selectedCity, 
    user, 
    bookings, 
    clientHomeMode, 
    setClientHomeMode, 
    setClientSubRoute 
  } = usePamwill();

  // Spa Mode state
  const [activeCategory, setActiveCategory] = useState<string>("Relaxation & Wellness");

  // Physio Mode state
  const [physioSearch, setPhysioSearch] = useState('');
  const [activePhysioCategory, setActivePhysioCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState<PhysioCondition | null>(null);
  const [physioPage, setPhysioPage] = useState<number>(1);
  const pageSize = 10;

  // Reset page whenever category filter or search changes
  useEffect(() => {
    setPhysioPage(1);
  }, [activePhysioCategory, physioSearch]);

  // Active in-progress booking banner
  const activeBooking = bookings.find(b => 
    ['Accepted', 'On the Way', 'Arrived', 'Service Started'].includes(b.status)
  );

  const filteredSpaServices = services.filter(s => s.category === activeCategory);

  const categoryImages: Record<string, string> = {
    "Relaxation & Wellness": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    "Therapeutic": "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
    "Luxury & Spa": "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
    "Beauty & Wellness": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    "Specialized": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80"
  };

  // Filtered Physio Conditions
  const filteredConditions = PHYSIO_CONDITIONS.filter(c => {
    const matchesCat = activePhysioCategory === 'All' || c.category === activePhysioCategory;
    const matchesSearch = !physioSearch.trim() ||
      c.condition.toLowerCase().includes(physioSearch.toLowerCase()) ||
      c.commonSymptoms.toLowerCase().includes(physioSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Exactly 10 conditions at a time (remove old 10 when loading next 10)
  const totalPages = Math.ceil(filteredConditions.length / pageSize) || 1;
  const startIndex = (physioPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredConditions.length);
  const currentTenConditions = filteredConditions.slice(startIndex, endIndex);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px' }}>
      
      {/* ========================================================================= */}
      {/* SWIGGY / INSTAMART STYLE DUAL INTERFACE TAB SWITCHER                       */}
      {/* ========================================================================= */}
      <div style={{
        margin: '16px 20px 0 20px',
        display: 'flex',
        backgroundColor: '#1E1A16',
        padding: '5px',
        borderRadius: 'var(--radius-pill)',
        border: '1.5px solid rgba(169, 129, 47, 0.35)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        gap: '6px'
      }}>
        {/* Spa Tab */}
        <button
          onClick={() => setClientHomeMode('spa')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '11px 18px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: clientHomeMode === 'spa' ? 'var(--accent-gold)' : 'transparent',
            color: clientHomeMode === 'spa' ? '#FFFFFF' : '#BAAE9E',
            fontSize: '14px',
            fontWeight: clientHomeMode === 'spa' ? 700 : 500,
            cursor: 'pointer',
            boxShadow: clientHomeMode === 'spa' ? '0 4px 18px rgba(169, 129, 47, 0.45)' : 'none',
            transition: 'all 200ms ease'
          }}
        >
          <Sparkles size={16} color={clientHomeMode === 'spa' ? '#FFFFFF' : 'var(--accent-gold)'} />
          <span>Spa & Massage</span>
          {clientHomeMode === 'spa' && (
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF', marginLeft: '2px' }} />
          )}
        </button>

        {/* Physiotherapy Tab */}
        <button
          onClick={() => setClientHomeMode('physio')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '11px 18px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: clientHomeMode === 'physio' ? 'var(--accent-gold)' : 'transparent',
            color: clientHomeMode === 'physio' ? '#100E0C' : '#BAAE9E',
            fontSize: '14px',
            fontWeight: clientHomeMode === 'physio' ? 700 : 500,
            cursor: 'pointer',
            boxShadow: clientHomeMode === 'physio' ? '0 4px 18px rgba(212, 163, 89, 0.35)' : 'none',
            transition: 'all 200ms ease'
          }}
        >
          <Activity size={16} color={clientHomeMode === 'physio' ? '#100E0C' : 'var(--accent-gold)'} />
          <span>Physiotherapy</span>
        </button>
      </div>

      {/* Real-time Active Session Notification Banner */}
      {activeBooking && (
        <div 
          onClick={() => onOpenLiveTracking && onOpenLiveTracking(activeBooking.id)}
          style={{
            margin: '0 20px',
            padding: '14px 18px',
            borderRadius: 'var(--radius-lg)',
            background: activeBooking.status === 'Arrived'
              ? 'linear-gradient(135deg, rgba(212, 163, 89, 0.25) 0%, rgba(31, 27, 22, 0.9) 100%)'
              : activeBooking.status === 'Service Started'
              ? 'linear-gradient(135deg, rgba(62, 123, 76, 0.22) 0%, rgba(31, 27, 22, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(40, 30, 20, 0.95) 0%, rgba(20, 18, 15, 0.98) 100%)',
            border: activeBooking.status === 'Arrived' 
              ? '2px solid var(--accent-gold)' 
              : activeBooking.status === 'Service Started'
              ? '2px solid var(--status-success)'
              : '1px solid var(--accent-gold)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: activeBooking.status === 'Arrived' 
                ? 'var(--accent-gold)' 
                : activeBooking.status === 'Service Started' 
                ? 'var(--status-success)' 
                : 'var(--accent-gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              flexShrink: 0
            }}>
              {activeBooking.status === 'Arrived' ? <KeyRound size={20} /> :
               activeBooking.status === 'Service Started' ? <Sparkles size={20} /> :
               <Clock size={20} color="var(--accent-gold-hover)" />}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: activeBooking.status === 'Arrived' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.15)',
                  color: '#fff'
                }}>
                  {activeBooking.status === 'Arrived' ? '⚡ ARRIVED' : activeBooking.status.toUpperCase()}
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                  #{activeBooking.id}
                </span>
              </div>

              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                {activeBooking.status === 'Arrived' ? `Start OTP: ${activeBooking.startOtp || '4821'}` :
                 activeBooking.status === 'Service Started' ? (activeBooking.endOtp ? `Completion OTP: ${activeBooking.endOtp}` : 'Session In Progress • Tap to Rate') :
                 `${activeBooking.service.name} • ${activeBooking.status}`}
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '11px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            View <ChevronRight size={13} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: SPA & MASSAGE INTERFACE (SANCTUARY DELIVERED)                      */}
      {/* ========================================================================= */}
      {clientHomeMode === 'spa' && (
        <>
          {/* Editorial Luxury Hero Banner */}
          <div style={{
            position: 'relative',
            margin: '0 20px',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-elevated)',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '28px 24px',
            color: '#FFFFFF'
          }}>
            <img
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80"
              alt="Boutique Spa Sanctuary"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 1
              }}
            />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(31, 27, 22, 0.15) 0%, rgba(31, 27, 22, 0.9) 100%)',
              zIndex: 2
            }} />

            <div style={{ position: 'relative', zIndex: 3 }}>
              <span className="eyebrow" style={{ color: 'var(--accent-gold-light)', display: 'inline-block', marginBottom: '6px' }}>
                SANCTUARY DELIVERED
              </span>
              <h1 style={{
                color: '#FFFFFF',
                fontSize: '28px',
                lineHeight: 1.25,
                marginBottom: '8px',
                fontFamily: 'var(--font-serif)'
              }}>
                Restorative Touch, in Your Sacred Space.
              </h1>
              <p style={{ fontSize: '13px', color: 'rgba(250, 248, 245, 0.9)', marginBottom: '18px', lineHeight: 1.45, maxWidth: '640px' }}>
                Certified master therapists bringing organic cold-pressed oils, heated volcanic basalt stones, and sanitized luxury linens straight to your private residence.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={onOpenBookingFlow}
                  className="btn-gold"
                  style={{
                    padding: '12px 20px',
                    fontSize: '13.5px',
                    boxShadow: '0 4px 16px rgba(169, 129, 47, 0.4)'
                  }}
                >
                  Book Massage Now <ChevronRight size={15} />
                </button>
                <button
                  onClick={() => setClientSubRoute('membership')}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 18px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Privilege Memberships →
                </button>
              </div>
            </div>
          </div>

          {/* Privilege Memberships Promotional Banner */}
          <div 
            onClick={() => setClientSubRoute('membership')}
            style={{
              margin: '0 20px',
              padding: '18px 22px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #2A2013 0%, #1C160D 100%)',
              border: '1px solid rgba(212, 163, 89, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0,0,0,0.35)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(169, 129, 47, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--accent-gold)'
              }}>
                <Sparkles size={20} color="var(--accent-gold)" />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--accent-gold-light)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  PAMWILL PRIVILEGE TIERS
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#FAF8F5' }}>
                  Silver, Gold & Platinum Sanctuary
                </div>
                <div style={{ fontSize: '12px', color: '#BAAE9E' }}>
                  Save up to 30% on all 47 therapies + get up to 4 Complimentary Free Sittings!
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--accent-gold)',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}>
              Explore →
            </div>
          </div>

          {/* Horizontal Category Rail */}
          <div style={{ paddingLeft: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: '20px', marginBottom: '12px' }}>
              <div>
                <span className="eyebrow">Curated Disciplines</span>
                <h2 style={{ fontSize: '20px', margin: 0 }}>Therapy Categories</h2>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>47 Treatments</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingRight: '20px', paddingBottom: '8px' }}>
              {SERVICE_CATEGORIES.map(category => {
                const isActive = activeCategory === category;
                return (
                  <div
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    style={{
                      minWidth: '150px',
                      width: '150px',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      position: 'relative',
                      height: '115px',
                      cursor: 'pointer',
                      border: isActive ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                      boxShadow: isActive ? 'var(--shadow-elevated)' : 'var(--shadow-sm)',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={categoryImages[category]}
                      alt={category}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: isActive 
                        ? 'linear-gradient(180deg, rgba(31, 27, 22, 0.2) 0%, rgba(31, 27, 22, 0.85) 100%)' 
                        : 'linear-gradient(180deg, rgba(31, 27, 22, 0.1) 0%, rgba(31, 27, 22, 0.75) 100%)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '10px'
                    }}>
                      <span style={{
                        color: '#FFFFFF',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        lineHeight: 1.2,
                        fontFamily: 'var(--font-serif)'
                      }}>
                        {category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Spa Sessions List */}
          <div style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent-gold)' }}>{activeCategory}</span>
                <h2 style={{ fontSize: '18px', margin: 0 }}>Featured Sessions</h2>
              </div>
              <button 
                onClick={onOpenBookingFlow}
                style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                View All ({filteredSpaServices.length}) →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
              {filteredSpaServices.slice(0, 6).map(service => {
                const minPrice = Math.min(...Object.values(service.basePricePerDuration));
                return (
                  <div
                    key={service.id}
                    onClick={() => onSelectService(service)}
                    className="card-luxury"
                    style={{
                      display: 'flex',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                  >
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      style={{ width: '110px', height: '125px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>{service.name}</h3>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            ₹{minPrice}
                          </span>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 8px 0', lineHeight: 1.3 }}>
                          {service.description.slice(0, 75)}...
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {service.durationOptionsMin.map(d => (
                            <span key={d} style={{ fontSize: '10px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', padding: '2px 5px', borderRadius: '4px' }}>
                              {d}m
                            </span>
                          ))}
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                          Reserve <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PHYSIOTHERAPY INTERFACE (DOCTOR & INTERN CLINICAL CARE)            */}
      {/* ========================================================================= */}
      {clientHomeMode === 'physio' && (
        <>
          {/* Clinical Hero Card */}
          <div style={{
            position: 'relative',
            margin: '0 20px',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid rgba(212, 163, 89, 0.3)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '28px 24px',
            color: '#FFFFFF'
          }}>
            <img
              src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1400&q=80"
              alt="Clinical Physiotherapy Care"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'right 30%',
                zIndex: 1
              }}
            />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, rgba(18, 14, 11, 0.96) 0%, rgba(18, 14, 11, 0.8) 48%, rgba(18, 14, 11, 0.2) 100%)',
              zIndex: 2
            }} />

            <div style={{ position: 'relative', zIndex: 3 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(212, 163, 89, 0.18)',
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--accent-gold)',
                marginBottom: '8px',
                border: '1px solid rgba(212, 163, 89, 0.25)'
              }}>
                <ShieldCheck size={14} color="var(--accent-gold)" /> EVIDENCE-BASED CLINICAL CARE
              </div>

              <h1 style={{
                fontSize: '26px',
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                lineHeight: 1.25,
                margin: '4px 0 8px 0',
                color: '#FAF8F5'
              }}>
                Clinical Physiotherapy Delivered to Your Home
              </h1>

              <p style={{ fontSize: '13px', color: '#D4C9BC', lineHeight: 1.45, maxWidth: '640px', marginBottom: '18px' }}>
                Consult Senior Licensed Doctors of Physiotherapy (Dr.) for diagnostics & manual spinal mobilization, or book affordable guided rehabilitation sessions with certified Interns.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onSelectService(PHYSIO_SERVICES[0])}
                  style={{
                    backgroundColor: 'var(--accent-gold)',
                    color: '#100E0C',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(212, 163, 89, 0.35)',
                    transition: 'transform 160ms ease, box-shadow 160ms ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <Sparkles size={16} color="#100E0C" />
                  <span>Book Physiotherapy Session</span>
                </button>
              </div>
            </div>
          </div>

          {/* 130 Medical Conditions Directory Section */}
          <div style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent-gold)' }}>MEDICAL REHABILITATION DIRECTORY</span>
                <h2 style={{ fontSize: '20px', margin: 0 }}>130 Clinical Conditions</h2>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 600 }}>8 Specialties • Home Care</span>
            </div>

            {/* Condition Live Search Box */}
            <div style={{
              position: 'relative',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={18} color="var(--accent-gold)" style={{ position: 'absolute', left: '14px' }} />
              <input
                type="text"
                placeholder="Search condition or symptom (e.g. Sciatica, ACL, Cervical, Spondylosis, Stroke)..."
                value={physioSearch}
                onChange={e => setPhysioSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 38px 12px 42px',
                  backgroundColor: '#1E1A16',
                  border: '1.5px solid rgba(212, 163, 89, 0.35)',
                  borderRadius: 'var(--radius-pill)',
                  color: '#FAF8F5',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              {physioSearch && (
                <button
                  onClick={() => setPhysioSearch('')}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    background: 'none',
                    border: 'none',
                    color: '#BAAE9E',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Specialty Pills */}
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px',
              marginBottom: '14px'
            }}>
              <button
                onClick={() => setActivePhysioCategory('All')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: activePhysioCategory === 'All' ? '1.5px solid var(--accent-gold)' : '1px solid #332B22',
                  backgroundColor: activePhysioCategory === 'All' ? 'var(--accent-gold)' : '#1E1A16',
                  color: activePhysioCategory === 'All' ? '#100E0C' : '#BAAE9E',
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                All (130)
              </button>

              {PHYSIO_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActivePhysioCategory(cat.title)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    border: activePhysioCategory === cat.title ? '1.5px solid var(--accent-gold)' : '1px solid #332B22',
                    backgroundColor: activePhysioCategory === cat.title ? 'var(--accent-gold)' : '#1E1A16',
                    color: activePhysioCategory === cat.title ? '#100E0C' : '#BAAE9E',
                    fontSize: '12px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  {cat.title} ({cat.conditionsCount})
                </button>
              ))}
            </div>

            {/* Dynamic Conditions Grid - Exactly 10 at a Time */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '10px'
            }}>
              {currentTenConditions.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCondition(c)}
                  style={{
                    backgroundColor: '#1E1A16',
                    border: '1px solid #332B22',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    transition: 'all 150ms ease'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#FAF8F5' }}>
                      {c.condition}
                    </div>
                    <div style={{ fontSize: '11px', color: '#BAAE9E', marginTop: '3px' }}>
                      <span style={{ color: 'var(--accent-gold)', marginRight: '4px' }}>●</span>
                      {c.commonSymptoms}
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--accent-gold)" />
                </div>
              ))}
            </div>

            {/* Strict 10-at-a-time Pagination (removes old 10 when next 10 is loaded) */}
            <div style={{
              marginTop: '16px',
              padding: '14px 18px',
              backgroundColor: '#181411',
              borderRadius: '14px',
              border: '1px solid #2B241D',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ fontSize: '12.5px', color: '#BAAE9E' }}>
                Showing <strong style={{ color: 'var(--accent-gold)' }}>{filteredConditions.length === 0 ? 0 : startIndex + 1} - {endIndex}</strong> of <strong style={{ color: '#FAF8F5' }}>{filteredConditions.length}</strong> conditions • Page <strong style={{ color: 'var(--accent-gold)' }}>{physioPage}</strong> of <strong>{totalPages}</strong>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => setPhysioPage(prev => Math.max(1, prev - 1))}
                  disabled={physioPage <= 1}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: physioPage <= 1 ? '#1A1613' : '#231E19',
                    border: '1px solid ' + (physioPage <= 1 ? '#2E2720' : 'rgba(212, 163, 89, 0.35)'),
                    color: physioPage <= 1 ? '#5E5549' : 'var(--accent-gold)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: physioPage <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 150ms ease'
                  }}
                >
                  <ChevronLeft size={15} /> Previous 10
                </button>

                <span style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'rgba(212, 163, 89, 0.12)',
                  color: 'var(--accent-gold)',
                  fontSize: '12px',
                  fontWeight: 700
                }}>
                  {physioPage} / {totalPages}
                </span>

                <button
                  onClick={() => setPhysioPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={physioPage >= totalPages}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: physioPage >= totalPages ? '#1A1613' : 'var(--accent-gold)',
                    border: 'none',
                    color: physioPage >= totalPages ? '#5E5549' : '#100E0C',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: physioPage >= totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: physioPage >= totalPages ? 'none' : '0 3px 12px rgba(212, 163, 89, 0.3)',
                    transition: 'all 150ms ease'
                  }}
                >
                  Next 10 <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Clinical Treatment Protocols List */}
          <div style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent-gold)' }}>DOCTOR & INTERN PROTOCOLS</span>
                <h2 style={{ fontSize: '18px', margin: 0 }}>Clinical Treatment Sessions</h2>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
              {PHYSIO_SERVICES.map(service => {
                const minPrice = Math.min(...Object.values(service.basePricePerDuration));

                return (
                  <div
                    key={service.id}
                    onClick={() => onSelectService(service)}
                    className="card-luxury"
                    style={{
                      display: 'flex',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                  >
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      style={{ width: '110px', height: '125px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                            {service.name}
                          </h3>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                            ₹{minPrice}
                          </span>
                        </div>
                        <p style={{ 
                          fontSize: '11px', 
                          color: 'var(--text-secondary)', 
                          margin: '4px 0 8px 0', 
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {service.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {service.durationOptionsMin.map(d => (
                            <span key={d} style={{ fontSize: '10px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', padding: '2px 5px', borderRadius: '4px' }}>
                              {d}m
                            </span>
                          ))}
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                          Reserve <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}


      {/* Interactive Condition Detail Modal */}
      {selectedCondition && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1C1814',
            border: '1.5px solid var(--accent-gold)',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            color: '#FAF8F5',
            boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedCondition(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#BAAE9E',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <span style={{
              fontSize: '10px',
              fontWeight: 800,
              color: '#100E0C',
              backgroundColor: 'var(--accent-gold)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-pill)',
              textTransform: 'uppercase'
            }}>
              {selectedCondition.category}
            </span>

            <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-serif)', margin: '8px 0 4px 0' }}>
              {selectedCondition.condition}
            </h2>

            <div style={{
              backgroundColor: 'rgba(212, 163, 89, 0.08)',
              padding: '12px 14px',
              borderRadius: '12px',
              margin: '14px 0',
              border: '1px solid rgba(212, 163, 89, 0.2)'
            }}>
              <div style={{ fontSize: '11px', color: '#BAAE9E', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>
                Reported Common Symptoms
              </div>
              <div style={{ fontSize: '13px', color: 'var(--accent-gold)', fontWeight: 600 }}>
                {selectedCondition.commonSymptoms}
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#BAAE9E', lineHeight: 1.5, marginBottom: '20px' }}>
              Our licensed clinical team provides in-home clinical assessments, joint mobilization, neuromuscular re-education, and structured exercise therapy for this condition.
            </p>

            <button
              onClick={() => {
                setSelectedCondition(null);
                onSelectService(PHYSIO_SERVICES[0]);
              }}
              style={{
                width: '100%',
                backgroundColor: 'var(--accent-gold)',
                color: '#100E0C',
                padding: '13px 20px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(212, 163, 89, 0.35)'
              }}
            >
              <Sparkles size={16} /> Book Clinical Rehabilitation Session
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
