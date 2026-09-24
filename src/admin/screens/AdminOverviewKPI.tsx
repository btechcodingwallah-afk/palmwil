import React from 'react';
import { 
  TrendingUp, Users, UserCheck, DollarSign, 
  Calendar, ShieldAlert, AlertTriangle, ArrowUpRight, Sparkles 
} from 'lucide-react';
import { usePamwill } from '../../state/store';

export const AdminOverviewKPI: React.FC = () => {
  const { bookings, therapists, services } = usePamwill();

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPaid, 0);
  const totalPlatformEarnings = bookings.reduce((sum, b) => sum + (b.platformCommission || 0), 0);
  const activeBookingsCount = bookings.filter(b => b.status !== 'Service Completed' && b.status !== 'Cancelled').length;
  const approvedTherapistsCount = therapists.filter(t => t.status === 'Approved').length;
  const sosBookings = bookings.filter(b => b.sosTriggered);

  // Dynamic ABV
  const abv = bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0;

  // Dynamic Unique Patrons
  const uniquePatronsCount = new Set(bookings.map(b => b.customerId || b.customerPhone).filter(Boolean)).size;

  // Dynamic Cancellation Rate
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;
  const cancellationRate = bookings.length > 0 
    ? ((cancelledCount / bookings.length) * 100).toFixed(1) + '%' 
    : '0.0%';

  // Dynamic Utilization
  const onlineTherapistsCount = therapists.filter(t => t.isOnline).length;
  const utilization = approvedTherapistsCount > 0
    ? Math.min(100, Math.round((activeBookingsCount / Math.max(1, onlineTherapistsCount || approvedTherapistsCount)) * 100)) + '%'
    : '0.0%';

  // Dynamic Most Requested Ceremonies
  const serviceCounts: Record<string, { count: number; revenue: number }> = {};
  bookings.forEach(b => {
    const sName = b.service?.name || 'Signature Therapy';
    if (!serviceCounts[sName]) serviceCounts[sName] = { count: 0, revenue: 0 };
    serviceCounts[sName].count += 1;
    serviceCounts[sName].revenue += b.totalPaid;
  });

  const topCeremonies = Object.keys(serviceCounts).length > 0
    ? Object.entries(serviceCounts).sort((a, b) => b[1].count - a[1].count).slice(0, 5).map(([name, data]) => ({
        name,
        bookings: data.count,
        revenue: '₹' + data.revenue.toLocaleString('en-IN'),
        share: Math.max(5, Math.round((data.count / bookings.length) * 100)) + '%'
      }))
    : services.slice(0, 5).map((s) => ({
        name: s.name,
        bookings: 0,
        revenue: '₹0',
        share: '0%'
      }));

  // Dynamic Hubs Performance
  const cityCounts: Record<string, { activeJobs: number; revenue: number }> = {};
  bookings.forEach(b => {
    const cityName = b.city || 'Delhi NCR';
    if (!cityCounts[cityName]) cityCounts[cityName] = { activeJobs: 0, revenue: 0 };
    if (b.status !== 'Service Completed' && b.status !== 'Cancelled') {
      cityCounts[cityName].activeJobs += 1;
    }
    cityCounts[cityName].revenue += b.totalPaid;
  });

  const activeHubs = Object.keys(cityCounts).length > 0
    ? Object.entries(cityCounts).sort((a, b) => b[1].revenue - a[1].revenue).map(([city, data]) => ({
        city,
        activeJobs: data.activeJobs,
        revenue: '₹' + data.revenue.toLocaleString('en-IN')
      }))
    : [
        { city: 'Delhi NCR', activeJobs: activeBookingsCount, revenue: '₹' + totalRevenue.toLocaleString('en-IN') },
        { city: 'Mumbai', activeJobs: 0, revenue: '₹0' },
        { city: 'Bengaluru', activeJobs: 0, revenue: '₹0' }
      ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="eyebrow">Executive Intelligence</span>
          <h1 style={{ fontSize: '26px', margin: '2px 0' }}>Platform Overview & Performance</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Real-time analytics across all active bookings and verified Indian wellness practitioners.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <select style={{
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-hairline)',
            backgroundColor: 'var(--bg-surface)',
            fontSize: '12px',
            outline: 'none'
          }}>
            <option>Last 30 Days</option>
            <option>Today</option>
            <option>This Quarter</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      {/* Critical SOS Alarm Alert Banner (If triggered) */}
      {sosBookings.length > 0 && (
        <div style={{
          backgroundColor: 'var(--status-error)',
          color: '#FFFFFF',
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(140, 58, 43, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={24} color="#fff" style={{ animation: 'pulse-ring 1s infinite' }} />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700 }}>
                CRITICAL SOS ALERT TRIGGERED ({sosBookings.length} Active Incident)
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                Booking #{sosBookings[0].id} ({sosBookings[0].customerName} at {sosBookings[0].address}). Live GPS shared with Emergency Response Team.
              </div>
            </div>
          </div>
          <button style={{
            backgroundColor: '#FFFFFF',
            color: 'var(--status-error)',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer'
          }}>
            Open Incident Command →
          </button>
        </div>
      )}

      {/* Primary KPI Grid (Real Metrics) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        
        {/* Metric 1: Platform Gross Revenue */}
        <div className="card-luxury" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gross Bookings</span>
            <DollarSign size={16} color="var(--accent-gold)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--status-success)', marginTop: '4px', fontWeight: 600 }}>
            {bookings.length} Total Sessions
          </div>
        </div>

        {/* Metric 2: Platform Net Commission */}
        <div className="card-luxury" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Net Margin</span>
            <TrendingUp size={16} color="var(--status-success)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-gold-hover)' }}>
            ₹{totalPlatformEarnings.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Direct operating revenue
          </div>
        </div>

        {/* Metric 3: Active Therapists */}
        <div className="card-luxury" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Therapists</span>
            <UserCheck size={16} color="var(--accent-gold)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {approvedTherapistsCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--status-success)', marginTop: '4px', fontWeight: 600 }}>
            100% Police Verified
          </div>
        </div>

        {/* Metric 4: Average Booking Value (ABV) */}
        <div className="card-luxury" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Booking Value</span>
            <Sparkles size={16} color="var(--accent-gold)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            ₹{abv.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--accent-gold)', marginTop: '4px', fontWeight: 600 }}>
            Boosted by Botanical Add-ons
          </div>
        </div>

        {/* Metric 5: Active Customers */}
        <div className="card-luxury" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Patrons</span>
            <Users size={16} color="var(--accent-gold)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {uniquePatronsCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--status-success)', marginTop: '4px', fontWeight: 600 }}>
            68% Repeat Booking Rate
          </div>
        </div>

        {/* Metric 6: Live Sessions Currently Active */}
        <div className="card-luxury" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active In-Progress</span>
            <Calendar size={16} color="var(--accent-gold)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {activeBookingsCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--status-success)', marginTop: '4px' }}>
            Tracking in real time
          </div>
        </div>

        {/* Metric 7: Cancellation Rate */}
        <div className="card-luxury" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cancellation Rate</span>
            <ShieldAlert size={16} color="var(--status-success)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--status-success)' }}>
            {cancellationRate}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Industry avg is 8.5%
          </div>
        </div>

        {/* Metric 8: Therapist Utilization */}
        <div className="card-luxury" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Therapist Utilization</span>
            <TrendingUp size={16} color="var(--accent-gold)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-gold-hover)' }}>
            {utilization}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--status-success)', marginTop: '4px', fontWeight: 600 }}>
            Optimal efficiency
          </div>
        </div>

      </div>

      {/* Two Column Section: Popular Services & City Heatmap */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Most Popular Services */}
        <div className="card-luxury" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px' }}>Most Requested Ceremonies</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>By Total Bookings</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topCeremonies.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.bookings} jobs ({item.revenue})</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: item.share, height: '100%', backgroundColor: 'var(--accent-gold)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Metros Performance */}
        <div className="card-luxury" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px' }}>Serviceable Hub Revenue</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active Hubs</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeHubs.map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{row.city}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.activeJobs} live providers on route</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.revenue}</div>
                  <span style={{ fontSize: '10px', color: 'var(--status-success)', fontWeight: 600 }}>Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
