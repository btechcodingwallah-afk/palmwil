import React, { useState, useEffect } from 'react';
import { Percent, Crown, Check, Save, DollarSign, Sparkles, Wallet } from 'lucide-react';
import { usePamwill } from '../../state/store';
import { MEMBERSHIP_PLANS } from '../../data/mockData';
import { DoctorPayoutRequestsView } from './DoctorPayoutRequestsView';

export const CommissionsMembershipsView: React.FC = () => {
  const { platformCommissionRate, setPlatformCommissionRate, payoutRequests } = usePamwill();
  const [ratePercent, setRatePercent] = useState(platformCommissionRate * 100);
  const [plans, setPlans] = useState(MEMBERSHIP_PLANS);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'commissions' | 'payouts'>('commissions');

  const pendingPayoutCount = payoutRequests.filter(p => p.status === 'Pending').length;

  useEffect(() => {
    setRatePercent(platformCommissionRate * 100);
  }, [platformCommissionRate]);

  const handleSaveCommission = () => {
    setPlatformCommissionRate(ratePercent / 100);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Sub-tab Navigation Switcher */}
      <div style={{
        display: 'inline-flex',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-pill)',
        padding: '4px',
        border: '1px solid var(--border-hairline)',
        width: 'fit-content'
      }}>
        <button
          onClick={() => setActiveSubTab('commissions')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: activeSubTab === 'commissions' ? 'var(--accent-gold)' : 'transparent',
            color: activeSubTab === 'commissions' ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Percent size={14} /> Platform Economics & Plans
        </button>
        <button
          onClick={() => setActiveSubTab('payouts')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            backgroundColor: activeSubTab === 'payouts' ? 'var(--accent-gold)' : 'transparent',
            color: activeSubTab === 'payouts' ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Wallet size={14} /> Doctor Payout Requests {pendingPayoutCount > 0 && `(${pendingPayoutCount})`}
        </button>
      </div>

      {activeSubTab === 'payouts' ? (
        <DoctorPayoutRequestsView />
      ) : (
        <>
          {/* Header */}
          <div>
            <span className="eyebrow">Monetization & Economics</span>
            <h1 style={{ fontSize: '26px', margin: '2px 0' }}>Commissions & Membership Architecture</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Configure global platform take-rates, per-job splits, and monthly subscription tiers.
            </p>
          </div>

          {savedSuccess && (
            <div style={{ padding: '12px 18px', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success)', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '13px' }}>
              ✓ Monetization policies updated across platform dispatch in real-time!
            </div>
          )}

      {/* Global Commission Model Card */}
      <div className="card-luxury" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Percent size={20} color="var(--accent-gold)" />
              <h3 style={{ fontSize: '18px', margin: 0 }}>Global Platform Commission Take-Rate</h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Default standard: Customer pays ₹100 → Platform takes {ratePercent}% (₹{ratePercent}) → Therapist receives {100 - ratePercent}% (₹{100 - ratePercent}).
            </p>
          </div>

          <button onClick={handleSaveCommission} className="btn-gold" style={{ padding: '9px 18px', fontSize: '13px' }}>
            <Save size={14} /> Update Rate
          </button>
        </div>

        {/* Interactive Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <input
            type="range"
            min="10"
            max="35"
            step="1"
            value={ratePercent}
            onChange={e => setRatePercent(Number(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--accent-gold)' }}
          />
          <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-gold-hover)', minWidth: '60px', textAlign: 'right' }}>
            {ratePercent}%
          </span>
        </div>

        {/* Live Calculation Preview on a ₹2,000 Session */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          padding: '14px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '12px'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Example Session Value</span>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>₹2,000</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>PamWill Platform Share ({ratePercent}%)</span>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-gold-hover)' }}>₹{(2000 * (ratePercent / 100)).toFixed(0)}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Practitioner Payout ({100 - ratePercent}%)</span>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-success)' }}>₹{(2000 * ((100 - ratePercent) / 100)).toFixed(0)}</div>
          </div>
        </div>
      </div>

      {/* Membership Tiers Management */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <span className="eyebrow">Subscription Recurring Revenue</span>
            <h3 style={{ fontSize: '18px', margin: 0 }}>Sovereign Membership Plans</h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {plans.map(plan => (
            <div key={plan.id} className="card-luxury" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="eyebrow">{plan.badge}</span>
                <h4 style={{ fontSize: '18px', margin: '4px 0 10px 0' }}>{plan.name}</h4>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
                  ₹{plan.monthlyPrice} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ month</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                      <Check size={14} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn-secondary" style={{ width: '100%', marginTop: '20px', padding: '9px', fontSize: '12px' }}>
                Edit Tier Pricing & Quotas
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )}

</div>
  );
};
