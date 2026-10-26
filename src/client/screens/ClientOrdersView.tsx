import React, { useState } from 'react';
import { 
  Package, Truck, CheckCircle2, Clock, ArrowRight, ArrowLeft, 
  MapPin, ShoppingBag, ExternalLink, ShieldCheck 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { StoreOrder } from '../../types';

export const ClientOrdersView: React.FC = () => {
  const { storeOrders, setClientSubRoute } = usePamwill();
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 6px 0'
          }}>
            Your Boutique Orders
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Track and manage your therapeutic apothecary shipments.
          </p>
        </div>

        <button
          onClick={() => setClientSubRoute('store')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-hairline)',
            color: 'var(--accent-gold)',
            borderRadius: 'var(--radius-pill)',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <ShoppingBag size={15} /> Visit Store
        </button>
      </div>

      {storeOrders.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1px solid var(--border-hairline)',
          padding: '60px 24px',
          textAlign: 'center'
        }}>
          <Package size={50} color="var(--accent-gold)" style={{ opacity: 0.4, marginBottom: '14px' }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>No store orders placed yet</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
            Browse authentic Ayurvedic oils, diffusers, and luxury wellness kits.
          </p>
          <button
            onClick={() => setClientSubRoute('store')}
            className="btn-gold"
            style={{ padding: '12px 28px', fontSize: '14px' }}
          >
            Start Shopping Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {storeOrders.map(order => (
            <div
              key={order.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '20px',
                border: '1px solid var(--border-hairline)',
                padding: '20px',
                boxShadow: 'var(--shadow-card)',
                transition: 'border-color 150ms ease'
              }}
            >
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                borderBottom: '1px solid var(--border-hairline)',
                paddingBottom: '14px',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Order #{order.id}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: 'rgba(76, 175, 80, 0.15)',
                      color: 'var(--status-success)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)'
                    }}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    ₹{order.totalAmount}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Payment: {order.paymentMethod === 'Razorpay' ? 'Prepaid (Razorpay)' : 'Cash / Pay on Delivery'}
                  </div>
                </div>
              </div>

              {/* Items in this order */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: '14px' }}>
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.productName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Qty: {item.quantity} • ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Details Footer */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-hairline)',
                fontSize: '12px',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="var(--accent-gold)" />
                  <span>
                    Delivering to <strong>{order.deliveryAddress?.label}</strong>: {order.deliveryAddress?.street || order.deliveryAddress?.address}, {order.deliveryAddress?.city}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  <Truck size={14} /> Tracking: <strong>{order.trackingNumber || 'PWX-77120'}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
