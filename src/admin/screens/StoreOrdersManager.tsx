import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Phone, 
  Mail, 
  MapPin, 
  IndianRupee, 
  RefreshCw, 
  AlertCircle, 
  Eye, 
  Calendar,
  X,
  Send,
  RotateCcw
} from 'lucide-react';
import { dbFetchStoreOrders, dbSaveStoreOrders, dbFetchStoreProducts, dbSaveStoreProducts } from '../../services/supabase';
import { StoreOrder, OrderStatus } from '../../types';

export const StoreOrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [activeOrder, setActiveOrder] = useState<StoreOrder | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Dispatch inputs
  const [courierPartner, setCourierPartner] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusUpdate, setStatusUpdate] = useState<OrderStatus>('Order Placed');
  const [updating, setUpdating] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const fetched = await dbFetchStoreOrders();
      if (fetched && Array.isArray(fetched)) {
        setOrders(fetched);
      }
    } catch (e) {
      console.error(e);
      showToast('Error loading orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openOrderModal = (order: StoreOrder) => {
    setActiveOrder(order);
    setStatusUpdate(order.orderStatus);
    setCourierPartner(order.trackingPartner || 'BlueDart Express');
    setTrackingNumber(order.trackingNumber || '');
  };

  const handleUpdateOrderStatus = async () => {
    if (!activeOrder) return;
    setUpdating(true);

    try {
      const now = new Date().toISOString();
      const updatedTimeline = [
        ...activeOrder.timeline,
        {
          status: statusUpdate,
          timestamp: now,
          note: trackingNumber ? `Handed over to ${courierPartner}. AWB: ${trackingNumber}` : `Order transitioned to ${statusUpdate}.`
        }
      ];

      const updatedOrders = orders.map(o => {
        if (o.id === activeOrder.id) {
          return {
            ...o,
            orderStatus: statusUpdate,
            trackingPartner: courierPartner,
            trackingNumber: trackingNumber,
            updatedAt: now,
            timeline: updatedTimeline
          };
        }
        return o;
      });

      setOrders(updatedOrders);
      setActiveOrder(prev => prev ? {
        ...prev,
        orderStatus: statusUpdate,
        trackingPartner: courierPartner,
        trackingNumber: trackingNumber,
        updatedAt: now,
        timeline: updatedTimeline
      } : null);

      const ok = await dbSaveStoreOrders(updatedOrders);
      if (ok) {
        showToast(`Order ${activeOrder.id} status updated to ${statusUpdate}.`);
      } else {
        showToast('Error saving order updates', 'error');
      }
    } catch (e) {
      showToast('Update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelAndRestoreStock = async (orderId: string) => {
    if (!window.confirm('Cancel this order and restore stock items back to inventory?')) return;
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const now = new Date().toISOString();
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          orderStatus: 'Cancelled' as OrderStatus,
          updatedAt: now,
          timeline: [
            ...o.timeline,
            { status: 'Cancelled' as OrderStatus, timestamp: now, note: 'Cancelled by Admin. Stock restored.' }
          ]
        };
      }
      return o;
    });

    setOrders(updatedOrders);
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder({ ...activeOrder, orderStatus: 'Cancelled' as OrderStatus });
    }

    await dbSaveStoreOrders(updatedOrders);

    // Restore stock
    try {
      const prods = await dbFetchStoreProducts();
      if (prods && Array.isArray(prods)) {
        const restoredProds = prods.map(p => {
          const matchingItem = targetOrder.items.find(i => i.productId === p.id);
          if (matchingItem) {
            const restoredStock = (p.stock || 0) + matchingItem.quantity;
            return { ...p, stock: restoredStock, inStock: restoredStock > 0 };
          }
          return p;
        });
        await dbSaveStoreProducts(restoredProds);
      }
      showToast('Order cancelled and inventory successfully restored.');
    } catch (e) {
      showToast('Order cancelled, but inventory restore failed', 'error');
    }
  };

  // Filters
  const filtered = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) ||
                        o.customerName.toLowerCase().includes(q) ||
                        (o.customerPhone && o.customerPhone.includes(q)) ||
                        (o.deliveryAddress?.city && o.deliveryAddress.city.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalOrdersCount = orders.length;
  const totalRevenue = orders
    .filter(o => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Refunded')
    .reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pendingCount = orders.filter(o => ['Order Placed', 'Order Confirmed', 'Processing', 'Packed'].includes(o.orderStatus)).length;
  const inTransitCount = orders.filter(o => ['Shipped', 'Out for Delivery'].includes(o.orderStatus)).length;
  const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          padding: '12px 20px',
          backgroundColor: notification.type === 'success' ? '#2D6A4F' : '#B91C1C',
          color: '#FFFFFF',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--accent-gold)',
              textTransform: 'uppercase'
            }}>
              Order Fulfillment & Courier Dispatch
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
            Store Order Management
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Fulfill apothecary orders, assign courier AWB tracking, and sync real-time delivery timelines with patrons.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={loadOrders}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh Orders'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Orders</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>{totalOrdersCount}</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Placed by patrons</span>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 600, textTransform: 'uppercase' }}>Gross Revenue</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-gold)', marginTop: '6px' }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Settled or awaiting COD</span>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 600, textTransform: 'uppercase' }}>Awaiting Dispatch</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#D97706', marginTop: '6px' }}>{pendingCount} Orders</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Processing & packing</span>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '11px', color: '#2D6A4F', fontWeight: 600, textTransform: 'uppercase' }}>Delivered Successfully</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#2D6A4F', marginTop: '6px' }}>{deliveredCount} Parcels</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Completed shipments</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
        backgroundColor: 'var(--bg-surface)',
        padding: '14px 18px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-hairline)'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Order Confirmed">Order Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-hairline)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-hairline)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Order ID</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Patron Details</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Items</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Payment</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Total</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{order.id}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.customerName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.customerPhone}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{order.deliveryAddress?.city}</div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{order.items.reduce((s, i) => s + i.quantity, 0)} Items</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order.items.map(i => i.productName).join(', ')}
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{order.paymentMethod}</div>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: order.paymentStatus === 'Paid' ? '#EDF3EE' : '#FEF3C7',
                        color: order.paymentStatus === 'Paid' ? '#2D6A4F' : '#B45309'
                      }}>
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--accent-gold)' }}>
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        backgroundColor: order.orderStatus === 'Delivered' ? '#EDF3EE' : order.orderStatus === 'Cancelled' ? '#FDEDEC' : 'var(--bg-primary)',
                        color: order.orderStatus === 'Delivered' ? '#2D6A4F' : order.orderStatus === 'Cancelled' ? '#DC2626' : 'var(--accent-gold-hover)',
                        border: '1px solid var(--border-hairline)'
                      }}>
                        {order.orderStatus}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => openOrderModal(order)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-hairline)',
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            No orders match the current filter.
          </div>
        )}
      </div>

      {/* Order Detail & Tracking Dispatch Drawer/Modal */}
      {activeOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-hairline)',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>Fulfillment Control</span>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '2px 0 0' }}>Order #{activeOrder.id}</h2>
              </div>
              <button onClick={() => setActiveOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Status Update Control Section */}
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid var(--border-hairline)'
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>Update Shipment & Fulfillment Status</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Shipment Stage *
                  </label>
                  <select
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value as OrderStatus)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', fontSize: '13px', fontWeight: 600 }}
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Order Confirmed">Order Confirmed</option>
                    <option value="Processing">Processing (Packing)</option>
                    <option value="Packed">Packed & Sealed</option>
                    <option value="Shipped">Shipped (Dispatched)</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Courier Partner
                  </label>
                  <input
                    type="text"
                    value={courierPartner}
                    onChange={(e) => setCourierPartner(e.target.value)}
                    placeholder="e.g. BlueDart Express, Delhivery"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Courier AWB / Tracking Reference Number
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. BD-8921849102"
                    style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', fontSize: '13px', fontFamily: 'monospace' }}
                  />
                  <button
                    onClick={handleUpdateOrderStatus}
                    disabled={updating}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'var(--accent-gold)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {updating ? 'Saving...' : 'Apply Status'}
                  </button>
                </div>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-hairline)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Customer</span>
                <div style={{ fontWeight: 600, fontSize: '14px', marginTop: '4px' }}>{activeOrder.customerName}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Phone: {activeOrder.customerPhone}</div>
                {activeOrder.customerEmail && <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Email: {activeOrder.customerEmail}</div>}
              </div>

              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-hairline)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Delivery Destination ({activeOrder.deliveryAddress?.label || 'Address'})
                </span>
                <div style={{ fontSize: '13px', marginTop: '4px', lineHeight: 1.4 }}>
                  {activeOrder.deliveryAddress?.apartment ? `${activeOrder.deliveryAddress.apartment}, ` : ''}
                  {activeOrder.deliveryAddress?.street || activeOrder.deliveryAddress?.address}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {activeOrder.deliveryAddress?.city}, {activeOrder.deliveryAddress?.state || 'Delhi'} - {activeOrder.deliveryAddress?.postalCode}
                </div>
              </div>
            </div>

            {/* Ordered Items List */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Items in Package
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeOrder.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-hairline)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={item.productImage || ''} alt={item.productName} style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.productName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ₹{item.price}</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials & Cancel */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-hairline)', paddingTop: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Amount</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  ₹{activeOrder.totalAmount.toLocaleString('en-IN')}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Method: {activeOrder.paymentMethod} • Status: {activeOrder.paymentStatus}
                </span>
              </div>

              {activeOrder.orderStatus !== 'Cancelled' && (
                <button
                  onClick={() => handleCancelAndRestoreStock(activeOrder.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px solid #DC2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.05)',
                    color: '#DC2626',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={13} />
                  Cancel & Restore Inventory
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
