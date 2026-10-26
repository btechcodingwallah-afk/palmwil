import React, { useState } from 'react';
import { 
  Coins, Sparkles, TrendingUp, Gift, ArrowRight, CheckCircle2, 
  Clock, Shield, ArrowDownLeft, ArrowUpRight 
} from 'lucide-react';
import { usePamwill } from '../../state/store';

export const ClientPamCoinView: React.FC = () => {
  const { pamCoins, addPamCoins, setClientSubRoute } = usePamwill();
  const [claimedBonusToday, setClaimedBonusToday] = useState(false);
  const [filter, setFilter] = useState<'all' | 'credited' | 'redeemed'>('all');

  const [transactions, setTransactions] = useState([
    {
      id: 'tx_1',
      title: 'Welcome Loyalty Onboarding Gift',
      amount: 150,
      type: 'credited' as const,
      date: '24 Oct 2026',
      note: 'Account creation welcome reward'
    },
    {
      id: 'tx_2',
      title: 'Completed Deep Tissue Ritual',
      amount: 100,
      type: 'credited' as const,
      date: '22 Oct 2026',
      note: '10% Cashback on Booking #PW-98102'
    },
    {
      id: 'tx_3',
      title: 'Therapist Review & Rating',
      amount: 50,
      type: 'credited' as const,
      date: '22 Oct 2026',
      note: 'Valued patron feedback reward'
    },
    {
      id: 'tx_4',
      title: 'Apothecary Checkout Deduction',
      amount: 50,
      type: 'redeemed' as const,
      date: '20 Oct 2026',
      note: 'Redeemed against Kumkumadi Oil'
    }
  ]);

  const handleClaimDailyBonus = () => {
    if (claimedBonusToday) return;
    addPamCoins(25, 'Daily Sanctuary Check-in Bonus');
    setTransactions(prev => [
      {
        id: `tx_${Date.now()}`,
        title: 'Daily Sanctuary Check-in Reward',
        amount: 25,
        type: 'credited',
        date: 'Today',
        note: 'Daily streak loyalty reward'
      },
      ...prev
    ]);
    setClaimedBonusToday(true);
  };

  const filteredTx = transactions.filter(t => filter === 'all' || t.type === filter);

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--accent-gold-light)',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '6px'
        }}>
          <Sparkles size={13} /> Sanctuary Treasury
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0
        }}>
          PamCoin Rewards & Loyalty Wallet
        </h1>
      </div>

      {/* Main Balance Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1C1814 0%, #2D251C 60%, #1A1612 100%)',
        borderRadius: '24px',
        padding: '36px',
        border: '1px solid rgba(169, 129, 47, 0.4)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        marginBottom: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        <div>
          <div style={{ fontSize: '13px', color: '#B5ABA0', fontWeight: 600, marginBottom: '6px' }}>
            Current Available Balance
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(229, 169, 60, 0.2)',
              border: '1px solid rgba(229, 169, 60, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Coins size={26} color="#E5A93C" />
            </div>
            <div>
              <span style={{ fontSize: '42px', fontWeight: 800, color: '#FAF8F5', lineHeight: 1 }}>
                {pamCoins}
              </span>
              <span style={{ fontSize: '14px', color: '#E5A93C', fontWeight: 700, marginLeft: '8px' }}>
                PamCoins (₹{pamCoins} Value)
              </span>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#9E9284', marginTop: '10px' }}>
            1 PamCoin = ₹1.00 INR. Automatically redeemable at checkout across therapies and store products.
          </div>
        </div>

        {/* Daily Bonus Claim Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleClaimDailyBonus}
            disabled={claimedBonusToday}
            style={{
              padding: '12px 24px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: claimedBonusToday ? '#2C2620' : 'var(--accent-gold)',
              color: claimedBonusToday ? '#8F8274' : '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: claimedBonusToday ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: claimedBonusToday ? 'none' : '0 8px 20px rgba(169, 129, 47, 0.35)'
            }}
          >
            <Gift size={16} />
            {claimedBonusToday ? 'Claimed Today (+25 Coins)' : 'Claim Daily +25 Coins'}
          </button>

          <button
            onClick={() => setClientSubRoute('store')}
            style={{
              padding: '12px 24px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'transparent',
              border: '1px solid rgba(169, 129, 47, 0.4)',
              color: '#FAF8F5',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            Redeem in Store <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Ways to Earn 3-Column Cards */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
          Ways to Accumulate PamCoins
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-hairline)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(169, 129, 47, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <TrendingUp size={18} color="var(--accent-gold)" />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              5-10% Session Cashback
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Earn automatic PamCoins credited straight to your treasury after every completed sitting.
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-hairline)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(76, 175, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <CheckCircle2 size={18} color="var(--status-success)" />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              +50 Coins Per Review
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Share verified practitioner feedback after your treatment to earn 50 instant bonus coins.
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-hairline)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(147, 51, 234, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Gift size={18} color="#9333EA" />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Daily Attendance Streak
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Open the web portal or app daily to collect your loyalty check-in gift of 25 coins every 24 hours.
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '24px',
        border: '1px solid var(--border-hairline)',
        padding: '24px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Treasury Ledger
          </h3>

          <div style={{ display: 'flex', gap: '6px' }}>
            {(['all', 'credited', 'redeemed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: filter === f ? '1px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                  backgroundColor: filter === f ? 'var(--accent-gold)' : 'transparent',
                  color: filter === f ? '#fff' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredTx.map(tx => (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-hairline)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: tx.type === 'credited' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {tx.type === 'credited' ? (
                    <ArrowDownLeft size={18} color="var(--status-success)" />
                  ) : (
                    <ArrowUpRight size={18} color="#EF4444" />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {tx.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {tx.note} • {tx.date}
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: '16px',
                fontWeight: 800,
                color: tx.type === 'credited' ? 'var(--status-success)' : '#EF4444'
              }}>
                {tx.type === 'credited' ? `+${tx.amount}` : `-${tx.amount}`} Coins
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
