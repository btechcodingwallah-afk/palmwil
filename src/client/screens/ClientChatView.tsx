import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, ShieldCheck, Sparkles, MessageSquare, ChevronDown, CheckCircle2 } from 'lucide-react';
import { usePamwill } from '../../state/store';

export const ClientChatView: React.FC = () => {
  const { bookings, user, getBookingMessages, sendChatMessage, setClientSubRoute } = usePamwill();
  
  // Available bookings for customer
  const clientBookings = bookings.filter(b => b.status !== 'Cancelled');
  const [selectedBookingId, setSelectedBookingId] = useState<string>(() => {
    const active = clientBookings.find(b => b.status !== 'Service Completed') || clientBookings[0];
    return active?.id || '';
  });

  const activeBooking = clientBookings.find(b => b.id === selectedBookingId) || clientBookings[0];

  useEffect(() => {
    if (!selectedBookingId && clientBookings.length > 0) {
      setSelectedBookingId(clientBookings[0].id);
    }
  }, [clientBookings, selectedBookingId]);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = activeBooking ? getBookingMessages(activeBooking.id) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const therapistDisplayName = activeBooking?.therapistName || 'Assigned Practitioner';

  const quickChips = [
    "Please call when at the gate",
    "Take elevator to our floor",
    "Extra focus on neck & shoulders",
    "Please use medium pressure",
    "Water and clean space are ready"
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeBooking) return;

    sendChatMessage(activeBooking.id, text, 'customer', user.name || 'Patient');
    if (!textToSend) setInputText('');
  };

  if (!activeBooking) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '32px 20px',
        textAlign: 'center',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '20px',
        border: '1px solid var(--border-hairline)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(198, 165, 103, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <MessageSquare size={32} color="var(--accent-gold)" />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
          No Active Practitioner Conversations
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.5, margin: '0 0 20px 0' }}>
          Your dedicated, encrypted practitioner coordination thread opens automatically as soon as a treatment session is booked.
        </p>
        <button
          onClick={() => setClientSubRoute('home')}
          style={{
            backgroundColor: 'var(--accent-gold)',
            color: '#100E0C',
            border: 'none',
            padding: '11px 24px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Explore Therapies & Book
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg-surface)',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '1px solid var(--border-hairline)',
      boxShadow: 'var(--shadow-elevated)'
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-hairline)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={activeBooking.therapistPhoto || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"}
            alt={therapistDisplayName}
            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--accent-gold)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {therapistDisplayName}
              </h3>
              <ShieldCheck size={14} color="var(--status-success)" />
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>
              {activeBooking.service?.name} • <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>#{activeBooking.id}</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Thread switcher if multiple bookings exist */}
          {clientBookings.length > 1 && (
            <select
              value={selectedBookingId}
              onChange={e => setSelectedBookingId(e.target.value)}
              style={{
                fontSize: '11px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-hairline)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {clientBookings.map(b => (
                <option key={b.id} value={b.id}>
                  #{b.id} ({b.status})
                </option>
              ))}
            </select>
          )}

          <a
            href={`tel:${activeBooking.therapistPhone || '+916296489227'}`}
            title="Call Practitioner"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              transition: 'all 150ms ease'
            }}
          >
            <Phone size={15} />
          </a>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <div style={{ textAlign: 'center', margin: '4px 0' }}>
          <span style={{
            fontSize: '10.5px',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-muted)',
            padding: '3px 12px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-hairline)'
          }}>
            Encrypted session coordination • Thread automatically archives 12h post-treatment
          </span>
        </div>

        {messages.map(msg => {
          const isMe = msg.sender === 'customer';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-hairline)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '11.5px',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                lineHeight: 1.45,
                margin: '6px 0'
              }}>
                <Sparkles size={13} color="var(--accent-gold)" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                {msg.text}
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start'
              }}
            >
              {!isMe && (
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginBottom: '3px', paddingLeft: '4px' }}>
                  {msg.senderName}
                </span>
              )}
              <div style={{
                maxWidth: '78%',
                padding: '11px 15px',
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                backgroundColor: isMe ? 'var(--text-primary)' : 'var(--bg-surface)',
                color: isMe ? '#FAF8F5' : 'var(--text-primary)',
                border: isMe ? 'none' : '1px solid var(--border-hairline)',
                fontSize: '13px',
                lineHeight: 1.45,
                boxShadow: isMe ? '0 2px 8px rgba(0,0,0,0.2)' : 'var(--shadow-sm)',
                wordBreak: 'break-word'
              }}>
                {msg.text}
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px', padding: '0 4px' }}>
                {msg.timestamp}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '8px 16px',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-hairline)'
      }}>
        {quickChips.map(chip => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            style={{
              whiteSpace: 'nowrap',
              fontSize: '11.5px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 120ms ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent-gold)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-hairline)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-hairline)',
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder={`Message ${therapistDisplayName}...`}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid var(--border-hairline)',
            backgroundColor: 'var(--bg-primary)',
            fontSize: '13px',
            outline: 'none',
            color: 'var(--text-primary)'
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: inputText.trim() ? 'var(--accent-gold)' : 'var(--bg-secondary)',
            border: 'none',
            color: inputText.trim() ? '#100E0C' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'default',
            transition: 'all 150ms ease',
            boxShadow: inputText.trim() ? '0 2px 10px rgba(198, 165, 103, 0.4)' : 'none'
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
