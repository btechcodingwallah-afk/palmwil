import React, { useState } from 'react';
import { 
  ShoppingBag, Shield, Check, Plus, Minus, ArrowLeft, ArrowRight, 
  Trash2, Sparkles, CheckCircle2, Wallet, Package 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { Product } from '../../types';

export const TherapistStoreView: React.FC = () => {
  const { currentTherapist, setTherapistSubRoute } = usePamwill();

  const therapistProducts: Product[] = [
    {
      id: 'ther_prod_bed',
      name: 'PamWill Portable Aluminium Foldable Massage Table',
      tagline: 'Ultralight 12kg aircraft-grade aluminium with memory foam padding',
      description: 'Professional grade foldable portable therapy bed. Features adjustable height (59cm - 82cm), reinforced aircraft aluminium chassis, waterproof oil-resistant PU upholstery, and heavy-duty Oxford transit backpack.',
      price: 8499,
      originalPrice: 11999,
      category: 'Therapy Tools',
      images: [
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop'
      ],
      stock: 18,
      inStock: true,
      rating: 4.96,
      reviewsCount: 88,
      specifications: [
        { label: 'Weight', value: '12.4 kg' },
        { label: 'Max Load', value: '250 kg working load' },
        { label: 'Padding', value: '6.5cm High-Density Multi-Layer Foam' }
      ]
    },
    {
      id: 'ther_prod_sheets',
      name: 'Disposable Waterproof Spa Bed Linens (Pack of 50)',
      tagline: 'Hospital-grade sterilized non-woven hygienic mattress sheets',
      description: 'Pre-cut elasticized disposable sheets designed specifically for on-demand home visits. Hydrophobic barrier prevents massage oil penetration to client mattresses and couches.',
      price: 1250,
      originalPrice: 1650,
      category: 'Therapy Tools',
      images: [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'
      ],
      stock: 60,
      inStock: true,
      rating: 4.9,
      reviewsCount: 145,
      specifications: [
        { label: 'Quantity', value: '50 Sheets per roll' },
        { label: 'Material', value: 'PP Non-Woven with PE Film' }
      ]
    },
    {
      id: 'ther_prod_oil_5l',
      name: 'Organic Sesame & Herb Base Massage Oil (5 Litre Can)',
      tagline: 'Cold-pressed Ayurvedic base carrier oil for therapeutic bodywork',
      description: 'Wholesale practitioner canister of pure cold-pressed black sesame oil fortified with Ashwagandha and Bala. Non-staining, smooth glide, and deep muscle penetration.',
      price: 2490,
      originalPrice: 3200,
      category: 'Ayurvedic Oils',
      images: [
        'https://images.unsplash.com/photo-1608248597359-0f6667954592?q=80&w=800&auto=format&fit=crop'
      ],
      stock: 40,
      inStock: true,
      rating: 4.94,
      reviewsCount: 112,
      specifications: [
        { label: 'Volume', value: '5,000 ml / 5 Litres' },
        { label: 'Purity', value: '100% Cold-Pressed Unrefined' }
      ]
    },
    {
      id: 'ther_prod_uniform',
      name: 'PamWill Official Practitioner Uniform & Kit Bag',
      tagline: 'Breathable linen spa tunic with gold embroidery & waterproof travel kit',
      description: 'Mandatory standard practitioner apparel for high-end residential assignments. Includes 2 organic cotton breathable tunics, practitioner trousers, and insulated oil bottle holster.',
      price: 1850,
      originalPrice: 2500,
      category: 'Therapy Tools',
      images: [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop'
      ],
      stock: 25,
      inStock: true,
      rating: 4.88,
      reviewsCount: 76,
      specifications: [
        { label: 'Sizes Available', value: 'S, M, L, XL' },
        { label: 'Fabric', value: 'Anti-Microbial Organic Cotton Blend' }
      ]
    }
  ];

  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);
  const [paymentSource, setPaymentSource] = useState<'wallet' | 'upi'>('wallet');

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.product.id !== id));
      return;
    }
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setOrderPlacedSuccess(true);
    setCart([]);
    setTimeout(() => setOrderPlacedSuccess(false), 4000);
  };

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      {/* Back button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setTherapistSubRoute('dashboard')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: 'var(--accent-gold)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      {/* Header */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '24px',
        border: '1px solid var(--border-hairline)',
        padding: '32px',
        marginBottom: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(169, 129, 47, 0.15)',
            color: 'var(--accent-gold-light)',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 12px',
            borderRadius: 'var(--radius-pill)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '8px'
          }}>
            <Package size={13} /> Practitioner Wholesale Depot
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 8px 0'
          }}>
            Therapist Supplies & Equipment Store
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Order subsidized practitioner gear: lightweight portable massage beds, sterile disposable linens, wholesale oils, and official uniform kit bags.
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid var(--border-hairline)',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Practitioner Payout Wallet
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-gold)' }}>
            ₹{currentTherapist?.walletBalance || 28400}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: 600 }}>
            Eligible for direct order deduction
          </div>
        </div>
      </div>

      {orderPlacedSuccess && (
        <div style={{
          backgroundColor: 'rgba(76, 175, 80, 0.18)',
          border: '1px solid rgba(76, 175, 80, 0.4)',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'center',
          marginBottom: '28px',
          color: 'var(--status-success)',
          fontWeight: 700,
          fontSize: '14px'
        }}>
          ✓ Practitioner equipment order confirmed! The package will be dispatched to your registered address with priority transit.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
        
        {/* Products Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {therapistProducts.map(prod => (
            <div
              key={prod.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '20px',
                border: '1px solid var(--border-hairline)',
                padding: '20px',
                display: 'flex',
                gap: '18px',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <img
                src={prod.images[0]}
                alt={prod.name}
                style={{ width: '100px', height: '100px', borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                  {prod.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                  {prod.tagline}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      ₹{prod.price}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '8px' }}>
                      ₹{prod.originalPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(prod)}
                    className="btn-gold"
                    style={{ padding: '8px 18px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={14} /> Add to Kit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Practitioner Order Basket */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1px solid var(--border-hairline)',
          padding: '24px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
            Equipment Basket ({cart.reduce((a, b) => a + b.quantity, 0)})
          </h3>

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--text-muted)', fontSize: '13px' }}>
              No equipment selected. Click "Add to Kit" on supplies above.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cart.map(item => (
                <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '10px' }}>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      ₹{item.product.price} each
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => handleUpdateQty(item.product.id, item.quantity - 1)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(item.product.id, item.quantity + 1)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              ))}

              <div style={{ paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--accent-gold)' }}>₹{cartTotal}</span>
              </div>

              {/* Payment Source */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Payment Method
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setPaymentSource('wallet')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '12px',
                      border: paymentSource === 'wallet' ? '1px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                      backgroundColor: paymentSource === 'wallet' ? 'rgba(169, 129, 47, 0.15)' : 'transparent',
                      color: paymentSource === 'wallet' ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Deduct from Payout Wallet
                  </button>
                  <button
                    onClick={() => setPaymentSource('upi')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '12px',
                      border: paymentSource === 'upi' ? '1px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                      backgroundColor: paymentSource === 'upi' ? 'rgba(169, 129, 47, 0.15)' : 'transparent',
                      color: paymentSource === 'upi' ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Pay via UPI / Card
                  </button>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-gold"
                style={{ width: '100%', padding: '14px', fontSize: '14px', marginTop: '14px' }}
              >
                Place Equipment Order (₹{cartTotal})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
