import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Booking, 
  BookingStatus, 
  Therapist, 
  UserProfile, 
  MassageService, 
  BookingReview,
  PayoutRequest,
  TrainingApplication,
  ApplicationStatus
} from '../types';
import { MASSAGE_SERVICES } from '../data/services';
import { INITIAL_THERAPISTS, INITIAL_USER, INITIAL_BOOKINGS, INITIAL_TRAINING_APPLICATIONS } from '../data/mockData';
import { 
  dbFetchServices, 
  dbUpsertService, 
  dbDeleteService,
  dbFetchTherapists, 
  dbUpdateTherapist, 
  dbFetchBookings, 
  dbInsertBooking, 
  dbUpdateBooking,
  dbFetchPayoutRequests,
  dbInsertPayoutRequest,
  dbUpdatePayoutRequest,
  dbFetchTrainingApplications,
  dbInsertTrainingApplication,
  dbUpdateTrainingApplicationStatus,
  subscribeToRealtimeUpdates 
} from '../services/supabase';
import { onFirebaseAuthStateChange, firebaseSignOutUser } from '../services/firebase';

export type PlatformRole = 'home' | 'client' | 'therapist' | 'admin';

interface PamwillContextType {
  // Navigation & Shell State
  currentRole: PlatformRole;
  setCurrentRole: (role: PlatformRole) => void;
  deviceFrame: 'phone' | 'full';
  setDeviceFrame: (frame: 'phone' | 'full') => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;

  // Supabase Sync Status
  isSupabaseConnected: boolean;

  // Client State
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  activeClientTab: 'home' | 'bookings' | 'chat' | 'profile';
  setActiveClientTab: (tab: 'home' | 'bookings' | 'chat' | 'profile') => void;

  // Therapist State
  therapists: Therapist[];
  currentTherapistId: string;
  setCurrentTherapistId: (id: string) => void;
  currentTherapist: Therapist;
  activeTherapistTab: 'dashboard' | 'bookings' | 'earnings' | 'chat' | 'profile';
  setActiveTherapistTab: (tab: 'dashboard' | 'bookings' | 'earnings' | 'chat' | 'profile') => void;
  toggleTherapistOnline: (therapistId: string) => void;

  // Admin & Bookings State
  bookings: Booking[];
  services: MassageService[];
  platformCommissionRate: number; // e.g. 0.20
  setPlatformCommissionRate: (rate: number) => void;
  
  // Cross-App Workflow Actions
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'platformCommission' | 'therapistPayout'>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  triggerSOS: (bookingId: string) => void;
  dismissSOS: (bookingId: string) => void;
  approveTherapist: (therapistId: string) => void;
  rejectTherapist: (therapistId: string) => void;
  submitReview: (bookingId: string, review: BookingReview) => void;
  saveService: (service: MassageService) => void;
  deleteService: (serviceId: string) => void;

  // Doctor / Therapist Payouts
  payoutRequests: PayoutRequest[];
  requestPayout: (therapistId: string, amount: number, upiId: string) => Promise<PayoutRequest>;
  markPayoutPaid: (payoutId: string, transactionRef?: string) => Promise<void>;
  rejectPayout: (payoutId: string, reason?: string) => Promise<void>;

  // Session Dual-OTP Lifecycle & Verification Actions
  generateStartOtp: (bookingId: string) => string;
  verifyStartOtp: (bookingId: string, enteredOtp: string) => { success: boolean; error?: string };
  submitClientRatingAndGenerateEndOtp: (bookingId: string, review: BookingReview) => string;
  verifyEndOtp: (bookingId: string, enteredOtp: string) => { success: boolean; error?: string };

  // Simulated live event trigger
  incomingBookingModal: Booking | null;
  setIncomingBookingModal: (booking: Booking | null) => void;
  activeTrackingBookingId: string | null;
  setActiveTrackingBookingId: (id: string | null) => void;

