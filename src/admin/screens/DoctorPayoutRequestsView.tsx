import React, { useState, useEffect } from 'react';
import { 
  QrCode, CheckCircle2, Clock, XCircle, Search, 
  ExternalLink, Copy, Check, ArrowUpRight, DollarSign, 
  Wallet, User, Phone, ShieldCheck, RefreshCw 
} from 'lucide-react';
import QRCode from 'qrcode';
import { usePamwill } from '../../state/store';
import { PayoutRequest } from '../../types';

export const DoctorPayoutRequestsView: React.FC = () => {
  const { payoutRequests, markPayoutPaid, rejectPayout, therapists, refreshData } = usePamwill();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
    const timer = setInterval(() => {
      refreshData();
    }, 3000);
    return () => clearInterval(timer);
  }, [refreshData]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const pendingCount = payoutRequests.filter(p => p.status === 'Pending').length;
  const paidCount = payoutRequests.filter(p => p.status === 'Paid').length;

  const filteredPayouts = payoutRequests.filter(p => {
    if (activeTab === 'pending' && p.status !== 'Pending') return false;
    if (activeTab === 'paid' && p.status !== 'Paid') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.therapistName.toLowerCase().includes(q) ||
        p.upiId.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Generate dynamic QR code whenever selectedPayout changes
  useEffect(() => {
    if (selectedPayout) {
      const noteMessage = `Pamwill paying ₹${selectedPayout.amount} to ${selectedPayout.therapistName}`;
      const upiUrl = `upi://pay?pa=${selectedPayout.upiId}&pn=${encodeURIComponent(selectedPayout.therapistName)}&am=${selectedPayout.amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(noteMessage)}`;

      QRCode.toDataURL(upiUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: '#1c1917',
          light: '#ffffff'
        }
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error('Failed to generate UPI QR code:', err));

      setTransactionRef(`UTR${Date.now().toString().slice(-8)}`);
    } else {
      setQrDataUrl('');
      setTransactionRef('');
    }
  }, [selectedPayout]);

  const handleCopyUpi = (upiId: string) => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePaymentDone = async () => {
    if (!selectedPayout) return;
    setIsProcessing(true);
    try {
      await markPayoutPaid(selectedPayout.id, transactionRef.trim() || undefined);
      const paidDoctorName = selectedPayout.therapistName;
      const paidAmount = selectedPayout.amount;
      setSelectedPayout(null);
      setSuccessToast(`✓ Successfully settled ₹${paidAmount.toLocaleString('en-IN')} to Dr. ${paidDoctorName}. Doctor dashboard updated in real-time.`);
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (e) {
      console.error('Failed to mark payment paid:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (payoutId: string) => {
    if (window.confirm('Are you sure you want to reject this payout request? The amount will be refunded back to the doctor’s wallet balance.')) {
      await rejectPayout(payoutId, 'Rejected by Admin');
    }
  };

  const totalPendingAmount = payoutRequests
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalSettledAmount = payoutRequests
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="eyebrow">Financial Disbursements</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
            <h1 style={{ fontSize: '26px', margin: 0 }}>Doctor & Therapist Payout Requests</h1>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-hairline)',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <RefreshCw size={13} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
              {isRefreshing ? 'Syncing...' : 'Sync Live'}
            </button>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Approve instant UPI transfers, scan dynamic QR codes, and disburse practitioner revenue share.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-hairline)',
            textAlign: 'right'
          }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Settlement</span>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#d97706' }}>
              ₹{totalPendingAmount.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-hairline)',
            textAlign: 'right'
          }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Settled</span>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-success)' }}>
              ₹{totalSettledAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {successToast && (
        <div style={{
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--status-success-bg)',
          color: 'var(--status-success)',
          border: '1px solid var(--status-success)',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-pill)',
          padding: '4px',
          border: '1px solid var(--border-hairline)'
        }}>
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: activeTab === 'pending' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'pending' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Pending Requests ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: activeTab === 'paid' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'paid' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Settled to UPI ({paidCount})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: activeTab === 'all' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            All Requests ({payoutRequests.length})
          </button>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name or UPI..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-surface)',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Payouts Table / List */}
      <div className="card-luxury" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredPayouts.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Wallet size={40} style={{ opacity: 0.3, margin: '0 auto 10px auto' }} />
            <h3 style={{ fontSize: '16px', margin: 0 }}>No Payout Requests Found</h3>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              {activeTab === 'pending' ? 'All practitioner payout requests have been settled!' : 'No payout transfers matching your criteria.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-hairline)', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '14px 18px' }}>Request ID</th>
                  <th style={{ padding: '14px 18px' }}>Doctor / Therapist</th>
                  <th style={{ padding: '14px 18px' }}>UPI VPA Address</th>
                  <th style={{ padding: '14px 18px' }}>Requested Amount</th>
                  <th style={{ padding: '14px 18px' }}>Date & Time</th>
                  <th style={{ padding: '14px 18px' }}>Status</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayouts.map(p => {
                  const targetTherapist = therapists.find(t => t.id === p.therapistId);

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                      <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--accent-gold-hover)' }}>
                        #{p.id}
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={p.therapistPhoto || targetTherapist?.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80'}
                            alt={p.therapistName}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.therapistName}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.therapistPhone || targetTherapist?.phone || '+91 Linked'}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)', backgroundColor: 'var(--bg-secondary)', padding: '3px 8px', borderRadius: '4px' }}>
                            {p.upiId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyUpi(p.upiId)}
                            title="Copy UPI VPA"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-gold)' }}
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          ₹{p.amount.toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <div>{new Date(p.requestedAt).toLocaleDateString()}</div>
                        <div>{new Date(p.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        {p.status === 'Paid' ? (
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-pill)',
                            backgroundColor: 'var(--status-success-bg)',
                            color: 'var(--status-success)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <CheckCircle2 size={12} /> Settled ({p.transactionRef || 'UPI'})
                          </span>
                        ) : p.status === 'Pending' ? (
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-pill)',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Clock size={12} /> Pending Approval
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-pill)',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#dc2626'
                          }}>
                            Declined
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        {p.status === 'Pending' ? (
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => setSelectedPayout(p)}
                              className="btn-gold"
                              style={{ padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <QrCode size={14} /> Pay via UPI QR
                            </button>
                            <button
                              onClick={() => handleReject(p.id)}
                              className="btn-secondary"
                              style={{ padding: '8px 10px', fontSize: '12px', color: '#dc2626' }}
                              title="Reject & Refund"
                            >
                              <XCircle size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedPayout(p)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            View Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dynamic UPI Payment & QR Code Modal */}
      {selectedPayout && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(18, 16, 14, 0.8)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => !isProcessing && setSelectedPayout(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
              border: '1px solid var(--border-hairline)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ textAlign: 'left' }}>
                <span className="eyebrow" style={{ fontSize: '10px' }}>Instant Bank Disbursal</span>
                <h3 style={{ fontSize: '20px', margin: '2px 0' }}>UPI Payout QR Code</h3>
              </div>
              <button
                onClick={() => setSelectedPayout(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {/* QR Code Container */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'inline-block',
              border: '2px solid var(--accent-gold)',
              boxShadow: '0 4px 20px rgba(169, 129, 47, 0.2)',
              marginBottom: '16px'
            }}>
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Dynamic UPI QR Code"
                  style={{ width: '220px', height: '220px', display: 'block' }}
                />
              ) : (
                <div style={{ width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RefreshCw className="animate-spin" size={24} color="var(--accent-gold)" />
                </div>
              )}
            </div>

            {/* Payment Description & NPCI Note */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              textAlign: 'left',
              fontSize: '12px',
              marginBottom: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payee Doctor:</span>
                <strong>{selectedPayout.therapistName}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>UPI VPA:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <code style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedPayout.upiId}</code>
                  <button
                    onClick={() => handleCopyUpi(selectedPayout.upiId)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-gold)' }}
                  >
                    {copiedUpi ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Requested Amount:</span>
                <strong style={{ fontSize: '15px', color: 'var(--accent-gold-hover)' }}>
                  ₹{selectedPayout.amount.toLocaleString('en-IN')}
                </strong>
              </div>

              <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <strong>UPI Payment Note:</strong> "Pamwill paying ₹{selectedPayout.amount} to {selectedPayout.therapistName}"
              </div>
            </div>

            {/* Direct App Launch Button for Mobile / Handheld Admin */}
            {(() => {
              const noteMessage = `Pamwill paying ₹${selectedPayout.amount} to ${selectedPayout.therapistName}`;
              const upiDeepLink = `upi://pay?pa=${selectedPayout.upiId}&pn=${encodeURIComponent(selectedPayout.therapistName)}&am=${selectedPayout.amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(noteMessage)}`;

              return (
                <a
                  href={upiDeepLink}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--accent-gold-hover)',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    marginBottom: '16px',
                    border: '1px solid var(--border-hairline)'
                  }}
                >
                  <ExternalLink size={13} /> Open Directly in UPI App (GPay / PhonePe / Paytm) ↗
                </a>
              );
            })()}

            {/* Transaction Reference Input & Confirm Payment Done */}
            {selectedPayout.status === 'Pending' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    BANK REFERENCE NUMBER / UTR
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={e => setTransactionRef(e.target.value)}
                    placeholder="e.g. UTR-49102849102"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: 'var(--bg-secondary)',
                      fontSize: '13px',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedPayout(null)}
                    className="btn-secondary"
                    style={{ flex: 1, minHeight: '48px' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePaymentDone}
                    disabled={isProcessing}
                    className="btn-gold"
                    style={{
                      flex: 1.5,
                      minHeight: '48px',
                      fontSize: '14px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <CheckCircle2 size={16} /> {isProcessing ? 'Updating...' : 'Payment Done'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                padding: '12px',
                backgroundColor: 'var(--status-success-bg)',
                color: 'var(--status-success)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600
              }}>
                ✓ Payment already settled on {new Date(selectedPayout.paidAt || selectedPayout.requestedAt).toLocaleDateString()}
                {selectedPayout.transactionRef && (
                  <div style={{ fontSize: '11px', marginTop: '2px', opacity: 0.9 }}>
                    Bank Reference: {selectedPayout.transactionRef}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
