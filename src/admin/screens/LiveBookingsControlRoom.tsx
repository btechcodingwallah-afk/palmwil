import React, { useState } from 'react';
import { 
  AlertTriangle, RefreshCw, UserCheck, ShieldAlert, 
  MapPin, CheckCircle, Search, Filter, List, Navigation, Radio
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { Booking, BookingStatus } from '../../types';
import { PamwillMap } from '../../components/map/PamwillMap';

export const LiveBookingsControlRoom: React.FC = () => {
  const { bookings, therapists, updateBookingStatus, triggerSOS, dismissSOS } = usePamwill();
  const [reassignModalBooking, setReassignModalBooking] = useState<Booking | null>(null);
  const [selectedReplacementTherapistId, setSelectedReplacementTherapistId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.service.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReassign = () => {
    if (!reassignModalBooking || !selectedReplacementTherapistId) return;
    const replacement = therapists.find(t => t.id === selectedReplacementTherapistId);
    if (!replacement) return;

    // Update booking therapist
    reassignModalBooking.therapistId = replacement.id;
    reassignModalBooking.therapistName = replacement.fullName;
    reassignModalBooking.therapistPhoto = replacement.photoUrl;
    reassignModalBooking.therapistPhone = replacement.phone;
    reassignModalBooking.therapistRating = replacement.rating;

    updateBookingStatus(reassignModalBooking.id, 'On the Way');
    setReassignModalBooking(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="eyebrow">Real-Time Dispatch</span>
          <h1 style={{ fontSize: '26px', margin: '2px 0' }}>Live Bookings & Dispatch Control</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Monitor active sessions, handle instant manual reassignments if a practitioner is delayed, and resolve SOS emergencies.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
          <input
            type="text"
            placeholder="Search by Booking ID, Patron Name, or Therapy..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-surface)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-hairline)',
            backgroundColor: 'var(--bg-surface)',
            fontSize: '13px',
            outline: 'none'
          }}
        >
          <option value="All">All Statuses ({bookings.length})</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="On the Way">On the Way</option>
          <option value="Arrived">Arrived</option>
          <option value="Service Started">Service Started</option>
          <option value="Service Completed">Service Completed</option>
        </select>

        {/* View Mode Toggle */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--radius-md)',
          padding: '2px',
          gap: '2px'
        }}>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: viewMode === 'table' ? 'var(--accent-gold-light)' : 'transparent',
              color: viewMode === 'table' ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <List size={14} /> Table
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: viewMode === 'map' ? 'var(--accent-gold-light)' : 'transparent',
              color: viewMode === 'map' ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Radio size={14} /> Dispatch Radar Map
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="card-luxury" style={{ overflow: 'hidden', padding: 0, border: '1px solid var(--border-hairline)' }}>
          <div style={{
            padding: '12px 18px',
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-hairline)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span className="eyebrow" style={{ fontSize: '10px' }}>Geographical Dispatch Radar</span>
              <h3 style={{ fontSize: '16px', margin: '2px 0 0 0' }}>Active Sessions & Online Fleet Radar</h3>
            </div>
            <div style={{ display: 'flex', gap: '14px', fontSize: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-success)', fontWeight: 600 }}>
                ● {therapists.filter(t => t.isOnline).length} Practitioners Online
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold-hover)', fontWeight: 600 }}>
                ✦ {filteredBookings.length} Active Dispatched Sessions
              </span>
            </div>
          </div>
          <div style={{ height: '520px', position: 'relative' }}>
            <PamwillMap
              mode="dispatch"
              height="100%"
              bookings={filteredBookings}
              therapists={therapists}
              onSelectBooking={b => setReassignModalBooking(b)}
            />
          </div>
        </div>
      ) : (
        /* Bookings Data Table */
        <div className="card-luxury" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-hairline)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px 16px' }}>ID & SERVICE</th>
              <th style={{ padding: '12px 16px' }}>PATRON & SANCTUARY</th>
              <th style={{ padding: '12px 16px' }}>ASSIGNED THERAPIST</th>
              <th style={{ padding: '12px 16px' }}>FINANCIALS</th>
              <th style={{ padding: '12px 16px' }}>STATUS</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>OPERATIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(b => (
              <tr 
                key={b.id} 
                style={{ 
                  borderBottom: '1px solid var(--border-subtle)',
                  backgroundColor: b.sosTriggered ? 'var(--status-error-bg)' : 'transparent'
                }}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>#{b.id}</div>
                  <div style={{ fontSize: '12px', color: 'var(--accent-gold-hover)' }}>{b.service.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>🕒 {b.durationMin}m • {b.scheduledDate} {b.scheduledTime}</div>
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 600 }}>{b.customerName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{b.customerPhone}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    📍 {b.address}
                  </div>
                  {b.liveLocation && (
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      backgroundColor: 'var(--status-success-bg)',
                      color: 'var(--status-success)',
                      padding: '1px 5px',
                      borderRadius: 'var(--radius-pill)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      marginTop: '2px'
                    }}>
                      🛰️ Live GPS ({b.liveLocation.latitude.toFixed(3)}, {b.liveLocation.longitude.toFixed(3)})
                    </span>
                  )}
                </td>

                <td style={{ padding: '14px 16px' }}>
                  {b.therapistName ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img 
                        src={b.therapistPhoto || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"} 
                        alt={b.therapistName}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '12px' }}>{b.therapistName}</div>
                        <div style={{ fontSize: '10px', color: 'var(--accent-gold)' }}>★ {b.therapistRating || 4.9}</div>
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--status-warning)', fontWeight: 600 }}>
                      ⚠️ Unassigned
                    </span>
                  )}
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700 }}>₹{b.totalPaid}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Platform: ₹{b.platformCommission} • Payout: ₹{b.therapistPayout}
                  </div>
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 
                        b.status === 'Service Completed' ? 'var(--status-success-bg)' :
                        b.status === 'Cancelled' ? 'var(--status-error-bg)' :
                        'var(--accent-gold-light)',
                      color:
                        b.status === 'Service Completed' ? 'var(--status-success)' :
                        b.status === 'Cancelled' ? 'var(--status-error)' :
                        'var(--accent-gold-hover)'
                    }}>
                      {b.status}
                    </span>

                    {b.sosTriggered && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        backgroundColor: 'var(--status-error)',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        SOS
                      </span>
                    )}
                  </div>
                </td>

                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                    {b.sosTriggered ? (
                      <button
                        onClick={() => dismissSOS(b.id)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--status-success)',
                          color: '#fff',
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Resolve SOS
                      </button>
                    ) : (
                      <button
                        onClick={() => setReassignModalBooking(b)}
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '11px' }}
                      >
                        <RefreshCw size={11} /> Reassign
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* Manual Therapist Reassignment Modal */}
      {reassignModalBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(18, 16, 14, 0.7)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setReassignModalBooking(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              border: '1px solid var(--border-hairline)'
            }}
          >
            <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>Manual Therapist Reassignment</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Reassign Booking #{reassignModalBooking.id} ({reassignModalBooking.service.name}) to an available verified practitioner.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                SELECT AVAILABLE PROVIDER
              </label>
              <select
                value={selectedReplacementTherapistId}
                onChange={e => setSelectedReplacementTherapistId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-hairline)',
                  backgroundColor: 'var(--bg-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="">-- Choose Verified Practitioner --</option>
                {therapists.filter(t => t.status === 'Approved').map(t => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} (Rating: {t.rating} • {t.completedJobs} jobs)
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setReassignModalBooking(null)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleReassign}
                disabled={!selectedReplacementTherapistId}
                className="btn-gold"
                style={{ flex: 1 }}
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
