import React, { useState } from 'react';
import { 
  ShieldCheck, DollarSign, Clock, MapPin, Award, 
  ChevronRight, ChevronDown, CheckCircle2, Sparkles, 
  Building, UserCheck, PhoneCall, AlertCircle, ArrowRight,
  TrendingUp, Navigation, Star, HeartHandshake, HelpCircle,
  Search, Shield, Laptop, Check
} from 'lucide-react';
import { usePamwill } from '../../state/store';

export const PartnerDiscoveryView: React.FC = () => {
  const { 
    setAuthTargetRole, 
    setAuthMode, 
    setAuthModalOpen,
    setTherapistSubRoute,
    platformCommissionRate,
    therapists
  } = usePamwill();

  // Earnings Simulator state
  const [dailySessions, setDailySessions] = useState<number>(3);
  const [workingDays, setWorkingDays] = useState<number>(26);

  // FAQ Search & Filter state
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(1);

  // Motivational Action Handlers
  const handleOpenRegister = () => {
    setAuthTargetRole('therapist');
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  const handleOpenLogin = () => {
    setAuthTargetRole('therapist');
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  // Calculations for Earnings Simulator
  // Average booking price ~₹2,200. Therapist receives 85% (~₹1,870) + ~₹300 avg tip = ~₹2,170/session
  const payoutPerSession = Math.round(2200 * (1 - platformCommissionRate));
  const avgTipPerSession = 300;
  const netPerSession = payoutPerSession + avgTipPerSession;
  const projectedMonthlyIncome = dailySessions * workingDays * netPerSession;
  const projectedWeeklyIncome = Math.round(dailySessions * 6 * netPerSession);

  // Mock Live Job Radar
  const liveSampleJobs = [
    {
      id: 'job-demo-1',
      service: '90m Signature Deep Tissue & Hot Stone',
      location: 'DLF Phase 5, Golf Course Rd',
      distance: '3.4 km away',
      payout: '₹2,450',
      timing: 'Today, 03:30 PM',
      clientRating: '5.0 ★ VIP Patron'
    },
    {
      id: 'job-demo-2',
      service: '120m Luxury Couple Abhyanga Ritual',
      location: 'Koramangala 4th Block',
      distance: '4.8 km away',
      payout: '₹4,100',
      timing: 'Today, 05:00 PM',
      clientRating: '4.9 ★ Gold Member'
    },
    {
      id: 'job-demo-3',
      service: '60m Clinical Spinal Decompression (Physio)',
      location: 'Indiranagar 100 Feet Rd',
      distance: '2.1 km away',
      payout: '₹1,890',
      timing: 'Today, 06:15 PM',
      clientRating: '4.9 ★ Verified Client'
    }
  ];

  // Comprehensive Partner FAQs
  const partnerFaqs = [
    {
      id: 1,
      category: 'earnings',
      question: 'How much can I realistically earn as a Pamwill Partner?',
      answer: 'Full-time specialists typically earn between ₹80,000 and ₹1,80,000 per month delivering 3–5 sessions per day. You keep up to 85% of every booking fee, plus 100% of client tips (which average ₹300–₹500 per session). As a welcome incentive, you pay 0% platform commission for your first 30 days!'
    },
    {
      id: 2,
      category: 'earnings',
      question: 'When and how do I receive my payouts?',
      answer: 'Pamwill operates instant automated payouts. After completing a session and confirming the secure OTP, your earnings are credited directly to your UPI ID or bank account within 30 minutes. No weekly waiting periods or delayed cheque clearances.'
    },
    {
      id: 3,
      category: 'safety',
      question: 'How does Pamwill guarantee therapist safety during home visits?',
      answer: 'Your safety is our absolute priority. Every client must be phone and identity verified before placing a booking. Our app features real-time GPS breadcrumb tracking and a one-touch Emergency SOS button connected directly to our 24/7 security control room. We maintain a strict zero-tolerance policy against inappropriate behavior.'
    },
    {
      id: 4,
      category: 'location',
      question: 'How does the Google Maps service perimeter work? Can I limit travel distance?',
      answer: 'Yes, absolutely! You have 100% control over where you travel. You set your home base or clinic pin on Google Maps and select your custom service radius (5 km, 10 km, or 15 km). You will NEVER receive booking alerts outside your chosen radius.'
    },
    {
      id: 5,
      category: 'spa_centers',
      question: 'Can established Spa Centers and Wellness Clinics join Pamwill?',
      answer: 'Yes! Pamwill has a specialized Spa Center Partner program. Spa owners can register their establishment, add multiple certified therapists under one master account, manage corporate wellness bookings, and track consolidated daily payouts with complete team analytics.'
    },
    {
      id: 6,
      category: 'onboarding',
      question: 'What certifications or documents do I need to get approved?',
      answer: 'We accept government-recognized wellness diplomas, CIDESCO/ITEC qualifications, BPT/MPT degrees for physiotherapists, or certifications from accredited massage institutes. You will also need valid Govt ID proof (Aadhaar/PAN) and police verification clearance. Our team assists with document verification within 24 hours.'
    },
    {
      id: 7,
      category: 'equipment',
      question: 'Do I need to carry heavy equipment or purchase expensive kits?',
      answer: 'Clients typically provide clean towels and a comfortable space. You only need your personal professional attire and massage oils. Pamwill also provides optional certified starter kits containing premium organic cold-pressed oils, branded linens, and lightweight portable tables at wholesale partner rates.'
    },
    {
      id: 8,
      category: 'schedule',
      question: 'Are there fixed working hours or mandatory minimum shifts?',
      answer: 'None at all. You are your own boss. Whenever you want to earn, simply toggle your status to "Online • Accepting" in the app. When you need rest, family time, or have personal commitments, toggle to "Offline". You only accept assignments that fit your lifestyle.'
    }
  ];

  const filteredFaqs = partnerFaqs.filter(faq => {
    const matchesCategory = faqCategory === 'all' || faq.category === faqCategory;
    const matchesSearch = faqSearch.trim() === '' || 
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 16px 120px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      {/* 1. HERO MOTIVATIONAL BANNER */}
      <section style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1C1814 0%, #2A231C 50%, #15120F 100%)',
        border: '1px solid rgba(212, 163, 89, 0.35)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        padding: '40px 28px',
        color: '#FAF8F5'
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-40%',
          right: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 163, 89, 0.25) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '780px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(212, 163, 89, 0.15)',
            border: '1px solid rgba(212, 163, 89, 0.4)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            marginBottom: '16px'
          }}>
            <Sparkles size={14} color="var(--accent-gold)" />
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)'
            }}>
              PAMWILL PRACTITIONER & SPA COLLECTIVE
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 4.5vw, 42px)',
            fontWeight: 700,
            lineHeight: 1.15,
            margin: '0 0 14px 0',
            color: '#FFFFFF'
          }}>
            Elevate Your Healing Practice. <br />
            <span style={{ color: 'var(--accent-gold-light)' }}>Earn on Your Own Terms.</span>
          </h1>

          <p style={{
            fontSize: '15px',
            color: '#D8D1C7',
            lineHeight: 1.6,
            margin: '0 0 24px 0',
            maxWidth: '680px'
          }}>
            Join India's most prestigious on-demand luxury spa and wellness collective. Deliver world-class massage and clinical physiotherapy sessions to verified patrons in your neighborhood while earning up to <strong>₹1,80,000/month</strong> with instant daily UPI settlements.
          </p>

          {/* Key Value Metrics Badges */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '28px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '12px',
              fontWeight: 600
            }}>
              <DollarSign size={14} color="var(--accent-gold)" />
              <span>Keep 80% – 85% Revenue</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(76, 175, 80, 0.15)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              fontSize: '12px',
              fontWeight: 600,
              color: '#81C784'
            }}>
              <CheckCircle2 size={14} />
              <span>Instant Daily UPI Payouts</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '12px',
              fontWeight: 600
            }}>
              <ShieldCheck size={14} color="#60A5FA" />
              <span>100% Pre-Screened Clients</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '12px',
              fontWeight: 600
            }}>
              <Navigation size={14} color="var(--accent-gold)" />
              <span>Google Maps 5–15 km Perimeter</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center'
          }}>
            <button
              onClick={handleOpenRegister}
              style={{
                padding: '14px 28px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--accent-gold)',
                color: '#15120F',
                border: 'none',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(212, 163, 89, 0.4)',
                transition: 'transform 150ms ease, box-shadow 150ms ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <span>✨ Apply as Therapist / Spa Partner</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={handleOpenLogin}
              style={{
                padding: '14px 24px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'transparent',
                color: '#FAF8F5',
                border: '1.5px solid rgba(212, 163, 89, 0.5)',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 150ms ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(212, 163, 89, 0.15)';
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(212, 163, 89, 0.5)';
              }}
            >
              <UserCheck size={16} />
              <span>Partner Sign In</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. LIVE JOB OPPORTUNITY RADAR (SIMULATED PREVIEW) */}
      <section style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid var(--border-hairline)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--status-success)',
                display: 'inline-block',
                boxShadow: '0 0 12px rgba(76, 175, 80, 0.8)'
              }} />
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
                Live Available Assignments in Your Metro
              </h2>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Sample real-time client booking requests dispatched to verified Pamwill practitioners.
            </p>
          </div>

          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--accent-gold)',
            backgroundColor: 'var(--accent-gold-light)',
            padding: '5px 12px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid rgba(212, 163, 89, 0.3)'
          }}>
            ⚡ High-Demand Peak Hours
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '14px'
        }}>
          {liveSampleJobs.map(job => (
            <div
              key={job.id}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid var(--border-hairline)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                transition: 'border-color 150ms ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--accent-gold)',
                    backgroundColor: 'var(--accent-gold-light)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-pill)'
                  }}>
                    {job.timing}
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {job.payout}
                  </span>
                </div>

                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {job.service}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <MapPin size={13} color="var(--accent-gold)" />
                  <span>{job.location} ({job.distance})</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>
                  <ShieldCheck size={13} />
                  <span>{job.clientRating} • Pre-screened</span>
                </div>
              </div>

              <button
                onClick={handleOpenRegister}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--accent-gold-light)',
                  border: '1px solid var(--accent-gold)',
                  color: 'var(--accent-gold)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 120ms ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-gold)';
                  e.currentTarget.style.color = '#15120F';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-gold-light)';
                  e.currentTarget.style.color = 'var(--accent-gold)';
                }}
              >
                <span>Accept Assignment Demo</span>
                <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE EARNINGS SIMULATOR */}
      <section style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid var(--border-hairline)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 28px auto' }}>
          <span className="eyebrow" style={{ color: 'var(--accent-gold)' }}>TRANSPARENT REVENUE CALCULATOR</span>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '4px 0 8px 0' }}>
            Calculate Your Monthly Income Potential
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            You keep 80% to 85% of standard session fees plus 100% of luxury patron tips. See what full-time or flexible part-time earnings look like:
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Daily Sessions Delivered
                </label>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  {dailySessions} sessions / day
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                value={dailySessions}
                onChange={e => setDailySessions(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--accent-gold)',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <span>1 (Casual Part-time)</span>
                <span>3 (Recommended)</span>
                <span>6 (High-earner)</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Working Days per Month
                </label>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  {workingDays} days / month
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="28"
                step="2"
                value={workingDays}
                onChange={e => setWorkingDays(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--accent-gold)',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <span>12 (Weekends only)</span>
                <span>20 (Standard)</span>
                <span>26 (Committed)</span>
              </div>
            </div>

            <div style={{
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-secondary)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}>
              💡 <strong>Instant Payout Guarantee:</strong> Funds automatically transfer to your registered UPI ID (e.g. yourname@okaxis) within 30 minutes of completing each session.
            </div>
          </div>

          {/* Results Card */}
          <div style={{
            background: 'linear-gradient(135deg, #1A1612 0%, #25201A 100%)',
            borderRadius: '20px',
            padding: '24px',
            color: '#FFFFFF',
            border: '1.5px solid rgba(212, 163, 89, 0.4)',
            textAlign: 'center',
            boxShadow: '0 12px 30px rgba(0,0,0,0.25)'
          }}>
            <span style={{ fontSize: '11px', color: '#D4C4B5', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Projected Monthly Take-Home
            </span>
            <div style={{
              fontSize: 'clamp(32px, 5vw, 44px)',
              fontWeight: 800,
              color: 'var(--accent-gold-light)',
              margin: '6px 0 10px 0'
            }}>
              ₹{projectedMonthlyIncome.toLocaleString('en-IN')}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              padding: '12px 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              margin: '12px 0 18px 0'
            }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B5ABA0' }}>Weekly Approx.</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#FAF8F5' }}>
                  ₹{projectedWeeklyIncome.toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontSize: '10px', color: '#B5ABA0' }}>Per Session Net</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#FAF8F5' }}>
                  ~₹{netPerSession}
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenRegister}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--accent-gold)',
                color: '#15120F',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Start Earning This Week →
            </button>
          </div>
        </div>
      </section>

      {/* 4. DEDICATED SECTION FOR SPA CENTERS & WELLNESS CLINICS */}
      <section style={{
        background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EFE6 100%)',
        borderRadius: '20px',
        padding: '30px 24px',
        border: '1.5px solid rgba(169, 129, 47, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--accent-gold)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#1F1B16' }}>
              Are You a Spa Center or Wellness Clinic Owner?
            </h2>
            <p style={{ fontSize: '12px', color: '#685D50', margin: '2px 0 0 0' }}>
              Multiply your establishment's revenue by listing your physical facility and dispatching your therapist fleet.
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '14px',
          marginTop: '6px'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#1F1B16', marginBottom: '4px' }}>
              👥 Unified Fleet Dispatch
            </div>
            <div style={{ fontSize: '11px', color: '#685D50', lineHeight: 1.45 }}>
              Register multiple licensed therapists under your spa center profile. Assign incoming jobs seamlessly.
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#1F1B16', marginBottom: '4px' }}>
              🏢 In-Sanctuary & On-Site
            </div>
            <div style={{ fontSize: '11px', color: '#685D50', lineHeight: 1.45 }}>
              Accept bookings directly at your spa address or send therapists on luxury mobile visits in your city zone.
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#1F1B16', marginBottom: '4px' }}>
              💼 Corporate & VIP Contracts
            </div>
            <div style={{ fontSize: '11px', color: '#685D50', lineHeight: 1.45 }}>
              Exclusive access to 5-star hotel concierge bookings, high-ticket wedding parties, and luxury residential suites.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
          <button
            onClick={handleOpenRegister}
            style={{
              padding: '11px 22px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: '#1F1B16',
              color: '#FAF8F5',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Register Your Spa Center or Clinic</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* 5. 6 CORE REASONS PRACTITIONERS CHOOSE PAMWILL */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <span className="eyebrow" style={{ color: 'var(--accent-gold)' }}>PROFESSIONAL STANDARDS</span>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '4px 0 0 0' }}>
            Why Elite Specialists Love Working With Us
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-hairline)'
          }}>
            <div style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}><ShieldCheck size={26} /></div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0' }}>100% Pre-Screened Patrons</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              All clients undergo mobile OTP and identity verification. Zero anonymous bookings are permitted on the platform.
            </p>
          </div>

          <div style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-hairline)'
          }}>
            <div style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}><Navigation size={26} /></div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0' }}>Google Maps Service Zone</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              You define your exact home or clinic pin and your custom 5–15 km travel perimeter. No unexpected distant travels.
            </p>
          </div>

          <div style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-hairline)'
          }}>
            <div style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}><Clock size={26} /></div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0' }}>30-Minute UPI Settlements</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Get paid immediately after ending your session with OTP confirmation. No monthly waiting or payout delays.
            </p>
          </div>

          <div style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-hairline)'
          }}>
            <div style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}><Award size={26} /></div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0' }}>CIDESCO & BPT Badges</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Distinguish your clinical credentials with official Doctor (Dr.) and Master Therapist badges that command premium pricing.
            </p>
          </div>

          <div style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-hairline)'
          }}>
            <div style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}><HeartHandshake size={26} /></div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0' }}>100% Client Tip Retention</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Pamwill takes zero percentage of client gratuities. Every single rupee tipped by appreciative clients goes to you.
            </p>
          </div>

          <div style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-hairline)'
          }}>
            <div style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}><PhoneCall size={26} /></div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0' }}>24/7 Security Helpline</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Our dedicated partner support and security team is available round the clock whenever you are on active assignment.
            </p>
          </div>
        </div>
      </section>

      {/* 6. COMPREHENSIVE PARTNER FAQS */}
      <section style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid var(--border-hairline)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 20px auto' }}>
          <span className="eyebrow" style={{ color: 'var(--accent-gold)' }}>HELP & TRANSPARENCY</span>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '4px 0 8px 0' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Everything you need to know about joining, daily operations, safety, and earnings.
          </p>
        </div>

        {/* FAQ Search & Category Filter */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {/* Search Input */}
          <div style={{
            position: 'relative',
            maxWidth: '540px',
            width: '100%',
            margin: '0 auto'
          }}>
            <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search questions (e.g. payout, safety, radius, spa center)..."
              value={faqSearch}
              onChange={e => setFaqSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-hairline)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Category Chips */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {[
              { id: 'all', label: 'All FAQs' },
              { id: 'earnings', label: '💰 Earnings & Payouts' },
              { id: 'safety', label: '🛡️ Safety' },
              { id: 'location', label: '📍 Google Maps & Radius' },
              { id: 'spa_centers', label: '🏢 Spa Centers' },
              { id: 'onboarding', label: '📜 Documents & Approval' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFaqCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid',
                  borderColor: faqCategory === cat.id ? 'var(--accent-gold)' : 'var(--border-hairline)',
                  backgroundColor: faqCategory === cat.id ? 'var(--accent-gold-light)' : 'transparent',
                  color: faqCategory === cat.id ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: faqCategory === cat.id ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 120ms ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '820px', margin: '0 auto' }}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map(faq => {
              const isOpen = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  style={{
                    borderRadius: '14px',
                    border: '1px solid',
                    borderColor: isOpen ? 'var(--accent-gold)' : 'var(--border-hairline)',
                    backgroundColor: isOpen ? 'var(--bg-secondary)' : 'var(--bg-surface)',
                    overflow: 'hidden',
                    transition: 'all 150ms ease'
                  }}
                >
                  <button
                    onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                    style={{
                      width: '100%',
                      padding: '16px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      gap: '12px'
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {faq.question}
                    </span>
                    <span style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 150ms ease',
                      color: isOpen ? 'var(--accent-gold)' : 'var(--text-secondary)'
                    }}>
                      <ChevronDown size={18} />
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 18px 16px 18px',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--border-hairline)',
                      paddingTop: '12px'
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)', fontSize: '13px' }}>
              No questions found matching "{faqSearch}". Try searching with different keywords.
            </div>
          )}
        </div>
      </section>

      {/* 7. 3-STEP EASY ONBOARDING GUIDE */}
      <section style={{
        borderRadius: '20px',
        padding: '28px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-hairline)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span className="eyebrow" style={{ color: 'var(--accent-gold)' }}>FAST TRACK REGISTRATION</span>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '4px 0 0 0' }}>
            Get Started in 3 Simple Steps
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          textAlign: 'center'
        }}>
          <div style={{ padding: '16px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-gold)',
              color: '#15120F',
              fontSize: '18px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}>
              1
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Sign Up & Submit Proof</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Enter your phone number and upload your wellness diploma or physio certification. Takes under 3 minutes.
            </div>
          </div>

          <div style={{ padding: '16px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-gold)',
              color: '#15120F',
              fontSize: '18px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}>
              2
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Set Google Maps Radius</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Pin your home location on Google Maps and select a comfortable travel distance (5 km, 10 km, or 15 km).
            </div>
          </div>

          <div style={{ padding: '16px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-gold)',
              color: '#15120F',
              fontSize: '18px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}>
              3
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Go Online & Earn</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Turn your status to "Online" to begin receiving high-paying luxury bookings with instant UPI payouts.
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={handleOpenRegister}
            style={{
              padding: '14px 32px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--accent-gold)',
              color: '#15120F',
              border: 'none',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(212, 163, 89, 0.35)'
            }}
          >
            Submit Your Application Now (5 Min)
          </button>
        </div>
      </section>

      {/* 8. PERSISTENT FLOATING MOTIVATIONAL BAR AT BOTTOM */}
      <div style={{
        position: 'fixed',
        bottom: '72px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '720px',
        backgroundColor: 'rgba(21, 18, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(212, 163, 89, 0.4)',
        borderRadius: 'var(--radius-pill)',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
        zIndex: 900
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--accent-gold)" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>
            Join 1,200+ Verified Specialists & Spas
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleOpenLogin}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'transparent',
              color: '#D8D1C7',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Login
          </button>

          <button
            onClick={handleOpenRegister}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--accent-gold)',
              color: '#15120F',
              border: 'none',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};
export default PartnerDiscoveryView;
