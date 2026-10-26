import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Star, Filter, Check, Eye, Plus, ArrowRight, Sparkles, Tag 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { Product } from '../../types';

interface ClientStoreViewProps {
  onOpenProductDetail: (product: Product) => void;
}

export const ClientStoreView: React.FC<ClientStoreViewProps> = ({ onOpenProductDetail }) => {
  const { storeProducts, addToCart, cartTotalCount, setClientSubRoute } = usePamwill();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  const categories = [
    'All',
    'Ayurvedic Oils',
    'Aromatherapy',
    'Therapy Tools',
    'Bath & Body',
    'Wellness Teas'
  ];

  const filteredProducts = storeProducts.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedNoticeId(product.id);
    setTimeout(() => setAddedNoticeId(null), 1800);
  };

  return (
    <div className="client-store-container" style={{ width: '100%', maxWidth: '100%', margin: '0 auto', padding: '24px 32px 80px', boxSizing: 'border-box' }}>
      
      {/* Hero Store Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1C1814 0%, #2A241D 50%, #171411 100%)',
        borderRadius: '24px',
        padding: '36px 32px',
        border: '1px solid rgba(169, 129, 47, 0.3)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
        marginBottom: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '640px', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(169, 129, 47, 0.2)',
            border: '1px solid rgba(169, 129, 47, 0.4)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--accent-gold-light)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '12px'
          }}>
            <Sparkles size={13} /> Apothecary & Wellness Boutique
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '32px',
            fontWeight: 700,
            color: '#FAF8F5',
            margin: '0 0 10px 0',
            lineHeight: 1.2
          }}>
            PamWill Wellness Sanctuary Store
          </h1>
          <p style={{ fontSize: '14px', color: '#B5ABA0', lineHeight: 1.6, margin: 0 }}>
            Handcrafted cold-pressed therapeutic oils, organic aromatherapy blends, and practitioner-grade recovery tools delivered directly to your doorstep.
          </p>
        </div>

        {/* View Cart Button */}
        <div style={{ zIndex: 2 }}>
          <button
            onClick={() => setClientSubRoute('cart')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--accent-gold)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '14px 28px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(169, 129, 47, 0.4)',
              transition: 'all 200ms ease'
            }}
          >
            <ShoppingBag size={18} />
            <span>View Shopping Cart ({cartTotalCount})</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Category Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          maxWidth: '100%'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '13px',
                fontWeight: 600,
                border: selectedCategory === cat ? '1px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                backgroundColor: selectedCategory === cat ? 'var(--accent-gold)' : 'var(--bg-surface)',
                color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 150ms ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{
          position: 'relative',
          minWidth: '260px',
          flex: '1 1 260px',
          maxWidth: '380px'
        }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search oils, balms, tools..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          border: '1px solid var(--border-hairline)'
        }}>
          <ShoppingBag size={42} color="var(--accent-gold)" style={{ opacity: 0.5, marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>No products found</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Try clearing your search or category filter.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {filteredProducts.map(product => {
            const hasDiscount = product.originalPrice && product.originalPrice > product.price;
            const discountPercent = hasDiscount
              ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
              : 0;

            return (
              <div
                key={product.id}
                onClick={() => onOpenProductDetail(product)}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '20px',
                  border: '1px solid var(--border-hairline)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
                  boxShadow: 'var(--shadow-card)',
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(169, 129, 47, 0.4)';
                  e.currentTarget.style.boxShadow = '0 16px 30px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-hairline)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                }}
              >
                {/* Product Image Container */}
                <div style={{ position: 'relative', height: '220px', width: '100%', backgroundColor: '#13110E', overflow: 'hidden' }}>
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1608248597359-0f6667954592?q=80&w=800&auto=format&fit=crop'}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Category Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(20, 18, 15, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: 'var(--accent-gold-light)',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-pill)',
                    letterSpacing: '0.04em'
                  }}>
                    {product.category}
                  </div>

                  {/* Discount Tag */}
                  {hasDiscount && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'var(--accent-gold)',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-pill)'
                    }}>
                      {discountPercent}% OFF
                    </div>
                  )}

                  {product.volumeOrWeight && (
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '12px',
                      backgroundColor: 'rgba(0,0,0,0.65)',
                      color: '#FAF8F5',
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      {product.volumeOrWeight}
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#E5A93C', fontSize: '12px', fontWeight: 700 }}>
                      <Star size={13} fill="#E5A93C" />
                      <span>{product.rating}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({product.reviewsCount} reviews)</span>
                  </div>

                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: '0 0 4px 0',
                    lineHeight: 1.3
                  }}>
                    {product.name}
                  </h3>

                  {product.tagline && (
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      margin: '0 0 12px 0',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.tagline}
                    </p>
                  )}

                  <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-hairline)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                          ₹{product.price}
                        </span>
                        {hasDiscount && (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--status-success)', fontWeight: 600 }}>In Stock</div>
                    </div>

                    <button
                      onClick={e => handleQuickAdd(product, e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: addedNoticeId === product.id ? 'var(--status-success)' : 'var(--accent-gold)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'background-color 150ms ease'
                      }}
                    >
                      {addedNoticeId === product.id ? (
                        <>
                          <Check size={14} /> Added
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
