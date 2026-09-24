import React, { useState } from 'react';
import { MapPin, Plus, Upload, Check, Search, ShieldCheck } from 'lucide-react';
import { INDIAN_CITIES, ALL_INDIAN_STATES, IndianCity } from '../../data/indianCities';

export const IndianCitiesManager: React.FC = () => {
  const [cities, setCities] = useState<IndianCity[]>(INDIAN_CITIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvSuccess, setCsvSuccess] = useState(false);

  const filteredCities = cities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProcessCsvImport = () => {
    setCsvSuccess(true);
    setTimeout(() => {
      setCsvSuccess(false);
      setShowCsvModal(false);
    }, 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="eyebrow">Geographic Coverage</span>
          <h1 style={{ fontSize: '26px', margin: '2px 0' }}>All-India Serviceable Hubs & Districts</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Configure active urban centers across 28 states and union territories, with district-level practitioner dispatch.
          </p>
        </div>

        <button
          onClick={() => setShowCsvModal(true)}
          className="btn-gold"
          style={{ padding: '10px 18px', fontSize: '13px' }}
        >
          <Upload size={15} /> Bulk CSV Import
        </button>
      </div>

      {/* Coverage Status Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="card-luxury" style={{ padding: '16px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Metros</span>
          <div style={{ fontSize: '22px', fontWeight: 700, margin: '4px 0' }}>8 Tier-1 Hubs</div>
          <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: 600 }}>100% Operational</span>
        </div>

        <div className="card-luxury" style={{ padding: '16px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Wellness Destinations</span>
          <div style={{ fontSize: '22px', fontWeight: 700, margin: '4px 0' }}>17 Key Retreats</div>
          <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 600 }}>Goa, Rishikesh, Udaipur</span>
        </div>

        <div className="card-luxury" style={{ padding: '16px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Indian States & UTs</span>
          <div style={{ fontSize: '22px', fontWeight: 700, margin: '4px 0' }}>{ALL_INDIAN_STATES.length} Regions</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>PAN-India Regulatory Ready</span>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative' }}>
        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
        <input
          type="text"
          placeholder="Filter cities or states (e.g. Maharashtra, Goa, Delhi NCR)..."
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

      {/* Cities Table */}
      <div className="card-luxury" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-hairline)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px 16px' }}>DISTRICT / METRO</th>
              <th style={{ padding: '12px 16px' }}>STATE / UT</th>
              <th style={{ padding: '12px 16px' }}>CLASSIFICATION</th>
              <th style={{ padding: '12px 16px' }}>DISPATCH STATUS</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.map(city => (
              <tr key={city.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} color="var(--accent-gold)" />
                    <span>{city.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                  {city.state}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--bg-secondary)' }}>
                    Tier {city.tier} {city.popular ? '• Popular' : ''}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ● Active On-Demand
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }}>
                    Configure Zones
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk CSV Import Modal */}
      {showCsvModal && (
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
        onClick={() => setShowCsvModal(false)}
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
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Bulk CSV District Import</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Upload standard format CSV file with columns: <code>city_name, state_name, tier, postal_codes</code>.
            </p>

            <div style={{
              border: '2px dashed var(--border-hairline)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-primary)',
              marginBottom: '16px'
            }}>
              <Upload size={28} color="var(--accent-gold)" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontSize: '13px', fontWeight: 600 }}>Drag and drop all-india-districts.csv</div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Supports up to 800+ districts in one import</span>
            </div>

            {csvSuccess ? (
              <div style={{ padding: '10px', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '13px', fontWeight: 600 }}>
                ✓ 742 Indian Districts & Pincodes Imported Successfully!
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowCsvModal(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button onClick={handleProcessCsvImport} className="btn-gold" style={{ flex: 1 }}>
                  Process & Import
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
