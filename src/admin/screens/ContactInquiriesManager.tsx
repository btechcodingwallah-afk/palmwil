import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Sparkles, 
  X, 
  MessageCircle, 
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Shield,
  HelpCircle,
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { ConnectInquiry, InquiryStatus, InquiryType } from '../../types';

export const ContactInquiriesManager: React.FC = () => {
  const { connectInquiries, updateConnectInquiryStatus, refreshData } = usePamwill();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');

  const [activeInquiry, setActiveInquiry] = useState<ConnectInquiry | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Compute metrics
  const totalCount = connectInquiries.length;
  const newCount = connectInquiries.filter(i => i.status === 'New').length;
  const inProgressCount = connectInquiries.filter(i => i.status === 'In Progress').length;
  const contactedCount = connectInquiries.filter(i => i.status === 'Contacted').length;
  const resolvedCount = connectInquiries.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;

  // Filter inquiries
  const filteredInquiries = connectInquiries.filter(inq => {
    const matchesSearch = 
      inq.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery) ||
      inq.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.organization && inq.organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || inq.status === selectedStatus;
    const matchesType = selectedType === 'All' || inq.inquiryType === selectedType;
    const matchesCity = selectedCity === 'All' || inq.city === selectedCity;

    return matchesSearch && matchesStatus && matchesType && matchesCity;
  });

  const handleOpenInquiry = (inq: ConnectInquiry) => {
    setActiveInquiry(inq);
    setAdminNoteInput(inq.adminNotes || '');
  };

  const handleUpdateStatus = async (inqId: string, newStatus: InquiryStatus, notes?: string) => {
    await updateConnectInquiryStatus(inqId, newStatus, notes);
    if (activeInquiry && activeInquiry.id === inqId) {
      setActiveInquiry(prev => prev ? { 
        ...prev, 
        status: newStatus, 
        ...(notes !== undefined ? { adminNotes: notes } : {}) 
      } : null);
    }
  };

  const handleSaveNote = async () => {
    if (!activeInquiry) return;
    setSavingNote(true);
    await updateConnectInquiryStatus(activeInquiry.id, activeInquiry.status, adminNoteInput);
    setSavingNote(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'New':
        return {
          bg: 'rgba(212, 175, 55, 0.18)',
          color: '#E8D298',
          border: 'rgba(212, 175, 55, 0.4)',
          icon: <AlertCircle size={12} />
        };
      case 'In Progress':
        return {
          bg: 'rgba(56, 126, 219, 0.15)',
          color: '#6AA8F7',
          border: 'rgba(56, 126, 219, 0.35)',
          icon: <Clock size={12} />
        };
      case 'Contacted':
        return {
          bg: 'rgba(168, 85, 247, 0.18)',
          color: '#C084FC',
          border: 'rgba(168, 85, 247, 0.35)',
          icon: <MessageCircle size={12} />
        };
      case 'Resolved':
        return {
          bg: 'rgba(76, 107, 79, 0.22)',
          color: '#72BB7A',
          border: 'rgba(76, 107, 79, 0.45)',
          icon: <CheckCircle2 size={12} />
        };
      case 'Closed':
        return {
          bg: 'rgba(120, 113, 108, 0.15)',
          color: '#A8A29E',
          border: 'rgba(120, 113, 108, 0.3)',
          icon: <XCircle size={12} />
        };
      default:
        return {
          bg: 'rgba(255,255,255,0.08)',
          color: '#D0C9C0',
          border: 'rgba(255,255,255,0.15)',
          icon: <Clock size={12} />
        };
    }
  };

  const getTypeBadge = (type: InquiryType) => {
    switch (type) {
      case 'Hotel & Resort Concierge Partnership':
        return { label: 'Resort Partnership', color: '#D4AF37', bg: 'rgba(212, 175, 55, 0.12)' };
      case 'Corporate Wellness & Retreats':
        return { label: 'Corporate Wellness', color: '#34D399', bg: 'rgba(52, 211, 153, 0.12)' };
      case 'Therapist Partner Onboarding':
        return { label: 'Therapist Partner', color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.12)' };
      case 'VIP Booking & Concierge Support':
        return { label: 'VIP Concierge', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' };
      case 'General Inquiry & Feedback':
      default:
        return { label: 'General Inquiry', color: '#93C5FD', bg: 'rgba(147, 197, 253, 0.12)' };
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header & KPI Summary */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '999px',
            backgroundColor: 'rgba(169, 129, 47, 0.12)',
            border: '1px solid rgba(169, 129, 47, 0.3)',
            color: '#D4AF37',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            <Sparkles size={12} /> Inbound Lead Concierge
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '30px',
            fontWeight: 700,
            color: '#FAF8F5',
            margin: '0 0 6px'
          }}>
            Client & Partner Inquiries
          </h1>
          <p style={{ fontSize: '14px', color: '#9E9284', margin: 0 }}>
            Manage inbound corporate retreat inquiries, luxury hotel/resort spa amenities, and direct executive correspondence.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            backgroundColor: '#1E1A16',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#FAF8F5',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Syncing...' : 'Sync Inquiries'}
        </button>
      </div>

      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px'
      }}>
        {/* Total Inquiries */}
        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={kpiLabelStyle}>Total Inquiries</span>
            <div style={{ ...kpiIconBox, backgroundColor: 'rgba(169, 129, 47, 0.15)', color: '#D4AF37' }}>
              <MessageSquare size={16} />
            </div>
          </div>
          <div style={kpiValueStyle}>{totalCount}</div>
          <span style={kpiSubtextStyle}>All submitted leads</span>
        </div>

        {/* New / Pending Action */}
        <div style={{
          ...kpiCardStyle,
          border: newCount > 0 ? '1px solid rgba(212, 175, 55, 0.45)' : kpiCardStyle.border,
          boxShadow: newCount > 0 ? '0 0 25px rgba(212, 175, 55, 0.1)' : 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={kpiLabelStyle}>New / Unread</span>
            <div style={{ ...kpiIconBox, backgroundColor: 'rgba(212, 175, 55, 0.18)', color: '#E8D298' }}>
              <AlertCircle size={16} />
            </div>
          </div>
          <div style={{ ...kpiValueStyle, color: '#E8D298' }}>{newCount}</div>
          <span style={kpiSubtextStyle}>Requires executive reply</span>
        </div>

        {/* In Progress */}
        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={kpiLabelStyle}>In Progress</span>
            <div style={{ ...kpiIconBox, backgroundColor: 'rgba(56, 126, 219, 0.15)', color: '#6AA8F7' }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ ...kpiValueStyle, color: '#6AA8F7' }}>{inProgressCount}</div>
          <span style={kpiSubtextStyle}>Under proposal draft</span>
        </div>

        {/* Contacted */}
        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={kpiLabelStyle}>Contacted</span>
            <div style={{ ...kpiIconBox, backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#C084FC' }}>
              <MessageCircle size={16} />
            </div>
          </div>
          <div style={{ ...kpiValueStyle, color: '#C084FC' }}>{contactedCount}</div>
          <span style={kpiSubtextStyle}>Outreach delivered</span>
        </div>

        {/* Resolved / Closed */}
        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={kpiLabelStyle}>Resolved</span>
            <div style={{ ...kpiIconBox, backgroundColor: 'rgba(76, 107, 79, 0.2)', color: '#72BB7A' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div style={{ ...kpiValueStyle, color: '#72BB7A' }}>{resolvedCount}</div>
          <span style={kpiSubtextStyle}>Completed & archived</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#1E1A16',
        borderRadius: '18px',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '18px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search Field */}
        <div style={{
          position: 'relative',
          flex: '1 1 280px',
          maxWidth: '380px'
        }}>
          <Search size={16} color="#887E74" style={{ position: 'absolute', left: '14px', top: '13px' }} />
          <input
            type="text"
            placeholder="Search by name, organization, email, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#171411',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              padding: '10px 14px 10px 40px',
              color: '#FAF8F5',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#887E74', fontWeight: 600 }}>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={selectStyle}
            >
              <option value="All">All Statuses ({totalCount})</option>
              <option value="New">New ({newCount})</option>
              <option value="In Progress">In Progress ({inProgressCount})</option>
              <option value="Contacted">Contacted ({contactedCount})</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#887E74', fontWeight: 600 }}>Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={selectStyle}
            >
              <option value="All">All Inquiries</option>
              <option value="Hotel & Resort Concierge Partnership">Hotels & Resorts</option>
              <option value="Corporate Wellness & Retreats">Corporate Wellness</option>
              <option value="Therapist Partner Onboarding">Therapist Network</option>
              <option value="VIP Booking & Concierge Support">VIP Concierge</option>
              <option value="General Inquiry & Feedback">General Inquiry</option>
            </select>
          </div>

          {/* City Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#887E74', fontWeight: 600 }}>City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={selectStyle}
            >
              <option value="All">All Cities</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Goa">Goa</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Pune">Pune</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table / Inquiries List */}
      <div style={{
        backgroundColor: '#171411',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden'
      }}>
        {filteredInquiries.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#887E74' }}>
            <MessageSquare size={40} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
            <h3 style={{ color: '#D0C9C0', fontSize: '16px', margin: '0 0 6px' }}>No Inquiries Found</h3>
            <p style={{ fontSize: '13px', margin: 0 }}>Try clearing your filters or search keywords.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
              <thead>
                <tr style={{
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  backgroundColor: 'rgba(255,255,255,0.02)'
                }}>
                  <th style={thStyle}>Inquiry Ref & Date</th>
                  <th style={thStyle}>Lead / Organization</th>
                  <th style={thStyle}>Inquiry Category</th>
                  <th style={thStyle}>Direct Contacts</th>
                  <th style={thStyle}>Preferred Channel</th>
                  <th style={thStyle}>Status</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inq) => {
                  const statusStyle = getStatusBadge(inq.status);
                  const typeBadge = getTypeBadge(inq.inquiryType);
                  const dateFormatted = new Date(inq.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr
                      key={inq.id}
                      onClick={() => handleOpenInquiry(inq)}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Ref & Date */}
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 700, color: '#FAF8F5', fontSize: '13px' }}>
                          {inq.id}
                        </div>
                        <div style={{ fontSize: '11px', color: '#887E74', marginTop: '2px' }}>
                          {dateFormatted}
                        </div>
                      </td>

                      {/* Lead / Organization */}
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600, color: '#FAF8F5', fontSize: '14px' }}>
                          {inq.fullName}
                        </div>
                        {inq.organization ? (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: '#D4AF37',
                            marginTop: '2px'
                          }}>
                            <Building size={12} /> {inq.organization}
                          </div>
                        ) : (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: '#887E74',
                            marginTop: '2px'
                          }}>
                            <MapPin size={11} /> {inq.city}
                          </div>
                        )}
                      </td>

                      {/* Inquiry Category */}
                      <td style={tdStyle}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          backgroundColor: typeBadge.bg,
                          color: typeBadge.color,
                          fontSize: '11px',
                          fontWeight: 600,
                          letterSpacing: '0.02em'
                        }}>
                          {typeBadge.label}
                        </span>
                      </td>

                      {/* Contact Info */}
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#D0C9C0' }}>
                            <Phone size={12} color="#887E74" />
                            {inq.phone}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#887E74' }}>
                            <Mail size={12} color="#887E74" />
                            {inq.email}
                          </div>
                        </div>
                      </td>

                      {/* Preferred Channel */}
                      <td style={tdStyle}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 9px',
                          borderRadius: '6px',
                          backgroundColor: inq.preferredContactMethod === 'WhatsApp' ? 'rgba(37, 211, 102, 0.15)' : 'rgba(255,255,255,0.06)',
                          color: inq.preferredContactMethod === 'WhatsApp' ? '#25D366' : '#C7BEB1',
                          fontSize: '11px',
                          fontWeight: 600
                        }}>
                          {inq.preferredContactMethod}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={tdStyle}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 11px',
                          borderRadius: '999px',
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          border: `1px solid ${statusStyle.border}`,
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {statusStyle.icon}
                          {inq.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenInquiry(inq);
                          }}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(169, 129, 47, 0.15)',
                            border: '1px solid rgba(169, 129, 47, 0.3)',
                            color: '#E8D298',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          Review & Action <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail & Action Drawer / Modal */}
      {activeInquiry && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(8, 7, 6, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setActiveInquiry(null)}>
          <div
            style={{
              backgroundColor: '#171411',
              border: '1px solid rgba(169, 129, 47, 0.4)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '720px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 70px rgba(0,0,0,0.85)',
              color: '#FAF8F5',
              position: 'relative',
              padding: '32px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveInquiry(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#B0A89F',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            {/* Header info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                fontSize: '11px',
                color: '#D4AF37',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                INQUIRY REF: {activeInquiry.id}
              </span>
              <span style={{ color: '#555' }}>•</span>
              <span style={{ fontSize: '12px', color: '#887E74' }}>
                {new Date(activeInquiry.createdAt).toLocaleString('en-IN')}
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '24px',
              fontWeight: 700,
              color: '#FAF8F5',
              margin: '0 0 6px'
            }}>
              {activeInquiry.fullName}
            </h2>

            {activeInquiry.organization && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: '#E8D298',
                marginBottom: '16px'
              }}>
                <Building size={14} /> {activeInquiry.organization} • {activeInquiry.city}
              </div>
            )}

            {/* Quick Contact Buttons */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '16px',
              backgroundColor: '#1E1A16',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '24px'
            }}>
              {/* WhatsApp Quick Link */}
              <a
                href={`https://wa.me/${activeInquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${activeInquiry.fullName}, this is the PamWill Concierge Team responding to your inquiry (${activeInquiry.id}) regarding ${activeInquiry.inquiryType}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '8px 16px',
                  borderRadius: '10px',
                  textDecoration: 'none'
                }}
              >
                <PhoneCall size={14} /> WhatsApp Chat <ExternalLink size={12} />
              </a>

              {/* Phone Direct Call */}
              <a
                href={`tel:${activeInquiry.phone}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FAF8F5',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '8px 16px',
                  borderRadius: '10px',
                  textDecoration: 'none'
                }}
              >
                <Phone size={14} /> Call {activeInquiry.phone}
              </a>

              {/* Direct Mail */}
              <a
                href={`mailto:${activeInquiry.email}?subject=${encodeURIComponent(`PamWill Concierge: Inquiry ${activeInquiry.id} (${activeInquiry.inquiryType})`)}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FAF8F5',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '8px 16px',
                  borderRadius: '10px',
                  textDecoration: 'none'
                }}
              >
                <Mail size={14} /> Email Lead
              </a>
            </div>

            {/* Inquiry Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              marginBottom: '20px'
            }}>
              <div style={infoBoxStyle}>
                <span style={infoLabelStyle}>Category</span>
                <span style={{ fontSize: '13px', color: '#FAF8F5', fontWeight: 600 }}>
                  {activeInquiry.inquiryType}
                </span>
              </div>
              <div style={infoBoxStyle}>
                <span style={infoLabelStyle}>City</span>
                <span style={{ fontSize: '13px', color: '#FAF8F5', fontWeight: 600 }}>
                  {activeInquiry.city}
                </span>
              </div>
              <div style={infoBoxStyle}>
                <span style={infoLabelStyle}>Preferred Channel</span>
                <span style={{ fontSize: '13px', color: '#FAF8F5', fontWeight: 600 }}>
                  {activeInquiry.preferredContactMethod}
                </span>
              </div>
            </div>

            {/* Message Details */}
            <div style={{ marginBottom: '24px' }}>
              <span style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#D4AF37',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px'
              }}>
                Inquiry Message / Project Scope
              </span>
              <div style={{
                backgroundColor: '#1E1A16',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                padding: '16px',
                fontSize: '14px',
                lineHeight: 1.6,
                color: '#FAF8F5',
                whiteSpace: 'pre-wrap'
              }}>
                {activeInquiry.message}
              </div>
            </div>

            {/* Status Transition Control */}
            <div style={{ marginBottom: '24px' }}>
              <span style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#B0A89F',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '10px'
              }}>
                Update Status
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(['New', 'In Progress', 'Contacted', 'Resolved', 'Closed'] as InquiryStatus[]).map(statusOption => {
                  const isCurrent = activeInquiry.status === statusOption;
                  return (
                    <button
                      key={statusOption}
                      onClick={() => handleUpdateStatus(activeInquiry.id, statusOption)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        backgroundColor: isCurrent ? 'var(--accent-gold, #A9812F)' : '#1E1A16',
                        border: isCurrent ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                        color: isCurrent ? '#FAF8F5' : '#887E74',
                        fontWeight: isCurrent ? 700 : 500,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {statusOption}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Admin Notes Section */}
            <div>
              <span style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#B0A89F',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px'
              }}>
                Internal Concierge Notes
              </span>
              <textarea
                rows={3}
                placeholder="Log internal follow-up remarks, agreed corporate terms, or meeting schedule..."
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#1E1A16',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  padding: '12px',
                  color: '#FAF8F5',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  marginBottom: '10px'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSaveNote}
                  disabled={savingNote}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(169, 129, 47, 0.25)',
                    border: '1px solid #D4AF37',
                    color: '#E8D298',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: savingNote ? 'not-allowed' : 'pointer'
                  }}
                >
                  {savingNote ? 'Saving...' : 'Save Internal Note'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

// Styles
const kpiCardStyle: React.CSSProperties = {
  backgroundColor: '#1E1A16',
  borderRadius: '18px',
  border: '1px solid rgba(255,255,255,0.08)',
  padding: '20px 22px',
  position: 'relative'
};

const kpiLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: '#887E74',
  textTransform: 'uppercase',
  letterSpacing: '0.06em'
};

const kpiIconBox: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const kpiValueStyle: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '32px',
  fontWeight: 700,
  color: '#FAF8F5',
  margin: '4px 0 2px'
};

const kpiSubtextStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#887E74'
};

const selectStyle: React.CSSProperties = {
  backgroundColor: '#171411',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  padding: '8px 12px',
  color: '#FAF8F5',
  fontSize: '13px',
  outline: 'none',
  cursor: 'pointer'
};

const thStyle: React.CSSProperties = {
  padding: '14px 20px',
  fontSize: '11px',
  fontWeight: 700,
  color: '#887E74',
  textTransform: 'uppercase',
  letterSpacing: '0.06em'
};

const tdStyle: React.CSSProperties = {
  padding: '16px 20px',
  verticalAlign: 'middle'
};

const infoBoxStyle: React.CSSProperties = {
  backgroundColor: '#1E1A16',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '12px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const infoLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#887E74',
  textTransform: 'uppercase',
  letterSpacing: '0.06em'
};
