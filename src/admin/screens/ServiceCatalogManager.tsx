import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Sparkles, AlertCircle, 
  Check, X, Image as ImageIcon, Search 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { MassageService, ServiceCategory } from '../../types';
import { SERVICE_CATEGORIES } from '../../data/services';

export const ServiceCatalogManager: React.FC = () => {
  const { services, saveService, deleteService } = usePamwill();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingService, setEditingService] = useState<MassageService | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ServiceCategory>('Relaxation & Wellness');
  const [formDescription, setFormDescription] = useState('');
  const [formBenefits, setFormBenefits] = useState('');
  const [formContraindications, setFormContraindications] = useState('');
  const [formPrice60, setFormPrice60] = useState(1699);
  const [formPrice90, setFormPrice90] = useState(2299);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formTag, setFormTag] = useState<MassageService['popularTag']>('Popular');
  const [formAddOnCompatible, setFormAddOnCompatible] = useState(true);

  const filteredServices = services
    .filter(s => activeCategory === 'All' || s.category === activeCategory)
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleOpenEdit = (service?: MassageService) => {
    if (service) {
      setEditingService(service);
      setFormName(service.name);
      setFormCategory(service.category);
      setFormDescription(service.description);
      setFormBenefits(service.benefits.join(', '));
      setFormContraindications(service.contraindications.join(', '));
      setFormPrice60(service.basePricePerDuration[60] || 1699);
      setFormPrice90(service.basePricePerDuration[90] || 2299);
      setFormImageUrl(service.imageUrl);
      setFormTag(service.popularTag || 'Popular');
      setFormAddOnCompatible(service.addOnCompatible);
    } else {
      const newService: MassageService = {
        id: `srv-${Date.now()}`,
        name: '',
        category: 'Relaxation & Wellness',
        description: '',
        benefits: [],
        contraindications: [],
        durationOptionsMin: [60, 90],
        basePricePerDuration: { 60: 1699, 90: 2299 },
        imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        addOnCompatible: true
      };
      setEditingService(newService);
      setFormName('');
      setFormCategory('Relaxation & Wellness');
      setFormDescription('');
      setFormBenefits('');
      setFormContraindications('');
      setFormPrice60(1699);
      setFormPrice90(2299);
      setFormImageUrl(newService.imageUrl);
      setFormTag('Popular');
      setFormAddOnCompatible(true);
    }
  };

  const handleSave = () => {
    if (!editingService || !formName) return;

    const updated: MassageService = {
      ...editingService,
      name: formName,
      category: formCategory,
      description: formDescription,
      benefits: formBenefits.split(',').map(s => s.trim()).filter(Boolean),
      contraindications: formContraindications.split(',').map(s => s.trim()).filter(Boolean),
      durationOptionsMin: [60, 90],
      basePricePerDuration: {
        60: Number(formPrice60),
        90: Number(formPrice90)
      },
      imageUrl: formImageUrl,
      popularTag: formTag,
      addOnCompatible: formAddOnCompatible
    };

    saveService(updated);
    setEditingService(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="eyebrow">Inventory & Therapy Architecture</span>
          <h1 style={{ fontSize: '26px', margin: '2px 0' }}>Massage Services Catalog ({services.length})</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Maintain all ~69 therapeutic and luxury massage rituals, duration pricing tiers, and strict medical contraindications.
          </p>
        </div>

        <button
          onClick={() => handleOpenEdit()}
          className="btn-gold"
          style={{ padding: '10px 18px', fontSize: '13px' }}
        >
          <Plus size={16} /> Add New Discipline
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
          <input
            type="text"
            placeholder="Search all 69 massage therapies..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-surface)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveCategory('All')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              cursor: 'pointer',
              border: activeCategory === 'All' ? '1px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
              backgroundColor: activeCategory === 'All' ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
              color: activeCategory === 'All' ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}
          >
            All Categories ({services.length})
          </button>
          {SERVICE_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                cursor: 'pointer',
                border: activeCategory === cat ? '1px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                backgroundColor: activeCategory === cat ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                color: activeCategory === cat ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
                fontWeight: 600,
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {filteredServices.map(service => {
          const price60 = service.basePricePerDuration[60] || Math.min(...Object.values(service.basePricePerDuration));
          return (
            <div key={service.id} className="card-luxury" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '140px' }}>
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(31, 27, 22, 0.85)',
                  color: '#FAF8F5',
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-pill)',
                  letterSpacing: '0.04em'
                }}>
                  {service.category}
                </span>

                {service.popularTag && (
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)'
                  }}>
                    {service.popularTag}
                  </span>
                )}
              </div>

              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>{service.name}</h3>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₹{price60}
                    </span>
                  </div>

                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.3, marginBottom: '10px' }}>
                    {service.description.slice(0, 95)}...
                  </p>
                </div>

                <div>
                  {service.contraindications.length > 0 && (
                    <div style={{ fontSize: '10px', color: 'var(--status-error)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} /> {service.contraindications.length} Contraindications
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => handleOpenEdit(service)}
                      className="btn-secondary"
                      style={{ flex: 1, padding: '8px', fontSize: '11px' }}
                    >
                      <Edit size={12} /> Edit Service
                    </button>
                    <button
                      onClick={() => deleteService(service.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-hairline)',
                        backgroundColor: 'transparent',
                        color: 'var(--status-error)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Service Modal */}
      {editingService && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(18, 16, 14, 0.7)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setEditingService(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              border: '1px solid var(--border-hairline)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '18px' }}>
                {editingService.name ? `Edit: ${editingService.name}` : "Create New Massage Discipline"}
              </h3>
              <button onClick={() => setEditingService(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>SERVICE NAME</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Balinese Sacred Flow"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>CATEGORY</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                  >
                    {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>POPULARITY BADGE</label>
                  <select
                    value={formTag || 'Popular'}
                    onChange={e => setFormTag(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                  >
                    <option value="Popular">Popular</option>
                    <option value="Therapeutic">Therapeutic</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Athletic">Athletic</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>60 MIN PRICE (₹)</label>
                  <input
                    type="number"
                    value={formPrice60}
                    onChange={e => setFormPrice60(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>90 MIN PRICE (₹)</label>
                  <input
                    type="number"
                    value={formPrice90}
                    onChange={e => setFormPrice90(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>BENEFITS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={formBenefits}
                  onChange={e => setFormBenefits(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--status-error)' }}>CONTRAINDICATIONS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={formContraindications}
                  onChange={e => setFormContraindications(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>EDITORIAL IMAGE URL (AI GENERATED)</label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={e => setFormImageUrl(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <button onClick={() => setEditingService(null)} className="btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button onClick={handleSave} className="btn-gold" style={{ flex: 1 }}>
                Save & Publish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
