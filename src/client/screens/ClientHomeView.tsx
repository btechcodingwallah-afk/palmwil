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
      {/* SWIGGY / INSTAMART STYLE DUAL INTERFACE TAB SWITCHER (Screenshot 1)         */}
      {/* ========================================================================= */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '8px 16px',
        borderBottom: '1px solid #EBE5DC'
      }}>
        <div style={{
          display: 'flex',
          backgroundColor: '#F3EFE9',
          borderRadius: '24px',
          padding: '4px',
          gap: '4px',
          maxWidth: '680px',
          margin: '0 auto'
        }}>
          {/* Physiotherapy Tab (FIRST) */}
          <button
            onClick={() => setClientHomeMode('physio')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: clientHomeMode === 'physio' ? '#0D9488' : 'transparent',
              color: clientHomeMode === 'physio' ? '#FFFFFF' : '#0D9488',
              fontSize: '13px',
              fontWeight: clientHomeMode === 'physio' ? 800 : 700,
              cursor: 'pointer',
              boxShadow: clientHomeMode === 'physio' ? '0 2px 8px rgba(13, 148, 136, 0.3)' : 'none',
              transition: 'all 160ms ease'
            }}
          >
            <Activity size={15} color={clientHomeMode === 'physio' ? '#FFFFFF' : '#0D9488'} />
            <span>Physiotherapy</span>
            <span style={{
              fontSize: '8px',
              fontWeight: 900,
              letterSpacing: '0.5px',
              padding: '2px 6px',
              borderRadius: '10px',
              backgroundColor: clientHomeMode === 'physio' ? 'rgba(255,255,255,0.25)' : '#CCFBF1',
              color: clientHomeMode === 'physio' ? '#FFFFFF' : '#0F766E'
            }}>
              DR. & INTERN
            </span>
            {clientHomeMode === 'physio' && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF', marginLeft: '2px' }} />
            )}
          </button>

          {/* Spa & Massage Tab (SECOND) */}
          <button
            onClick={() => setClientHomeMode('spa')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: clientHomeMode === 'spa' ? '#A9812F' : 'transparent',
              color: clientHomeMode === 'spa' ? '#FFFFFF' : '#8A7B6D',
              fontSize: '13px',
              fontWeight: clientHomeMode === 'spa' ? 800 : 700,
              cursor: 'pointer',
              boxShadow: clientHomeMode === 'spa' ? '0 2px 8px rgba(169, 129, 47, 0.3)' : 'none',
              transition: 'all 160ms ease'
            }}
          >
            <Sparkles size={15} color={clientHomeMode === 'spa' ? '#FFFFFF' : '#8A7B6D'} />
            <span>Spa & Massage</span>
            {clientHomeMode === 'spa' && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF', marginLeft: '2px' }} />
            )}
          </button>
        </div>
      </div>

      {/* Real-time Active Session Notification Banner (Screenshot 1) */}
      {activeBooking && (
        <div 
          onClick={() => onOpenLiveTracking && onOpenLiveTracking(activeBooking.id)}
          style={{
            margin: '14px 16px 0 16px',
            padding: '14px 16px',
            borderRadius: '16px',
            backgroundColor: '#1F1B16',
            boxShadow: '0 8px 24px rgba(31, 27, 22, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '19px',
              backgroundColor: '#A9812F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0
            }}>
              <KeyRound size={18} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                  letterSpacing: '0.5px'
                }}>
                  {activeBooking.status.toUpperCase()}
                </span>
                <span style={{ fontSize: '11px', color: '#E4DDD2', fontWeight: 600 }}>
                  #{activeBooking.id}
                </span>
              </div>

              <div style={{ fontSize: '12px', fontWeight: 700, color: '#FAF8F5' }}>
                {activeBooking.service?.name} • {activeBooking.status}
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.18)',
            color: '#FFFFFF',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            View <ChevronRight size={13} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: SPA & MASSAGE INTERFACE (SANCTUARY DELIVERED - Screenshot 1)        */}
      {/* ========================================================================= */}
      {clientHomeMode === 'spa' && (
        <>
          {/* Editorial Luxury Hero Banner (Screenshot 1) */}
          <div style={{
            position: 'relative',
            margin: '14px 16px 0 16px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(31, 27, 22, 0.08)',
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '18px',
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

            <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{
                color: '#E2B755',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}>
                SANCTUARY DELIVERED
              </span>
              <h2 style={{
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: 800,
                lineHeight: '26px',
                margin: 0,
                fontFamily: 'var(--font-sans)'
              }}>
                Restorative Touch, in Your Sacred Space.
              </h2>
              <p style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.85)',
                margin: 0,
                lineHeight: '16px'
              }}>
                Certified master therapists bringing organic cold-pressed oils, heated basalt stones, and luxury linens straight to your door.
              </p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  onClick={onOpenBookingFlow}
                  style={{
                    backgroundColor: '#A9812F',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 4px 14px rgba(169, 129, 47, 0.35)'
                  }}
                >
                  Book Massage Now <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => setClientSubRoute('membership')}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Privilege Memberships
                </button>
              </div>
            </div>
          </div>

          {/* Privilege Memberships Promotional Banner (Screenshot 1) */}
          <div 
            onClick={() => setClientSubRoute('membership')}
            style={{
              margin: '14px 16px 0 16px',
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: '#1F1B16',
              border: '1px solid #3D2F1E',
              boxShadow: '0 4px 16px rgba(31, 27, 22, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{
                fontSize: '9px',
                fontWeight: 800,
                color: '#E2B755',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                💎 PAMWILL PRIVILEGE TIERS
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                Silver, Gold & Platinum Sanctuary
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', marginTop: '2px', lineHeight: '15px' }}>
                Save up to 30% on all 47 spa therapies + get up to 4 Complimentary Free Sittings! (Exclusive to Spa & Massage)
              </div>
            </div>

            <button
              style={{
                backgroundColor: '#A9812F',
                color: '#FFFFFF',
                border: 'none',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                marginLeft: '12px'
              }}
            >
              Explore →
            </button>
          </div>

          {/* Categories Carousel (Screenshot 1) */}
          <div style={{ marginTop: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              padding: '0 18px',
              marginBottom: '12px'
            }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#A9812F', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                  CATALOGUE & WELLNESS
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#1F1B16', marginTop: '2px' }}>
                  Therapy Categories
                </div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A8F82' }}>
                60 Standard Treatments
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              padding: '0 18px',
              scrollbarWidth: 'none'
            }}>
              {[
                { name: 'Relaxation & Wellness', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80' },
                { name: 'Therapeutic', img: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80' },
                { name: 'Luxury & Spa', img: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80' },
                { name: 'Beauty & Wellness', img: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80' },
                { name: 'Specialized', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80' }
              ].map(cat => (
                <div
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  style={{
                    width: '140px',
                    height: '95px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(31, 27, 22, 0.08)',
                    border: activeCategory === cat.name ? '2px solid #A9812F' : 'none'
                  }}
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(31, 27, 22, 0.1) 0%, rgba(31, 27, 22, 0.8) 100%)'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    right: '10px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: '0.3px',
                    lineHeight: '15px'
                  }}>
                    {cat.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Sessions (Screenshot 1) */}
          <div style={{ marginTop: '24px', padding: '0 18px', paddingBottom: '30px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '14px'
            }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#A9812F', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                  RELAXATION & WELLNESS
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#1F1B16', marginTop: '2px' }}>
                  Featured Sessions
                </div>
              </div>
              <div 
                onClick={onOpenBookingFlow}
                style={{ fontSize: '12px', fontWeight: 700, color: '#A9812F', cursor: 'pointer' }}
              >
                View All ({filteredSpaServices.length}) →
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredSpaServices.slice(0, 6).map(svc => {
                const minPrice = Math.min(...Object.values(svc.basePricePerDuration));
                return (
                  <div
                    key={svc.id}
                    onClick={() => onSelectService(svc)}
                    style={{
                      display: 'flex',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '12px',
                      border: '1px solid #E4DDD2',
                      boxShadow: '0 4px 16px rgba(31, 27, 22, 0.04)',
                      cursor: 'pointer',
                      gap: '12px'
                    }}
                  >
                    <img
                      src={svc.imageUrl}
                      alt={svc.name}
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        backgroundColor: '#EBE5DC',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#1F1B16', marginRight: '8px' }}>
                          {svc.name}
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#A9812F', whiteSpace: 'nowrap' }}>
                          ₹{minPrice}
                        </div>
                      </div>

                      <div style={{
                        fontSize: '11px',
                        color: '#6B6259',
                        marginTop: '2px',
                        lineHeight: '15px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {svc.description}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {svc.durationOptionsMin.map(d => (
                            <span
                              key={d}
                              style={{
                                backgroundColor: '#F7EEDD',
                                border: '1px solid #E4DDD2',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 700,
                                color: '#A9812F'
                              }}
                            >
                              {d}m
                            </span>
                          ))}
                        </div>

                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#A9812F', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          Reserve <ChevronRight size={13} />
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
                  backgroundColor: 'var(--bg-surface)',
                  border: '1.5px solid var(--border-hairline)',
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                  boxShadow: 'var(--shadow-sm)'
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
                    color: 'var(--text-muted)',
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
                  border: activePhysioCategory === 'All' ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                  backgroundColor: activePhysioCategory === 'All' ? 'var(--accent-gold)' : 'var(--bg-surface)',
                  color: activePhysioCategory === 'All' ? '#100E0C' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
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
                    border: activePhysioCategory === cat.title ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                    backgroundColor: activePhysioCategory === cat.title ? 'var(--accent-gold)' : 'var(--bg-surface)',
                    color: activePhysioCategory === cat.title ? '#100E0C' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
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
                  className="card-luxury"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-hairline)',
                    borderRadius: '14px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 150ms ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.borderColor = 'var(--accent-gold)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-hairline)';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {c.condition}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px' }}>
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
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '14px',
              border: '1px solid var(--border-hairline)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Showing <strong style={{ color: 'var(--accent-gold)' }}>{filteredConditions.length === 0 ? 0 : startIndex + 1} - {endIndex}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{filteredConditions.length}</strong> conditions • Page <strong style={{ color: 'var(--accent-gold)' }}>{physioPage}</strong> of <strong>{totalPages}</strong>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => setPhysioPage(prev => Math.max(1, prev - 1))}
                  disabled={physioPage <= 1}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: physioPage <= 1 ? 'var(--bg-secondary)' : 'var(--bg-surface)',
                    border: '1px solid ' + (physioPage <= 1 ? 'var(--border-hairline)' : 'rgba(212, 163, 89, 0.4)'),
                    color: physioPage <= 1 ? 'var(--text-muted)' : 'var(--accent-gold)',
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
                    backgroundColor: physioPage >= totalPages ? 'var(--bg-secondary)' : 'var(--accent-gold)',
                    border: 'none',
                    color: physioPage >= totalPages ? 'var(--text-muted)' : '#100E0C',
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
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--accent-gold)',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            color: 'var(--text-primary)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
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
                color: 'var(--text-muted)',
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

            <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-serif)', margin: '8px 0 4px 0', color: 'var(--text-primary)' }}>
              {selectedCondition.condition}
            </h2>

            <div style={{
              backgroundColor: 'rgba(212, 163, 89, 0.08)',
              padding: '12px 14px',
              borderRadius: '12px',
              margin: '14px 0',
              border: '1px solid rgba(212, 163, 89, 0.25)'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>
                Reported Common Symptoms
              </div>
              <div style={{ fontSize: '13px', color: 'var(--accent-gold)', fontWeight: 600 }}>
                {selectedCondition.commonSymptoms}
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
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
