import React, { useState } from 'react';
import { WebsitePage } from '../types';
import { WHY_CHOOSE_PILLARS, TESTIMONIALS } from '../data/websiteContent';
import { MASSAGE_SERVICES } from '../../data/services';
import { MassageService } from '../../types';
import { 
  Sparkles, 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  Award, 
  Clock, 
  CheckCircle2, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Smartphone,
  MessageSquare,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { DownloadSection } from '../components/DownloadSection';

interface HomePageProps {
  onNavigatePage: (page: WebsitePage) => void;
  onOpenWellnessGuide: () => void;
  onSelectService: (service: MassageService) => void;
  onOpenAppDownload?: (type?: 'patient' | 'therapist') => void;
  onNavigateRole?: (role: 'client' | 'therapist' | 'admin') => void;
  onShowToast?: (msg: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigatePage,
  onOpenWellnessGuide,
  onSelectService,
  onOpenAppDownload,
  onNavigateRole,
  onShowToast
}) => {
  const { setTrainingModalOpen } = usePamwill();
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  // Take top 3 curated featured services
  const featuredServices = MASSAGE_SERVICES.slice(0, 3);
  const homeTestimonials = TESTIMONIALS.slice(0, 3);

  const nextTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev + 1) % homeTestimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev - 1 + homeTestimonials.length) % homeTestimonials.length);
  };

  const getPillarIcon = (name: string) => {
    switch (name) {
      case 'Award': return <Award size={22} color="var(--cta)" />;
      case 'Sparkles': return <Sparkles size={22} color="var(--cta)" />;
      case 'ShieldCheck': return <ShieldCheck size={22} color="var(--cta)" />;
      default: return <CheckCircle2 size={22} color="var(--cta)" />;
    }
  };

  const handleAppLaunch = (type: 'patient' | 'therapist' = 'patient') => {
    if (onOpenAppDownload) {
      onOpenAppDownload(type);
    } else {
      onNavigatePage('contact');
    }
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: 'var(--background)',
      color: 'var(--text)',
      transition: 'background-color 200ms ease, color 200ms ease'
    }}>
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '72px 24px 84px',
        overflow: 'hidden',
        background: 'var(--hero-bg)',
        color: 'var(--text)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          
          {/* Eyebrow Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--pill-bg)',
            border: '1px solid var(--pill-border)',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 16px',
            fontSize: '11.5px',
            fontWeight: 700,
            color: 'var(--pill-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '20px'
          }}>
            <Sparkles size={14} color="var(--cta)" /> Luxury In-Home Spa Sanctuary
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: 600,
            lineHeight: 1.18,
            color: 'var(--text)',
            letterSpacing: '-0.025em',
            maxWidth: '880px',
            margin: '0 auto 20px'
          }}>
            Five-Star Spa & Clinical Recovery Rituals Delivered to Your Sanctuary
          </h1>

          {/* Value Prop */}
          <p style={{
            fontSize: 'clamp(15px, 2vw, 17px)',
            lineHeight: 1.6,
            color: 'var(--text-muted)',
            maxWidth: '660px',
            margin: '0 auto 36px',
            fontWeight: 400
          }}>
            Indulge in certified master massage therapists, heated basalt stones, and pure cold-pressed botanicals in the serene privacy of your home or luxury hotel suite.
          </p>

          {/* Primary Action Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <button
              onClick={() => onNavigatePage('services')}
              style={{
                backgroundColor: 'var(--cta)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '15px 32px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(198, 165, 103, 0.35)',
                transition: 'all 160ms ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--cta-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--cta)')}
            >
              Explore Services <ArrowRight size={17} />
            </button>

            {/* Direct App Launch Button */}
            <button
              onClick={() => handleAppLaunch('patient')}
              style={{
                backgroundColor: 'var(--surface-card)',
                color: 'var(--text)',
                border: '1.5px solid var(--border-gold)',
                borderRadius: 'var(--radius-pill)',
                padding: '14px 28px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backdropFilter: 'blur(8px)',
                transition: 'all 160ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                e.currentTarget.style.borderColor = 'var(--cta)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                e.currentTarget.style.borderColor = 'var(--border-gold)';
              }}
            >
              <Smartphone size={16} color="var(--cta)" /> Get The App to Book
            </button>

            {/* Download Guide */}
            <button
              onClick={onOpenWellnessGuide}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-hairline)',
                borderRadius: 'var(--radius-pill)',
                padding: '14px 24px',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 160ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--cta)';
                e.currentTarget.style.color = 'var(--cta)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hairline)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <Download size={15} color="var(--cta)" /> Wellness Guide (20% Off)
            </button>
          </div>

          {/* Trust proof indicators */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '44px',
            fontSize: '13px',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="var(--cta)" /> 100% Background-Verified Therapists
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={16} color="var(--cta)" fill="var(--cta)" /> 4.96/5 Star Guest Rating
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="var(--cta)" /> Medical-Grade Sanitation
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE PAMWILL (4 Scannable Pillars) */}
      <section style={{
        padding: '70px 24px',
        backgroundColor: 'var(--surface-card)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--cta)',
              marginBottom: '8px'
            }}>
              Uncompromising Quality
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              fontWeight: 600,
              color: 'var(--text)',
              margin: 0
            }}>
              Why Discriminating Guests Choose PamWill
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {WHY_CHOOSE_PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border-hairline)',
                  borderRadius: '16px',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: 'var(--card-shadow)',
                  transition: 'transform 180ms ease, border-color 180ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--cta)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-hairline)';
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getPillarIcon(pillar.iconName)}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '19px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  margin: 0
                }}>
                  {pillar.title}
                </h3>
                <p style={{
                  fontSize: '13.5px',
                  lineHeight: 1.55,
                  color: 'var(--text-muted)',
                  margin: 0
                }}>
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE RITUALS PREVIEW */}
      <section style={{
        padding: '80px 24px',
        backgroundColor: 'var(--background)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '40px'
          }}>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--cta)',
                marginBottom: '8px'
              }}>
                Curated Menu
              </div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(26px, 3.5vw, 36px)',
                fontWeight: 600,
                color: 'var(--text)',
                margin: 0
              }}>
                Signature Rituals & Bodywork
              </h2>
            </div>

            <button
              onClick={() => onNavigatePage('services')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--cta)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 0'
              }}
            >
              View Full Menu & Pricing <ArrowRight size={16} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {featuredServices.map((service) => (
              <div
                key={service.id}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-hairline)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--card-shadow)',
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--cta)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-hairline)';
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#FFFFFF'
                  }}>
                    From ₹{(service.basePricePerDuration[60] || 1699).toLocaleString()}
                  </div>
                </div>

                <div style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '11px', color: 'var(--cta)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                    {service.category}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'var(--text)',
                    margin: '0 0 8px'
                  }}>
                    {service.name}
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: 'var(--text-muted)',
                    margin: '0 0 18px',
                    flex: 1
                  }}>
                    {service.description.slice(0, 90)}...
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <Clock size={14} color="var(--cta)" />
                      <span>{service.durationOptionsMin.join(' / ')} min</span>
                    </div>

                    <button
                      onClick={() => onSelectService(service)}
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--cta)',
                        border: '1px solid var(--border-gold)',
                        borderRadius: 'var(--radius-pill)',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 150ms ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--cta)';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--cta)';
                      }}
                    >
                      Ritual Info <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIAL CAROUSEL (3 Quotes Max) */}
      <section style={{
        padding: '70px 24px',
        backgroundColor: 'var(--surface-card)',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--cta)',
            marginBottom: '8px'
          }}>
            Guest Reflections
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(24px, 3.5vw, 34px)',
            fontWeight: 600,
            color: 'var(--text)',
            margin: '0 0 32px'
          }}>
            Trusted by Connoisseurs of Wellness
          </h2>

          {/* Testimonial Active Slide */}
          <div style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border-hairline)',
            borderRadius: '18px',
            padding: '36px 30px',
            position: 'relative',
            boxShadow: 'var(--card-shadow)'
          }}>
            {/* Stars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '16px' }}>
              {[...Array(homeTestimonials[activeTestimonialIdx].rating)].map((_, i) => (
                <Star key={i} size={17} color="var(--cta)" fill="var(--cta)" />
              ))}
            </div>

            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(16px, 2.5vw, 20px)',
              lineHeight: 1.6,
              color: 'var(--text)',
              fontStyle: 'italic',
              margin: '0 0 24px'
            }}>
              "{homeTestimonials[activeTestimonialIdx].quote}"
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <img
                src={homeTestimonials[activeTestimonialIdx].avatarUrl}
                alt={homeTestimonials[activeTestimonialIdx].clientName}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid var(--cta)'
                }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                  {homeTestimonials[activeTestimonialIdx].clientName}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {homeTestimonials[activeTestimonialIdx].location} • {homeTestimonials[activeTestimonialIdx].treatmentName}
                </div>
              </div>
            </div>

            {/* Carousel Navigation Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginTop: '28px'
            }}>
              <button
                onClick={prevTestimonial}
                aria-label="Previous review"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-hairline)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {activeTestimonialIdx + 1} / {homeTestimonials.length}
              </div>

              <button
                onClick={nextTestimonial}
                aria-label="Next review"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-hairline)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PAMWILL MOBILE APPLICATIONS DOWNLOAD CENTER */}
      <DownloadSection
        onNavigateRole={onNavigateRole || (() => {})}
        onOpenQr={(type) => {
          if (onOpenAppDownload) {
            onOpenAppDownload(type);
          }
        }}
        onShowToast={onShowToast || (() => {})}
      />

      {/* 6. FOOTER CTA BANNER */}
      <section style={{
        padding: '70px 24px',
        backgroundColor: 'var(--background)',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-gold)',
          borderRadius: '24px',
          padding: '50px 32px',
          position: 'relative',
          boxShadow: 'var(--card-shadow)',
          overflow: 'hidden'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--cta)',
            marginBottom: '10px'
          }}>
            On-Demand Sanctuary
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(26px, 4vw, 38px)',
            fontWeight: 600,
            color: 'var(--text)',
            margin: '0 0 16px'
          }}>
            Ready to Melt Away Tension in Your Sanctuary?
          </h2>

          <p style={{
            fontSize: '15px',
            color: 'var(--text-muted)',
            maxWidth: '560px',
            margin: '0 auto 30px',
            lineHeight: 1.5
          }}>
            Verified therapists arrive equipped with warm botanical oils, fresh linen sets, and heated stones in under 45 minutes via the PamWill App.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
            <button
              onClick={() => handleAppLaunch('patient')}
              style={{
                backgroundColor: 'var(--cta)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '16px 36px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 25px rgba(198, 165, 103, 0.4)',
                transition: 'all 160ms ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--cta-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--cta)')}
            >
              <Smartphone size={18} /> Book Session on Mobile App
            </button>

            <button
              onClick={() => onNavigatePage('contact')}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text)',
                border: '1px solid var(--border-hairline)',
                borderRadius: 'var(--radius-pill)',
                padding: '16px 28px',
                fontSize: '14.5px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 160ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--cta)';
                e.currentTarget.style.color = 'var(--cta)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hairline)';
                e.currentTarget.style.color = 'var(--text)';
              }}
            >
              <MessageSquare size={16} /> Contact Concierge
            </button>
          </div>
        </div>
      </section>

      {/* 6. PAMWILL ACADEMY: CLINICAL TRAINING & APPRENTICESHIP / INTERNSHIP */}
      <section style={{
        padding: '80px 24px',
        backgroundColor: 'var(--surface-card)',
        borderTop: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--pill-bg)',
              border: '1px solid var(--pill-border)',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 16px',
              fontSize: '11.5px',
              fontWeight: 700,
              color: 'var(--pill-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px'
            }}>
              <GraduationCap size={15} color="var(--cta)" /> PamWill Academy & Clinical Internships
            </div>

            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 600,
              color: 'var(--text)',
              margin: '0 0 16px',
              letterSpacing: '-0.02em'
            }}>
              Launch Your Career in Luxury Clinical Wellness
            </h2>

            <p style={{
              fontSize: '15.5px',
              lineHeight: 1.65,
              color: 'var(--text-muted)',
              margin: 0
            }}>
              Join Bengaluru's premier accredited therapist training & apprenticeship initiative. We provide CIDESCO-aligned certification, paid apprenticeship stipends, hands-on master mentorship, and 100% guaranteed on-demand platform placement.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '44px'
          }}>
            {[
              {
                icon: <Award size={22} color="var(--cta)" />,
                title: 'Certified 500+ Hour Curriculum',
                desc: 'Comprehensive training in Swedish Relaxation, Deep Tissue Myofascial, Balinese Acupressure, and Posture Decompression.'
              },
              {
                icon: <Briefcase size={22} color="var(--cta)" />,
                title: 'Paid Clinical Apprenticeship',
                desc: 'Earn a monthly stipend during hands-on clinical training, client shadowing, and live practicals with senior practitioners.'
              },
              {
                icon: <Sparkles size={22} color="var(--cta)" />,
                title: 'Complete Professional Kit',
                desc: 'Complimentary portable ergonomic massage table, heated volcanic basalt stones, uniform pack, and pure organic botanicals.'
              },
              {
                icon: <ShieldCheck size={22} color="var(--cta)" />,
                title: '100% Guaranteed Placement',
                desc: 'Graduate directly onto the PamWill platform with verified practitioner status, VIP guest dispatch, and weekly payouts.'
              }
            ].map((card, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border-hairline)',
                  borderRadius: '18px',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: 'var(--card-shadow)',
                  transition: 'transform 180ms ease, border-color 180ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--cta)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-hairline)';
                }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {card.icon}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--text)',
                  margin: 0
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontSize: '13.5px',
                  lineHeight: 1.55,
                  color: 'var(--text-muted)',
                  margin: 0
                }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Impact Stats & Action Bar */}
          <div style={{
            backgroundColor: 'var(--surface)',
            border: '1.5px solid var(--border-gold)',
            borderRadius: '20px',
            padding: '32px 28px',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px'
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '32px'
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 700, color: 'var(--cta)' }}>
                  ₹45k – ₹85k+
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Avg. Monthly Practitioner Earnings
                </div>
              </div>

              <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-subtle)' }} />

              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 700, color: 'var(--cta)' }}>
                  500+ Hours
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Accredited Clinical Training
                </div>
              </div>

              <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-subtle)' }} />

              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 700, color: 'var(--cta)' }}>
                  100%
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Guaranteed Job Placement
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <button
                onClick={() => setTrainingModalOpen(true)}
                style={{
                  backgroundColor: 'var(--cta)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-pill)',
                  padding: '14px 28px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(198, 165, 103, 0.35)',
                  transition: 'all 160ms ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--cta-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--cta)')}
              >
                <GraduationCap size={16} /> Apply for Training & Internship <ArrowRight size={15} />
              </button>

              <button
                onClick={() => onNavigatePage('contact')}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text)',
                  border: '1px solid var(--border-hairline)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '14px 22px',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 160ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--cta)';
                  e.currentTarget.style.color = 'var(--cta)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-hairline)';
                  e.currentTarget.style.color = 'var(--text)';
                }}
              >
                <MessageSquare size={15} /> Academy Inquiries
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default HomePage;
