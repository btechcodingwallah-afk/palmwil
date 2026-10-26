import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Plus, CreditCard, Banknote, ShieldCheck, 
  Coins, CheckCircle2, Check, Sparkles 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { DeliveryAddress } from '../../types';

export const ClientCheckoutView: React.FC = () => {
  const { 
    user,
    cart, 
    cartTotalPrice, 
    appliedVoucher, 
    savedAddresses, 
    addSavedAddress, 
    pamCoins, 
    redeemPamCoins, 
    placeStoreOrder,
    setClientSubRoute 
  } = usePamwill();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedAddresses[0]?.id || ''
  );
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'COD'>('Razorpay');
  const [useCoins, setUseCoins] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New Address form inputs
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newCity, setNewCity] = useState('Gurugram, Delhi NCR');
  const [newLabel, setNewLabel] = useState<'Home' | 'Office' | 'Hotel'>('Home');

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '40px 20px', textAlign: 'center' }}>
        <h2>No items in checkout</h2>
        <button
          onClick={() => setClientSubRoute('store')}
          className="btn-gold"
          style={{ padding: '12px 24px', marginTop: '16px' }}
        >
          Return to Store
        </button>
      </div>
    );
  }

  const deliveryFee = cartTotalPrice > 1500 ? 0 : 99;
  const voucherDiscount = appliedVoucher
    ? appliedVoucher.discountType === 'percentage'
      ? Math.round((cartTotalPrice * appliedVoucher.discountValue) / 100)
      : appliedVoucher.discountValue
    : 0;

  const coinsDeduction = useCoins ? Math.min(pamCoins, Math.max(0, cartTotalPrice - voucherDiscount)) : 0;
  const grandTotal = Math.max(0, cartTotalPrice + deliveryFee - voucherDiscount - coinsDeduction);

  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0];

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newPhone.trim()) return;
    const newAddr: DeliveryAddress = {
      id: `addr_${Date.now()}`,
      label: newLabel,
      recipientName: newRecipientName || (user.name && user.name !== 'Guest Client' ? user.name : 'Valued Patron'),
      phone: newPhone,
      street: newStreet,
      address: newStreet,
      landmark: newLandmark,
      city: newCity,
      isDefault: savedAddresses.length === 0
    };
    addSavedAddress(newAddr);
    setSelectedAddressId(newAddr.id);
    setShowNewAddressForm(false);
    setNewStreet('');
    setNewLandmark('');
  };

  const handleConfirmOrder = () => {
    if (!selectedAddress) {
      alert('Please select or add a delivery address first.');
      return;
    }

    setIsPlacing(true);

    if (useCoins && coinsDeduction > 0) {
      redeemPamCoins(coinsDeduction);
    }

    setTimeout(() => {
      placeStoreOrder({
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0],
          price: item.product.price,
          quantity: item.quantity,
          volumeOrWeight: item.product.volumeOrWeight
        })),
        deliveryAddress: selectedAddress,
        paymentMethod: paymentMethod,
        voucherCode: appliedVoucher?.code,
        subtotal: cartTotalPrice,
        deliveryFee,
        discount: voucherDiscount + coinsDeduction,
        totalAmount: grandTotal
      });

      setIsPlacing(false);
      setClientSubRoute('orders');
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      {/* Back Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setClientSubRoute('cart')}
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
          <ArrowLeft size={16} /> Back to Basket
        </button>
      </div>

      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '28px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        margin: '0 0 24px 0'
      }}>
        Luxury Delivery & Payment Checkout
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
        
        {/* Left Column: Address Selection & Payment Methods */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 1. Address Selection */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '24px',
            border: '1px solid var(--border-hairline)',
            padding: '24px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  1. Delivery Destination
                </h3>
              </div>
              <button
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-gold)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} /> Add New
              </button>
            </div>

            {/* Address Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {savedAddresses.map(addr => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                      backgroundColor: isSelected ? 'rgba(169, 129, 47, 0.08)' : 'var(--bg-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          backgroundColor: 'var(--accent-gold)',
                          color: '#fff',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          textTransform: 'uppercase'
                        }}>
                          {addr.label}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {addr.recipientName || 'Resident Patron'}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{addr.phone}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {addr.street || addr.address}, {addr.landmark && `Near ${addr.landmark}, `}{addr.city}
                      </div>
                    </div>
                    {isSelected && <Check size={18} color="var(--accent-gold)" style={{ flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>

            {/* Inline Add Address Form */}
            {showNewAddressForm && (
              <form onSubmit={handleAddNewAddress} style={{
                marginTop: '16px',
                padding: '18px',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-hairline)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Add New Residence / Location</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['Home', 'Office', 'Hotel'] as const).map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setNewLabel(l)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-pill)',
                        border: newLabel === l ? '1px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                        backgroundColor: newLabel === l ? 'var(--accent-gold)' : 'transparent',
                        color: newLabel === l ? '#fff' : 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Recipient Full Name"
                  value={newRecipientName}
                  onChange={e => setNewRecipientName(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="tel"
                  placeholder="Contact Mobile Number (+91 ...)"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  required
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Flat / Villa / Street Address"
                  value={newStreet}
                  onChange={e => setNewStreet(e.target.value)}
                  required
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Landmark (Optional)"
                  value={newLandmark}
                  onChange={e => setNewLandmark(e.target.value)}
                  style={inputStyle}
                />
                <button
                  type="submit"
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Save Address & Deliver Here
                </button>
              </form>
            )}
          </div>

          {/* 2. Payment Method */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '24px',
            border: '1px solid var(--border-hairline)',
            padding: '24px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
              2. Select Payment Method
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Online UPI / Cards */}
              <div
                onClick={() => setPaymentMethod('Razorpay')}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: paymentMethod === 'Razorpay' ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                  backgroundColor: paymentMethod === 'Razorpay' ? 'rgba(169, 129, 47, 0.08)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CreditCard size={20} color="var(--accent-gold)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                      Online Payment (UPI, Cards, NetBanking)
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Instant secure checkout via Razorpay Gateway
                    </div>
                  </div>
                </div>
                {paymentMethod === 'Razorpay' && <Check size={18} color="var(--accent-gold)" />}
              </div>

              {/* Cash On Delivery */}
              <div
                onClick={() => setPaymentMethod('COD')}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: paymentMethod === 'COD' ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                  backgroundColor: paymentMethod === 'COD' ? 'rgba(169, 129, 47, 0.08)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Banknote size={20} color="var(--status-success)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                      Pay on Delivery (Cash / Handover UPI)
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Pay at your doorstep upon receiving package
                    </div>
                  </div>
                </div>
                {paymentMethod === 'COD' && <Check size={18} color="var(--accent-gold)" />}
              </div>
            </div>

            {/* PamCoin Loyalty Toggle */}
            {pamCoins > 0 && (
              <div style={{
                marginTop: '16px',
                padding: '14px 16px',
                borderRadius: '16px',
                backgroundColor: 'rgba(229, 169, 60, 0.12)',
                border: '1px solid rgba(229, 169, 60, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Coins size={20} color="#E5A93C" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Redeem PamCoins Balance
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Available: {pamCoins} PamCoins (Save ₹{Math.min(pamCoins, cartTotalPrice)})
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={useCoins}
                  onChange={e => setUseCoins(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1px solid var(--border-hairline)',
          padding: '24px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
            Package Summary ({cart.length} item{cart.length > 1 ? 's' : ''})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {cart.map(item => (
              <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.product.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} × ₹{item.product.price}
                  </div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{item.product.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-hairline)', paddingTop: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>₹{cartTotalPrice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>
            {voucherDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--status-success)' }}>
                <span>Voucher Code ({appliedVoucher?.code})</span>
                <span>-₹{voucherDiscount}</span>
              </div>
            )}
            {coinsDeduction > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#E5A93C' }}>
                <span>PamCoins Redeemed</span>
                <span>-₹{coinsDeduction}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', borderTop: '1px solid var(--border-hairline)', paddingTop: '12px' }}>
              <span>Amount Due</span>
              <span style={{ color: 'var(--accent-gold)' }}>₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={handleConfirmOrder}
            disabled={isPlacing}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--accent-gold)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '15px',
              fontWeight: 800,
              cursor: isPlacing ? 'wait' : 'pointer',
              boxShadow: '0 8px 24px rgba(169, 129, 47, 0.4)',
              opacity: isPlacing ? 0.7 : 1
            }}
          >
            {isPlacing ? 'Placing Sanctuary Order...' : `Confirm Order (₹${grandTotal})`}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="var(--status-success)" /> Safe & Discreet Packaging Guarantee
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-hairline)',
  color: 'var(--text-primary)',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box'
};
