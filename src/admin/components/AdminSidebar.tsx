import React from 'react';
import { 
  BarChart3, Users, UserCheck, CalendarDays, MapPin, 
  Sparkles, Percent, Crown, ShieldAlert, FileText, Settings, LogOut, Wallet, GraduationCap, MessageSquare 
} from 'lucide-react';

export type AdminSection = 
  | 'overview' 
  | 'payouts'
  | 'inquiries'
  | 'training'
  | 'verification' 
  | 'therapists' 
  | 'bookings' 
  | 'services' 
  | 'cities' 
  | 'commissions' 
  | 'memberships';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  pendingVerificationsCount: number;
  sosAlertCount: number;
  pendingPayoutsCount?: number;
  pendingTrainingCount?: number;
  pendingInquiriesCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  pendingVerificationsCount,
  sosAlertCount,
  pendingPayoutsCount = 0,
  pendingTrainingCount = 0,
  pendingInquiriesCount = 0
}) => {
  const navItems = [
    { id: 'overview' as const, label: 'KPI Overview', icon: BarChart3 },
    { id: 'inquiries' as const, label: 'Inbound Inquiries', icon: MessageSquare, badge: pendingInquiriesCount },
    { id: 'payouts' as const, label: 'Doctor UPI Payouts', icon: Wallet, badge: pendingPayoutsCount },
    { id: 'training' as const, label: 'Training & Internships', icon: GraduationCap, badge: pendingTrainingCount },
    { id: 'verification' as const, label: 'Verification Queue', icon: UserCheck, badge: pendingVerificationsCount },
    { id: 'bookings' as const, label: 'Live Bookings', icon: CalendarDays, alert: sosAlertCount > 0 },
    { id: 'therapists' as const, label: 'Therapist Directory', icon: Users },
    { id: 'services' as const, label: 'Services Catalog (69)', icon: Sparkles },
    { id: 'cities' as const, label: 'Indian Cities & Districts', icon: MapPin },
    { id: 'commissions' as const, label: 'Platform Economics', icon: Percent },
    { id: 'memberships' as const, label: 'Membership Tiers', icon: Crown }
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-hairline)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100%',
      overflowY: 'auto'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid var(--border-hairline)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <img
          src="/assets/pamwill-icon.png"
          alt="PamWill"
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--accent-gold)' }}
        />
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Pamwill
          </div>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-gold-hover)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Operations Console
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span className="eyebrow" style={{ padding: '0 12px', marginBottom: '8px' }}>Executive Management</span>

        {navItems.map(item => {
          const isActive = currentSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                border: isActive ? '1px solid var(--accent-gold)' : '1px solid transparent',
                backgroundColor: isActive ? 'var(--accent-gold-light)' : 'transparent',
                color: isActive ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 150ms ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={17} color={isActive ? 'var(--accent-gold)' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'var(--accent-gold)',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)'
                }}>
                  {item.badge}
                </span>
              )}

              {item.alert && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: 'var(--status-error)',
                  color: '#FFFFFF',
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-pill)',
                  animation: 'pulse-ring 1s infinite'
                }}>
                  SOS
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Super Admin Status Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border-hairline)',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Logged in as:</div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Super Admin • All India</div>
        <div style={{ fontSize: '10px', color: 'var(--status-success)', fontWeight: 600, marginTop: '2px' }}>
          ● Live Dispatch Connected
        </div>
      </div>
    </aside>
  );
};
