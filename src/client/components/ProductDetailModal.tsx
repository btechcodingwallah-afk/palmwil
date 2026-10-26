import React, { useState } from 'react';
import { 
  X, Star, ShoppingBag, Plus, Minus, Check, ArrowRight, ShieldCheck, Sparkles 
} from 'lucide-react';
import { Product } from '../../types';
import { usePamwill } from '../../state/store';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, setClientSubRoute } = usePamwill();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    setClientSubRoute('checkout');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 13, 11, 0.8)',
        backdropFilter: 'blur(12px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '28px',
          border: '1px solid var(--border-hairline)',
          maxWidth: '880px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-elevated)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: '#FAF8F5',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* Left Column: Image Showcase */}
        <div style={{ padding: '24px', backgroundColor: '#14120F', display: 'flex', flexDirection: 'column', gap: '12px', borderTopLeftRadius: '28px' }}>
          <div style={{ height: '320px', borderRadius: '18px', overflow: 'hidden', position: 'relative' }}>
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {hasDiscount && (
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: 'var(--accent-gold)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)'
              }}>
                {discountPercent}% OFF
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImageIndex === i ? '2px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & CTAs */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--accent-gold-light)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '6px'
          }}>
            {product.category}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            lineHeight: 1.2
          }}>
            {product.name}
          </h2>

          {product.tagline && (
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', fontStyle: 'italic' }}>
              {product.tagline}
            </div>
          )}

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#E5A93C', fontSize: '13px', fontWeight: 700 }}>
              <Star size={15} fill="#E5A93C" />
              <span>{product.rating}</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({product.reviewsCount} verified reviews)</span>
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{product.price}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: '15px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.originalPrice}
              </span>
            )}
            {product.volumeOrWeight && (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
                {product.volumeOrWeight}
              </span>
            )}
          </div>

          {/* Description */}
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 20px 0' }}>
            {product.description}
          </p>

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Apothecary Specifications
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {product.specifications.map((spec, idx) => (
                  <div key={idx} style={{ display: 'flex', fontSize: '12px', lineHeight: 1.4 }}>
                    <span style={{ color: 'var(--text-muted)', width: '130px', flexShrink: 0 }}>{spec.label}:</span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-hairline)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-hairline)' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontSize: '14px', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: addedNotice ? 'var(--status-success)' : 'var(--bg-secondary)',
                  color: addedNotice ? '#fff' : 'var(--text-primary)',
                  border: '1px solid var(--accent-gold)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {addedNotice ? <><Check size={16} /> Added ({quantity})</> : <><ShoppingBag size={16} /> Add to Basket</>}
              </button>

              <button
                onClick={handleBuyNow}
                className="btn-gold"
                style={{
                  flex: 1,
                  padding: '14px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                Instant Checkout <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
