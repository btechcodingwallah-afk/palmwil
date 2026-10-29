import React, { useState } from 'react';
import { 
  ShieldCheck, Award, FileText, MapPin, Globe, Clock, 
  DollarSign, Trophy, User, ChevronRight, Edit3, Camera, 
  Headphones, MessageSquare, Shield, Info, LogOut, RefreshCw, 
  CheckCircle2, AlertTriangle, ExternalLink, Sparkles, Phone,
  CreditCard, Landmark, Check, X, HelpCircle, Crosshair
} from 'lucide-react';
import { usePamwill } from '../../state/store';
import { getTherapistRoleBadge, formatTherapistDisplayName } from '../../types';
import { PamwillMap } from '../../components/map/PamwillMap';
import { reverseGeocodeCoords } from '../../services/googleMaps';

export const TherapistProfileView: React.FC = () => {
  const { 
    currentTherapist, 
    updateTherapistProfile, 
    dailyGoalCount, 
    setTherapistSubRoute, 
    logoutTherapist,
    setCurrentRole
  } = usePamwill();

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [specialtiesModalOpen, setSpecialtiesModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  // Service Area on Google Map state
  const [serviceAreaModalOpen, setServiceAreaModalOpen] = useState(false);
  const [serviceRadius, setServiceRadius] = useState<number>(currentTherapist?.serviceRadiusKm || 10);
  const [serviceAreaCoords, setServiceAreaCoords] = useState<[number, number]>(() => {
    if (currentTherapist?.currentLocation?.latitude && currentTherapist?.currentLocation?.longitude) {
      return [currentTherapist.currentLocation.latitude, currentTherapist.currentLocation.longitude];
    }
    return [28.4680, 77.0850]; // default DLF Cyber City Gurugram
  });
  const [serviceAreaName, setServiceAreaName] = useState<string>(
    currentTherapist?.currentLocation?.area || 'DLF Cyber City, Gurugram'
  );
  const [isLocatingTherapist, setIsLocatingTherapist] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(currentTherapist?.fullName || '');
  const [editPhone, setEditPhone] = useState(currentTherapist?.phone || '');
  const [editEmail, setEditEmail] = useState(currentTherapist?.email || '');
  const [editExperience, setEditExperience] = useState(currentTherapist?.experienceYears?.toString() || '6');
  const [editWorkingHours, setEditWorkingHours] = useState(currentTherapist?.workingHours || '08:00 AM - 08:00 PM');
  const [editUpiId, setEditUpiId] = useState(currentTherapist?.upiId || 'dr.iyer@okhdfcbank');
  const [editBankAccount, setEditBankAccount] = useState(currentTherapist?.bankAccount || 'HDFC Bank •••• 4091');
  const [editPhotoUrl, setEditPhotoUrl] = useState(currentTherapist?.photoUrl || '');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const roleBadge = getTherapistRoleBadge(currentTherapist?.role);
  const displayName = formatTherapistDisplayName(currentTherapist?.fullName || '', currentTherapist?.role);

  const handleTherapistLocateMe = () => {
    setIsLocatingTherapist(true);
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));
          setServiceAreaCoords([lat, lng]);
          setIsLocatingTherapist(false);
          try {
            const detectedName = await reverseGeocodeCoords(lat, lng);
            setServiceAreaName(detectedName);
          } catch {
            setServiceAreaName(`GPS Base (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`);
          }
        },
        err => {
          console.warn('Geolocation error:', err);
          setIsLocatingTherapist(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLocatingTherapist(false);
    }
  };

  const handleSaveServiceArea = () => {
    if (currentTherapist?.id) {
      updateTherapistProfile(currentTherapist.id, {
        currentLocation: {
          latitude: serviceAreaCoords[0],
          longitude: serviceAreaCoords[1],
          area: serviceAreaName || `Sanctuary Base (${serviceAreaCoords[0].toFixed(4)}° N, ${serviceAreaCoords[1].toFixed(4)}° E)`
        },
        serviceRadiusKm: serviceRadius
      });
    }
    setServiceAreaModalOpen(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTherapist?.id) {
      updateTherapistProfile(currentTherapist.id, {
        fullName: editName,
        phone: editPhone,
        email: editEmail,
        experienceYears: parseInt(editExperience) || 6,
        workingHours: editWorkingHours,
        upiId: editUpiId,
        bankAccount: editBankAccount,
        photoUrl: editPhotoUrl || currentTherapist.photoUrl
      });
    }
    setEditModalOpen(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleConfirmSignOut = () => {
    setSignOutModalOpen(false);
    logoutTherapist();
  };

  return (
    <div className="therapist-profile-container" style={{
      width: '100%',
      maxWidth: '100%',
      margin: '0 auto',
      padding: '24px 32px 60px',
      backgroundColor: '#FAF8F5',
      minHeight: '100%',
      boxSizing: 'border-box'
    }}>
      
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{
            fontSize: '10px',
            fontWeight: 800,
            color: '#A9812F',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            PRACTITIONER CONCIERGE & CREDENTIALS
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#1F1B16',
            margin: '2px 0 0 0',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '-0.5px'
          }}>
            Practitioner Profile
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setCurrentRole('client')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4DDD2',
              padding: '7px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#6B6259',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(31, 27, 22, 0.04)'
            }}
          >
            <RefreshCw size={13} color="#6B6259" />
            <span>Switch to Client Portal</span>
          </button>

          <button
            onClick={() => setEditModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #A9812F',
              padding: '7px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#A9812F',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(169, 129, 47, 0.12)'
            }}
          >
            <Edit3 size={14} color="#A9812F" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {saveSuccessNotice && (
        <div style={{
          backgroundColor: '#EDF7ED',
          border: '1px solid #4C6B4F',
          borderRadius: '12px',
          padding: '12px 16px',
          color: '#4C6B4F',
          fontSize: '13px',
          fontWeight: 700,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>Profile changes and payout credentials saved successfully!</span>
        </div>
      )}

      {/* Interactive Google Maps Service Area Active Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E4DDD2',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 2px 10px rgba(31, 27, 22, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: '#F7EEDD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#A9812F',
            flexShrink: 0
          }}>
            <MapPin size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#1F1B16' }}>
                Operational Service Perimeter: {currentTherapist?.currentLocation?.area || 'DLF Cyber City, Gurugram'}
              </span>
              <span style={{
                backgroundColor: '#EDF7ED',
                color: '#4C6B4F',
                fontSize: '10px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '8px',
                letterSpacing: '0.4px'
              }}>
                {currentTherapist?.serviceRadiusKm || 10} KM GOOGLE MAPS ZONE ACTIVE
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#6B6259', marginTop: '2px' }}>
              Only clients within {currentTherapist?.serviceRadiusKm || 10} km of your base coordinates can view and book your sanctuary sessions.
            </div>
          </div>
        </div>

        <button
          onClick={() => setServiceAreaModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#A9812F',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '9px 16px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(169, 129, 47, 0.22)'
          }}
        >
          <Crosshair size={14} />
          <span>Adjust Base on Map</span>
        </button>
      </div>

      {/* Responsive 2-Column Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* LEFT COLUMN: Hero Practitioner Card, Financial & Earnings, Credentials & KYC */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Hero Practitioner Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E4DDD2',
            boxShadow: '0 4px 16px rgba(31, 27, 22, 0.04)',
            overflow: 'hidden'
          }}>
            {/* Gold top accent line */}
            <div style={{ height: '4px', backgroundColor: '#A9812F' }} />

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={currentTherapist?.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'}
                    alt={currentTherapist?.fullName}
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2.5px solid #A9812F'
                    }}
                  />
                  <button
                    onClick={() => setEditModalOpen(true)}
                    title="Change Avatar"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: '#A9812F',
                      border: '2px solid #FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <Camera size={11} color="#FFFFFF" />
                  </button>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '19px', fontWeight: 800, color: '#1F1B16' }}>
                      {displayName}
                    </div>
                    <ShieldCheck size={18} color="#4C6B4F" />
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B6259', marginTop: '2px' }}>
                    {currentTherapist?.phone} • {currentTherapist?.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      backgroundColor: roleBadge.bg || '#F7EEDD',
                      color: roleBadge.color || '#A9812F',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      textTransform: 'uppercase'
                    }}>
                      {roleBadge.label}
                    </span>
                    <span style={{
                      backgroundColor: currentTherapist?.isOnline ? '#EDF7ED' : '#F5F5F5',
                      color: currentTherapist?.isOnline ? '#4C6B4F' : '#9A8F82',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: currentTherapist?.isOnline ? '#4C6B4F' : '#9A8F82'
                      }} />
                      {currentTherapist?.isOnline ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Stat Columns */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                borderTop: '1px solid #F1ECE4',
                paddingTop: '14px',
                textAlign: 'center'
              }}>
                <div 
                  onClick={() => setTherapistSubRoute('bookings')}
                  style={{ borderRight: '1px solid #F1ECE4', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>
                    {currentTherapist?.completedJobs || 0}
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: '#9A8F82', letterSpacing: '0.5px' }}>
                    SESSIONS
                  </div>
                </div>

                <div 
                  onClick={() => setTherapistSubRoute('earnings')}
                  style={{ borderRight: '1px solid #F1ECE4', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#A9812F' }}>
                    ₹{currentTherapist?.walletBalance || 0}
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: '#9A8F82', letterSpacing: '0.5px' }}>
                    WALLET
                  </div>
                </div>

                <div style={{ borderRight: '1px solid #F1ECE4' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>
                    ★ {currentTherapist?.rating || '4.95'}
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: '#9A8F82', letterSpacing: '0.5px' }}>
                    RATING
                  </div>
                </div>

                <div onClick={() => setKycModalOpen(true)} style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#4C6B4F' }}>
                    Verified
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: '#9A8F82', letterSpacing: '0.5px' }}>
                    KYC STATUS
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: FINANCIAL & REWARDS (Earnings & Payouts + Daily 10-Goal) */}
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#6B6259',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              paddingLeft: '4px'
            }}>
              FINANCIAL & PERFORMANCE
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Earnings & Payouts Card */}
              <div
                onClick={() => setTherapistSubRoute('earnings')}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}>
                    <DollarSign size={18} color="#A9812F" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={menuTitleStyle}>Earnings & Payouts</span>
                      <span style={{
                        backgroundColor: '#EDF7ED',
                        color: '#4C6B4F',
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        INSTANT UPI
                      </span>
                    </div>
                    <div style={menuSubStyle}>
                      Wallet balance, direct UPI withdrawals & commission logs
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    backgroundColor: '#F7EEDD',
                    color: '#A9812F',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '10px'
                  }}>
                    ₹{currentTherapist?.walletBalance || 0}
                  </span>
                  <ChevronRight size={16} color="#9A8F82" />
                </div>
              </div>

              {/* Daily 10-Goal Card */}
              <div
                onClick={() => setTherapistSubRoute('daily-goal')}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}>
                    <Trophy size={18} color="#A9812F" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={menuTitleStyle}>Daily 10-Goal</span>
                      <span style={{
                        backgroundColor: '#A9812F',
                        color: '#FFFFFF',
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        ₹1,000 BONUS
                      </span>
                    </div>
                    <div style={menuSubStyle}>
                      Complete 10 sanctuary sessions today for ₹1,000 jackpot bonus
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    backgroundColor: '#F7EEDD',
                    color: '#A9812F',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '10px'
                  }}>
                    {dailyGoalCount}/10 Done
                  </span>
                  <ChevronRight size={16} color="#9A8F82" />
                </div>
              </div>
            </div>
          </div>

          {/* Section: CREDENTIALS & KYC */}
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#6B6259',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              paddingLeft: '4px'
            }}>
              CREDENTIALS & KYC VERIFICATION
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Credentials & KYC Dossier */}
              <div
                onClick={() => setKycModalOpen(true)}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}>
                    <ShieldCheck size={18} color="#A9812F" />
                  </div>
                  <div>
                    <div style={menuTitleStyle}>Credentials & KYC Dossier</div>
                    <div style={menuSubStyle}>
                      Aadhaar, PAN, CIDESCO certification, Police clearance & ID records
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    backgroundColor: '#EDF7ED',
                    color: '#4C6B4F',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}>
                    100% Verified ✓
                  </span>
                  <ChevronRight size={16} color="#9A8F82" />
                </div>
              </div>

              {/* Diplomas & Certifications */}
              <div
                onClick={() => setSpecialtiesModalOpen(true)}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}>
                    <Award size={18} color="#A9812F" />
                  </div>
                  <div>
                    <div style={menuTitleStyle}>Diplomas & Modalities</div>
                    <div style={menuSubStyle}>
                      {(currentTherapist?.certifications || []).join(', ') || 'Certified Wellness & Massage Practitioner'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    backgroundColor: '#F7EEDD',
                    color: '#A9812F',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}>
                    {(currentTherapist?.certifications || []).length || 3} Diplomas
                  </span>
                  <ChevronRight size={16} color="#9A8F82" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Service Areas, Concierge Support, Governance & Legal, Account Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Section: OPERATIONAL COVERAGE */}
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#6B6259',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              paddingLeft: '4px'
            }}>
              OPERATIONAL COVERAGE & SCHEDULE
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div 
                style={menuCardStyle} 
                onClick={() => setServiceAreaModalOpen(true)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><MapPin size={18} color="#A9812F" /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={menuTitleStyle}>Google Maps Service Area & Radius</span>
                      <span style={{
                        backgroundColor: '#EDF7ED',
                        color: '#4C6B4F',
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        {currentTherapist?.serviceRadiusKm || 10} KM RADIUS
                      </span>
                    </div>
                    <div style={menuSubStyle}>
                      {currentTherapist?.currentLocation?.area || 'DLF Cyber City, Sector 24, Gurugram'} (Click to adjust map pin & perimeter)
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9A8F82" />
              </div>

              <div style={menuCardStyle} onClick={() => setEditModalOpen(true)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><Clock size={18} color="#A9812F" /></div>
                  <div>
                    <div style={menuTitleStyle}>Operating Hours & Availability</div>
                    <div style={menuSubStyle}>{currentTherapist?.workingHours || '08:00 AM - 08:00 PM'} (Mon - Sun)</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9A8F82" />
              </div>

              <div style={menuCardStyle} onClick={() => setEditModalOpen(true)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><CreditCard size={18} color="#A9812F" /></div>
                  <div>
                    <div style={menuTitleStyle}>Payout Bank Coordinates</div>
                    <div style={menuSubStyle}>{currentTherapist?.upiId || 'dr.iyer@okhdfcbank'} • {currentTherapist?.bankAccount || 'HDFC Bank'}</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9A8F82" />
              </div>
            </div>
          </div>

          {/* Section: PRACTITIONER CARE & SUPPORT */}
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#6B6259',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              paddingLeft: '4px'
            }}>
              PRACTITIONER CARE & SUPPORT
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                onClick={() => setSupportModalOpen(true)}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><Headphones size={18} color="#A9812F" /></div>
                  <div>
                    <div style={menuTitleStyle}>24/7 Therapist Partner Concierge</div>
                    <div style={menuSubStyle}>WhatsApp partner helpline, phone desk & emergency SOS</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9A8F82" />
              </div>

              <div
                onClick={() => setFeedbackModalOpen(true)}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><MessageSquare size={18} color="#A9812F" /></div>
                  <div>
                    <div style={menuTitleStyle}>Partner Feedback & Suggestions</div>
                    <div style={menuSubStyle}>Submit operational requests or safety reports to management</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9A8F82" />
              </div>
            </div>
          </div>

          {/* Section: GOVERNANCE & PRIVACY */}
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#6B6259',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              paddingLeft: '4px'
            }}>
              GOVERNANCE, SAFETY & PRIVACY
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                onClick={() => setSafetyModalOpen(true)}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><Shield size={18} color="#A9812F" /></div>
                  <div>
                    <div style={menuTitleStyle}>Safety Standards & Code of Conduct</div>
                    <div style={menuSubStyle}>Zero-tolerance harassment policy & hygiene protocols</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9A8F82" />
              </div>

              <div
                onClick={() => setPrivacyModalOpen(true)}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><FileText size={18} color="#A9812F" /></div>
                  <div>
                    <div style={menuTitleStyle}>Privacy & Data Security Policy</div>
                    <div style={menuSubStyle}>ISO 27001 data protection, medical confidentiality & HIPAA</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9A8F82" />
              </div>
            </div>
          </div>

          {/* Section: ACCOUNT ACTIONS */}
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#6B6259',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              paddingLeft: '4px'
            }}>
              ACCOUNT ACTIONS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                onClick={() => setCurrentRole('client')}
                style={menuCardStyle}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={iconWrapStyle}><RefreshCw size={18} color="#A9812F" /></div>
                  <div>
                    <div style={menuTitleStyle}>Switch to Client Experience</div>
                    <div style={menuSubStyle}>Experience the platform as a booking patron</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9A8F82" />
              </div>

              <button
                onClick={() => setSignOutModalOpen(true)}
                style={{
                  backgroundColor: '#F9EFEF',
                  border: '1px solid rgba(140, 58, 43, 0.15)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: '#8C3A2B',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '4px'
                }}
              >
                <LogOut size={16} color="#8C3A2B" />
                <span>Sign Out of Practitioner Portal</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL 0: GOOGLE MAPS SERVICE AREA & 10 KM RADIUS MODAL */}
      {/* ======================================================== */}
      {serviceAreaModalOpen && (
        <div style={modalOverlayStyle} onClick={() => setServiceAreaModalOpen(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E4DDD2',
              padding: '24px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 16px 44px rgba(31, 27, 22, 0.25)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#A9812F', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  GOOGLE MAPS SERVICE RADIUS
                </div>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '19px', fontWeight: 800, color: '#1F1B16' }}>
                  Set Your Operational Area
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setServiceAreaModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6259', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Subtitle / Value prop banner */}
            <div style={{
              backgroundColor: '#FBF8F3',
              border: '1px solid #EAE0D0',
              borderRadius: '14px',
              padding: '12px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#1F1B16' }}>
                  Zero Manual Address Typing
                </div>
                <div style={{ fontSize: '11px', color: '#6B6259', marginTop: '2px' }}>
                  Use 1-tap live GPS or tap anywhere on the Google Map. Only clients within {serviceRadius} km will receive your booking profile.
                </div>
              </div>
              <button
                type="button"
                onClick={handleTherapistLocateMe}
                disabled={isLocatingTherapist}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#A9812F',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: isLocatingTherapist ? 'wait' : 'pointer',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(169, 129, 47, 0.25)'
                }}
              >
                <Crosshair size={14} />
                <span>{isLocatingTherapist ? 'Locating...' : 'Use My GPS'}</span>
              </button>
            </div>

            {/* Service Radius Selector */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#6B6259', marginBottom: '6px' }}>
                Operational Perimeter Radius:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[5, 10, 15].map(radius => (
                  <button
                    key={radius}
                    type="button"
                    onClick={() => setServiceRadius(radius)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: serviceRadius === radius ? '2px solid #A9812F' : '1px solid #E4DDD2',
                      backgroundColor: serviceRadius === radius ? '#F7EEDD' : '#FFFFFF',
                      color: serviceRadius === radius ? '#A9812F' : '#6B6259',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 150ms ease'
                    }}
                  >
                    <div>{radius} km {radius === 10 ? '★ Standard' : ''}</div>
                    <div style={{ fontSize: '9px', fontWeight: 500, color: serviceRadius === radius ? '#A9812F' : '#9A8F82' }}>
                      {radius === 5 ? 'Hyperlocal' : radius === 10 ? 'Recommended' : 'Extended Metro'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive PamwillMap with Radius circle */}
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1.5px solid #E4DDD2',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              marginBottom: '14px'
            }}>
              <PamwillMap
                mode="picker"
                height={260}
                pickerCoords={serviceAreaCoords}
                serviceRadiusKm={serviceRadius}
                onPickerChange={async (coords) => {
                  setServiceAreaCoords([coords.latitude, coords.longitude]);
                  if (coords.placeName) {
                    setServiceAreaName(coords.placeName);
                  } else {
                    try {
                      const detected = await reverseGeocodeCoords(coords.latitude, coords.longitude);
                      setServiceAreaName(detected);
                    } catch {
                      setServiceAreaName(`Base (${coords.latitude.toFixed(4)}°, ${coords.longitude.toFixed(4)}°)`);
                    }
                  }
                }}
              />
            </div>

            {/* Reverse Geocoded Area Display */}
            <div style={{
              backgroundColor: '#FAF8F5',
              border: '1px solid #E4DDD2',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#A9812F', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                <MapPin size={13} />
                <span>Detected Base Sanctuary & Coverage Zone</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#1F1B16', marginTop: '4px' }}>
                {serviceAreaName || 'Locating current area...'}
              </div>
              <div style={{ fontSize: '11px', color: '#6B6259', marginTop: '3px' }}>
                Lat {serviceAreaCoords[0].toFixed(4)}° • Lng {serviceAreaCoords[1].toFixed(4)}° • Clients within {serviceRadius} km radius will automatically be routed to you.
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setServiceAreaModalOpen(false)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  backgroundColor: '#F1ECE4',
                  border: 'none',
                  color: '#6B6259',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveServiceArea}
                style={{
                  padding: '10px 22px',
                  borderRadius: '12px',
                  backgroundColor: '#A9812F',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 3px 10px rgba(169, 129, 47, 0.3)'
                }}
              >
                <Check size={16} />
                <span>Save & Activate {serviceRadius} km Area</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: EDIT PRACTITIONER PROFILE */}
      {/* ======================================================== */}
      {editModalOpen && (
        <div style={modalOverlayStyle}>
          <form
            onSubmit={handleSaveProfile}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E4DDD2',
              padding: '24px',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 12px 36px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>
                Edit Practitioner Credentials & Profile
              </h3>
              <button 
                type="button" 
                onClick={() => setEditModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6259' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={formLabelStyle}>Full Legal Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  style={formInputStyle}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={formLabelStyle}>Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    style={formInputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={formLabelStyle}>Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    style={formInputStyle}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={formLabelStyle}>Experience (Years)</label>
                  <input
                    type="number"
                    value={editExperience}
                    onChange={e => setEditExperience(e.target.value)}
                    style={formInputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={formLabelStyle}>Working Timings</label>
                  <input
                    type="text"
                    value={editWorkingHours}
                    onChange={e => setEditWorkingHours(e.target.value)}
                    style={formInputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={formLabelStyle}>Avatar / Photo URL</label>
                <input
                  type="url"
                  value={editPhotoUrl}
                  onChange={e => setEditPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  style={formInputStyle}
                />
              </div>

              <div style={{
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#FAF8F5',
                border: '1px solid #E4DDD2'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#A9812F', marginBottom: '8px' }}>
                  PAYOUT & BANK ACCOUNT COORDINATES
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={formLabelStyle}>Primary UPI ID (for instant settlement)</label>
                    <input
                      type="text"
                      value={editUpiId}
                      onChange={e => setEditUpiId(e.target.value)}
                      placeholder="e.g. mobile@okaxis"
                      style={formInputStyle}
                    />
                  </div>
                  <div>
                    <label style={formLabelStyle}>Bank Account & Branch</label>
                    <input
                      type="text"
                      value={editBankAccount}
                      onChange={e => setEditBankAccount(e.target.value)}
                      placeholder="e.g. HDFC Bank, Indiranagar"
                      style={formInputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#F1ECE4',
                  border: 'none',
                  color: '#6B6259',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  backgroundColor: '#A9812F',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CREDENTIALS & KYC DOSSIER */}
      {/* ======================================================== */}
      {kycModalOpen && (
        <div style={modalOverlayStyle} onClick={() => setKycModalOpen(false)}>
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E4DDD2',
              padding: '24px',
              maxWidth: '540px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 16px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>
                  Verified Credentials & KYC Dossier
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6B6259' }}>
                  Certified identity records verified by PamWill Trust & Safety Board.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setKycModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6259' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'Government Aadhaar Card (UIDAI)', desc: '•••• •••• 9842 — Verified with OTP', status: 'Verified ✓' },
                { title: 'Permanent Account Number (PAN)', desc: 'Permanent Tax ID on file', status: 'Verified ✓' },
                { title: 'CIDESCO / ITEC Spa Diploma', desc: 'Accredited international diploma certification', status: 'Verified ✓' },
                { title: 'State Police Background Clearance', desc: 'No criminal records on file, background checked', status: 'Active 2026 ✓' },
                { title: 'Verified Bank Settlement Coordinates', desc: currentTherapist?.bankAccount || 'HDFC Bank Payout Gateway', status: 'Connected ✓' }
              ].map((doc, i) => (
                <div key={i} style={{
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #E4DDD2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#EDF7ED',
                      color: '#4C6B4F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1F1B16' }}>{doc.title}</div>
                      <div style={{ fontSize: '11px', color: '#6B6259', marginTop: '2px' }}>{doc.desc}</div>
                    </div>
                  </div>
                  <span style={{
                    backgroundColor: '#EDF7ED',
                    color: '#4C6B4F',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap'
                  }}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '18px',
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: '#F7EEDD',
              border: '1px solid #A9812F',
              fontSize: '11px',
              color: '#1F1B16'
            }}>
              <strong>PamWill Trust Seal:</strong> Your credentials are encrypted under ISO 27001 data protection and only shared with verified booking clients prior to sanctuary arrival.
            </div>

            <button
              onClick={() => setKycModalOpen(false)}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                backgroundColor: '#A9812F',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: MODALITIES & SPECIALTIES */}
      {/* ======================================================== */}
      {specialtiesModalOpen && (
        <div style={modalOverlayStyle} onClick={() => setSpecialtiesModalOpen(false)}>
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E4DDD2',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 16px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>
                Diplomas & Approved Modalities
              </h3>
              <button 
                type="button" 
                onClick={() => setSpecialtiesModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6259' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Swedish Relaxation Therapy',
                'Deep Tissue Clinical Massage',
                'Traditional Thai Yoga Stretching',
                'Ayurvedic Abhyanga Herbal Therapy',
                'Sports & Myofascial Muscle Recovery',
                'Pregnancy & Post-Natal Gentle Therapy',
                'Foot Reflexology & Acupressure'
              ].map((modality, i) => (
                <div key={i} style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #E4DDD2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Award size={16} color="#A9812F" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1F1B16' }}>{modality}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#4C6B4F', fontWeight: 700 }}>Active ✓</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSpecialtiesModalOpen(false)}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                backgroundColor: '#A9812F',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: 24/7 PARTNER CONCIERGE & SUPPORT */}
      {/* ======================================================== */}
      {supportModalOpen && (
        <div style={modalOverlayStyle} onClick={() => setSupportModalOpen(false)}>
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E4DDD2',
              padding: '24px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 16px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>
                  Therapist Partner Concierge & Help
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6B6259' }}>
                  Direct emergency & operational assistance for active sessions.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setSupportModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6259' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href="https://wa.me/919876543210?text=Hello%20PamWill%20Partner%20Desk,%20I%20need%20support%20with%20my%20practitioner%20account."
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#EDF7ED',
                  border: '1px solid #4C6B4F',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                  color: '#1F1B16'
                }}
              >
                <MessageSquare size={20} color="#4C6B4F" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#4C6B4F' }}>WhatsApp Partner Desk</div>
                  <div style={{ fontSize: '11px', color: '#6B6259' }}>Instant resolution for active booking questions (7 AM - 11 PM)</div>
                </div>
              </a>

              <a
                href="tel:+919876543210"
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #E4DDD2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                  color: '#1F1B16'
                }}
              >
                <Phone size={20} color="#A9812F" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800 }}>Telephone Priority Helpline</div>
                  <div style={{ fontSize: '11px', color: '#6B6259' }}>Call +91 98765 43210 for immediate voice assistance</div>
                </div>
              </a>

              <div style={{
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#F9EFEF',
                border: '1px solid #8C3A2B',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <AlertTriangle size={20} color="#8C3A2B" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#8C3A2B' }}>In-Session Emergency SOS</div>
                  <div style={{ fontSize: '11px', color: '#6B6259' }}>
                    Available on every active job card. Triggers instant location broadcast to local emergency contacts.
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSupportModalOpen(false)}
              style={{
                marginTop: '18px',
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                backgroundColor: '#A9812F',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: PRIVACY & SECURITY POLICY */}
      {/* ======================================================== */}
      {privacyModalOpen && (
        <div style={modalOverlayStyle} onClick={() => setPrivacyModalOpen(false)}>
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E4DDD2',
              padding: '24px',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 16px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>
                Practitioner Privacy & Data Security
              </h3>
              <button 
                type="button" 
                onClick={() => setPrivacyModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6259' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '12px', color: '#4A4238', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ margin: 0 }}>
                <strong>1. Identity Protection:</strong> Your personal contact details (personal phone number and home address) are masked by PamWill's proxy call gateway. Patrons never receive your personal phone number.
              </p>
              <p style={{ margin: 0 }}>
                <strong>2. Payout Security:</strong> Bank details and UPI coordinates are encrypted at rest using AES-256 standard and communicated securely via Razorpay Payouts API.
              </p>
              <p style={{ margin: 0 }}>
                <strong>3. GPS Location Privacy:</strong> Your live GPS coordinates are only tracked when you are in "Online" status or currently assigned to an active "On the Way" session. Once "Offline", location tracking is strictly suspended.
              </p>
              <p style={{ margin: 0 }}>
                <strong>4. Medical Confidentiality:</strong> Patron therapy notes and wellness consultation logs comply with Indian digital healthcare guidelines and cannot be exported or downloaded to personal devices.
              </p>
            </div>

            <button
              onClick={() => setPrivacyModalOpen(false)}
              style={{
                marginTop: '18px',
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                backgroundColor: '#A9812F',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: SAFETY STANDARDS & CODE OF CONDUCT */}
      {/* ======================================================== */}
      {safetyModalOpen && (
        <div style={modalOverlayStyle} onClick={() => setSafetyModalOpen(false)}>
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E4DDD2',
              padding: '24px',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 16px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>
                Practitioner Safety & Code of Ethics
              </h3>
              <button 
                type="button" 
                onClick={() => setSafetyModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6259' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '12px', color: '#4A4238', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ margin: 0 }}>
                <strong>• Zero Tolerance Policy:</strong> PamWill operates a strict zero-tolerance protocol against any harassment or unprofessional behavior. If at any point you feel unsafe at a destination, you have full authority to immediately exit the premises and trigger the in-app SOS.
              </p>
              <p style={{ margin: 0 }}>
                <strong>• Hygiene & Equipment:</strong> Therapists must carry sanitized linens, single-use disposable bed sheets, organic cold-pressed massage oils, and certified essential oils at every sanctuary booking.
              </p>
              <p style={{ margin: 0 }}>
                <strong>• Dual-OTP Verification:</strong> Ensure Start OTP is verified before opening treatment kit, and End OTP is confirmed once the full ritual concludes.
              </p>
              <p style={{ margin: 0 }}>
                <strong>• Punctuality & Attire:</strong> Arrive in clean PamWill branded black/ivory medical scrubs 10 minutes prior to booking time.
              </p>
            </div>

            <button
              onClick={() => setSafetyModalOpen(false)}
              style={{
                marginTop: '18px',
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                backgroundColor: '#A9812F',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Acknowledged
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 7: PARTNER FEEDBACK & GRIEVANCE */}
      {/* ======================================================== */}
      {feedbackModalOpen && (
        <div style={modalOverlayStyle} onClick={() => setFeedbackModalOpen(false)}>
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E4DDD2',
              padding: '24px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 16px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>
                Practitioner Feedback & Grievances
              </h3>
              <button 
                type="button" 
                onClick={() => setFeedbackModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6259' }}
              >
                <X size={18} />
              </button>
            </div>

            {feedbackSubmitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={40} color="#4C6B4F" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1F1B16' }}>Feedback Received</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#6B6259' }}>
                  Thank you for helping us elevate the PamWill therapist experience. Our partner success team will review your submission within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setFeedbackSubmitted(false);
                    setFeedbackModalOpen(false);
                  }}
                  style={{
                    marginTop: '16px',
                    padding: '9px 20px',
                    borderRadius: '10px',
                    backgroundColor: '#A9812F',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#6B6259' }}>
                  Have suggestions on commission payouts, job alerts, or supply kits? Share your thoughts directly with leadership.
                </p>
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Type your feedback, suggestion, or grievance here..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #E4DDD2',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    marginBottom: '16px'
                  }}
                />
                <button
                  disabled={!feedbackText.trim()}
                  onClick={() => {
                    setFeedbackSubmitted(true);
                    setFeedbackText('');
                  }}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '10px',
                    backgroundColor: '#A9812F',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: feedbackText.trim() ? 'pointer' : 'not-allowed',
                    opacity: feedbackText.trim() ? 1 : 0.6
                  }}
                >
                  Submit Feedback
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 8: SIGN OUT CONFIRMATION */}
      {/* ======================================================== */}
      {signOutModalOpen && (
        <div style={modalOverlayStyle} onClick={() => setSignOutModalOpen(false)}>
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E4DDD2',
              padding: '28px 24px',
              maxWidth: '380px',
              width: '100%',
              boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#F9EFEF',
              color: '#8C3A2B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <LogOut size={24} color="#8C3A2B" />
            </div>

            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 800, color: '#1F1B16' }}>
              Sign Out of Practitioner Portal?
            </h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#6B6259', lineHeight: 1.5 }}>
              Your status will be set to Offline and you will stop receiving incoming job notifications until you sign back in.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setSignOutModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#F1ECE4',
                  border: 'none',
                  color: '#6B6259',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSignOut}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#8C3A2B',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Styling tokens
const menuCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #E4DDD2',
  padding: '14px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(31, 27, 22, 0.03)',
  transition: 'transform 120ms ease'
};

const iconWrapStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: '#F7EEDD',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const menuTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  color: '#1F1B16'
};

const menuSubStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#6B6259',
  marginTop: '2px',
  lineHeight: '14px'
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(6px)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px'
};

const formLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 700,
  color: '#6B6259',
  display: 'block',
  marginBottom: '4px'
};

const formInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid #E4DDD2',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box'
};

export default TherapistProfileView;
