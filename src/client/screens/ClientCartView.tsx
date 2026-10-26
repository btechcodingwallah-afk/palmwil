import React, { useState } from 'react';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, 
  Tag, ShieldCheck, Sparkles, CheckCircle2 
} from 'lucide-react';
import { usePamwill } from '../../state/store';

export const ClientCartView: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotalPrice,
    setClientSubRoute,
    applyVoucher,
    appliedVoucher,
    removeVoucher,
    vouchers
  } = usePamwill();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const deliveryFee = cartTotalPrice > 1500 ? 0 : 99;
  const voucherDiscount = appliedVoucher
    ? appliedVoucher.discountType === 'percentage'
      ? Math.round((cartTotalPrice * appliedVoucher.discountValue) / 100)
      : appliedVoucher.discountValue
    : 0;

  const grandTotal = Math.max(0, cartTotalPrice + deliveryFee - voucherDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyVoucher(couponCodeInput, cartTotalPrice);
    if (res.success) {
      setCouponFeedback({ type: 'success', message: res.message });
      setCouponCodeInput('');
    } else {
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      {/* Header Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button
          onClick={() => setClientSubRoute('store')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--accent-gold)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0
          }}
        >
          <ArrowLeft size={16} /> Continue Shopping
        </button>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--status-error)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Clear All Items
          </button>
        )}
      </div>

      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '28px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        margin: '0 0 24px 0'
      }}>
        Your Wellness Basket ({cart.reduce((a, b) => a + b.quantity, 0)})
      </h1>

      {cart.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1px solid var(--border-hairline)',
          padding: '60px 24px',
          textAlign: 'center'
        }}>
          <ShoppingBag size={54} color="var(--accent-gold)" style={{ opacity: 0.4, marginBottom: '16px' }} />
          <h2 style={{ fontSize: '20px', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>Your basket is currently empty</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 24px 0', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
            Explore our curated sanctuary oils, therapeutic balms, and wellness supplies.
          </p>
          <button
            onClick={() => setClientSubRoute('store')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--accent-gold)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Explore Sanctuary Store <ArrowRight size={15} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map(item => (
              <div
                key={item.product.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '20px',
                  border: '1px solid var(--border-hairline)',
                  padding: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  style={{ width: '80px', height: '80px', borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {item.product.category}
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.product.name}
                  </h4>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{item.product.price}
                    {item.product.volumeOrWeight && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '6px' }}>
                        ({item.product.volumeOrWeight})
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-hairline)' }}>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                  >
                    <Minus size={13} />
                  </button>
                  <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Remove Item */}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
                  title="Remove from cart"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {/* Free Delivery Teaser */}
            <div style={{
              backgroundColor: 'rgba(169, 129, 47, 0.08)',
              border: '1px dashed rgba(169, 129, 47, 0.35)',
              borderRadius: '16px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Sparkles size={18} color="var(--accent-gold)" />
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {cartTotalPrice >= 1500 ? (
                  <span style={{ color: 'var(--status-success)', fontWeight: 700 }}>
                    Congratulations! You unlocked Free Luxury Delivery.
                  </span>
                ) : (
                  <span>
                    Add <strong>₹{1500 - cartTotalPrice}</strong> more to enjoy Free Doorstep Delivery.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary & Coupon Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '24px',
            border: '1px solid var(--border-hairline)',
            padding: '24px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 18px 0' }}>
              Order Breakdown
            </h3>

            {/* Voucher Code Form */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Promotional Voucher Code
              </div>
              {appliedVoucher ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(76, 175, 80, 0.12)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--status-success)" />
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--status-success)' }}>
                        {appliedVoucher.code}
                      </span>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Save ₹{voucherDiscount}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={removeVoucher}
                    style={{ background: 'none', border: 'none', color: 'var(--status-error)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter code (e.g. PAMWILL20)"
                    value={couponCodeInput}
                    onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-hairline)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '10px 18px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--accent-gold)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponFeedback && (
                <div style={{
                  fontSize: '12px',
                  marginTop: '6px',
                  color: couponFeedback.type === 'success' ? 'var(--status-success)' : 'var(--status-error)'
                }}>
                  {couponFeedback.message}
                </div>
              )}
            </div>

            {/* Calculations Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-hairline)', paddingTop: '16px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{cartTotalPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>Delivery Fee</span>
                <span style={{ fontWeight: 600, color: deliveryFee === 0 ? 'var(--status-success)' : 'var(--text-primary)' }}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              {appliedVoucher && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--status-success)' }}>
                  <span>Voucher Discount</span>
                  <span style={{ fontWeight: 700 }}>-₹{voucherDiscount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', borderTop: '1px solid var(--border-hairline)', paddingTop: '12px' }}>
                <span>Estimated Total</span>
                <span style={{ color: 'var(--accent-gold)' }}>₹{grandTotal}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => setClientSubRoute('checkout')}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--accent-gold)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(169, 129, 47, 0.35)'
              }}
            >
              Proceed to Delivery & Payment <ArrowRight size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <ShieldCheck size={14} color="var(--status-success)" /> 100% Authentic PamWill Apothecary Guarantee
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
