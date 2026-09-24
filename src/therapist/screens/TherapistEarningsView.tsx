import React, { useState } from 'react';
import { Download, ArrowUpRight, DollarSign, Calendar, ShieldCheck, Check, Clock, CheckCircle2 } from 'lucide-react';
import { usePamwill } from '../../state/store';

export const TherapistEarningsView: React.FC = () => {
  const { currentTherapist, bookings, payoutRequests, platformCommissionRate } = usePamwill();
  const [settlementCycle, setSettlementCycle] = useState<'Daily' | 'Weekly'>('Daily');

  // Real completed bookings for this therapist
  const completedSessions = bookings.filter(b => 
    b.therapistId === currentTherapist.id && 
    b.status === 'Service Completed'
  );

  const cumulativeEarnings = completedSessions.reduce((sum, b) => sum + (b.therapistPayout || 0), 0);

  // Real Payouts for this therapist
  const myPayouts = payoutRequests.filter(p => p.therapistId === currentTherapist.id);

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <span className="eyebrow">Financial Transparency</span>
        <h2 style={{ fontSize: '24px', margin: 0 }}>Earnings & Payouts</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          {(100 - platformCommissionRate * 100).toFixed(0)}% practitioner revenue share settled directly to your UPI account.
        </p>
      </div>

      {/* Main Balance Banner */}
      <div style={{
        padding: '20px',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--text-primary)',
        color: '#FFFFFF'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#D9D1C5', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Cumulative Payout (All-Time)
            </span>
            <div style={{ fontSize: '30px', fontWeight: 700, color: 'var(--accent-gold-light)', margin: '4px 0' }}>
              ₹{cumulativeEarnings.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '11px', color: '#B0A89C' }}>
              Total Completed Sanctuary Sessions: {completedSessions.length}
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '11px',
            color: 'var(--accent-gold-light)'
          }}>
            Available in Wallet: ₹{currentTherapist.walletBalance.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Settlement Cycle Preference Toggle */}
      <div className="card-luxury" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600 }}>Settlement Schedule</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Direct settlements to: <strong>{currentTherapist.upiId || 'UPI VPA'}</strong>
          </div>
        </div>

        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-pill)',
          padding: '3px'
        }}>
          {(['Daily', 'Weekly'] as const).map(cycle => (
            <button
              key={cycle}
              onClick={() => setSettlementCycle(cycle)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                backgroundColor: settlementCycle === cycle ? 'var(--bg-surface)' : 'transparent',
                color: settlementCycle === cycle ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {cycle}
            </button>
          ))}
        </div>
      </div>

      {/* Payout Disbursal History (UPI Requests) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span className="eyebrow">UPI Payout Requests & Transfers</span>
        </div>

        {myPayouts.length === 0 ? (
          <div className="card-luxury" style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            No payout transfers requested yet. When you request a payout from your dashboard, real-time UPI tracking appears here.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {myPayouts.map(p => (
              <div key={p.id} className="card-luxury" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-gold)' }}>#{p.id}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      • {new Date(p.requestedAt).toLocaleDateString()} {new Date(p.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '2px' }}>
                    UPI VPA: <strong>{p.upiId}</strong>
                  </div>
                  {p.transactionRef && (
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      Ref/UTR: {p.transactionRef}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: p.status === 'Paid' ? 'var(--status-success)' : 'var(--accent-gold-hover)' }}>
                    ₹{p.amount.toLocaleString('en-IN')}
                  </div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: p.status === 'Paid' ? 'var(--status-success-bg)' : '#fef3c7',
                    color: p.status === 'Paid' ? 'var(--status-success)' : '#92400e',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {p.status === 'Paid' ? (
                      <>
                        <CheckCircle2 size={11} /> Settled to UPI
                      </>
                    ) : (
                      <>
                        <Clock size={11} /> Pending Admin
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transparent Commission Breakdown Rule */}
      <div style={{
        padding: '16px',
        backgroundColor: 'var(--accent-gold-light)',
        border: '1px solid rgba(169, 129, 47, 0.3)',
        borderRadius: 'var(--radius-md)',
        fontSize: '12px'
      }}>
        <div style={{ fontWeight: 700, color: 'var(--accent-gold-hover)', marginBottom: '4px' }}>
          PamWill Fair Compensation Guarantee
        </div>
        <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
          For every ₹1,000 paid by a client: You receive <strong>₹{(1000 * (1 - platformCommissionRate)).toFixed(0)}</strong> ({(100 - platformCommissionRate * 100).toFixed(0)}%), and the platform retains <strong>₹{(1000 * platformCommissionRate).toFixed(0)}</strong> ({(platformCommissionRate * 100).toFixed(0)}%) for customer acquisition, linens, organic oils, and live logistics dispatch.
        </p>
      </div>

      {/* Real Itemized Session Breakdown Table */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span className="eyebrow">Real Completed Session Ledgers</span>
          <button style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-gold)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Download size={12} /> Tax Statement (PDF)
          </button>
        </div>

        {completedSessions.length === 0 ? (
          <div className="card-luxury" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '13px', margin: 0 }}>No completed sessions in ledger yet.</p>
            <p style={{ fontSize: '11px', margin: '4px 0 0 0' }}>Once you complete appointments, itemized gross and net payouts will record here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {completedSessions.map(row => (
              <div key={row.id} className="card-luxury" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>{row.service.name} ({row.durationMin}m)</h4>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      #{row.id} • {row.scheduledDate} {row.scheduledTime} • Client: {row.customerName}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--status-success)' }}>
                      +₹{row.therapistPayout}
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--status-success)', fontWeight: 600 }}>Credited to Wallet</span>
                  </div>
                </div>

                {/* Commission Sub-Row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '6px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '11px',
                  color: 'var(--text-muted)'
                }}>
                  <span>Gross Client Paid: ₹{row.totalPaid}</span>
                  <span>Platform Fee ({platformCommissionRate * 100}%): -₹{row.platformCommission}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
