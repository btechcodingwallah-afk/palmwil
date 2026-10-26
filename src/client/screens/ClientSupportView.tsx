import React, { useState } from 'react';
import { 
  HelpCircle, MessageSquare, Phone, Mail, ChevronDown, 
  ChevronUp, Send, CheckCircle2, ShieldCheck, Clock, Sparkles 
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { COMPANY_INFO } from '../../config/env';

export const ClientSupportView: React.FC = () => {
  const { setConnectModalOpen } = usePamwill();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: "How does the PamWill in-home sanctuary service work?",
      a: "Select your desired therapy (Massage, Physiotherapy, or Ayurvedic ritual), choose your preferred date, time, and duration, and confirm your address. A certified, police-verified therapist arrives with sanitized equipment, fresh disposable linens, and organic oils."
    },
    {
      q: "What is the Dual-OTP verification protocol?",
      a: "For mutual safety and punctuality, you receive a 4-digit Start OTP when the therapist arrives, which you show to begin the session timer. Upon completion, you verify an End OTP to release the session and finalize ratings."
    },
    {
      q: "What are the hygiene and safety standards followed?",
      a: "All practitioners undergo background verification, Aadhaar verification, and health screenings. Therapists carry sterile disposables, hospital-grade sanitizers, and seal-packed organic massage oils."
    },
    {
      q: "What is the cancellation and rescheduling policy?",
      a: "You can reschedule or cancel free of charge up to 2 hours before the scheduled sitting. Cancellations within 2 hours may incur a ₹300 practitioner transit fee."
    },
    {
      q: "How do PamCoins work?",
      a: "1 PamCoin equals ₹1 INR. You earn 5-10% cashback in PamCoins on every treatment and store order. PamCoins can be deducted directly at checkout."
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 4000);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--accent-gold-light)',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '8px'
        }}>
          <HelpCircle size={14} /> Concierge Care & Assistance
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '32px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: '0 0 10px 0'
        }}>
          How May We Assist You Today?
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Our dedicated luxury wellness butler team is available 24/7 across WhatsApp, phone, and direct ticket inquiries.
        </p>
      </div>

      {/* Quick Contact Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        {/* WhatsApp Direct */}
        <a
          href={`https://wa.me/${COMPANY_INFO.phone.replace(/[^0-9]/g, '')}?text=Hello%20PamWill%20Concierge`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px solid var(--border-hairline)',
            padding: '24px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            boxShadow: 'var(--shadow-card)',
            transition: 'border-color 150ms ease'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(76, 175, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <MessageSquare size={20} color="var(--status-success)" />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
            WhatsApp Concierge
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
            Instant response within 5 minutes for booking inquiries and therapist directions.
          </p>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--status-success)' }}>
            Chat Now &rarr;
          </span>
        </a>

        {/* Priority Phone Hotline */}
        <a
          href={`tel:${COMPANY_INFO.phone}`}
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px solid var(--border-hairline)',
            padding: '24px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            boxShadow: 'var(--shadow-card)',
            transition: 'border-color 150ms ease'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(169, 129, 47, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <Phone size={20} color="var(--accent-gold)" />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
            Direct Phone Helpline
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
            Speak directly with a sanctuary care supervisor for immediate support.
          </p>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-gold)' }}>
            {COMPANY_INFO.phone} &rarr;
          </span>
        </a>

        {/* Concierge Form */}
        <div
          onClick={() => setConnectModalOpen(true)}
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px solid var(--border-hairline)',
            padding: '24px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            boxShadow: 'var(--shadow-card)',
            transition: 'border-color 150ms ease'
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <Mail size={20} color="#3B82F6" />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
            Executive Concierge Desk
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
            Submit custom corporate retreat, VIP, or partnership requests.
          </p>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#3B82F6' }}>
            Open Inquiry Form &rarr;
          </span>
        </div>
      </div>

      {/* FAQs Accordion */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '24px',
        border: '1px solid var(--border-hairline)',
        padding: '28px',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '40px'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '22px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: '0 0 20px 0'
        }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <div
                key={i}
                style={{
                  border: '1px solid var(--border-hairline)',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-secondary)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="var(--accent-gold)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 20px 16px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border-hairline)', paddingTop: '12px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Ticket Submission Box */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '24px',
        border: '1px solid var(--border-hairline)',
        padding: '28px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
          Send a Direct Inquiry to Management
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
          Have a specific question, special health request, or feedback? Drop our operations leadership a note.
        </p>

        {submitted ? (
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(76, 175, 80, 0.15)',
            border: '1px solid rgba(76, 175, 80, 0.35)',
            borderRadius: '16px',
            textAlign: 'center',
            color: 'var(--status-success)',
            fontWeight: 700,
            fontSize: '14px'
          }}>
            <CheckCircle2 size={24} style={{ marginBottom: '8px' }} />
            <div>Your inquiry ticket has been assigned to a Senior Concierge Officer. We will respond within 2 hours.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="text"
              placeholder="Subject (e.g. Reschedule session, Specific medical condition)"
              value={ticketSubject}
              onChange={e => setTicketSubject(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-hairline)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />

            <textarea
              placeholder="Detailed message or instructions..."
              value={ticketMessage}
              onChange={e => setTicketMessage(e.target.value)}
              required
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-hairline)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />

            <button
              type="submit"
              className="btn-gold"
              style={{ alignSelf: 'flex-start', padding: '12px 28px', fontSize: '13px' }}
            >
              <Send size={14} style={{ marginRight: '6px' }} /> Submit Inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
