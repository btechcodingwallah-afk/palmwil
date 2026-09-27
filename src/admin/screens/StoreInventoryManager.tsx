import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Tag, 
  IndianRupee, 
  Sparkles,
  ArrowUpRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { dbFetchStoreProducts, dbSaveStoreProducts } from '../../services/supabase';
import { Product, ProductCategory } from '../../types';

export const StoreInventoryManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'InStock' | 'LowStock' | 'OutOfStock'>('All');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    tagline: '',
    description: '',
    category: 'Ayurvedic Oils',
    price: 999,
    originalPrice: 1299,
    stock: 25,
    volumeOrWeight: '100 ml',
    images: ['https://images.unsplash.com/photo-1608248597359-0f6667954592?q=80&w=1000'],
    specifications: [
      { label: 'Key Ingredients', value: 'Botanical Extracts' },
      { label: 'Origin', value: 'Sanctuary Apothecary, India' }
    ],
    inStock: true,
    isEnabled: true,
    featured: false,
    rating: 4.9,
    reviewsCount: 20
  });

  const [imagesText, setImagesText] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const fetched = await dbFetchStoreProducts();
      if (fetched && Array.isArray(fetched) && fetched.length > 0) {
        setProducts(fetched);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading store products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggleEnable = async (productId: string) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const nextState = p.isEnabled === false ? true : false;
        return { ...p, isEnabled: nextState };
      }
      return p;
    });
    setProducts(updated);
    const success = await dbSaveStoreProducts(updated);
    if (success) {
      showToast('Product visibility updated.');
    } else {
      showToast('Failed to save changes', 'error');
    }
  };

  const handleStockAdjust = async (productId: string, delta: number) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const newStock = Math.max(0, (p.stock || 0) + delta);
        return { ...p, stock: newStock, inStock: newStock > 0 };
      }
      return p;
    });
    setProducts(updated);
    await dbSaveStoreProducts(updated);
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to permanently remove this product from the store catalog?')) return;
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    const ok = await dbSaveStoreProducts(updated);
    if (ok) {
      showToast('Product removed from catalog.');
    } else {
      showToast('Error removing product', 'error');
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      tagline: '',
      description: '',
      category: 'Ayurvedic Oils',
      price: 899,
      originalPrice: 1099,
      stock: 30,
      volumeOrWeight: '100 ml',
      images: ['https://images.unsplash.com/photo-1608248597359-0f6667954592?q=80&w=1000'],
      specifications: [
        { label: 'Key Ingredients', value: '100% Herbal Extracts' },
        { label: 'Origin', value: 'Kerala Sanctuary, India' }
      ],
      inStock: true,
      isEnabled: true,
      featured: false,
      rating: 4.8,
      reviewsCount: 15
    });
    setImagesText('https://images.unsplash.com/photo-1608248597359-0f6667954592?q=80&w=1000');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData({ ...p });
    setImagesText((p.images || []).join('\n'));
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Product name is required.');
      return;
    }

    const imgList = imagesText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const priceNum = Number(formData.price) || 0;
    const origPriceNum = Number(formData.originalPrice) || priceNum;
    const stockNum = Number(formData.stock) || 0;

    let updatedList: Product[];
    if (editingId) {
      updatedList = products.map(p => {
        if (p.id === editingId) {
          return {
            ...p,
            ...formData,
            price: priceNum,
            originalPrice: origPriceNum,
            stock: stockNum,
            inStock: stockNum > 0,
            images: imgList.length > 0 ? imgList : p.images
          } as Product;
        }
        return p;
      });
    } else {
      const newProduct: Product = {
        id: 'prod_' + Date.now(),
        name: formData.name || '',
        tagline: formData.tagline || '',
        description: formData.description || '',
        category: formData.category || 'Ayurvedic Oils',
        price: priceNum,
        originalPrice: origPriceNum,
        stock: stockNum,
        inStock: stockNum > 0,
        volumeOrWeight: formData.volumeOrWeight || '',
        rating: 4.9,
        reviewsCount: 1,
        images: imgList.length > 0 ? imgList : ['https://images.unsplash.com/photo-1608248597359-0f6667954592?q=80&w=1000'],
        specifications: formData.specifications || [],
        featured: formData.featured ?? false,
        isEnabled: formData.isEnabled ?? true
      };
      updatedList = [newProduct, ...products];
    }

    setProducts(updatedList);
    setIsModalOpen(false);

    const ok = await dbSaveStoreProducts(updatedList);
    if (ok) {
      showToast(editingId ? 'Product updated successfully.' : 'New product published to mobile app.');
    } else {
      showToast('Error syncing to database.', 'error');
    }
  };

  // Filtered List
  const filtered = products.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) ||
                        p.category.toLowerCase().includes(q) ||
                        (p.description && p.description.toLowerCase().includes(q));
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    let matchStock = true;
    if (stockFilter === 'InStock') matchStock = p.stock > 0;
    if (stockFilter === 'LowStock') matchStock = p.stock > 0 && p.stock <= 5;
    if (stockFilter === 'OutOfStock') matchStock = p.stock === 0;

    return matchSearch && matchCat && matchStock;
  });

  const totalCatalog = products.length;
  const inStockCount = products.filter(p => p.stock > 0).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

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
              Apothecary & Merchandising
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
            Store Inventory & Products
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Manage remedies, bronze tools, essential oils, prices, stock levels, and live visibility in patron mobile apps.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={loadProducts}
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
            {loading ? 'Refreshing...' : 'Sync Live'}
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
            Add New Product
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Catalog</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>{totalCatalog} Products</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Across all wellness categories</span>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '11px', color: '#2D6A4F', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Stock Active</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#2D6A4F', marginTop: '6px' }}>{inStockCount} SKUs</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Available for patron checkout</span>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Low Stock Alert</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#D97706', marginTop: '6px' }}>{lowStockCount} SKUs</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Less than 5 units left</span>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '18px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hairline)' }}>
          <span style={{ fontSize: '11px', color: '#B91C1C', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Out of Stock</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#B91C1C', marginTop: '6px' }}>{outOfStockCount} SKUs</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Replenishment required</span>
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
            placeholder="Search by product name, category, ingredients..."
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
            <option value="Ayurvedic Oils">Ayurvedic Oils</option>
            <option value="Aromatherapy">Aromatherapy</option>
            <option value="Therapy Tools">Therapy Tools</option>
            <option value="Bath & Body">Bath & Body</option>
            <option value="Wellness Teas">Wellness Teas</option>
          </select>
        </div>

        {/* Stock Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Stock:</span>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
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
            <option value="All">All Stock Levels</option>
            <option value="InStock">In Stock Only</option>
            <option value="LowStock">Low Stock (≤ 5)</option>
            <option value="OutOfStock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filtered.map(product => {
          const isLow = product.stock > 0 && product.stock <= 5;
          const isOut = product.stock === 0;

          return (
            <div
              key={product.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-hairline)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
                opacity: product.isEnabled === false ? 0.6 : 1,
                position: 'relative'
              }}
            >
              <div>
                {/* Image and Header Row */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1608248597359-0f6667954592?q=80&w=200'}
                    alt={product.name}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid var(--border-hairline)'
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--accent-gold)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {product.category}
                      </span>

                      {/* Stock Pill */}
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        backgroundColor: isOut ? '#FDEDEC' : isLow ? '#FEF3C7' : '#EDF3EE',
                        color: isOut ? '#B91C1C' : isLow ? '#B45309' : '#2D6A4F'
                      }}>
                        {isOut ? 'OUT OF STOCK' : isLow ? `ONLY ${product.stock} LEFT` : `IN STOCK (${product.stock})`}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 2px' }}>
                      {product.name}
                    </h3>
                    {product.volumeOrWeight && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{product.volumeOrWeight}</span>
                    )}
                  </div>
                </div>

                {/* Price and Stock Controls */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '12px',
                  backgroundColor: 'var(--bg-primary)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-hairline)'
                }}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Price</span>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₹{product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '6px' }}>
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Stock Stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Stock:</span>
                    <button
                      onClick={() => handleStockAdjust(product.id, -1)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-hairline)',
                        backgroundColor: 'var(--bg-surface)',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                      {product.stock}
                    </span>
                    <button
                      onClick={() => handleStockAdjust(product.id, 1)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-hairline)',
                        backgroundColor: 'var(--bg-surface)',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--border-hairline)',
                paddingTop: '10px',
                marginTop: '4px'
              }}>
                <button
                  onClick={() => handleToggleEnable(product.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: 'none',
                    border: 'none',
                    color: product.isEnabled !== false ? '#2D6A4F' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {product.isEnabled !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                  {product.isEnabled !== false ? 'Active on App' : 'Disabled (Hidden)'}
                </button>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleOpenEdit(product)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: 'transparent',
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit3 size={12} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      backgroundColor: 'rgba(239, 68, 68, 0.05)',
                      color: '#EF4444',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
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
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
                {editingId ? 'Edit Product' : 'Add New Product to Store'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. 100% Authentic Ayurvedic Saffron & Lotus Radiance Nectar"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-primary)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Category *</label>
                  <select
                    value={formData.category || 'Ayurvedic Oils'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-primary)' }}
                  >
                    <option value="Ayurvedic Oils">Ayurvedic Oils</option>
                    <option value="Aromatherapy">Aromatherapy</option>
                    <option value="Therapy Tools">Therapy Tools</option>
                    <option value="Bath & Body">Bath & Body</option>
                    <option value="Wellness Teas">Wellness Teas</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Net Volume / Weight</label>
                  <input
                    type="text"
                    value={formData.volumeOrWeight || ''}
                    onChange={(e) => setFormData({ ...formData, volumeOrWeight: e.target.value })}
                    placeholder="e.g. 30 ml / 1 Set / 200 g"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-primary)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-primary)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>MRP / Original (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-primary)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Available Stock</label>
                  <input
                    type="number"
                    value={formData.stock || 0}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Image URLs (1 per line)</label>
                <textarea
                  rows={2}
                  value={imagesText}
                  onChange={(e) => setImagesText(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-primary)', fontFamily: 'monospace', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-primary)', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured ?? false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  Featured in Store
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={formData.isEnabled ?? true}
                    onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                  />
                  Published (Visible to patrons)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', borderTop: '1px solid var(--border-hairline)', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border-hairline)', background: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--accent-gold)', color: '#FFFFFF', fontWeight: 600, cursor: 'pointer' }}
                >
                  {editingId ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
