import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Percent, 
  IndianRupee, 
  Calendar,
  Layers,
  Copy
} from 'lucide-react';
import { dbFetchVouchers, dbSaveVouchers } from '../../services/supabase';
import { Voucher } from '../../types';

const INITIAL_SYSTEM_VOUCHERS: Voucher[] = [
  {
    id: 'v1',
    code: 'WELCOME500',
    title: 'First Sanctuary Experience',
    description: 'Flat ₹500 off on your maiden therapeutic reservation with verified doctors.',
    discountType: 'fixed',
    discountValue: 500,
    minSpend: 1499,
    expiryDate: '31 Dec 2026',
    category: 'All',
    tag: 'FIRST ORDER',
    accentColor: '#C5A059',
    isActive: true,
  },
  {
    id: 'v2',
    code: 'AYUR20',
    title: 'Ayurvedic Rejuvenation',
    description: '20% off authentic Panchakarma, Shirodhara and herbal rejuvenation rituals.',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 2499,
    expiryDate: '15 Oct 2026',
    category: 'Ayurveda',
    tag: 'LIMITED TIME',
    accentColor: '#2D6A4F',
    isActive: true,
  },
  {
    id: 'v3',
    code: 'GOLDMEMBER',
    title: 'Sanctuary Elite Privilege',
    description: 'Exclusive ₹800 concession reserved for Gold & Platinum sanctuary patrons.',
    discountType: 'fixed',
    discountValue: 800,
    minSpend: 2999,
    expiryDate: '30 Nov 2026',
    category: 'Wellness',
    tag: 'MEMBERS ONLY',
    accentColor: '#9381FF',
    isActive: true,
  },
  {
    id: 'v4',
    code: 'DEEPTISSUE',
    title: 'Sports Recovery Special',
    description: '₹400 off certified deep tissue & sports orthopedic sessions.',
    discountType: 'fixed',
    discountValue: 400,
    minSpend: 1999,
    expiryDate: '28 Oct 2026',
    category: 'Therapy',
    accentColor: '#B5838D',
    isActive: true,
  },
];