  // Authentication & Onboarding Modals
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'onboarding' | 'login' | 'register';
  setAuthMode: (mode: 'onboarding' | 'login' | 'register') => void;
  authTargetRole: 'client' | 'therapist';
  setAuthTargetRole: (role: 'client' | 'therapist') => void;
  isTherapistLoggedIn: boolean;
  setIsTherapistLoggedIn: (loggedIn: boolean) => void;
  logoutTherapist: () => void;
  loginTherapist: (therapistId: string) => void;
  therapistRegisterModalOpen: boolean;
  setTherapistRegisterModalOpen: (open: boolean) => void;
  registerTherapist: (therapist: Therapist) => void;
  // Training & Internship Applications
  trainingApplications: TrainingApplication[];
  submitTrainingApplication: (appData: Omit<TrainingApplication, 'id' | 'appliedAt' | 'status'>) => Promise<{ success: boolean; id: string }>;
  updateTrainingApplicationStatus: (id: string, status: ApplicationStatus, notes?: string) => Promise<void>;
  trainingModalOpen: boolean;
  setTrainingModalOpen: (open: boolean) => void;

  logout: () => void;
  pendingGoogleUser: { email: string; name: string; photoUrl: string } | null;
  setPendingGoogleUser: (user: { email: string; name: string; photoUrl: string } | null) => void;
  refreshData: () => Promise<void>;
}

const PamwillContext = createContext<PamwillContextType | undefined>(undefined);

