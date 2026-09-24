import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, HeartHandshake, Clock, 
  ChevronRight, Star, ArrowRight, Award, Compass, KeyRound 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { SERVICE_CATEGORIES } from '../../data/services';
import { MassageService } from '../../types';

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
  const { services, selectedCity, user, bookings } = usePamwill();
  const [activeCategory, setActiveCategory] = useState<string>("Relaxation & Wellness");

  // Find any active session for the patient
  const activeBooking = bookings.find(b => 
    ['Accepted', 'On the Way', 'Arrived', 'Service Started'].includes(b.status)
  );

  const filteredServices = services.filter(s => s.category === activeCategory);

  const categoryImages: Record<string, string> = {
    "Relaxation & Wellness": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    "Therapeutic": "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
    "Luxury & Spa": "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
    "Beauty & Wellness": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    "Specialized": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80"
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px' }}>
      
      {/* Real-time Active Session Notification Banner */}
      {activeBooking && (
        <div 
          onClick={() => onOpenLiveTracking && onOpenLiveTracking(activeBooking.id)}
          style={{
            margin: '14px 20px 0 20px',
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
            gap: '12px',
            transition: 'transform 0.15s ease'
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
      
      {/* Editorial Luxury Hero Banner */}
      <div style={{
        position: 'relative',
        margin: '16px 20px 0 20px',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-elevated)',
        minHeight: '260px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '24px 20px',
        color: '#FFFFFF'
      }}>
        {/* Background Image with warm dark gradient overlay */}
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
          background: 'linear-gradient(180deg, rgba(31, 27, 22, 0.15) 0%, rgba(31, 27, 22, 0.88) 100%)',
          zIndex: 2
        }} />

        <div style={{ position: 'relative', zIndex: 3 }}>
          <span className="eyebrow" style={{ color: 'var(--accent-gold-light)', display: 'inline-block', marginBottom: '6px' }}>
            Sanctuary Delivered
          </span>
          <h1 style={{
            color: '#FFFFFF',
            fontSize: '26px',
            lineHeight: 1.25,
            marginBottom: '8px',
            fontFamily: 'var(--font-serif)'
          }}>
            Restorative Touch, in Your Sacred Space.
          </h1>
          <p style={{ fontSize: '12px', color: 'rgba(250, 248, 245, 0.85)', marginBottom: '16px', lineHeight: 1.4 }}>
            Certified master therapists bringing organic oils, heated stones, and luxury linens straight to your door.
          </p>

          {/* Quick Action CTAs */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onOpenBookingFlow}
              className="btn-gold"
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: '13px',
                boxShadow: '0 4px 16px rgba(169, 129, 47, 0.4)'
              }}
            >
              Book Massage Now <ChevronRight size={15} />
            </button>
            <button
              onClick={onSwitchToTherapist}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Join as Therapist
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Category Rail */}
      <div style={{ paddingLeft: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: '20px', marginBottom: '12px' }}>
          <div>
            <span className="eyebrow">Curated Disciplines</span>
            <h2 style={{ fontSize: '20px', margin: 0 }}>Therapy Categories</h2>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>69 Treatments</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingRight: '20px', paddingBottom: '8px' }}>
          {SERVICE_CATEGORIES.map(category => {
            const isActive = activeCategory === category;
            return (
              <div
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  minWidth: '140px',
                  width: '140px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '110px',
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
                    fontSize: '12px',
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

      {/* Filtered Services List */}
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
            View All ({filteredServices.length}) →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredServices.slice(0, 4).map(service => {
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
                  style={{ width: '105px', height: '120px', objectFit: 'cover' }}
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

      {/* Why Choose Us Luxury Strip */}
      <div style={{
        margin: '0 20px',
        padding: '20px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-hairline)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span className="eyebrow">The PamWill Standard</span>
          <h3 style={{ fontSize: '18px', marginTop: '2px' }}>Pure Wellness, Zero Compromise</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ padding: '6px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)' }}>
              <ShieldCheck size={16} color="var(--accent-gold)" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>CIDESCO Certified</div>
              <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Rigorous 100% police & credential verified.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ padding: '6px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)' }}>
              <Sparkles size={16} color="var(--accent-gold)" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>Hospital-Grade Hygiene</div>
              <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Sterilized linens & organic single-use consumables.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ padding: '6px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)' }}>
              <Clock size={16} color="var(--accent-gold)" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>Arrives in 45 Mins</div>
              <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Live GPS tracking straight to your address.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ padding: '6px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)' }}>
              <Award size={16} color="var(--accent-gold)" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>Transparent Pricing</div>
              <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Zero hidden travel charges or tipping required.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Reviews Carousel */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ marginBottom: '12px' }}>
          <span className="eyebrow">Verified Experiences</span>
          <h3 style={{ fontSize: '18px', marginTop: '2px' }}>Words from Our Patrons</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            {
              author: "Mrs. Radhika Singhania",
              city: "Golf Links, New Delhi",
              service: "Ayurvedic Abhyanga",
              comment: "The therapist brought custom warm brass vessels, lavender essences, and plush white linen. Felt as quiet and pristine as the Oberoi Spa.",
              stars: 5
            },
            {
              author: "Vikram Mehta",
              city: "Juhu, Mumbai",
              service: "Deep Tissue Massage",
              comment: "I travel constantly for work. Having a verified master therapist arrive at my hotel suite in under 40 minutes completely saved my back.",
              stars: 5
            }
          ].map((rev, i) => (
            <div key={i} className="card-luxury" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{rev.author}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rev.city} • {rev.service}</div>
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(rev.stars)].map((_, idx) => (
                    <Star key={idx} size={12} fill="var(--accent-gold)" color="var(--accent-gold)" />
                  ))}
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
