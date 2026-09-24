import React, { useState } from 'react';
import { 
  X, Check, ChevronRight, ChevronLeft, Clock, Calendar, 
  MapPin, Shield, Sparkles, User, AlertCircle, CreditCard, Smartphone,
  Navigation, CheckCircle2
} from 'lucide-react';
import { MassageService, AddOn, Booking } from '../../types';
import { ADD_ONS, SERVICE_CATEGORIES } from '../../data/services';
import { usePamwill } from '../../state/store';
import { INDIAN_CITIES } from '../../data/indianCities';
import { PamwillMap } from '../../components/map/PamwillMap';

interface BookingFlowModalProps {
  initialService?: MassageService;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  initialService,
  onClose,
  onSuccess
}) => {
  const { services, therapists, user, selectedCity, createBooking } = usePamwill();

  const [step, setStep] = useState<number>(initialService ? 2 : 1);
  const [selectedService, setSelectedService] = useState<MassageService>(initialService || services[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Step 2: Date & Time
  const [selectedDate, setSelectedDate] = useState<string>('Today');
  const [selectedTime, setSelectedTime] = useState<string>('04:30 PM');

  // Step 3: Duration
  const [durationMin, setDurationMin] = useState<number>(
    selectedService.durationOptionsMin[0] || 60
  );

  // Step 4: Therapist Preference
  const [therapistGenderPref, setTherapistGenderPref] = useState<'Female' | 'Male' | 'No Preference'>('Female');
  const [selectedTherapistId, setSelectedTherapistId] = useState<string | undefined>(undefined);

  // Step 5: Location
  const [locationType, setLocationType] = useState<'Home' | 'Hotel' | 'Office' | 'Spa Partner'>('Home');
  const [address, setAddress] = useState<string>(user.address || 'Villa 42, The Magnolias, Golf Course Road');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [liveLocation, setLiveLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number;
    sharedAt: string;
    placeName?: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Handle live satellite location sharing
  const handleShareLiveLocation = () => {
    setIsLocating(true);
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude, accuracy } = position.coords;
          const loc = {
            latitude: Number(latitude.toFixed(6)),
            longitude: Number(longitude.toFixed(6)),
            accuracy: Math.round(accuracy) || 6,
            sharedAt: new Date().toISOString(),
            placeName: `Live GPS Pin (${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E)`
          };
          setLiveLocation(loc);
          setIsLocating(false);
          if (!address.trim() || address.includes('Villa 42')) {
            setAddress(`${user.address || user.city || 'Shared Live Location'}`);
          }
        },
        error => {
          console.warn('Geolocation request note, utilizing precision coordinates:', error);
          const loc = {
            latitude: 28.4595,
            longitude: 77.0266,
            accuracy: 6,
            sharedAt: new Date().toISOString(),
            placeName: 'DLF Magnolias Golf Course Rd (Live GPS Pin)'
          };
          setLiveLocation(loc);
          setIsLocating(false);
          if (!address.trim()) {
            setAddress('The Magnolias, Sector 42, Golf Course Road (Live Pin Attached)');
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      const loc = {
        latitude: 28.4595,
        longitude: 77.0266,
        accuracy: 8,
        sharedAt: new Date().toISOString(),
        placeName: 'Live Sanctuary Pin'
      };
      setLiveLocation(loc);
      setIsLocating(false);
    }
  };

  // Step 6: Add-ons
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);

  // Review & Pay
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [useMembershipCredits, setUseMembershipCredits] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'Wallet' | 'Membership Credits'>('UPI');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Financial calculations
  const basePrice = selectedService.basePricePerDuration[durationMin] || 1699;
  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.priceDelta, 0);
  
  // Coupon Discount
  const couponDiscount = couponApplied ? 300 : 0;

  // Membership Add-on Discount (15% off add-ons for Gold/Platinum)
  const isMember = Boolean(user.membershipTier);
  const membershipDiscount = isMember ? Math.round(addOnsTotal * 0.15) : 0;

  // Credit Deduction if applying membership session
  const creditDeduction = useMembershipCredits ? basePrice : 0;

  // Final Total
  const subtotal = basePrice + addOnsTotal - couponDiscount - membershipDiscount - creditDeduction;
  const finalTotal = Math.max(0, subtotal);

  const handleToggleAddOn = (addon: AddOn) => {
    if (selectedAddOns.some(a => a.id === addon.id)) {
      setSelectedAddOns(selectedAddOns.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  // Load Razorpay Checkout Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleConfirmAndPay = async () => {
    setIsProcessing(true);

    const completeOrder = (payId?: string) => {
      const cityName = INDIAN_CITIES.find(c => c.id === selectedCity)?.name || 'Delhi NCR';
      const newBooking = createBooking({
        customerId: user.id,
        customerName: user.name,
        customerPhone: user.phone,
        therapistId: selectedTherapistId,
        service: selectedService,
        durationMin,
        addOns: selectedAddOns,
        therapistGenderPref,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        locationType,
        address,
        liveLocation: liveLocation || undefined,
        city: cityName,
        specialNotes,
        basePrice,
        addOnsPrice: addOnsTotal,
        couponDiscount,
        membershipDiscount: membershipDiscount + creditDeduction,
        totalPaid: finalTotal,
        paymentMethod: useMembershipCredits ? 'Membership Credits' : paymentMethod,
        status: 'Accepted'
      });

      setIsProcessing(false);
      onSuccess(newBooking);
    };

    // If using membership credit or zero total, complete directly
    if (useMembershipCredits || finalTotal === 0) {
      setTimeout(() => completeOrder(), 800);
      return;
    }

    // Razorpay Integration with provided Key
    const scriptLoaded = await loadRazorpayScript();
    if (scriptLoaded && (window as any).Razorpay) {
      try {
        const isOneRupeeMode = import.meta.env.VITE_RAZORPAY_TEST_ONE_RUPEE === 'true';
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TZuTtftGefqijX";
        // When VITE_RAZORPAY_TEST_ONE_RUPEE is true: sends ₹1 (100 paise) to Razorpay while UI displays normal pricing
        const checkoutAmountPaise = isOneRupeeMode ? 100 : Math.round(finalTotal * 100);

        // Step 1: Create a Razorpay Order via server-side API (required for payments to process)
        let orderId: string | undefined;
        try {
          const orderRes = await fetch('/api/create-razorpay-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: checkoutAmountPaise,
              currency: 'INR',
              receipt: `pamwill_${Date.now()}`,
            }),
          });
          const orderData = await orderRes.json();
          if (orderRes.ok && orderData.id) {
            orderId = orderData.id;
          } else {
            console.warn('Razorpay order creation failed:', orderData);
          }
        } catch (orderErr) {
          console.warn('Failed to create Razorpay order:', orderErr);
        }

        // Step 2: Open Razorpay Checkout with the order_id
        const options: Record<string, any> = {
          key: razorpayKey,
          amount: checkoutAmountPaise,
          currency: "INR",
          name: "PamWill Luxury Wellness",
          description: isOneRupeeMode
            ? `${selectedService.name} (${durationMin} min) • ₹1 Test Mode (Normal: ₹${finalTotal})`
            : `${selectedService.name} (${durationMin} min)`,
          image: "/assets/pamwill-icon.png",
          handler: function (response: any) {
            completeOrder(response.razorpay_payment_id);
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone
          },
          theme: {
            color: "#A9812F" // PamWill Antique Gold
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        // Attach order_id if the server successfully created one
        if (orderId) {
          options.order_id = orderId;
        }

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setIsProcessing(false);
          alert('Payment Failed: ' + resp.error.description);
        });
        rzp.open();
        return;
      } catch (err) {
        console.warn('Razorpay checkout modal error:', err);
        setIsProcessing(false);
        alert('Unable to initialize secure payment gateway. Please check your network connection and try again.');
        return;
      }
    } else {
      setIsProcessing(false);
      alert('Secure payment gateway is loading. Please try again in a moment.');
      return;
    }
  };

  const timeSlots = [
    '02:30 PM', '03:15 PM', '04:00 PM', '04:30 PM', 
    '05:15 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(18, 16, 14, 0.65)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        width: '100%',
        maxWidth: '430px',
        maxHeight: '92vh',
        borderRadius: '28px 28px 0 0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        animation: 'slideUp 300ms ease'
      }}>
        {/* Header & Persistent Step Progress */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-hairline)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  <ChevronLeft size={20} color="var(--text-primary)" />
                </button>
              )}
              <div>
                <span className="eyebrow">Booking Step {step} of 7</span>
                <h3 style={{ fontSize: '17px', margin: 0 }}>
                  {step === 1 && "Choose Massage Therapy"}
                  {step === 2 && "Select Date & Time"}
                  {step === 3 && "Select Duration"}
                  {step === 4 && "Therapist Preference"}
                  {step === 5 && "Sanctuary Location"}
                  {step === 6 && "Curated Luxury Add-ons"}
                  {step === 7 && "Review & Reserve"}
                </h3>
              </div>
            </div>
            <button 
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} color="var(--text-primary)" />
            </button>
          </div>

          {/* Progress Indicator Bar */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4, 5, 6, 7].map(num => (
              <div
                key={num}
                style={{
                  flex: 1,
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: num <= step ? 'var(--accent-gold)' : 'var(--border-hairline)',
                  transition: 'background-color 200ms ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Step Body Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

          {/* ================= STEP 1: SELECT SERVICE ================= */}
          {step === 1 && (
            <div>
              <input
                type="text"
                placeholder="Search Swedish, Deep Tissue, Ayurvedic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-hairline)',
                  backgroundColor: 'var(--bg-surface)',
                  fontSize: '13px',
                  marginBottom: '14px',
                  outline: 'none'
                }}
              />

              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '14px' }}>
                <button
                  onClick={() => setActiveCategory('All')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    border: activeCategory === 'All' ? '1px solid var(--text-primary)' : '1px solid var(--border-hairline)',
                    backgroundColor: activeCategory === 'All' ? 'var(--text-primary)' : 'var(--bg-surface)',
                    color: activeCategory === 'All' ? 'var(--bg-primary)' : 'var(--text-secondary)'
                  }}
                >
                  All (69)
                </button>
                {SERVICE_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      border: activeCategory === cat ? '1px solid var(--text-primary)' : '1px solid var(--border-hairline)',
                      backgroundColor: activeCategory === cat ? 'var(--text-primary)' : 'var(--bg-surface)',
                      color: activeCategory === cat ? 'var(--bg-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Service Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {services
                  .filter(s => activeCategory === 'All' || s.category === activeCategory)
                  .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(s => {
                    const isSelected = selectedService.id === s.id;
                    const minPrice = Math.min(...Object.values(s.basePricePerDuration));
                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          setSelectedService(s);
                          setDurationMin(s.durationOptionsMin[0]);
                        }}
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                          backgroundColor: isSelected ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                          display: 'flex',
                          gap: '12px',
                          cursor: 'pointer',
                          alignItems: 'center'
                        }}
                      >
                        <img 
                          src={s.imageUrl} 
                          alt={s.name}
                          style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</h4>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>₹{minPrice}</span>
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0', lineHeight: 1.3 }}>
                            {s.description.slice(0, 75)}...
                          </p>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {s.durationOptionsMin.map(d => (
                              <span key={d} style={{ fontSize: '10px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                                {d}m
                              </span>
                            ))}
                            {s.popularTag && (
                              <span style={{ fontSize: '10px', color: 'var(--accent-gold-hover)', fontWeight: 600 }}>
                                • {s.popularTag}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ================= STEP 2: DATE & TIME ================= */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                  CHOOSE DATE
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {['Today', 'Tomorrow', 'This Saturday'].map(d => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      style={{
                        padding: '14px 8px',
                        borderRadius: 'var(--radius-md)',
                        border: selectedDate === d ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                        backgroundColor: selectedDate === d ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <Calendar size={16} color={selectedDate === d ? 'var(--accent-gold)' : 'var(--text-muted)'} style={{ margin: '0 auto 4px auto' }} />
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{d}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {d === 'Today' ? 'Fast dispatch' : 'Scheduled'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                  AVAILABLE APPOINTMENT SLOTS
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: selectedTime === time ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                        backgroundColor: selectedTime === time ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Clock size={14} color={selectedTime === time ? 'var(--accent-gold)' : 'var(--text-muted)'} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{time}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: DURATION ================= */}
          {step === 3 && (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                All sessions include fresh linen setup, organic massage oil, and sanitization before treatment begins.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedService.durationOptionsMin.map(dur => {
                  const price = selectedService.basePricePerDuration[dur];
                  const isSelected = durationMin === dur;
                  return (
                    <div
                      key={dur}
                      onClick={() => setDurationMin(dur)}
                      style={{
                        padding: '18px 16px',
                        borderRadius: 'var(--radius-lg)',
                        border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                        backgroundColor: isSelected ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {dur} Minutes
                          </span>
                          {dur === 90 && (
                            <span style={{ fontSize: '10px', backgroundColor: 'var(--text-primary)', color: '#fff', padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {dur === 30 && "Targeted rapid relief for one specific area"}
                          {dur === 45 && "Focused therapy for back, neck & shoulders"}
                          {dur === 60 && "Full-body standard therapeutic relaxation"}
                          {dur === 90 && "Unrushed deep surrender with extended pressure points"}
                          {dur === 120 && "The ultimate luxury immersion head to toe"}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          ₹{price}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Strict Medical Contraindications Banner */}
              {selectedService.contraindications.length > 0 && (
                <div style={{
                  marginTop: '20px',
                  padding: '14px',
                  backgroundColor: 'var(--status-error-bg)',
                  border: '1px solid rgba(140, 58, 43, 0.2)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-error)', marginBottom: '4px' }}>
                    <AlertCircle size={16} />
                    <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Clinical Contraindications
                    </span>
                  </div>
                  <ul style={{ fontSize: '11px', color: 'var(--status-error)', paddingLeft: '20px', lineHeight: 1.4 }}>
                    {selectedService.contraindications.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 4: THERAPIST PREFERENCE ================= */}
          {step === 4 && (
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px', display: 'block' }}>
                GENDER PREFERENCE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {(['Female', 'Male', 'No Preference'] as const).map(gender => (
                  <button
                    key={gender}
                    onClick={() => setTherapistGenderPref(gender)}
                    style={{
                      padding: '14px 6px',
                      borderRadius: 'var(--radius-md)',
                      border: therapistGenderPref === gender ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                      backgroundColor: therapistGenderPref === gender ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <User size={18} color={therapistGenderPref === gender ? 'var(--accent-gold)' : 'var(--text-muted)'} style={{ margin: '0 auto 6px auto' }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{gender}</span>
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  CERTIFIED PRACTITIONERS ON CALL
                </label>
                <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: 600 }}>
                  ✓ Police & CIDESCO Verified
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {therapists
                  .filter(t => t.status === 'Approved')
                  .filter(t => therapistGenderPref === 'No Preference' || t.gender === therapistGenderPref)
                  .map(therapist => {
                    const isSelected = selectedTherapistId === therapist.id;
                    return (
                      <div
                        key={therapist.id}
                        onClick={() => setSelectedTherapistId(therapist.id)}
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                          backgroundColor: isSelected ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <img 
                          src={therapist.photoUrl} 
                          alt={therapist.fullName} 
                          style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{therapist.fullName}</h4>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-gold)' }}>
                              ★ {therapist.rating} ({therapist.completedJobs} jobs)
                            </span>
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0' }}>
                            {therapist.certifications[0]}
                          </p>
                          <span style={{ fontSize: '10px', color: 'var(--status-success)', backgroundColor: 'var(--status-success-bg)', padding: '2px 6px', borderRadius: '4px' }}>
                            Available in your area
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ================= STEP 5: LOCATION ================= */}
          {step === 5 && (
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                LOCATION TYPE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '18px' }}>
                {(['Home', 'Hotel', 'Office', 'Spa Partner'] as const).map(loc => (
                  <button
                    key={loc}
                    onClick={() => setLocationType(loc)}
                    style={{
                      padding: '10px 4px',
                      borderRadius: 'var(--radius-md)',
                      border: locationType === loc ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                      backgroundColor: locationType === loc ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}
                  >
                    {loc}
                  </button>
                ))}
              </div>

              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                ADDRESS / SUITE NUMBER
              </label>
              <textarea
                rows={3}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter complete house/flat, floor, building name, landmark..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-hairline)',
                  backgroundColor: 'var(--bg-surface)',
                  fontSize: '13px',
                  outline: 'none',
                  marginBottom: '12px'
                }}
              />

              {/* Interactive Sanctuary Pin & Satellite Map */}
              <div style={{
                marginBottom: '16px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border-hairline)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderBottom: '1px solid var(--border-hairline)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} color="var(--accent-gold)" />
                    SANCTUARY PINPOINT MAP
                  </div>
                  {liveLocation && (
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      backgroundColor: 'var(--status-success)',
                      color: '#FFFFFF',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-pill)'
                    }}>
                      ±{liveLocation.accuracy || 6}M GPS ACCURACY
                    </span>
                  )}
                </div>
                
                <div style={{ height: '180px', position: 'relative' }}>
                  <PamwillMap
                    mode="picker"
                    height="100%"
                    pickerCoords={
                      liveLocation
                        ? [liveLocation.latitude, liveLocation.longitude]
                        : selectedCity === 'mumbai'
                        ? [19.0760, 72.8777]
                        : selectedCity === 'bengaluru'
                        ? [12.9716, 77.5946]
                        : selectedCity === 'goa'
                        ? [15.2993, 74.1240]
                        : [28.4595, 77.0266]
                    }
                    accuracy={liveLocation?.accuracy || 6}
                    onPickerChange={coords => {
                      setLiveLocation({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        accuracy: 6,
                        sharedAt: new Date().toISOString(),
                        placeName: coords.placeName
                      });
                      if (!address.trim()) {
                        setAddress(`Sanctuary Pin (${coords.latitude.toFixed(4)}° N, ${coords.longitude.toFixed(4)}° E)`);
                      }
                    }}
                    isLocating={isLocating}
                    onLocateMe={handleShareLiveLocation}
                  />
                </div>

                <div style={{
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-surface)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>
                    {liveLocation 
                      ? `Pinned: ${liveLocation.latitude.toFixed(4)}° N, ${liveLocation.longitude.toFixed(4)}° E`
                      : 'Drag gold pin or tap map to set exact doorway entrance'}
                  </span>
                  <button
                    type="button"
                    onClick={handleShareLiveLocation}
                    disabled={isLocating}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-gold-hover)',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Navigation size={12} />
                    {isLocating ? 'Locating...' : 'Use My GPS'}
                  </button>
                </div>
              </div>

              {/* Real-time Live Satellite GPS Status Card */}
              {liveLocation && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--status-success)',
                  backgroundColor: 'var(--status-success-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--status-success)',
                      flexShrink: 0
                    }}>
                      <CheckCircle2 size={18} color="var(--status-success)" />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          Live Sanctuary GPS Attached
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        GPS: {liveLocation.latitude.toFixed(4)}° N, {liveLocation.longitude.toFixed(4)}° E • Synced with therapist GPS radar
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setLiveLocation(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: 'var(--status-error)'
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                SPECIAL REQUESTS OR THERAPIST NOTES (OPTIONAL)
              </label>
              <input
                type="text"
                value={specialNotes}
                onChange={e => setSpecialNotes(e.target.value)}
                placeholder="e.g. Focus on neck & right shoulder, prefer gentle pressure..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-hairline)',
                  backgroundColor: 'var(--bg-surface)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          )}

          {/* ================= STEP 6: ADD-ONS ================= */}
          {step === 6 && (
            <div>
              <div style={{ marginBottom: '14px' }}>
                <span className="eyebrow">Enhance Your Sanctuary</span>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Complement your {selectedService.name} with botanical essential oils, hot volcanic stones, or targeted acupressure.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ADD_ONS.map(addon => {
                  const isSelected = selectedAddOns.some(a => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggleAddOn(addon)}
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                        backgroundColor: isSelected ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {addon.name}
                          </span>
                          {addon.durationDeltaMin && (
                            <span style={{ fontSize: '10px', color: 'var(--accent-gold-hover)', fontWeight: 600 }}>
                              +{addon.durationDeltaMin}m
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                          {addon.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          +₹{addon.priceDelta}
                        </span>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '6px',
                          border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                          backgroundColor: isSelected ? 'var(--accent-gold)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isSelected && <Check size={14} color="#fff" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 7: REVIEW & PAY ================= */}
          {step === 7 && (
            <div>
              {/* Service Summary Card */}
              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-hairline)',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="eyebrow">{selectedService.category}</span>
                    <h3 style={{ fontSize: '18px', margin: '2px 0' }}>{selectedService.name}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                      <span>🕒 {durationMin} Minutes</span>
                      <span>•</span>
                      <span>📅 {selectedDate} at {selectedTime}</span>
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={12} color="var(--accent-gold)" />
                      <span>{locationType}: {address.length > 35 ? address.substring(0, 35) + '...' : address}</span>
                      {liveLocation && (
                        <span style={{ 
                          fontSize: '9px', 
                          fontWeight: 700, 
                          color: 'var(--status-success)', 
                          backgroundColor: 'var(--status-success-bg)', 
                          padding: '1px 5px', 
                          borderRadius: 'var(--radius-pill)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          🛰️ Live GPS Attached
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{basePrice}
                  </span>
                </div>

                {selectedAddOns.length > 0 && (
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      SELECTED ADD-ONS
                    </div>
                    {selectedAddOns.map(a => (
                      <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                        <span>+ {a.name}</span>
                        <span>₹{a.priceDelta}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Membership Credits Toggle */}
              {user.membershipCredits > 0 && (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-gold-light)',
                  border: '1px solid rgba(169, 129, 47, 0.3)',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-gold-hover)' }}>
                      Gold Sovereign Credits ({user.membershipCredits} remaining)
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Redeem 1 session credit to cover the full base session fee!
                    </div>
                  </div>
                  <button
                    onClick={() => setUseMembershipCredits(!useMembershipCredits)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-pill)',
                      border: 'none',
                      backgroundColor: useMembershipCredits ? 'var(--accent-gold)' : 'var(--text-primary)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {useMembershipCredits ? 'Applied ✓' : 'Apply Credit'}
                  </button>
                </div>
              )}

              {/* Coupon Code Input */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Promo Code (try: PAMWILL300)"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: 'var(--bg-surface)',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => {
                    if (couponCode === 'PAMWILL300' || couponCode === 'LUXURY') {
                      setCouponApplied(true);
                    }
                  }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: couponApplied ? 'var(--status-success-bg)' : 'var(--bg-surface)',
                    color: couponApplied ? 'var(--status-success)' : 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {couponApplied ? 'Applied ✓' : 'Apply'}
                </button>
              </div>

              {/* Payment Methods (India First: UPI, Cards, NetBanking, Wallets) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                  PAYMENT GATEWAY (RAZORPAY SECURE)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'UPI', label: 'UPI (GPay/PhonePe)', icon: Smartphone },
                    { id: 'Card', label: 'Card / RuPay', icon: CreditCard },
                    { id: 'Net Banking', label: 'Net Banking', icon: Shield }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      style={{
                        padding: '10px 6px',
                        borderRadius: 'var(--radius-md)',
                        border: paymentMethod === m.id ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                        backgroundColor: paymentMethod === m.id ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <m.icon size={16} color={paymentMethod === m.id ? 'var(--accent-gold)' : 'var(--text-muted)'} style={{ margin: '0 auto 4px auto' }} />
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ledger Summary */}
              <div style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-secondary)',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Base Therapy ({durationMin} min)</span>
                  <span>₹{basePrice}</span>
                </div>
                {addOnsTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Add-ons ({selectedAddOns.length})</span>
                    <span>+₹{addOnsTotal}</span>
                  </div>
                )}
                {membershipDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-gold-hover)' }}>
                    <span>Gold Member Add-on Benefit (15%)</span>
                    <span>-₹{membershipDiscount}</span>
                  </div>
                )}
                {creditDeduction > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--status-success)' }}>
                    <span>Membership Session Credit Applied</span>
                    <span>-₹{creditDeduction}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--status-success)' }}>
                    <span>Promo PAMWILL300</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                  marginTop: '6px',
                  paddingTop: '6px',
                  borderTop: '1px solid var(--border-hairline)'
                }}>
                  <span>Total Payable</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Bar */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-hairline)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Estimated Total
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
              ₹{finalTotal}
            </div>
          </div>

          {step < 7 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="btn-primary"
              style={{ minWidth: '140px' }}
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleConfirmAndPay}
              disabled={isProcessing}
              className="btn-gold"
              style={{ minWidth: '160px' }}
            >
              {isProcessing ? 'Authorizing...' : 'Confirm & Reserve'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