export const PamwillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<PlatformRole>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const s = window.location.search.toLowerCase();
      const h = window.location.hash.toLowerCase();
      if (p.includes('admin') || s.includes('admin') || h.includes('admin')) {
        return 'admin';
      }
      if (p.includes('therapist') || s.includes('therapist') || h.includes('therapist')) {
        return 'therapist';
      }
      if (p.includes('client') || p.includes('app') || s.includes('client') || h.includes('client')) {
        return 'client';
      }
    }
    return 'home';
  });

  const setCurrentRole = (role: PlatformRole) => {
    setCurrentRoleState(role);
    if (typeof window !== 'undefined' && window.history && window.history.pushState) {
      const newPath = role === 'admin' ? '/admin' : role === 'therapist' ? '/therapist' : role === 'client' ? '/app' : '/';
      window.history.pushState({ role }, '', newPath);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      if (p.includes('admin')) setCurrentRoleState('admin');
      else if (p.includes('therapist')) setCurrentRoleState('therapist');
      else if (p.includes('client') || p.includes('app')) setCurrentRoleState('client');
      else setCurrentRoleState('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [deviceFrame, setDeviceFrame] = useState<'phone' | 'full'>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const s = window.location.search.toLowerCase();
      const h = window.location.hash.toLowerCase();
      if (p.includes('admin') || s.includes('admin') || h.includes('admin')) {
        return 'full';
      }
    }
    return 'phone';
  });
  const [selectedCity, setSelectedCity] = useState<string>('delhi-ncr');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pamwill_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id === 'user-souvik' || parsed.name === 'Dr. Souvik Sen' || !parsed.isAuthenticated) {
          localStorage.removeItem('pamwill_user');
          return INITIAL_USER;
        }
        return parsed;
      } catch (e) {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  const [activeClientTab, setActiveClientTab] = useState<'home' | 'bookings' | 'chat' | 'profile'>('home');
  const [activeTherapistTab, setActiveTherapistTab] = useState<'dashboard' | 'bookings' | 'earnings' | 'chat' | 'profile'>('dashboard');

  const [therapists, setTherapists] = useState<Therapist[]>(() => {
    const saved = localStorage.getItem('pamwill_therapists');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const cleaned = parsed.filter((t: Therapist) => t.id !== 'ther-1' && t.id !== 'ther-2' && t.id !== 'ther-pending-1');
        if (cleaned.length > 0) return cleaned;
      } catch {}
    }
    return [];
  });

  const [currentTherapistId, setCurrentTherapistId] = useState<string>('ther-1788953840879');

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('pamwill_bookings');
    if (saved) {
      try {
        const parsed: Booking[] = JSON.parse(saved);
        const cleaned = parsed.filter(b => b.id !== 'PW-98214' && b.id !== 'PW-98102' && !b.id.startsWith('PW-98'));
        return cleaned.map(b => {
          if (!b.liveLocation) {
            const svcLoc = (b.service as any)?.liveLocation;
            if (svcLoc?.latitude && svcLoc?.longitude) {
              return { ...b, liveLocation: svcLoc };
            }
            if (typeof b.address === 'string') {
              const match = b.address.match(/(\d+(?:\.\d+)?)\s*°?\s*N[,\s]+(\d+(?:\.\d+)?)\s*°?\s*E/i);
              if (match) {
                return {
                  ...b,
                  liveLocation: {
                    latitude: parseFloat(match[1]),
                    longitude: parseFloat(match[2]),
                    accuracy: 6,
                    sharedAt: b.createdAt || new Date().toISOString(),
                    placeName: b.address
                  }
                };
              }
            }
            return {
              ...b,
              liveLocation: {
                latitude: 28.4595,
                longitude: 77.0945,
                accuracy: 6,
                sharedAt: new Date().toISOString(),
                placeName: b.address || 'Sanctuary Destination'
              }
            };
          }
          return b;
        });
      } catch (e) {
        return INITIAL_BOOKINGS;
      }
    }
    return INITIAL_BOOKINGS;
  });

  const [services, setServices] = useState<MassageService[]>(() => {
    const saved = localStorage.getItem('pamwill_services');
    return saved ? JSON.parse(saved) : MASSAGE_SERVICES;
  });

  const [platformCommissionRate, setPlatformCommissionRate] = useState<number>(() => {
    const saved = localStorage.getItem('pamwill_commission_rate');
    return saved !== null ? JSON.parse(saved) : 0.20;
  });

  useEffect(() => {
    localStorage.setItem('pamwill_commission_rate', JSON.stringify(platformCommissionRate));
  }, [platformCommissionRate]);

  // Doctor / Therapist Payout Requests State
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(() => {
    const saved = localStorage.getItem('pamwill_payout_requests');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pamwill_payout_requests', JSON.stringify(payoutRequests));
  }, [payoutRequests]);

  // Training & Internship Applications State
  const [trainingApplications, setTrainingApplications] = useState<TrainingApplication[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pamwill_training_applications');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return INITIAL_TRAINING_APPLICATIONS;
        }
      }
    }
    return INITIAL_TRAINING_APPLICATIONS;
  });

  const [trainingModalOpen, setTrainingModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('pamwill_training_applications', JSON.stringify(trainingApplications));
  }, [trainingApplications]);

  const [incomingBookingModal, setIncomingBookingModal] = useState<Booking | null>(null);
  const [activeTrackingBookingId, setActiveTrackingBookingId] = useState<string | null>(null);

  // Auth & Registration Modals
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'onboarding' | 'login' | 'register'>('login');
  const [authTargetRole, setAuthTargetRole] = useState<'client' | 'therapist'>('client');
  const [isTherapistLoggedIn, setIsTherapistLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('pamwill_therapist_logged_in');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [therapistRegisterModalOpen, setTherapistRegisterModalOpen] = useState<boolean>(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<{ email: string; name: string; photoUrl: string } | null>(() => {
    const saved = localStorage.getItem('pamwill_pending_google_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('pamwill_therapist_logged_in', JSON.stringify(isTherapistLoggedIn));
  }, [isTherapistLoggedIn]);

  useEffect(() => {
    if (pendingGoogleUser) {
      localStorage.setItem('pamwill_pending_google_user', JSON.stringify(pendingGoogleUser));
    } else {
      localStorage.removeItem('pamwill_pending_google_user');
    }
  }, [pendingGoogleUser]);

  // Sync authTargetRole with current role when switching
  useEffect(() => {
    if (currentRole === 'therapist') {
      setAuthTargetRole('therapist');
    } else if (currentRole === 'client') {
      setAuthTargetRole('client');
    }
  }, [currentRole]);

  // Load from Supabase on Mount
  const loadFromSupabase = useCallback(async () => {
    try {
      const [remoteServices, remoteTherapists, remoteBookings, remotePayouts, remoteTrainingApps] = await Promise.all([
        dbFetchServices(),
        dbFetchTherapists(),
        dbFetchBookings(),
        dbFetchPayoutRequests(),
        dbFetchTrainingApplications()
      ]);

      let connected = false;

      if (remoteServices && remoteServices.length > 0) {
        setServices(remoteServices);
        connected = true;
      }
      if (remoteTherapists && remoteTherapists.length > 0) {
        setTherapists(prev => {
          // Merge wallet balance and stats if local has newer completion
          return remoteTherapists.map(rt => {
            const loc = prev.find(p => p.id === rt.id);
            if (!loc) return rt;
            return {
              ...rt,
              walletBalance: Math.max(rt.walletBalance || 0, loc.walletBalance || 0),
              completedJobs: Math.max(rt.completedJobs || 0, loc.completedJobs || 0)
            };
          });
        });
        connected = true;
      }
      if (remoteBookings && remoteBookings.length > 0) {
        const STATUS_PRIORITY: Record<string, number> = {
          'Pending': 0,
          'Accepted': 1,
          'On the Way': 2,
          'Arrived': 3,
          'Service Started': 4,
          'Service Completed': 5,
          'Cancelled': 6
        };

        setBookings(prev => {
          return remoteBookings.map(rb => {
            const local = prev.find(p => p.id === rb.id);
            if (!local) return rb;
            const localPriority = STATUS_PRIORITY[local.status] ?? 0;
            const remotePriority = STATUS_PRIORITY[rb.status] ?? 0;
            const mergedStatus = (local.status === 'Cancelled' || rb.status === 'Cancelled')
              ? 'Cancelled'
              : (localPriority > remotePriority ? local.status : rb.status);

            return {
              ...rb,
              startOtp: rb.startOtp || local.startOtp,
              endOtp: rb.endOtp || local.endOtp,
              review: rb.review || local.review,
              sessionStartedAt: rb.sessionStartedAt || local.sessionStartedAt,
              sessionCompletedAt: rb.sessionCompletedAt || local.sessionCompletedAt,
              status: mergedStatus
            };
          });
        });
        connected = true;
      }
      if (remotePayouts && remotePayouts.length > 0) {
        setPayoutRequests(remotePayouts);
      }
      if (remoteTrainingApps && remoteTrainingApps.length > 0) {
        setTrainingApplications(remoteTrainingApps);
      }

      setIsSupabaseConnected(connected);
    } catch (e) {
      console.warn('Initial Supabase sync check:', e);
    }
  }, []);

  useEffect(() => {
    loadFromSupabase();

    // Cross-tab / Window instantaneous storage listener
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'pamwill_bookings' && e.newValue) {
        try {
          setBookings(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === 'pamwill_therapists' && e.newValue) {
        try {
          setTherapists(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // Subscribe to Realtime Postgres changes across tables
    const unsubscribe = subscribeToRealtimeUpdates((table, event, payload) => {
      console.log(`[Supabase Realtime] ${table} ${event}`, payload);
      loadFromSupabase();
    });

    // Listen to Firebase Auth state
    const unsubscribeFirebase = onFirebaseAuthStateChange(async (fbUser) => {
      if (fbUser) {
        setPendingGoogleUser({
          email: fbUser.email || '',
          name: fbUser.displayName || '',
          photoUrl: fbUser.photoURL || ''
        });
        setUser(prev => ({
          ...prev,
          name: fbUser.displayName || prev.name,
          email: fbUser.email || prev.email,
          phone: fbUser.phoneNumber || prev.phone,
          avatarUrl: fbUser.photoURL || prev.avatarUrl,
          isAuthenticated: true
        }));
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorage);
      unsubscribe();
      unsubscribeFirebase();
    };
  }, [loadFromSupabase]);

  // Sync to local storage for instant caching
  useEffect(() => {
    localStorage.setItem('pamwill_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pamwill_therapists', JSON.stringify(therapists));
  }, [therapists]);

  useEffect(() => {
    localStorage.setItem('pamwill_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('pamwill_services', JSON.stringify(services));
  }, [services]);

  const currentTherapist = therapists.find(t => t.id === currentTherapistId) || therapists[0];

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const toggleTherapistOnline = (therapistId: string) => {
    const target = therapists.find(t => t.id === therapistId);
    const newStatus = !target?.isOnline;

    setTherapists(prev => prev.map(t => {
      if (t.id === therapistId) {
        return { ...t, isOnline: newStatus };
      }
      return t;
    }));

    // Persist to Supabase
    dbUpdateTherapist(therapistId, { isOnline: newStatus });
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'platformCommission' | 'therapistPayout'>): Booking => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `PW-${randomNum}`;
    const commission = Math.round(bookingData.totalPaid * platformCommissionRate * 10) / 10;
    const payout = Math.round((bookingData.totalPaid - commission) * 10) / 10;

    const chosenTherapist = bookingData.therapistId 
      ? therapists.find(t => t.id === bookingData.therapistId)
      : therapists.find(t => t.status === 'Approved' && t.isOnline);

    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      therapistId: chosenTherapist?.id,
      therapistName: chosenTherapist?.fullName,
      therapistPhoto: chosenTherapist?.photoUrl,
      therapistRating: chosenTherapist?.rating,
      therapistPhone: chosenTherapist?.phone,
      platformCommission: commission,
      therapistPayout: payout,
      createdAt: new Date().toISOString(),
      etaMinutes: 22,
      sosTriggered: false
    };

    setBookings(prev => [newBooking, ...prev]);
    setActiveTrackingBookingId(newId);

    // Persist to Supabase
    dbInsertBooking(newBooking);

    if (chosenTherapist) {
      setIncomingBookingModal(newBooking);
    }

    return newBooking;
  };

  const generateStartOtp = (bookingId: string): string => {
    const existing = bookings.find(b => b.id === bookingId)?.startOtp;
    if (existing) return existing;
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setBookings(prev => {
      const updated = prev.map(b => b.id === bookingId ? { ...b, startOtp: code } : b);
      localStorage.setItem('pamwill_bookings', JSON.stringify(updated));
      return updated;
    });
    const target = bookings.find(b => b.id === bookingId);
    if (target) {
      dbUpdateBooking(bookingId, { startOtp: code, service: target.service });
    }
    return code;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    let newEta = 15;
    if (status === 'Accepted') newEta = 20;
    if (status === 'On the Way') newEta = 12;
    if (status === 'Arrived') newEta = 0;
    if (status === 'Service Started' || status === 'Service Completed') newEta = 0;

    let generatedStartOtp: string | undefined;

    setBookings(prev => {
      const updated = prev.map(b => {
        if (b.id === bookingId) {
          let startOtp = b.startOtp;
          if ((status === 'Arrived' || status === 'On the Way') && !startOtp) {
            startOtp = Math.floor(1000 + Math.random() * 9000).toString();
            generatedStartOtp = startOtp;
          }

          if (status === 'Service Completed' && b.status !== 'Service Completed') {
            const targetTherapistId = b.therapistId || currentTherapist.id;
            setTherapists(therapistList => {
              const updatedList = therapistList.map(t => {
                if (t.id === targetTherapistId) {
                  const updatedBalance = Math.round((t.walletBalance + b.therapistPayout) * 10) / 10;
                  const updatedJobs = (t.completedJobs || 0) + 1;
                  dbUpdateTherapist(t.id, { walletBalance: updatedBalance, completedJobs: updatedJobs });
                  return {
                    ...t,
                    completedJobs: updatedJobs,
                    walletBalance: updatedBalance
                  };
                }
                return t;
              });
              localStorage.setItem('pamwill_therapists', JSON.stringify(updatedList));
              return updatedList;
            });
          }

          return { 
            ...b, 
            status, 
            etaMinutes: newEta,
            ...(startOtp ? { startOtp } : {})
          };
        }
        return b;
      });
      localStorage.setItem('pamwill_bookings', JSON.stringify(updated));
      return updated;
    });

    // Persist to Supabase
    const targetBooking = bookings.find(b => b.id === bookingId);
    dbUpdateBooking(bookingId, { 
      status, 
      etaMinutes: newEta,
      ...(generatedStartOtp ? { startOtp: generatedStartOtp } : {}),
      ...(targetBooking?.service ? { service: { ...targetBooking.service, ...(generatedStartOtp ? { startOtp: generatedStartOtp } : {}) } as any } : {})
    });
  };

  const verifyStartOtp = (bookingId: string, enteredOtp: string): { success: boolean; error?: string } => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) {
      return { success: false, error: 'Booking not found.' };
    }

    const cleanEntered = enteredOtp.trim();
    // Default fallback to 4821 if not set
    const expectedOtp = target.startOtp || '4821';

    if (cleanEntered !== expectedOtp) {
      return { 
        success: false, 
        error: `Incorrect start OTP. Please ask the client for the 4-digit code shown on their screen.` 
      };
    }

    const now = new Date().toISOString();

    setBookings(prev => {
      const updated = prev.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'Service Started' as BookingStatus,
            sessionStartedAt: now,
            startOtp: expectedOtp,
            etaMinutes: 0
          };
        }
        return b;
      });
      localStorage.setItem('pamwill_bookings', JSON.stringify(updated));
      return updated;
    });

    dbUpdateBooking(bookingId, {
      status: 'Service Started',
      sessionStartedAt: now,
      startOtp: expectedOtp,
      etaMinutes: 0,
      service: target.service
    });

    return { success: true };
  };

  const submitClientRatingAndGenerateEndOtp = (bookingId: string, review: BookingReview): string => {
    const endOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const target = bookings.find(b => b.id === bookingId);

    setBookings(prev => {
      const updated = prev.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            review,
            endOtp
          };
        }
        return b;
      });
      localStorage.setItem('pamwill_bookings', JSON.stringify(updated));
      return updated;
    });

    dbUpdateBooking(bookingId, {
      review,
      endOtp,
      service: target?.service
    });

    return endOtp;
  };

  const verifyEndOtp = (bookingId: string, enteredOtp: string): { success: boolean; error?: string } => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) {
      return { success: false, error: 'Booking not found.' };
    }

    if (!target.review || !target.endOtp) {
      return { 
        success: false, 
        error: 'Client has not rated this session yet. The client must submit their rating first on their screen to reveal the Completion OTP.' 
      };
    }

    const cleanEntered = enteredOtp.trim();
    if (cleanEntered !== target.endOtp) {
      return { 
        success: false, 
        error: 'Invalid Completion OTP. Please enter the 4-digit code shown on the client\'s screen.' 
      };
    }

    const now = new Date().toISOString();
    const targetTherapistId = target.therapistId || currentTherapist.id;
    const payoutAmount = target.therapistPayout || 0;

    // 1. Update Booking to Service Completed
    setBookings(prev => {
      const updated = prev.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'Service Completed' as BookingStatus,
            sessionCompletedAt: now,
            etaMinutes: 0
          };
        }
        return b;
      });
      localStorage.setItem('pamwill_bookings', JSON.stringify(updated));
      return updated;
    });

    dbUpdateBooking(bookingId, {
      status: 'Service Completed',
      sessionCompletedAt: now,
      etaMinutes: 0,
      service: target.service
    });

    // 2. Immediately credit the therapist's virtual wallet money!
    setTherapists(therapistList => {
      const updatedList = therapistList.map(t => {
        if (t.id === targetTherapistId) {
          const updatedBalance = Math.round((t.walletBalance + payoutAmount) * 10) / 10;
          const updatedJobs = (t.completedJobs || 0) + 1;
          dbUpdateTherapist(t.id, { walletBalance: updatedBalance, completedJobs: updatedJobs });
          return {
            ...t,
            completedJobs: updatedJobs,
            walletBalance: updatedBalance
          };
        }
        return t;
      });
      localStorage.setItem('pamwill_therapists', JSON.stringify(updatedList));
      return updatedList;
    });

    return { success: true };
  };

  // ================= PAYOUT WORKFLOW METHODS =================
  const requestPayout = async (therapistId: string, amount: number, upiId: string): Promise<PayoutRequest> => {
    const targetTherapist = therapists.find(t => t.id === therapistId) || currentTherapist;
    const newId = `PAY-${Date.now().toString().slice(-6)}`;
    const payoutAmount = Math.max(1, Math.round(amount * 100) / 100);

    const newPayout: PayoutRequest = {
      id: newId,
      therapistId: targetTherapist.id,
      therapistName: targetTherapist.fullName,
      therapistPhoto: targetTherapist.photoUrl,
      therapistPhone: targetTherapist.phone,
      upiId: upiId || targetTherapist.upiId || 'pooja.wellness@okaxis',
      amount: payoutAmount,
      status: 'Pending',
      requestedAt: new Date().toISOString()
    };

    // Deduct requested amount from therapist's available wallet balance immediately
    const updatedWallet = Math.max(0, Math.round((targetTherapist.walletBalance - payoutAmount) * 100) / 100);
    setTherapists(prev => prev.map(t => t.id === targetTherapist.id ? { ...t, walletBalance: updatedWallet } : t));
    dbUpdateTherapist(targetTherapist.id, { walletBalance: updatedWallet });

    setPayoutRequests(prev => [newPayout, ...prev]);
    await dbInsertPayoutRequest(newPayout);
    return newPayout;
  };

  const markPayoutPaid = async (payoutId: string, transactionRef?: string): Promise<void> => {
    const ref = transactionRef || `UTR-${Date.now().toString().slice(-8)}`;
    const now = new Date().toISOString();

    setPayoutRequests(prev => prev.map(p => {
      if (p.id === payoutId) {
        return {
          ...p,
          status: 'Paid',
          paidAt: now,
          transactionRef: ref
        };
      }
      return p;
    }));

    await dbUpdatePayoutRequest(payoutId, { status: 'Paid', paidAt: now, transactionRef: ref });
  };

  const rejectPayout = async (payoutId: string, reason?: string): Promise<void> => {
    const targetPayout = payoutRequests.find(p => p.id === payoutId);
    if (targetPayout && targetPayout.status === 'Pending') {
      // Refund balance back to therapist wallet
      setTherapists(prev => prev.map(t => {
        if (t.id === targetPayout.therapistId) {
          const refunded = Math.round((t.walletBalance + targetPayout.amount) * 100) / 100;
          dbUpdateTherapist(t.id, { walletBalance: refunded });
          return { ...t, walletBalance: refunded };
        }
        return t;
      }));
    }

    setPayoutRequests(prev => prev.map(p => {
      if (p.id === payoutId) {
        return { ...p, status: 'Rejected', notes: reason || 'Declined by Admin' };
      }
      return p;
    }));

    await dbUpdatePayoutRequest(payoutId, { status: 'Rejected', notes: reason || 'Declined by Admin' });
  };

  const triggerSOS = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, sosTriggered: true };
      }
      return b;
    }));
    dbUpdateBooking(bookingId, { sosTriggered: true });
  };

  const dismissSOS = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, sosTriggered: false };
      }
      return b;
    }));
    dbUpdateBooking(bookingId, { sosTriggered: false });
  };

  const approveTherapist = (therapistId: string) => {
    setTherapists(prev => prev.map(t => {
      if (t.id === therapistId) {
        return {
          ...t,
          status: 'Approved' as const,
          documents: t.documents.map(d => ({ ...d, verificationStatus: 'verified' as const }))
        };
      }
      return t;
    }));
    dbUpdateTherapist(therapistId, { status: 'Approved' });
  };

  const rejectTherapist = (therapistId: string) => {
    setTherapists(prev => prev.map(t => {
      if (t.id === therapistId) {
        return {
          ...t,
          status: 'Suspended' as const,
          documents: t.documents.map(d => ({ ...d, verificationStatus: 'rejected' as const }))
        };
      }
      return t;
    }));
    dbUpdateTherapist(therapistId, { status: 'Suspended' });
  };

  const submitReview = (bookingId: string, review: BookingReview) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, review };
      }
      return b;
    }));
    dbUpdateBooking(bookingId, { review });
  };

  const saveService = (service: MassageService) => {
    setServices(prev => {
      const exists = prev.some(s => s.id === service.id);
      if (exists) {
        return prev.map(s => s.id === service.id ? service : s);
      }
      return [service, ...prev];
    });
    // Persist to Supabase
    dbUpsertService(service);
  };

  const deleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
    // Persist to Supabase
    dbDeleteService(serviceId);
  };

  const registerTherapist = (newTherapist: Therapist) => {
    setTherapists(prev => [newTherapist, ...prev]);
    setCurrentTherapistId(newTherapist.id);
    setIsTherapistLoggedIn(true);
  };

  const logoutTherapist = () => {
    setTherapists(prev => prev.map(t => t.id === currentTherapistId ? { ...t, isOnline: false } : t));
    setIsTherapistLoggedIn(false);
  };

  const loginTherapist = (therapistId: string) => {
    setCurrentTherapistId(therapistId);
    setIsTherapistLoggedIn(true);
    setCurrentRole('therapist');
  };

  const logout = async () => {
    await firebaseSignOutUser();
    setUser(INITIAL_USER);
    localStorage.removeItem('pamwill_user');
    localStorage.removeItem('pamwill_logged_out');
  };

  return (
    <PamwillContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        deviceFrame,
        setDeviceFrame,
        selectedCity,
        setSelectedCity,
        isSupabaseConnected,
        user,
        updateUser,
        activeClientTab,
        setActiveClientTab,
        therapists,
        currentTherapistId,
        setCurrentTherapistId,
        currentTherapist,
        activeTherapistTab,
        setActiveTherapistTab,
        toggleTherapistOnline,
        bookings,
        services,
        platformCommissionRate,
        setPlatformCommissionRate,
        createBooking,
        updateBookingStatus,
        triggerSOS,
        dismissSOS,
        approveTherapist,
        rejectTherapist,
        submitReview,
        generateStartOtp,
        verifyStartOtp,
        submitClientRatingAndGenerateEndOtp,
        verifyEndOtp,
        saveService,
        deleteService,
        payoutRequests,
        requestPayout,
        markPayoutPaid,
        rejectPayout,
        incomingBookingModal,
        setIncomingBookingModal,
        activeTrackingBookingId,
        setActiveTrackingBookingId,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        authTargetRole,
        setAuthTargetRole,
        isTherapistLoggedIn,
        setIsTherapistLoggedIn,
        logoutTherapist,
        loginTherapist,
        therapistRegisterModalOpen,
        setTherapistRegisterModalOpen,
        registerTherapist,
        logout,
        pendingGoogleUser,
        setPendingGoogleUser,
        trainingApplications,
        submitTrainingApplication: async (appData: Omit<TrainingApplication, 'id' | 'appliedAt' | 'status'>) => {
          const newId = `app-tr-${Date.now().toString().slice(-6)}`;
          const newApp: TrainingApplication = {
            id: newId,
            ...appData,
            status: 'Pending',
            appliedAt: new Date().toISOString()
          };

          setTrainingApplications(prev => [newApp, ...prev]);
          await dbInsertTrainingApplication(newApp);
          return { success: true, id: newId };
        },
        updateTrainingApplicationStatus: async (id: string, status: ApplicationStatus, notes?: string) => {
          setTrainingApplications(prev => prev.map(a => {
            if (a.id === id) {
              return {
                ...a,
                status,
                ...(notes !== undefined ? { adminNotes: notes } : {})
              };
            }
            return a;
          }));
          await dbUpdateTrainingApplicationStatus(id, status, notes);
        },
        trainingModalOpen,
        setTrainingModalOpen,
        refreshData: loadFromSupabase
      }}
    >
      {children}
    </PamwillContext.Provider>
  );
};

export const usePamwill = () => {
  const context = useContext(PamwillContext);
  if (!context) {
    throw new Error('usePamwill must be used within a PamwillProvider');
  }
  return context;
};
