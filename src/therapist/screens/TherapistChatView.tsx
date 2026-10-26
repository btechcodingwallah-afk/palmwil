import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, MapPin, Sparkles, MessageSquare, CheckCircle2, User, Clock, ChevronRight } from 'lucide-react';
import { usePamwill } from '../../state/store';

export const TherapistChatView: React.FC = () => {
  const { 
    bookings, 
    currentTherapist, 
    currentTherapistId, 
    getBookingMessages, 
    sendChatMessage,
    setTherapistSubRoute 
  } = usePamwill();

  // Find bookings belonging to this therapist, or active ones if testing
  const therapistBookings = bookings.filter(b => 
    (b.therapistId === currentTherapistId || b.therapistName === currentTherapist?.fullName) &&
    b.status !== 'Cancelled'
  );
  const effectiveBookings = therapistBookings.length > 0 
    ? therapistBookings 
    : bookings.filter(b => b.status !== 'Cancelled');

  const [selectedBookingId, setSelectedBookingId] = useState<string>(() => {
    const active = effectiveBookings.find(b => b.status !== 'Service Completed') || effectiveBookings[0];
    return active?.id || '';
  });

  const activeBooking = effectiveBookings.find(b => b.id === selectedBookingId) || effectiveBookings[0];

  useEffect(() => {
    if (!selectedBookingId && effectiveBookings.length > 0) {
      setSelectedBookingId(effectiveBookings[0].id);
    }
  }, [effectiveBookings, selectedBookingId]);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = activeBooking ? getBookingMessages(activeBooking.id) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const quickChips = [
    "I am on my way to your location.",
    "Arriving in approximately 10-15 minutes.",
    "I have reached your gate / entrance.",
    "Please share the flat number or tower.",
    "Please keep a clean, quiet space ready."
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeBooking) return;

    sendChatMessage(
      activeBooking.id, 
      text, 
      'therapist', 
      currentTherapist?.fullName || 'Practitioner'
    );
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
          backgroundColor: 'rgba(62, 123, 82, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <MessageSquare size={32} color="#5BB377" />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
          No Active Patient Conversations
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.5, margin: '0 0 20px 0' }}>
          Patient coordination threads open automatically when an incoming booking is dispatched and accepted by you.
        </p>
        <button
          onClick={() => setTherapistSubRoute('bookings')}
          style={{
            backgroundColor: '#3E7B52',
            color: '#FFFFFF',
            border: 'none',
            padding: '11px 24px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(62, 123, 82, 0.3)'
          }}
        >
          View Dispatched Jobs
        </button>
      </div>
    );
  }

  const patientName = activeBooking.customerName || 'Patient';

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
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'rgba(62, 123, 82, 0.15)',
            border: '1.5px solid #5BB377',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#5BB377',
            flexShrink: 0
          }}>
            <User size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {patientName}
              </h3>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: activeBooking.status === 'Service Completed' ? 'var(--bg-secondary)' : 'rgba(62, 123, 82, 0.15)',
                color: activeBooking.status === 'Service Completed' ? 'var(--text-muted)' : '#5BB377'
              }}>
                {activeBooking.status}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              <span>{activeBooking.service?.name}</span>
              <span>•</span>
              <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>#{activeBooking.id}</span>
              {activeBooking.address && (
                <>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <MapPin size={11} color="var(--accent-gold)" /> {activeBooking.address}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {effectiveBookings.length > 1 && (
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
              {effectiveBookings.map(b => (
                <option key={b.id} value={b.id}>
                  {b.customerName || 'Patient'} (#{b.id})
                </option>
              ))}
            </select>
          )}

          {activeBooking.customerPhone && (
            <a
              href={`tel:${activeBooking.customerPhone}`}
              title="Call Patient"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(62, 123, 82, 0.12)',
                border: '1px solid rgba(62, 123, 82, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5BB377',
                textDecoration: 'none',
                transition: 'all 150ms ease'
              }}
            >
              <Phone size={15} />
            </a>
          )}
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
            Coordinate premises access, directions, or arrival updates with {patientName}
          </span>
        </div>

        {messages.map(msg => {
          const isMe = msg.sender === 'therapist';
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
                  {msg.senderName} (Patient)
                </span>
              )}
              <div style={{
                maxWidth: '78%',
                padding: '11px 15px',
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                backgroundColor: isMe ? '#253E2B' : 'var(--bg-surface)',
                color: isMe ? '#FFFFFF' : 'var(--text-primary)',
                border: isMe ? '1px solid #3E7B52' : '1px solid var(--border-hairline)',
                fontSize: '13px',
                lineHeight: 1.45,
                boxShadow: isMe ? '0 2px 8px rgba(37, 62, 43, 0.3)' : 'var(--shadow-sm)',
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
              e.currentTarget.style.borderColor = '#5BB377';
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
          placeholder={`Message ${patientName}...`}
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
            backgroundColor: inputText.trim() ? '#3E7B52' : 'var(--bg-secondary)',
            border: 'none',
            color: inputText.trim() ? '#FFFFFF' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'default',
            transition: 'all 150ms ease',
            boxShadow: inputText.trim() ? '0 2px 10px rgba(62, 123, 82, 0.4)' : 'none'
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
