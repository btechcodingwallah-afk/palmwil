import React, { useState } from 'react';
import { WebsitePage } from '../types';
import { MASSAGE_SERVICES } from '../../data/services';
import { MassageService } from '../../types';
import { ServiceQuiz } from '../components/ServiceQuiz';
import { Sparkles, Clock, ArrowRight, Smartphone, Info, MessageSquare } from 'lucide-react';

interface ServicesPageProps {
  onNavigatePage: (page: WebsitePage) => void;
  onOpenServiceDetail: (service: MassageService) => void;
  onSelectService: (service: MassageService) => void;
  onOpenAppDownload?: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigatePage,
  onOpenServiceDetail,
  onSelectService,
  onOpenAppDownload
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Relaxation & Wellness', 'Therapeutic', 'Luxury & Spa'];

  // Curate 8 primary services
  const primaryServices = MASSAGE_SERVICES.slice(0, 8);

  const filteredServices = selectedCategory === 'All'
    ? primaryServices
    : MASSAGE_SERVICES.filter(s => s.category.toLowerCase().includes(selectedCategory.toLowerCase())).slice(0, 8);

  const handleBookInApp = (service: MassageService) => {
    if (onOpenAppDownload) {
      onOpenAppDownload();
    } else {
      onSelectService(service);
    }
  };

  return (
    <div style={{
      width: '100%',
      padding: '60px 24px 90px',
      backgroundColor: 'var(--background)',
      color: 'var(--text)',
      transition: 'background-color 200ms ease, color 200ms ease'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Breadcrumb Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => onNavigatePage('home')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
          >
            Home
          </button>
          <span>/</span>
          <span style={{ color: 'var(--cta)' }}>Services</span>
        </div>

        {/* Page Intro */}
        <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--pill-bg)',
            border: '1px solid var(--pill-border)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--pill-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '12px'
          }}>
            <Sparkles size={13} color="var(--cta)" /> Signature Treatment Menu
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(30px, 4vw, 44px)',
            fontWeight: 600,
            margin: '0 0 16px',
            color: 'var(--text)',
            letterSpacing: '-0.02em'
          }}>
            Our Massage & Bodywork Rituals
          </h1>

          <p style={{
            fontSize: '15px',
            lineHeight: 1.6,
            color: 'var(--text-muted)',
            margin: 0
          }}>
            Every session includes heated volcanic stones, hypoallergenic organic botanicals, and bespoke pressure techniques customized to your recovery.
          </p>

          {/* App Booking Callout */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '16px',
            padding: '8px 18px',
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-pill)',
            fontSize: '12.5px',
            color: 'var(--text)'
          }}>
            <Smartphone size={15} color="var(--cta)" />
            <span>Therapist appointments are booked exclusively through the <strong>PamWill Mobile App</strong>.</span>
          </div>

          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '28px'
          }}>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    backgroundColor: active ? 'var(--cta)' : 'var(--surface-card)',
                    color: active ? '#FFFFFF' : 'var(--text-muted)',
                    border: active ? '1px solid var(--cta)' : '1px solid var(--border-hairline)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '8px 20px',
                    fontSize: '13px',
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Cards Grid (6-8 Cards) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '28px',
          marginBottom: '64px'
        }}>
          {filteredServices.map((service) => {
            const defaultDuration = service.durationOptionsMin[0] || 60;
            const price = service.basePricePerDuration[defaultDuration] || 1699;

            return (
              <div
                key={service.id}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '18px',
                  border: '1px solid var(--border-hairline)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--card-shadow)',
                  transition: 'transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease'
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
                {/* Image */}
                <div style={{ position: 'relative', width: '100%', height: '210px' }}>
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'var(--pill-bg)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid var(--pill-border)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '3px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--pill-text)',
                    textTransform: 'uppercase'
                  }}>
                    {service.category}
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '4px 12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#FFFFFF'
                  }}>
                    ₹{price.toLocaleString()}
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'var(--text)',
                    margin: '0 0 8px',
                    lineHeight: 1.25
                  }}>
                    {service.name}
                  </h3>

                  <p style={{
                    fontSize: '13.5px',
                    lineHeight: 1.5,
                    color: 'var(--text-muted)',
                    margin: '0 0 16px',
                    flex: 1
                  }}>
                    {service.description.slice(0, 110)}...
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginBottom: '18px'
                  }}>
                    <Clock size={14} color="var(--cta)" />
                    <span>Options: {service.durationOptionsMin.join(', ')} min</span>
                  </div>

                  {/* Actions: View Details + Book in App / Inquire */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '16px'
                  }}>
                    <button
                      onClick={() => onOpenServiceDetail(service)}
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--text)',
                        border: '1px solid var(--border-hairline)',
                        borderRadius: 'var(--radius-pill)',
                        padding: '10px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 150ms ease'
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
                      <Info size={13} /> View Details
                    </button>

                    <button
                      onClick={() => handleBookInApp(service)}
                      style={{
                        backgroundColor: 'var(--cta)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 'var(--radius-pill)',
                        padding: '10px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(198, 165, 103, 0.3)',
                        transition: 'all 150ms ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--cta-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--cta)')}
                      title="Schedule on PamWill Mobile App"
                    >
                      <Smartphone size={13} /> Book on App
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Treatment Recommendation Quiz */}
        <div style={{ marginTop: '40px' }}>
          <ServiceQuiz
            services={MASSAGE_SERVICES}
            onSelectService={(service) => {
              onOpenServiceDetail(service);
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default ServicesPage;
