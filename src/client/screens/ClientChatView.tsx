import React, { useState } from 'react';
import { Send, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { usePamwill } from '../../state/store';
import { ChatMessage } from '../../types';

export const ClientChatView: React.FC = () => {
  const { bookings, user } = usePamwill();
  const activeBooking = bookings.find(b => b.status !== 'Service Completed' && b.status !== 'Cancelled') || bookings[0];

  const therapistDisplayName = activeBooking?.therapistName || 'Your Practitioner';

  const [messages, setMessages] = useState<ChatMessage[]>(activeBooking ? [
    {
      id: 'm1',
      bookingId: activeBooking.id,
      sender: 'system',
      senderName: 'PamWill Concierge',
      text: `Practitioner ${therapistDisplayName} has accepted your booking and is preparing the sanitized kit and botanical oils.`,
      timestamp: new Date(activeBooking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'm2',
      bookingId: activeBooking.id,
      sender: 'therapist',
      senderName: therapistDisplayName,
      text: `Namaste ${user.name.split(' ')[0]}. I am on my way to your location. Could you let me know if you prefer relaxing lavender or refreshing eucalyptus oil today?`,
      timestamp: new Date(Date.now() - 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ] : []);

  const [inputText, setInputText] = useState('');

  const quickChips = [
    "Lavender oil please",
    "Please call when at gate",
    "Take elevator to 4th floor",
    "Extra focus on lower back"
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      bookingId: activeBooking?.id || 'PW-1',
      sender: 'customer',
      senderName: user.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    if (!textToSend) setInputText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-hairline)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={activeBooking?.therapistPhoto || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"}
            alt="Therapist"
            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--accent-gold)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>{therapistDisplayName}</h3>
              <ShieldCheck size={14} color="var(--status-success)" />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--status-success)', margin: 0 }}>Active Session Thread • #{activeBooking?.id}</p>
          </div>
        </div>

        <a
          href={`tel:${activeBooking?.therapistPhone || '+919811044219'}`}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            textDecoration: 'none'
          }}
        >
          <Phone size={16} />
        </a>
      </div>

      {/* Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ textAlign: 'center', margin: '8px 0' }}>
          <span style={{ fontSize: '10px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', padding: '3px 10px', borderRadius: 'var(--radius-pill)' }}>
            Thread automatically closes 12h post-service
          </span>
        </div>

        {messages.map(msg => {
          const isMe = msg.sender === 'customer';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-hairline)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                lineHeight: 1.4
              }}>
                <Sparkles size={12} color="var(--accent-gold)" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
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
              <div style={{
                maxWidth: '80%',
                padding: '12px 14px',
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                backgroundColor: isMe ? 'var(--text-primary)' : 'var(--bg-surface)',
                color: isMe ? '#FAF8F5' : 'var(--text-primary)',
                border: isMe ? 'none' : '1px solid var(--border-hairline)',
                fontSize: '13px',
                lineHeight: 1.4,
                boxShadow: 'var(--shadow-sm)'
              }}>
                {msg.text}
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px', padding: '0 4px' }}>
                {msg.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick Suggestion Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '8px 20px', backgroundColor: 'var(--bg-surface)' }}>
        {quickChips.map(chip => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            style={{
              whiteSpace: 'nowrap',
              fontSize: '11px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-hairline)',
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Message practitioner..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-hairline)',
            backgroundColor: 'var(--bg-primary)',
            fontSize: '13px',
            outline: 'none'
          }}
        />
        <button
          onClick={() => handleSend()}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-gold)',
            border: 'none',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
