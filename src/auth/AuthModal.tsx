import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Check, Smartphone, Mail, ArrowRight, ShieldCheck, 
  Sparkles, Lock, User, MapPin, Heart, ChevronLeft, 
  FileText, Award, Upload, Briefcase, DollarSign, Building, 
  Clock, ShieldAlert, CheckCircle2, ChevronRight, UploadCloud
} from 'lucide-react';
import { usePamwill } from '../state/store';
import { 
  authSignInWithPhone, 
  authVerifyPhoneOtp, 
  authSignInWithEmail, 
  dbSaveUserProfile,
  dbInsertTherapist 
} from '../services/supabase';
import { auth, firebaseSignInWithGoogle } from '../services/firebase';
import { UserProfile, Therapist, TherapistDocument } from '../types';
import { INDIAN_CITIES } from '../data/indianCities';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'onboarding' | 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { 
    user, 
    updateUser, 
    therapists, 
    currentTherapist,
    setCurrentTherapistId, 
    setCurrentRole, 
    registerTherapist,
    loginTherapist,
    setIsTherapistLoggedIn,
    authTargetRole,
    setAuthTargetRole,
    pendingGoogleUser
  } = usePamwill();

  const [view, setView] = useState<'onboarding' | 'login' | 'otp' | 'patron-onboarding' | 'therapist-onboarding'>('login');
  
  // Carousel slide for general onboarding
  const [currentSlide, setCurrentSlide] = useState(0);

  // Login inputs
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('9871088200');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [therapistAuthTab, setTherapistAuthTab] = useState<'signin' | 'signup'>('signup');

  // ================= PATRON ONBOARDING STATE =================
  const [patronStep, setPatronStep] = useState(1);
  const [patronName, setPatronName] = useState(user.name || '');
  const [patronGender, setPatronGender] = useState<'Female' | 'Male' | 'Other'>(user.gender || 'Female');
  const [patronAge, setPatronAge] = useState(user.age || 30);
  const [patronAddress, setPatronAddress] = useState(user.address || 'Villa 42, The Magnolias, Golf Course Road');
  const [patronCity, setPatronCity] = useState(user.city || 'Delhi NCR (Gurugram / Noida)');
  const [patronLocationType, setPatronLocationType] = useState<'Home' | 'Hotel' | 'Office'>('Home');
  const [patronConditions, setPatronConditions] = useState<string[]>(user.medicalConditions || ['Upper Back Stiffness']);
  const [patronPrefGender, setPatronPrefGender] = useState<'Female' | 'Male' | 'No Preference'>(user.preferredTherapistGender || 'Female');
  const [patronPressure, setPatronPressure] = useState<'Moderate Therapeutic' | 'Gentle Relaxation' | 'Firm Deep Tissue'>('Moderate Therapeutic');
  const [emergencyContactName, setEmergencyContactName] = useState(user.emergencyContact?.name || 'Ananya Sen');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(user.emergencyContact?.phone || '+91 98710 88201');

  // ================= THERAPIST ONBOARDING STATE =================
  const [therapistStep, setTherapistStep] = useState(1);
  const [tFullName, setTFullName] = useState('');
  const [tPhotoUrl, setTPhotoUrl] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80');
  const [tPhone, setTPhone] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tGender, setTGender] = useState<'Female' | 'Male'>('Female');
  const [tAge, setTAge] = useState<string>('');
  
  // Real Document Upload States
  const [tAadhaarNumber, setTAadhaarNumber] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [policeCertFile, setPoliceCertFile] = useState<File | null>(null);
  const [tPanNumber, setTPanNumber] = useState('');
  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const policeCertInputRef = useRef<HTMLInputElement>(null);

  // Qualifications
  const [tExperienceYears, setTExperienceYears] = useState<number | string>(5);
  const [tCertifications, setTCertifications] = useState<string[]>([
    'CIDESCO International Spa & Wellness Diploma',
    'Deep Tissue Trigger Point Specialist'
  ]);
  const [tLanguages, setTLanguages] = useState<string[]>(['English', 'Hindi']);
  // Availability
  const [tCities, setTCities] = useState<string[]>(['delhi-ncr', 'mumbai']);
  const [tWorkingHours, setTWorkingHours] = useState('08:00 AM - 08:30 PM');
  // Banking
  const [tBankName, setTBankName] = useState('');
  const [tBankAccount, setTBankAccount] = useState('');
  const [tIfsc, setTIfsc] = useState('');
  const [tUpiId, setTUpiId] = useState('');

  // Sync initialMode and values whenever modal opens or role changes
  useEffect(() => {
    if (!isOpen) return;

    if (initialMode === 'onboarding') {
      setView('onboarding');
    } else if (initialMode === 'register') {
      if (authTargetRole === 'therapist') {
        setView('therapist-onboarding');
      } else {
        setView('patron-onboarding');
      }
    } else {
      setView('login');
    }

    // Refresh therapist form state:
    // If registering / starting onboarding, fetch Google account email & clear all fake demo data!
    if (authTargetRole === 'therapist' && (initialMode === 'register' || view === 'therapist-onboarding')) {
      const gUser = pendingGoogleUser || (auth.currentUser ? {
        email: auth.currentUser.email || '',
        name: auth.currentUser.displayName || '',
        photoUrl: auth.currentUser.photoURL || ''
      } : null);

      setTFullName(gUser?.name || '');
      setTEmail(gUser?.email || '');
      if (gUser?.photoUrl) setTPhotoUrl(gUser.photoUrl);
      setTPhone('');
      setTAge('');
      setTAadhaarNumber('');
      setAadhaarFile(null);
      setPoliceCertFile(null);
      setTPanNumber('');
      setTBankName('');
      setTBankAccount('');
      setTIfsc('');
      setTUpiId('');
      setTherapistStep(1);
    } else if (authTargetRole === 'therapist' && currentTherapist && initialMode !== 'register') {
      // ONLY load currentTherapist if intentionally editing active practitioner
      if (currentTherapist.fullName) setTFullName(currentTherapist.fullName);
      if (currentTherapist.email) setTEmail(currentTherapist.email);
      if (currentTherapist.phone) setTPhone(currentTherapist.phone);
      if (currentTherapist.photoUrl) setTPhotoUrl(currentTherapist.photoUrl);
      if (currentTherapist.experienceYears) setTExperienceYears(currentTherapist.experienceYears);
      if (currentTherapist.certifications?.length) setTCertifications(currentTherapist.certifications);
      if (currentTherapist.languages?.length) setTLanguages(currentTherapist.languages);
      if (currentTherapist.availableCities?.length) setTCities(currentTherapist.availableCities);
      if (currentTherapist.aadhaarNumber) setTAadhaarNumber(currentTherapist.aadhaarNumber);
      if (currentTherapist.panNumber) setTPanNumber(currentTherapist.panNumber);
      if (currentTherapist.upiId) setTUpiId(currentTherapist.upiId);
    }

    // Refresh patron form state if editing current user
    if (user) {
      if (user.name) setPatronName(user.name);
      if (user.address) setPatronAddress(user.address);
      if (user.city) setPatronCity(user.city);
      if (user.medicalConditions) setPatronConditions(user.medicalConditions);
      if (user.emergencyContact?.name) setEmergencyContactName(user.emergencyContact.name);
      if (user.emergencyContact?.phone) setEmergencyContactPhone(user.emergencyContact.phone);
    }
  }, [isOpen, initialMode, authTargetRole, pendingGoogleUser, currentTherapist?.id, user.name]);

  // Countdown timer for OTP
  useEffect(() => {
    if (view === 'otp' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [view, countdown]);

  if (!isOpen) return null;

  const slides = [
    {
      title: "Master Practitioners at Your Doorstep",
      desc: "100% police-verified and CIDESCO-certified therapists bringing hospital-grade linens and organic oils.",
      img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Real-Time GPS Tracking & Safety SOS",
      desc: "Watch your specialist approach with live ETA, route maps, and instantaneous emergency alert dispatch.",
      img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Seamless & Transparent Payments",
      desc: "Experience frictionless checkouts powered by Razorpay, UPI, RuPay, and Sovereign Membership credits.",
      img: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80"
    }
  ];

  // ================= GOOGLE LOGIN HANDLER =================
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { user: fbUser, error } = await firebaseSignInWithGoogle();
      
      if (fbUser) {
        if (authTargetRole === 'therapist') {
          // Check if therapist exists
          const existingT = therapists.find(t => 
            (fbUser.email && t.email.toLowerCase() === fbUser.email.toLowerCase()) ||
            (fbUser.phoneNumber && t.phone.includes(fbUser.phoneNumber))
          );

          if (existingT) {
            loginTherapist(existingT.id);
            setIsLoading(false);
            onClose();
            return;
          } else {
            // Pre-fill and launch therapist onboarding
            setTFullName(fbUser.displayName || '');
            setTEmail(fbUser.email || '');
            setTPhotoUrl(fbUser.photoURL || tPhotoUrl);
            setTPhone(fbUser.phoneNumber || '');
            setView('therapist-onboarding');
            setIsLoading(false);
            return;
          }
        } else {
          // Patron Login
          const updated = {
            name: fbUser.displayName || user.name,
            email: fbUser.email || user.email,
            phone: fbUser.phoneNumber || user.phone,
            avatarUrl: fbUser.photoURL || undefined,
            isAuthenticated: true
          };
          updateUser(updated);
          await dbSaveUserProfile({ ...user, ...updated });
          setIsLoading(false);
          onClose();
          return;
        }
      }

      if (error) {
        if (authTargetRole === 'therapist') {
          setIsLoading(false);
          if (therapistAuthTab === 'signin') {
            setErrorMessage(error.message || 'Google sign-in was cancelled or failed.');
            return;
          } else {
            const currentFbUser = auth.currentUser;
            setTFullName(currentFbUser?.displayName || '');
            setTEmail(currentFbUser?.email || '');
            setView('therapist-onboarding');
            return;
          }
        }
        setErrorMessage(error.message || 'Google sign-in failed. Please try again.');
      }
    } catch (err: any) {
      if (authTargetRole === 'therapist') {
        setIsLoading(false);
        if (therapistAuthTab === 'signin') {
          setErrorMessage(err?.message || 'Google sign-in error.');
          return;
        } else {
          const currentFbUser = auth.currentUser;
          setTFullName(currentFbUser?.displayName || '');
          setTEmail(currentFbUser?.email || '');
          setView('therapist-onboarding');
          return;
        }
      }
      setErrorMessage(err?.message || 'Error communicating with Google authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  // ================= PHONE OTP =================
  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);

    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
    await authSignInWithPhone(formattedPhone);

    setIsLoading(false);
    setView('otp');
    setCountdown(45);
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code");
      return;
    }

    setIsLoading(true);
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
    await authVerifyPhoneOtp(formattedPhone, fullOtp);

    setTimeout(() => {
      setIsLoading(false);
      if (authTargetRole === 'therapist') {
        const existingT = therapists.find(t => t.phone.includes(phone));
        if (existingT) {
          loginTherapist(existingT.id);
          onClose();
        } else {
          setTPhone(formattedPhone);
          setView('therapist-onboarding');
        }
      } else {
        updateUser({
          phone: formattedPhone,
          isAuthenticated: true
        });
        onClose();
      }
    }, 700);
  };

  // ================= EMAIL AUTH =================
  const handleEmailAuth = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);

    if (password) {
      await authSignInWithEmail(email, password);
    } else {
      await authSignInWithEmail(email);
    }

    setTimeout(() => {
      setIsLoading(false);
      if (authTargetRole === 'therapist') {
        const existingT = therapists.find(t => t.email.toLowerCase() === email.toLowerCase());
        if (existingT) {
          loginTherapist(existingT.id);
          onClose();
        } else {
          setTEmail(email);
          setView('therapist-onboarding');
        }
      } else {
        updateUser({
          email,
          name: email.split('@')[0],
          isAuthenticated: true
        });
        onClose();
      }
    }, 800);
  };

  // ================= COMPLETE PATRON ONBOARDING =================
  const handleCompletePatronOnboarding = async () => {
    setIsLoading(true);
    const updatedProfile: UserProfile = {
      ...user,
      name: patronName,
      gender: patronGender,
      age: Number(patronAge),
      address: patronAddress,
      city: patronCity,
      medicalConditions: patronConditions,
      preferredTherapistGender: patronPrefGender,
      emergencyContact: {
        name: emergencyContactName,
        phone: emergencyContactPhone,
        relationship: 'Family Contact'
      },
      savedAddresses: [
        {
          id: 'addr-primary',
          label: patronLocationType,
          address: patronAddress,
          city: patronCity
        }
      ],
      isAuthenticated: true
    };

    updateUser(updatedProfile);
    await dbSaveUserProfile(updatedProfile);
    setIsLoading(false);
    onClose();
  };

  // ================= COMPLETE THERAPIST ONBOARDING =================
  const handleCompleteTherapistOnboarding = async () => {
    setIsLoading(true);
    const newId = `ther-${Date.now()}`;

    const newTherapist: Therapist = {
      id: newId,
      fullName: tFullName,
      photoUrl: tPhotoUrl,
      phone: tPhone.startsWith('+91') ? tPhone : `+91 ${tPhone}`,
      email: tEmail,
      status: 'Under Review',
      gender: tGender,
      rating: 5.0,
      reviewCount: 0,
      completedJobs: 0,
      experienceYears: Number(tExperienceYears) || 5,
      languages: tLanguages,
      availableCities: tCities,
      workingHours: tWorkingHours || '08:00 AM - 08:30 PM',
      isOnline: false,
      walletBalance: 0,
      bankAccount: tBankName && tBankAccount ? `${tBankName} •••• ${tBankAccount.slice(-4)}` : 'Direct Deposit (In Setup)',
      upiId: tUpiId,
      certifications: tCertifications,
      aadhaarNumber: tAadhaarNumber,
      panNumber: tPanNumber,
      documents: [
        {
          id: `doc-${newId}-1`,
          title: aadhaarFile ? `Aadhaar Card (${aadhaarFile.name})` : 'Aadhaar Card Front & Back',
          type: 'aadhaar',
          url: aadhaarFile ? URL.createObjectURL(aadhaarFile) : `/therapist_resources/aadhaar/${newId}_aadhaar.png`,
          verificationStatus: 'pending'
        },
        {
          id: `doc-${newId}-2`,
          title: policeCertFile ? `Police Clearance (${policeCertFile.name})` : 'State Police Verification Certificate',
          type: 'police',
          url: policeCertFile ? URL.createObjectURL(policeCertFile) : `/therapist_resources/police_clearance/${newId}_police_clearance.png`,
          verificationStatus: 'pending'
        }
      ]
    };

    // Insert into Supabase
    await dbInsertTherapist(newTherapist);
    registerTherapist(newTherapist);
    setCurrentTherapistId(newId);
    setIsTherapistLoggedIn(true);
    setCurrentRole('therapist');

    setIsLoading(false);
    onClose();
  };

  const handleOtpChange = (val: string, index: number) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(18, 16, 14, 0.78)',
      backdropFilter: 'blur(14px)',
      zIndex: 2200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        width: '100%',
        maxWidth: '430px',
        maxHeight: '92vh',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-phone)',
        border: '1px solid var(--border-hairline)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        
        {/* Modal Top Bar */}
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {view !== 'login' && view !== 'onboarding' && (
              <button 
                onClick={() => setView('login')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
              >
                <ChevronLeft size={20} color="var(--text-primary)" />
              </button>
            )}
            <img src="/assets/pamwill-icon.png" alt="PamWill" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
            <div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 600 }}>
                PamWill Access
              </span>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--accent-gold-hover)', marginLeft: '6px' }}>
                {authTargetRole === 'therapist' ? 'PRACTITIONER' : 'PATRON'}
              </span>
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

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

          {/* ================= LOGIN VIEW ================= */}
          {view === 'login' && (
            <div>
              {/* Role Toggle Strip */}
              <div style={{
                display: 'flex',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-pill)',
                padding: '4px',
                marginBottom: '18px'
              }}>
                <button
                  onClick={() => setAuthTargetRole('client')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    backgroundColor: authTargetRole === 'client' ? 'var(--bg-surface)' : 'transparent',
                    color: authTargetRole === 'client' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: authTargetRole === 'client' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 150ms ease'
                  }}
                >
                  <User size={13} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                  Patron / Client
                </button>
                <button
                  onClick={() => setAuthTargetRole('therapist')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    backgroundColor: authTargetRole === 'therapist' ? 'var(--bg-surface)' : 'transparent',
                    color: authTargetRole === 'therapist' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: authTargetRole === 'therapist' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 150ms ease'
                  }}
                >
                  <Briefcase size={13} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                  Therapist Specialist
                </button>
              </div>

              {/* Title & Description */}
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <span className="eyebrow">
                  {authTargetRole === 'therapist' ? 'Verified Practitioner Portal' : 'Welcome to Sanctuary'}
                </span>
                <h2 style={{ fontSize: '20px', margin: '4px 0' }}>
                  {authTargetRole === 'therapist'
                    ? (therapistAuthTab === 'signin' ? 'Practitioner Sign In' : 'Practitioner Sign Up')
                    : 'Enter PamWill'}
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {authTargetRole === 'therapist'
                    ? (therapistAuthTab === 'signin'
                        ? 'Sign in with your Google account to access your practitioner dashboard.'
                        : 'Sign up with Google first, then start the 5-step verification onboarding.')
                    : 'Sign in to manage appointments, live tracking sessions, and sovereign membership credits.'}
                </p>
              </div>

              {authTargetRole === 'therapist' ? (
                /* ================= THERAPIST EXCLUSIVE GOOGLE FLOW ================= */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Therapist 2-Way Tab Switcher */}
                  <div style={{
                    display: 'flex',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '3px',
                    maxWidth: '240px',
                    margin: '0 auto 6px auto',
                    border: '1px solid var(--border-hairline)'
                  }}>
                    <button
                      onClick={() => setTherapistAuthTab('signin')}
                      style={{
                        flex: 1,
                        padding: '7px 14px',
                        borderRadius: 'var(--radius-pill)',
                        border: 'none',
                        backgroundColor: therapistAuthTab === 'signin' ? 'var(--bg-surface)' : 'transparent',
                        color: therapistAuthTab === 'signin' ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: therapistAuthTab === 'signin' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 150ms ease'
                      }}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setTherapistAuthTab('signup')}
                      style={{
                        flex: 1,
                        padding: '7px 14px',
                        borderRadius: 'var(--radius-pill)',
                        border: 'none',
                        backgroundColor: therapistAuthTab === 'signup' ? 'var(--bg-surface)' : 'transparent',
                        color: therapistAuthTab === 'signup' ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: therapistAuthTab === 'signup' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 150ms ease'
                      }}
                    >
                      Sign Up
                    </button>
                  </div>

                  {errorMessage && (
                    <div style={{ padding: '8px 12px', backgroundColor: 'var(--status-error-bg)', color: 'var(--status-error)', borderRadius: 'var(--radius-sm)', fontSize: '11px', textAlign: 'center' }}>
                      {errorMessage}
                    </div>
                  )}

                  {/* Google Action Button */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid #e0dbd3',
                      backgroundColor: '#ffffff',
                      color: '#1F1B16',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>
                      {isLoading
                        ? 'Connecting to Google...'
                        : therapistAuthTab === 'signin'
                          ? 'Sign In with Google'
                          : 'Sign Up with Google & Start Onboarding →'}
                    </span>
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    {therapistAuthTab === 'signin' ? (
                      <button
                        onClick={() => setTherapistAuthTab('signup')}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-gold-hover)', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        New practitioner? Switch to Sign Up & Onboarding →
                      </button>
                    ) : (
                      <button
                        onClick={() => setTherapistAuthTab('signin')}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 500, cursor: 'pointer' }}
                      >
                        Already registered? <span style={{ color: 'var(--accent-gold-hover)', fontWeight: 600 }}>Sign In →</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* ================= PATRON CLIENT AUTH OPTIONS ================= */
                <div>
                  {/* Google Sign-In with Firebase */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      boxShadow: 'var(--shadow-sm)',
                      marginBottom: '12px'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Apple ID */}
                  <button
                    onClick={() => {
                      updateUser({ name: "Apple Patron", email: "patron@appleid.com", isAuthenticated: true });
                      onClose();
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      backgroundColor: '#000000',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      marginBottom: '16px'
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 170 170" fill="#fff">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.41-9.79-11.48-20.73-15.19-32.81-3.71-12.08-5.57-23.76-5.57-35.03 0-14.28 3.59-26.47 10.77-36.56 7.18-10.09 16.32-15.25 27.42-15.49 4.35 0 9.28 1.16 14.78 3.48 5.51 2.33 9.49 3.59 11.96 3.8 2.08-.21 6.18-1.53 12.31-3.95 6.13-2.43 11.2-3.48 15.22-3.17 11.33.85 20.35 4.97 27.06 12.38-9.91 5.92-14.78 14.18-14.61 24.77.17 8.35 3.38 15.35 9.63 21 6.25 5.66 13.79 8.89 22.61 9.69-2.22 6.84-4.89 13.77-8.01 20.79zM119.22 31.81c0-7.09 2.53-13.88 7.58-20.36 5.05-6.49 11.38-10.63 18.99-12.45.21 1.27.32 2.43.32 3.49 0 7.08-2.6 13.97-7.79 20.67-5.18 6.7-11.45 10.74-18.78 12.13-.1-.95-.32-2.1-.32-3.48z"/>
                    </svg>
                    <span>Continue with Apple</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-hairline)' }} />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Or continue with phone / email
                    </span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-hairline)' }} />
                  </div>

                  {/* Login Method Toggle */}
                  <div style={{
                    display: 'flex',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '3px',
                    marginBottom: '12px'
                  }}>
                    <button
                      onClick={() => setLoginMethod('phone')}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: 'var(--radius-pill)',
                        border: 'none',
                        backgroundColor: loginMethod === 'phone' ? 'var(--bg-surface)' : 'transparent',
                        color: loginMethod === 'phone' ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Smartphone size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Mobile OTP
                    </button>
                    <button
                      onClick={() => setLoginMethod('email')}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: 'var(--radius-pill)',
                        border: 'none',
                        backgroundColor: loginMethod === 'email' ? 'var(--bg-surface)' : 'transparent',
                        color: loginMethod === 'email' ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Mail size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Email Login
                    </button>
                  </div>

                  {errorMessage && (
                    <div style={{ padding: '8px 12px', backgroundColor: 'var(--status-error-bg)', color: 'var(--status-error)', borderRadius: 'var(--radius-sm)', fontSize: '11px', marginBottom: '12px' }}>
                      {errorMessage}
                    </div>
                  )}

                  {/* Phone OTP */}
                  {loginMethod === 'phone' ? (
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--border-hairline)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-surface)',
                        overflow: 'hidden',
                        marginBottom: '14px'
                      }}>
                        <span style={{ padding: '12px 14px', backgroundColor: 'var(--bg-secondary)', fontSize: '13px', fontWeight: 600, borderRight: '1px solid var(--border-hairline)' }}>
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          placeholder="Enter 10-digit mobile number"
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            outline: 'none',
                            fontSize: '14px',
                            backgroundColor: 'transparent'
                          }}
                        />
                      </div>

                      <button
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className="btn-gold"
                        style={{ width: '100%', padding: '13px', fontSize: '14px' }}
                      >
                        {isLoading ? 'Sending SMS Code...' : 'Get Verification Code →'}
                      </button>
                    </div>
                  ) : (
                    /* Email */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input
                        type="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-hairline)',
                          outline: 'none',
                          fontSize: '13px'
                        }}
                      />
                      <input
                        type="password"
                        placeholder="Password (leave blank for magic link)"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-hairline)',
                          outline: 'none',
                          fontSize: '13px'
                        }}
                      />
                      <button
                        onClick={handleEmailAuth}
                        disabled={isLoading}
                        className="btn-gold"
                        style={{ width: '100%', padding: '13px', fontSize: '14px', marginTop: '4px' }}
                      >
                        {isLoading ? 'Authenticating...' : 'Sign In with Email →'}
                      </button>
                    </div>
                  )}

                  {/* Patron Onboarding Prompt */}
                  <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-hairline)', textAlign: 'center' }}>
                    <button
                      onClick={() => setView('patron-onboarding')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-gold-hover)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      New Patron? Complete Sanctuary Profile Onboarding →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= OTP VERIFICATION ================= */}
          {view === 'otp' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span className="eyebrow">Security Verification</span>
                <h2 style={{ fontSize: '20px', margin: '4px 0' }}>Enter 6-Digit Code</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Sent via SMS to <strong>+91 {phone}</strong>.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    style={{
                      width: '44px',
                      height: '50px',
                      textAlign: 'center',
                      fontSize: '18px',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-sm)',
                      border: digit ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                      backgroundColor: 'var(--bg-surface)',
                      outline: 'none'
                    }}
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="btn-gold"
                style={{ width: '100%', padding: '13px', fontSize: '14px', marginBottom: '14px' }}
              >
                {isLoading ? 'Verifying OTP...' : 'Verify & Enter Sanctuary ✓'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                {countdown > 0 ? (
                  <span>Resend code in <strong>00:{countdown < 10 ? `0${countdown}` : countdown}</strong></span>
                ) : (
                  <button
                    onClick={handleSendOtp}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Resend SMS Code
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ================= PATRON 3-STEP ONBOARDING ================= */}
          {view === 'patron-onboarding' && (
            <div>
              {/* Progress Tracker */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="eyebrow" style={{ color: 'var(--accent-gold)' }}>
                    Step {patronStep} of 3: {patronStep === 1 ? 'Identity' : patronStep === 2 ? 'Sanctuary Address' : 'Wellness & SOS Safety'}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>{Math.round((patronStep / 3) * 100)}%</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
                  {[1, 2, 3].map(s => (
                    <div key={s} style={{
                      flex: 1,
                      borderRadius: '2px',
                      backgroundColor: s <= patronStep ? 'var(--accent-gold)' : 'var(--border-hairline)'
                    }} />
                  ))}
                </div>
              </div>

              {/* Step 1: Personal Profile */}
              {patronStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '18px', margin: 0, fontFamily: 'var(--font-serif)' }}>Patron Identity</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    Our certified therapists greet you by name and tailor essential botanicals.
                  </p>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      value={patronName}
                      onChange={e => setPatronName(e.target.value)}
                      placeholder="e.g. Souvik Sen"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        GENDER
                      </label>
                      <select
                        value={patronGender}
                        onChange={e => setPatronGender(e.target.value as any)}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        AGE
                      </label>
                      <input
                        type="number"
                        value={patronAge}
                        onChange={e => setPatronAge(Number(e.target.value))}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setPatronStep(2)}
                    className="btn-gold"
                    style={{ width: '100%', padding: '12px', marginTop: '10px' }}
                  >
                    Next: Sanctuary Destination →
                  </button>
                </div>
              )}

              {/* Step 2: Sanctuary Destination */}
              {patronStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '18px', margin: 0, fontFamily: 'var(--font-serif)' }}>Primary Sanctuary Location</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    Where should our specialists arrive with the treatment table and organic oils?
                  </p>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      PRIMARY METRO CITY
                    </label>
                    <select
                      value={patronCity}
                      onChange={e => setPatronCity(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                    >
                      {INDIAN_CITIES.map(c => (
                        <option key={c.id} value={c.name}>{c.name} ({c.state})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      LOCATION TYPE
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      {(['Home', 'Hotel', 'Office'] as const).map(lt => (
                        <button
                          key={lt}
                          onClick={() => setPatronLocationType(lt)}
                          style={{
                            padding: '8px',
                            borderRadius: 'var(--radius-sm)',
                            border: patronLocationType === lt ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                            backgroundColor: patronLocationType === lt ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                            fontWeight: 600,
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          {lt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      STREET ADDRESS / VILLA / RESIDENCE
                    </label>
                    <textarea
                      rows={2}
                      value={patronAddress}
                      onChange={e => setPatronAddress(e.target.value)}
                      placeholder="Villa / Flat number, building name, landmark..."
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button onClick={() => setPatronStep(1)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                      ← Back
                    </button>
                    <button onClick={() => setPatronStep(3)} className="btn-gold" style={{ flex: 2, padding: '10px' }}>
                      Next: Health & SOS Safety →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Health & SOS Safety */}
              {patronStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '18px', margin: 0, fontFamily: 'var(--font-serif)' }}>Wellness & Safety Preferences</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    Configure pressure gradients, sensitive muscle zones, and your 24/7 SOS safety contact.
                  </p>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      TARGET HEALTH ZONES & SENSITIVITIES
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {['Lower Back Tension', 'Neck & Shoulders', 'Sciatica Relief', 'Migraines', 'Sports Strain', 'Sensitive Skin'].map(cond => {
                        const selected = patronConditions.includes(cond);
                        return (
                          <button
                            key={cond}
                            onClick={() => {
                              if (selected) setPatronConditions(patronConditions.filter(c => c !== cond));
                              else setPatronConditions([...patronConditions, cond]);
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-pill)',
                              border: selected ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                              backgroundColor: selected ? 'var(--accent-gold-light)' : 'var(--bg-secondary)',
                              color: selected ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {selected ? '✓ ' : '+ '}{cond}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      PREFERRED THERAPIST GENDER
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      {(['Female', 'Male', 'No Preference'] as const).map(g => (
                        <button
                          key={g}
                          onClick={() => setPatronPrefGender(g)}
                          style={{
                            padding: '8px 4px',
                            borderRadius: 'var(--radius-sm)',
                            border: patronPrefGender === g ? '2px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                            backgroundColor: patronPrefGender === g ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-hairline)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <ShieldAlert size={15} color="var(--status-error)" />
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>Emergency Contact (24/7 SOS)</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Contact Name"
                        value={emergencyContactName}
                        onChange={e => setEmergencyContactName(e.target.value)}
                        style={{ padding: '8px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border-hairline)' }}
                      />
                      <input
                        type="tel"
                        placeholder="Mobile (+91)"
                        value={emergencyContactPhone}
                        onChange={e => setEmergencyContactPhone(e.target.value)}
                        style={{ padding: '8px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border-hairline)' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button onClick={() => setPatronStep(2)} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>
                      ← Back
                    </button>
                    <button
                      onClick={handleCompletePatronOnboarding}
                      disabled={isLoading}
                      className="btn-gold"
                      style={{ flex: 2, padding: '12px' }}
                    >
                      {isLoading ? 'Saving Sanctuary Profile...' : 'Complete & Enter Sanctuary ✓'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= THERAPIST 5-STEP ONBOARDING ================= */}
          {view === 'therapist-onboarding' && (
            <div>
              {/* Progress Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="eyebrow" style={{ color: 'var(--accent-gold)' }}>
                    Step {therapistStep} of 5: {
                      therapistStep === 1 ? 'Personal Identity' :
                      therapistStep === 2 ? 'Government & Police Clearance' :
                      therapistStep === 3 ? 'Certifications & Skills' :
                      therapistStep === 4 ? 'Metros & Timings' : 'Direct Payout Banking'
                    }
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>{therapistStep * 20}%</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <div key={s} style={{
                      flex: 1,
                      borderRadius: '2px',
                      backgroundColor: s <= therapistStep ? 'var(--accent-gold)' : 'var(--border-hairline)'
                    }} />
                  ))}
                </div>
              </div>

              {/* STEP 1: Personal Details */}
              {therapistStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: '18px', margin: 0, fontFamily: 'var(--font-serif)' }}>Practitioner Identity</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    Enter your official legal details matching your government identity documents.
                  </p>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      LEGAL FULL NAME
                    </label>
                    <input
                      type="text"
                      value={tFullName}
                      onChange={e => setTFullName(e.target.value)}
                      placeholder="As printed on Aadhaar card"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        GENDER
                      </label>
                      <select
                        value={tGender}
                        onChange={e => setTGender(e.target.value as any)}
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                        AGE
                      </label>
                      <input
                        type="number"
                        value={tAge}
                        onChange={e => setTAge(e.target.value)}
                        placeholder="e.g. 29"
                        style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      PHONE NUMBER (+91)
                    </label>
                    <input
                      type="tel"
                      value={tPhone}
                      onChange={e => setTPhone(e.target.value)}
                      placeholder="+91 98XXXXXXXX"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                        EMAIL ADDRESS
                      </label>
                      {tEmail && (
                        <span style={{ 
                          fontSize: '10px', 
                          fontWeight: 600, 
                          color: 'var(--status-success)', 
                          backgroundColor: 'var(--status-success-bg)', 
                          padding: '1px 6px', 
                          borderRadius: 'var(--radius-pill)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          <CheckCircle2 size={10} /> Google Account
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      value={tEmail}
                      onChange={e => setTEmail(e.target.value)}
                      placeholder="practitioner@pamwill.in"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!tFullName.trim()) { setErrorMessage("Please enter your legal full name matching your government ID"); return; }
                      if (!tEmail.trim()) { setErrorMessage("Please enter or verify your email address"); return; }
                      setErrorMessage(null);
                      setTherapistStep(2);
                    }}
                    className="btn-gold"
                    style={{ width: '100%', padding: '12px', marginTop: '8px' }}
                  >
                    Next: Government & Police Clearance →
                  </button>
                </div>
              )}

              {/* STEP 2: Government Legal & Police Clearance */}
              {therapistStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '18px', margin: 0, fontFamily: 'var(--font-serif)' }}>Legal & Police Clearance</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    100% of PamWill therapists are verified by State Police and UIDAI biometric records.
                  </p>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      AADHAAR NUMBER (12 DIGITS)
                    </label>
                    <input
                      type="text"
                      value={tAadhaarNumber}
                      onChange={e => setTAadhaarNumber(e.target.value)}
                      placeholder="e.g. 4892 1029 4819"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                    />
                  </div>

                  {/* Hidden Real File Pickers */}
                  <input
                    type="file"
                    ref={aadhaarInputRef}
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }}
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setAadhaarFile(e.target.files[0]);
                      }
                    }}
                  />

                  <input
                    type="file"
                    ref={policeCertInputRef}
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }}
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setPoliceCertFile(e.target.files[0]);
                      }
                    }}
                  />

                  {/* Interactive Aadhaar Upload Zone */}
                  <div 
                    onClick={() => aadhaarInputRef.current?.click()}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: aadhaarFile ? '1.5px solid var(--status-success)' : '1.5px dashed var(--accent-gold)',
                      backgroundColor: aadhaarFile ? 'var(--status-success-bg)' : 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={20} color={aadhaarFile ? "var(--status-success)" : "var(--accent-gold)"} />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {aadhaarFile ? aadhaarFile.name : "Aadhaar Card (Front & Back)"}
                        </div>
                        <div style={{ fontSize: '10px', color: aadhaarFile ? 'var(--status-success)' : 'var(--text-muted)' }}>
                          {aadhaarFile 
                            ? `File attached (${(aadhaarFile.size / 1024).toFixed(0)} KB) ✓ Click to change` 
                            : "Click to upload original Aadhaar (PDF / JPG)"}
                        </div>
                      </div>
                    </div>
                    <span style={{ 
                      fontSize: '11px', 
                      color: aadhaarFile ? 'var(--status-success)' : 'var(--accent-gold)', 
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: aadhaarFile ? '#fff' : 'rgba(169, 129, 47, 0.1)'
                    }}>
                      {aadhaarFile ? 'Uploaded ✓' : '+ Upload File'}
                    </span>
                  </div>

                  {/* Interactive Police Clearance Upload Zone */}
                  <div 
                    onClick={() => policeCertInputRef.current?.click()}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: policeCertFile ? '1.5px solid var(--status-success)' : '1.5px dashed var(--accent-gold)',
                      backgroundColor: policeCertFile ? 'var(--status-success-bg)' : 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ShieldCheck size={20} color={policeCertFile ? "var(--status-success)" : "var(--accent-gold)"} />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {policeCertFile ? policeCertFile.name : "Police Character Clearance Certificate"}
                        </div>
                        <div style={{ fontSize: '10px', color: policeCertFile ? 'var(--status-success)' : 'var(--text-muted)' }}>
                          {policeCertFile 
                            ? `File attached (${(policeCertFile.size / 1024).toFixed(0)} KB) ✓ Click to change` 
                            : "Click to upload State Police record (PDF / JPG)"}
                        </div>
                      </div>
                    </div>
                    <span style={{ 
                      fontSize: '11px', 
                      color: policeCertFile ? 'var(--status-success)' : 'var(--accent-gold)', 
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: policeCertFile ? '#fff' : 'rgba(169, 129, 47, 0.1)'
                    }}>
                      {policeCertFile ? 'Uploaded ✓' : '+ Upload File'}
                    </span>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      PAN CARD NUMBER (TAX COMPLIANCE)
                    </label>
                    <input
                      type="text"
                      value={tPanNumber}
                      onChange={e => setTPanNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. ABCDE1234F"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button onClick={() => setTherapistStep(1)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                      ← Back
                    </button>
                    <button onClick={() => setTherapistStep(3)} className="btn-gold" style={{ flex: 2, padding: '10px' }}>
                      Next: Certifications & Skills →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Certifications & Skills */}
              {therapistStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '18px', margin: 0, fontFamily: 'var(--font-serif)' }}>Certifications & Experience</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    Highlight diplomas, hospital credentials, and international spa certificates.
                  </p>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      YEARS OF EXPERIENCE
                    </label>
                    <input
                      type="number"
                      value={tExperienceYears}
                      onChange={e => setTExperienceYears(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      CERTIFICATIONS ON FILE
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        'CIDESCO International Spa Diploma',
                        'National Academy of Sports Medicine (NASM) Bodywork',
                        'Ayurvedic Panchakarma & Abhyanga Institute',
                        'Thai Yoga Traditional Therapy'
                      ].map(cert => {
                        const selected = tCertifications.includes(cert);
                        return (
                          <button
                            key={cert}
                            onClick={() => {
                              if (selected) setTCertifications(tCertifications.filter(c => c !== cert));
                              else setTCertifications([...tCertifications, cert]);
                            }}
                            style={{
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                              border: selected ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                              backgroundColor: selected ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                              color: selected ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
                              fontSize: '12px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span>{cert}</span>
                            {selected && <Check size={14} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button onClick={() => setTherapistStep(2)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                      ← Back
                    </button>
                    <button onClick={() => setTherapistStep(4)} className="btn-gold" style={{ flex: 2, padding: '10px' }}>
                      Next: Metros & Hours →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Operating Metros & Working Hours */}
              {therapistStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '18px', margin: 0, fontFamily: 'var(--font-serif)' }}>Service Coverage</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    Select the Indian cities where you are available for private mobile house calls.
                  </p>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      ACTIVE METROS
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                      {INDIAN_CITIES.slice(0, 8).map(city => {
                        const selected = tCities.includes(city.id);
                        return (
                          <button
                            key={city.id}
                            onClick={() => {
                              if (selected) setTCities(tCities.filter(c => c !== city.id));
                              else setTCities([...tCities, city.id]);
                            }}
                            style={{
                              padding: '8px 10px',
                              borderRadius: 'var(--radius-sm)',
                              border: selected ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-hairline)',
                              backgroundColor: selected ? 'var(--accent-gold-light)' : 'var(--bg-surface)',
                              color: selected ? 'var(--accent-gold-hover)' : 'var(--text-secondary)',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            {selected ? '✓ ' : '+ '}{city.name.split(' ')[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      DAILY OPERATING TIMINGS
                    </label>
                    <input
                      type="text"
                      value={tWorkingHours}
                      onChange={e => setTWorkingHours(e.target.value)}
                      placeholder="e.g. 08:00 AM - 08:30 PM"
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button onClick={() => setTherapistStep(3)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                      ← Back
                    </button>
                    <button onClick={() => setTherapistStep(5)} className="btn-gold" style={{ flex: 2, padding: '10px' }}>
                      Next: Direct Payout Banking →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Direct Payout Banking */}
              {therapistStep === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '18px', margin: 0, fontFamily: 'var(--font-serif)' }}>Payout & Direct Deposits</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    Earnings are credited daily via NEFT / IMPS and instant UPI settlement.
                  </p>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      BANK NAME
                    </label>
                    <input
                      type="text"
                      value={tBankName}
                      onChange={e => setTBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank / ICICI Bank"
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      ACCOUNT NUMBER
                    </label>
                    <input
                      type="text"
                      value={tBankAccount}
                      onChange={e => setTBankAccount(e.target.value)}
                      placeholder="Enter account number"
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      IFSC CODE
                    </label>
                    <input
                      type="text"
                      value={tIfsc}
                      onChange={e => setTIfsc(e.target.value.toUpperCase())}
                      placeholder="e.g. HDFC0001092"
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      UPI ID FOR INSTANT WITHDRAWAL
                    </label>
                    <input
                      type="text"
                      value={tUpiId}
                      onChange={e => setTUpiId(e.target.value)}
                      placeholder="practitioner@okhdfcbank"
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)', fontSize: '13px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button onClick={() => setTherapistStep(4)} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>
                      ← Back
                    </button>
                    <button
                      onClick={handleCompleteTherapistOnboarding}
                      disabled={isLoading}
                      className="btn-gold"
                      style={{ flex: 2, padding: '12px' }}
                    >
                      {isLoading ? 'Submitting Application...' : 'Submit for Verification ✓'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