export const VouchersPromotionsManager: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_SYSTEM_VOUCHERS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Paused'>('All');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucherId, setEditingVoucherId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Voucher>>({
    code: '',
    title: '',
    description: '',
    discountType: 'fixed',
    discountValue: 500,
    minSpend: 1499,
    expiryDate: '31 Dec 2026',
    category: 'All',
    tag: '',
    accentColor: '#C5A059',
    isActive: true
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadVouchers = async () => {
    setLoading(true);
    try {
      const fetched = await dbFetchVouchers();
      if (fetched && Array.isArray(fetched) && fetched.length > 0) {
        setVouchers(fetched);
      } else {
        // If not in database yet, seed with initial system vouchers
        await dbSaveVouchers(INITIAL_SYSTEM_VOUCHERS);
        setVouchers(INITIAL_SYSTEM_VOUCHERS);
      }
    } catch (err) {
      console.error('Error fetching vouchers:', err);
      showToast('Failed to load vouchers from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const handleToggleStatus = async (id: string) => {
    const updated = vouchers.map(v => v.id === id ? { ...v, isActive: !v.isActive } : v);
    setVouchers(updated);
    const success = await dbSaveVouchers(updated);
    if (success) {
      showToast('Voucher status updated and synced to database.');
    } else {
      showToast('Failed to sync changes to database', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this voucher code?')) return;
    const updated = vouchers.filter(v => v.id !== id);
    setVouchers(updated);
    const success = await dbSaveVouchers(updated);
    if (success) {
      showToast('Voucher deleted and synced with patron mobile app.');
    } else {
      showToast('Failed to delete voucher', 'error');
    }
  };

  const handleOpenAdd = () => {
    setEditingVoucherId(null);
    setFormData({
      code: '',
      title: '',
      description: '',
      discountType: 'fixed',
      discountValue: 500,
      minSpend: 1499,
      expiryDate: '31 Dec 2026',
      category: 'All',
      tag: 'NEW',
      accentColor: '#C5A059',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Voucher) => {
    setEditingVoucherId(v.id);
    setFormData({ ...v });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.title) {
      alert('Voucher Code and Title are required.');
      return;
    }

    let updatedList: Voucher[];
    const codeClean = formData.code.trim().toUpperCase();

    if (editingVoucherId) {
      updatedList = vouchers.map(v => {
        if (v.id === editingVoucherId) {
          return {
            ...v,
            ...formData,
            code: codeClean
          } as Voucher;
        }
        return v;
      });
    } else {
      // Check duplicate
      if (vouchers.some(v => v.code.toUpperCase() === codeClean)) {
        alert('A voucher with this code already exists.');
        return;
      }
      const newVoucher: Voucher = {
        id: 'v_' + Date.now(),
        code: codeClean,
        title: formData.title || '',
        description: formData.description || '',
        discountType: formData.discountType || 'fixed',
        discountValue: Number(formData.discountValue) || 100,
        minSpend: Number(formData.minSpend) || 0,
        expiryDate: formData.expiryDate || '31 Dec 2026',
        category: (formData.category as any) || 'All',
        tag: formData.tag || '',
        accentColor: formData.accentColor || '#C5A059',
        isActive: formData.isActive ?? true
      };
      updatedList = [newVoucher, ...vouchers];
    }

    setVouchers(updatedList);
    setIsModalOpen(false);

    const success = await dbSaveVouchers(updatedList);
    if (success) {
      showToast(editingVoucherId ? 'Voucher updated successfully' : 'New voucher created and published to mobile app');
    } else {
      showToast('Error syncing to database', 'error');
    }
  };

  // Filtered List
  const filtered = vouchers.filter(v => {
    const matchesSearch = v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || v.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || 
                          (statusFilter === 'Active' && v.isActive) || 
                          (statusFilter === 'Paused' && !v.isActive);
    return matchesSearch && matchesCat && matchesStatus;
  });

  const totalCodes = vouchers.length;
  const activeCodes = vouchers.filter(v => v.isActive).length;
  const pausedCodes = totalCodes - activeCodes;

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
          gap: '8px',
          animation: 'fadeIn 0.2s ease-out'
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
              Promotions & Growth Engine
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
            Vouchers & Promo Codes
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Manage discount codes, patron perks, and promotional offers live synced with the patron mobile app.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={loadVouchers}
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
            {loading ? 'Syncing...' : 'Sync Live'}
          </button>

          <button
            onClick={handleOpenAdd}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 20px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--accent-gold)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(197, 160, 89, 0.3)'
            }}
          >
            <Plus size={16} />
            Create Promo Voucher
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Promo Codes</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>{totalCodes}</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Registered in system registry</span>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '11px', color: '#2D6A4F', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active on Mobile App</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#2D6A4F', marginTop: '6px' }}>{activeCodes}</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Ready for patrons to redeem</span>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '11px', color: '#B91C1C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paused / Inactive</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#B91C1C', marginTop: '6px' }}>{pausedCodes}</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Hidden from checkout discount</span>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Database Status</span>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            Connected & Live
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Supabase system_vouchers table</span>
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
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by promo code, title, or description..."
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

        {/* Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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
            <option value="All">All Categories</option>
            <option value="Wellness">Wellness</option>
            <option value="Therapy">Therapy</option>
            <option value="Ayurveda">Ayurveda</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
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
            <option value="Active">Active Only</option>
            <option value="Paused">Paused Only</option>
          </select>
        </div>
      </div>

      {/* Vouchers Table / Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '16px'
      }}>
        {filtered.map(voucher => {
          const accent = voucher.accentColor || '#C5A059';

          return (
            <div
              key={voucher.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-hairline)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                position: 'relative',
                opacity: voucher.isActive ? 1 : 0.65,
                transition: 'all 200ms ease'
              }}
            >
              <div>
                {/* Top Row: Code Badge & Category Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      backgroundColor: voucher.isActive ? accent : '#64748B',
                      color: '#FFFFFF',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '13px',
                      letterSpacing: '0.08em',
                      fontFamily: 'monospace',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}>
                      {voucher.code}
                    </div>

                    {voucher.tag && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(197, 160, 89, 0.15)',
                        color: 'var(--accent-gold)',
                        border: '1px solid rgba(197, 160, 89, 0.3)'
                      }}>
                        {voucher.tag}
                      </span>
                    )}
                  </div>

                  {/* Status Toggle Switch */}
                  <button
                    onClick={() => handleToggleStatus(voucher.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '14px',
                      border: 'none',
                      backgroundColor: voucher.isActive ? 'rgba(45, 106, 79, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: voucher.isActive ? '#2D6A4F' : '#DC2626',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: voucher.isActive ? '#2D6A4F' : '#DC2626'
                    }} />
                    {voucher.isActive ? 'ACTIVE' : 'PAUSED'}
                  </button>
                </div>

                {/* Title & Description */}
                <div style={{ marginTop: '14px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {voucher.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                    {voucher.description}
                  </p>
                </div>

                {/* Offer Details Strip */}
                <div style={{
                  marginTop: '14px',
                  backgroundColor: 'var(--bg-primary)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  border: '1px solid var(--border-hairline)'
                }}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Benefit</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: accent }}>
                      {voucher.discountType === 'percentage' ? `${voucher.discountValue}% OFF` : `₹${voucher.discountValue} OFF`}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Min Order</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      ₹{voucher.minSpend}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Category</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {voucher.category}
                    </span>
                  </div>
                </div>

                {/* Expiry */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <Calendar size={12} />
                  <span>Valid until: <strong style={{ color: 'var(--text-secondary)' }}>{voucher.expiryDate}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
                borderTop: '1px solid var(--border-hairline)',
                paddingTop: '12px'
              }}>
                <button
                  onClick={() => handleOpenEdit(voucher)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  <Edit3 size={13} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(voucher.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    color: '#EF4444',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px 20px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-hairline)'
        }}>
          <Tag size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>No promo vouchers match your filters</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Try clearing the search or category filter, or create a new voucher code.
          </p>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
            maxWidth: '520px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {editingVoucherId ? 'Edit Promo Voucher' : 'Create New Promo Voucher'}
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Changes will sync directly to patron mobile apps upon saving.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Promo Code & Badge */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Promo Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MONSOON30"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      fontWeight: 700
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Badge Tag (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. POPULAR, 20% OFF"
                    value={formData.tag || ''}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Voucher Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monsoon Rejuvenation Special"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Terms or details shown to patrons..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Discount Type & Value */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType || 'fixed'}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  >
                    <option value="fixed">Flat Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.discountValue || ''}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              {/* Min Spend & Expiry */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Minimum Spend (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minSpend || 0}
                    onChange={(e) => setFormData({ ...formData, minSpend: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="31 Dec 2026"
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              {/* Category & Accent Color */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Applicable Category
                  </label>
                  <select
                    value={formData.category || 'All'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  >
                    <option value="All">All Categories</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Therapy">Therapy</option>
                    <option value="Ayurveda">Ayurveda</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Brand Accent Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={formData.accentColor || '#C5A059'}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      style={{
                        width: '36px',
                        height: '36px',
                        padding: 0,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="text"
                      value={formData.accentColor || '#C5A059'}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-hairline)',
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Status Radio */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ accentColor: 'var(--accent-gold)' }}
                  />
                  <span>Publish as Active (visible in mobile app)</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                marginTop: '12px',
                borderTop: '1px solid var(--border-hairline)',
                paddingTop: '16px'
              }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'var(--accent-gold)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(197, 160, 89, 0.3)'
                  }}
                >
                  {editingVoucherId ? 'Save Changes' : 'Create Voucher'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
