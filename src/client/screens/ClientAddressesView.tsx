import React, { useState } from 'react';
import { 
  MapPin, Plus, Trash2, Edit2, Check, ArrowLeft, Home, Briefcase, Building 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { DeliveryAddress } from '../../types';

export const ClientAddressesView: React.FC = () => {
  const { user, savedAddresses, addSavedAddress, updateSavedAddress, deleteSavedAddress, setClientSubRoute } = usePamwill();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState<DeliveryAddress | null>(null);

  // Form states
  const [label, setLabel] = useState<string>('Home');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Gurugram, Delhi NCR');
  const [isDefault, setIsDefault] = useState(false);

  const openAddModal = () => {
    setEditingAddr(null);
    setLabel('Home');
    setRecipientName(user.name && user.name !== 'Guest Client' ? user.name : '');
    setPhone(user.phone || '');
    setStreet('');
    setLandmark('');
    setCity('Gurugram, Delhi NCR');
    setIsDefault(savedAddresses.length === 0);
    setModalOpen(true);
  };

  const openEditModal = (addr: DeliveryAddress) => {
    setEditingAddr(addr);
    setLabel(addr.label || 'Home');
    setRecipientName(addr.recipientName || '');
    setPhone(addr.phone || '');
    setStreet(addr.street || addr.address || '');
    setLandmark(addr.landmark || '');
    setCity(addr.city || 'Gurugram, Delhi NCR');
    setIsDefault(!!addr.isDefault);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !phone.trim()) return;

    if (editingAddr) {
      updateSavedAddress({
        ...editingAddr,
        label,
        recipientName,
        phone,
        street,
        address: street,
        landmark,
        city,
        isDefault
      });
    } else {
      addSavedAddress({
        id: `addr_${Date.now()}`,
        label,
        recipientName,
        phone,
        street,
        address: street,
        landmark,
        city,
        isDefault
      });
    }

    setModalOpen(false);
  };

  const getLabelIcon = (lbl: string) => {
    if (lbl.toLowerCase().includes('home')) return <Home size={16} />;
    if (lbl.toLowerCase().includes('office')) return <Briefcase size={16} />;
    return <Building size={16} />;
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <button
            onClick={() => setClientSubRoute('profile')}
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
              padding: 0,
              marginBottom: '6px'
            }}
          >
            <ArrowLeft size={15} /> Back to Profile
          </button>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Saved Delivery & Treatment Addresses
          </h1>
        </div>

        <button
          onClick={openAddModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--accent-gold)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            padding: '12px 22px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(169, 129, 47, 0.35)'
          }}
        >
          <Plus size={16} /> Add New Address
        </button>
      </div>

      {/* Address Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {savedAddresses.map(addr => (
          <div
            key={addr.id}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '20px',
              border: addr.isDefault ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
              padding: '22px',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(169, 129, 47, 0.15)',
                    color: 'var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getLabelIcon(addr.label || 'Home')}
                  </div>
                  <div>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span style={{
                        marginLeft: '8px',
                        fontSize: '10px',
                        fontWeight: 800,
                        backgroundColor: 'var(--accent-gold)',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        textTransform: 'uppercase'
                      }}>
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => openEditModal(addr)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    title="Edit address"
                  >
                    <Edit2 size={15} />
                  </button>
                  {savedAddresses.length > 1 && (
                    <button
                      onClick={() => deleteSavedAddress(addr.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--status-error)', cursor: 'pointer', padding: '4px' }}
                      title="Delete address"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {addr.recipientName}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '6px' }}>
                {addr.street || addr.address}
                {addr.landmark && `, Near ${addr.landmark}`}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {addr.city} • Contact: {addr.phone}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 13, 11, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}
        onClick={() => setModalOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '24px',
              border: '1px solid var(--border-hairline)',
              padding: '32px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: 'var(--shadow-elevated)'
            }}
          >
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 20px 0'
            }}>
              {editingAddr ? 'Edit Address' : 'Add New Address'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Location Tag</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['Home', 'Office', 'Hotel', 'Other'] as const).map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLabel(l)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-pill)',
                        border: label === l ? '1px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                        backgroundColor: label === l ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                        color: label === l ? '#fff' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Resident / Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder="Full Name"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Contact Mobile Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98..."
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Address / Villa / Apartment</label>
                <input
                  type="text"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  placeholder="House number, Street, Locality"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Landmark (Optional)</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  placeholder="Near Park / Club / Metro"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>City & Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="City, State"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                <input
                  type="checkbox"
                  id="defaultCheck"
                  checked={isDefault}
                  onChange={e => setIsDefault(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--accent-gold)' }}
                />
                <label htmlFor="defaultCheck" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Set as default delivery & treatment address
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-hairline)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--accent-gold)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: '6px'
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
