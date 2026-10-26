import React, { useState } from 'react';
import { 
  Tag, Copy, Check, Sparkles, Clock, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { Voucher } from '../../types';

export const ClientVouchersView: React.FC = () => {
  const { vouchers, applyVoucher, setClientSubRoute } = usePamwill();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyDirectly = (code: string) => {
    applyVoucher(code);
    setAppliedNotice(code);
    setTimeout(() => {
      setAppliedNotice(null);
      setClientSubRoute('booking');
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      {/* Header */}
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
          <Tag size={13} /> Exclusive Promotions
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0
        }}>
          PamWill Vouchers & Privilege Coupons
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '6px' }}>
          Copy discount codes or apply them directly to your treatment sessions and apothecary orders.
        </p>
      </div>

      {/* Applied Notice */}
      {appliedNotice && (
        <div style={{
          backgroundColor: 'rgba(76, 175, 80, 0.18)',
          border: '1px solid rgba(76, 175, 80, 0.4)',
          borderRadius: '16px',
          padding: '14px',
          textAlign: 'center',
          marginBottom: '24px',
          color: 'var(--status-success)',
          fontWeight: 700,
          fontSize: '13px'
        }}>
          ✨ Code <strong>{appliedNotice}</strong> applied! Redirecting to booking flow...
        </div>
      )}

      {/* Grid of Vouchers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {vouchers.map(voucher => {
          const isCopied = copiedCode === voucher.code;

          return (
            <div
              key={voucher.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '20px',
                border: '1px solid var(--border-hairline)',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-card)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Accent Bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: voucher.accentColor || 'var(--accent-gold)'
              }} />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    backgroundColor: 'rgba(169, 129, 47, 0.15)',
                    color: voucher.accentColor || 'var(--accent-gold)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-pill)',
                    letterSpacing: '0.04em'
                  }}>
                    {voucher.tag || 'Special Offer'}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <Clock size={12} /> Valid until {voucher.expiryDate}
                  </div>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                  {voucher.title}
                </h3>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 16px 0' }}>
                  {voucher.description}
                </p>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Min spend: ₹{voucher.minSpend} • Applicable on {voucher.category}
                </div>
              </div>

              {/* Code Box & Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px dashed var(--border-hairline)',
                borderRadius: '12px',
                padding: '8px 12px'
              }}>
                <div style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.08em' }}>
                  {voucher.code}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleCopy(voucher.code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'none',
                      border: '1px solid var(--border-hairline)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isCopied ? 'var(--status-success)' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {isCopied ? <Check size={12} /> : <Copy size={12} />}
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>

                  <button
                    onClick={() => handleApplyDirectly(voucher.code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'var(--accent-gold)',
                      border: 'none',
                      borderRadius: 'var(--radius-pill)',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    Apply <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
