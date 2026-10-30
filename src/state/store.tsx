import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Booking, 
  BookingStatus, 
  Therapist, 
  UserProfile, 
  MassageService, 
  BookingReview,
  PayoutRequest,
  TrainingApplication,
  ApplicationStatus,
  ConnectInquiry,
  InquiryStatus,
  Product,
  StoreOrder,
  Voucher,
  DeliveryAddress,
  ChatMessage
} from '../types';
import { MASSAGE_SERVICES } from '../data/services';
import { 
  INITIAL_THERAPISTS, 
  INITIAL_USER, 
  INITIAL_BOOKINGS, 
  INITIAL_TRAINING_APPLICATIONS,
  INITIAL_CONNECT_INQUIRIES,
  INITIAL_VOUCHERS,
  INITIAL_SAVED_ADDRESSES
} from '../data/mockData';
import { INITIAL_STORE_PRODUCTS } from '../data/storeProducts';
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
  dbFetchConnectInquiries,
  dbInsertConnectInquiry,
  dbUpdateConnectInquiryStatus,
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

  // Visual Theme ('light' | 'dark')
  websiteTheme: 'light' | 'dark';
  setWebsiteTheme: (theme: 'light' | 'dark') => void;
  toggleWebsiteTheme: () => void;

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
  updateTherapistProfile: (therapistId: string, updates: Partial<Therapist>) => void;
  // Training & Internship Applications
  trainingApplications: TrainingApplication[];
  submitTrainingApplication: (appData: Omit<TrainingApplication, 'id' | 'appliedAt' | 'status'>) => Promise<{ success: boolean; id: string }>;
  updateTrainingApplicationStatus: (id: string, status: ApplicationStatus, notes?: string) => Promise<void>;
  trainingModalOpen: boolean;
  setTrainingModalOpen: (open: boolean) => void;

  // Connect With Us & Executive Inquiries
  connectInquiries: ConnectInquiry[];
  submitConnectInquiry: (inquiryData: Omit<ConnectInquiry, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; id: string }>;
  updateConnectInquiryStatus: (id: string, status: InquiryStatus, notes?: string) => Promise<void>;
  connectModalOpen: boolean;
  setConnectModalOpen: (open: boolean) => void;

  logout: () => void;
  pendingGoogleUser: { email: string; name: string; photoUrl: string } | null;
  setPendingGoogleUser: (user: { email: string; name: string; photoUrl: string } | null) => void;
  refreshData: () => Promise<void>;

  // Client Navigation & Sub-Pages
  clientSubRoute: string;
  setClientSubRoute: (route: string, param?: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  clientHomeMode: 'spa' | 'physio';
  setClientHomeMode: (mode: 'spa' | 'physio') => void;

  // Therapist Navigation & Sub-Pages
  therapistSubRoute: string;
  setTherapistSubRoute: (route: string) => void;

  // Wellness Store & Cart (Patient / Client)
  storeProducts: Product[];
  cart: { product: Product; quantity: number }[];
  cartTotalCount: number;
  cartTotalPrice: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  storeOrders: StoreOrder[];
  placeStoreOrder: (orderData: {
    items: { productId: string; productName: string; productImage: string; price: number; quantity: number; volumeOrWeight?: string }[];
    deliveryAddress: DeliveryAddress;
    paymentMethod: 'COD' | 'Razorpay';
    voucherCode?: string;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    totalAmount: number;
  }) => StoreOrder;

  // PamCoins & Loyalty
  pamCoins: number;
  addPamCoins: (amount: number, reason: string) => void;
  redeemPamCoins: (amount: number) => boolean;

  // Vouchers
  vouchers: Voucher[];
  appliedVoucher: Voucher | null;
  applyVoucher: (code: string, subtotal?: number) => { success: boolean; discount: number; message: string };
  removeVoucher: () => void;

  // Saved Addresses
  savedAddresses: DeliveryAddress[];
  addSavedAddress: (address: DeliveryAddress) => void;
  updateSavedAddress: (address: DeliveryAddress) => void;
  deleteSavedAddress: (id: string) => void;

  // Therapist Daily Goal & Supplies Store
  dailyGoalCount: number;
  incrementDailyGoal: () => void;
  resetDailyGoal: () => void;
  therapistCart: { product: Product; quantity: number }[];
  addTherapistToCart: (product: Product, quantity?: number) => void;
  clearTherapistCart: () => void;

  // View Mode
  viewMode: 'responsive' | 'simulator';
  setViewMode: (mode: 'responsive' | 'simulator') => void;
  toggleViewMode: () => void;

  // Real-time Chat System
  chatMessages: Record<string, ChatMessage[]>;
  sendChatMessage: (bookingId: string, text: string, sender: 'customer' | 'therapist' | 'system', senderName?: string) => void;
  getBookingMessages: (bookingId: string) => ChatMessage[];

  // Global URL dispatcher
  navigateTo: (path: string) => void;
}

const PamwillContext = createContext<PamwillContextType | undefined>(undefined);

function parseRouteFromUrl() {
  if (typeof window === 'undefined') {
    return { role: 'home' as PlatformRole, clientSub: 'home', therapistSub: 'dashboard' };
  }
  const p = window.location.pathname.toLowerCase();
  const s = window.location.search.toLowerCase();
  const h = window.location.hash.toLowerCase();

  let role: PlatformRole = 'home';
  if (p.includes('admin') || s.includes('admin') || h.includes('admin')) {
    role = 'admin';
  } else if (p.includes('therapist') || s.includes('therapist') || h.includes('therapist')) {
    role = 'therapist';
  } else if (p.includes('client') || p.includes('patient') || p.includes('app') || s.includes('client') || h.includes('client')) {
    role = 'client';
  }

  let clientSub = 'home';
  if (p.includes('store') || h.includes('store')) clientSub = 'store';
  else if (p.includes('cart') || h.includes('cart')) clientSub = 'cart';
  else if (p.includes('checkout') || h.includes('checkout')) clientSub = 'checkout';
  else if (p.includes('orders') || h.includes('orders')) clientSub = 'orders';
  else if (p.includes('membership') || h.includes('membership')) clientSub = 'membership';
  else if (p.includes('pamcoin') || p.includes('coin') || h.includes('pamcoin')) clientSub = 'pamcoin';
  else if (p.includes('vouchers') || p.includes('coupon') || h.includes('vouchers')) clientSub = 'vouchers';
  else if (p.includes('addresses') || p.includes('address') || h.includes('addresses')) clientSub = 'addresses';
  else if (p.includes('support') || p.includes('help') || h.includes('support')) clientSub = 'support';
  else if (p.includes('feedback') || h.includes('feedback')) clientSub = 'feedback';
  else if (p.includes('profile') || h.includes('profile')) clientSub = 'profile';
  else if (p.includes('bookings') || h.includes('bookings')) clientSub = 'bookings';
  else if (p.includes('tracking') || h.includes('tracking')) clientSub = 'tracking';
  else if (p.includes('services') || h.includes('services')) clientSub = 'services';
  else if (p.includes('booking') || h.includes('booking')) clientSub = 'booking';
  else if (p.includes('about') || h.includes('about')) clientSub = 'about';
  else if (p.includes('privacy') || h.includes('privacy')) clientSub = 'privacy';
  else if (p.includes('chat') || h.includes('chat')) clientSub = 'chat';

  let clientHomeMode: 'spa' | 'physio' = 'physio';
  if (p.includes('spa') || s.includes('spa') || h.includes('spa')) {
    clientHomeMode = 'spa';
  } else if (p.includes('physio') || s.includes('physio') || h.includes('physio')) {
    clientHomeMode = 'physio';
  }

  let therapistSub = 'dashboard';
  if (p.includes('earnings') || h.includes('earnings')) therapistSub = 'earnings';
  else if (p.includes('bookings') || p.includes('jobs') || h.includes('bookings')) therapistSub = 'bookings';
  else if (p.includes('daily-goal') || p.includes('game') || h.includes('daily-goal')) therapistSub = 'daily-goal';
  else if (p.includes('store') || h.includes('store')) therapistSub = 'store';
  else if (p.includes('profile') || h.includes('profile')) therapistSub = 'profile';
  else if (p.includes('onboarding') || h.includes('onboarding')) therapistSub = 'onboarding';
  else if (p.includes('login') || h.includes('login')) therapistSub = 'login';
  else if (p.includes('chat') || h.includes('chat')) therapistSub = 'chat';

  return { 
    role, 
    clientSub, 
    therapistSub, 
    clientHomeMode: (clientHomeMode || 'physio') as 'spa' | 'physio' 
  };
}

export const PamwillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialRoutes = parseRouteFromUrl();
  const [currentRole, setCurrentRoleState] = useState<PlatformRole>(initialRoutes.role);
  const [clientSubRoute, setClientSubRouteState] = useState<string>(initialRoutes.clientSub);
  const [therapistSubRoute, setTherapistSubRouteState] = useState<string>(initialRoutes.therapistSub);
  const [clientHomeMode, setClientHomeModeState] = useState<'spa' | 'physio'>(initialRoutes.clientHomeMode || 'physio');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [viewMode, setViewModeState] = useState<'responsive' | 'simulator'>('responsive');
  const [deviceFrame, setDeviceFrame] = useState<'phone' | 'full'>('full');

  const setViewMode = (mode: 'responsive' | 'simulator') => {
    setViewModeState(mode);
    setDeviceFrame(mode === 'simulator' ? 'phone' : 'full');
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'responsive' ? 'simulator' : 'responsive');
  };

  const setClientHomeMode = (mode: 'spa' | 'physio') => {
    setClientHomeModeState(mode);
    if (typeof window !== 'undefined' && window.history && window.history.pushState) {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', mode);
      window.history.pushState({ role: 'client', mode }, '', url.toString());
    }
  };

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (window.history && window.history.pushState) {
        window.history.pushState({}, '', path);
      }
    }
    const { role, clientSub, therapistSub, clientHomeMode: newMode } = parseRouteFromUrl();
    setCurrentRoleState(role);
    setClientSubRouteState(clientSub);
    setTherapistSubRouteState(therapistSub);
    setClientHomeModeState(newMode || 'physio');
  };

  const setClientSubRoute = (route: string, param?: string) => {
    setClientSubRouteState(route);
    if (param) setSelectedProductId(param);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (window.history && window.history.pushState) {
        const path = route === 'home' ? '/client' : param ? `/client/${route}/${param}` : `/client/${route}`;
        window.history.pushState({ role: 'client', sub: route }, '', path);
      }
    }
  };

  const setTherapistSubRoute = (route: string) => {
    setTherapistSubRouteState(route);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (window.history && window.history.pushState) {
        const path = route === 'dashboard' ? '/therapist' : `/therapist/${route}`;
        window.history.pushState({ role: 'therapist', sub: route }, '', path);
      }
    }
  };

  const setCurrentRole = (role: PlatformRole) => {
    setCurrentRoleState(role);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (window.history && window.history.pushState) {
        const newPath = role === 'admin' ? '/admin' : role === 'therapist' ? '/therapist' : role === 'client' ? '/client' : '/';
        window.history.pushState({ role }, '', newPath);
      }
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const { role, clientSub, therapistSub, clientHomeMode: newMode } = parseRouteFromUrl();
      setCurrentRoleState(role);
      setClientSubRouteState(clientSub);
      setTherapistSubRouteState(therapistSub);
      setClientHomeModeState(newMode || 'physio');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [websiteTheme, setWebsiteThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pamwill_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'light';
  });

  const setWebsiteTheme = (theme: 'light' | 'dark') => {
    setWebsiteThemeState(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pamwill_theme', theme);
      document.documentElement.setAttribute(
        'data-theme',
        theme === 'light' ? 'minimalist-light' : 'minimalist-dark'
      );
    }
  };

  const toggleWebsiteTheme = () => {
    setWebsiteTheme(websiteTheme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute(
        'data-theme',
        websiteTheme === 'light' ? 'minimalist-light' : 'minimalist-dark'
      );
    }
  }, [websiteTheme]);
  const [selectedCity, setSelectedCity] = useState<string>('delhi-ncr');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pamwill_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id === 'user-souvik' || parsed.name === 'Dr. Souvik Sen' || parsed.name === 'Aarav Mehra' || parsed.email === 'aarav.mehra@pamwill.com' || !parsed.isAuthenticated) {
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
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((t: Therapist) => t.id));
          const missingInitial = INITIAL_THERAPISTS.filter(it => !existingIds.has(it.id));
          return [...parsed, ...missingInitial];
        }
      } catch {}
    }
    return INITIAL_THERAPISTS;
  });

  const [currentTherapistId, setCurrentTherapistId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pamwill_current_therapist_id');
      if (saved && saved !== 'ther-1793003027409') return saved;
      if (saved === 'ther-1793003027409') {
        localStorage.removeItem('pamwill_current_therapist_id');
        localStorage.setItem('pamwill_therapist_logged_in', 'false');
      }
    }
    return '';
  });

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

  // Wellness Store & Cart
  const [storeProducts] = useState<Product[]>(INITIAL_STORE_PRODUCTS);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pamwill_cart');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pamwill_cart', JSON.stringify(cart));
    }
  }, [cart]);

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Store Orders
  const [storeOrders, setStoreOrders] = useState<StoreOrder[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pamwill_store_orders');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [];
  });

  const placeStoreOrder = (orderData: {
    items: { productId: string; productName: string; productImage: string; price: number; quantity: number; volumeOrWeight?: string }[];
    deliveryAddress: DeliveryAddress;
    paymentMethod: 'COD' | 'Razorpay';
    voucherCode?: string;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    totalAmount: number;
  }): StoreOrder => {
    const newOrder: StoreOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customerId: user.id || 'client-guest',
      customerName: user.name || orderData.deliveryAddress.recipientName || 'Valued Patron',
      customerPhone: user.phone || orderData.deliveryAddress.phone || '+91 98100 00000',
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      discount: orderData.discount,
      voucherCode: orderData.voucherCode,
      totalAmount: orderData.totalAmount,
      deliveryAddress: orderData.deliveryAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'Razorpay' ? 'Paid' : 'Pending',
      orderStatus: 'Order Placed',
      trackingPartner: 'PamWill Express Concierge',
      trackingNumber: `PWX-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          note: 'Order confirmed and sent to luxury apothecary warehouse.'
        }
      ]
    };

    setStoreOrders(prev => {
      const updated = [newOrder, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('pamwill_store_orders', JSON.stringify(updated));
      }
      return updated;
    });

    clearCart();
    return newOrder;
  };

  // PamCoins Loyalty
  const [pamCoins, setPamCoins] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pamwill_coins');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) return val;
      }
    }
    return 0;
  });

  const addPamCoins = (amount: number, reason: string) => {
    setPamCoins(prev => {
      const next = prev + amount;
      if (typeof window !== 'undefined') localStorage.setItem('pamwill_coins', next.toString());
      return next;
    });
  };

  const redeemPamCoins = (amount: number) => {
    if (pamCoins < amount) return false;
    setPamCoins(prev => {
      const next = prev - amount;
      if (typeof window !== 'undefined') localStorage.setItem('pamwill_coins', next.toString());
      return next;
    });
    return true;
  };

  // Vouchers
  const [vouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  const applyVoucher = (code: string, subtotal = 0) => {
    const match = vouchers.find(v => v.code.toUpperCase() === code.trim().toUpperCase() && v.isActive);
    if (!match) {
      return { success: false, discount: 0, message: 'Invalid or expired voucher code.' };
    }
    if (subtotal > 0 && subtotal < match.minSpend) {
      return { success: false, discount: 0, message: `Minimum spend of ₹${match.minSpend} required for this code.` };
    }
    const discount = match.discountType === 'percentage'
      ? Math.round((subtotal * match.discountValue) / 100)
      : match.discountValue;
    setAppliedVoucher(match);
    return { success: true, discount, message: `${match.code} applied successfully!` };
  };

  const removeVoucher = () => setAppliedVoucher(null);

  // Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pamwill_addresses');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const cleaned = parsed.filter(a => a.recipientName !== 'Aarav Mehra' && a.id !== 'addr_1' && a.id !== 'addr_2');
            return cleaned;
          }
        } catch {}
      }
    }
    return INITIAL_SAVED_ADDRESSES;
  });

  const addSavedAddress = (address: DeliveryAddress) => {
    setSavedAddresses(prev => {
      const updated = [address, ...prev];
      if (typeof window !== 'undefined') localStorage.setItem('pamwill_addresses', JSON.stringify(updated));
      return updated;
    });
  };

  const updateSavedAddress = (address: DeliveryAddress) => {
    setSavedAddresses(prev => {
      const updated = prev.map(a => a.id === address.id ? address : a);
      if (typeof window !== 'undefined') localStorage.setItem('pamwill_addresses', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSavedAddress = (id: string) => {
    setSavedAddresses(prev => {
      const updated = prev.filter(a => a.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('pamwill_addresses', JSON.stringify(updated));
      return updated;
    });
  };

  // Therapist Daily Goal & Equipment Cart (Scoped per therapist, defaults to 0 for new accounts)
  const getTherapistGoal = (therapistId: string) => {
    if (typeof window !== 'undefined') {
      // Clear legacy global default (which was 3)
      localStorage.removeItem('pamwill_daily_goal');
      const saved = localStorage.getItem(`pamwill_daily_goal_${therapistId}`);
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) return val;
      }
    }
    return 0;
  };

  const [dailyGoalCount, setDailyGoalCount] = useState<number>(() => {
    return getTherapistGoal(currentTherapistId);
  });

  useEffect(() => {
    setDailyGoalCount(getTherapistGoal(currentTherapistId));
  }, [currentTherapistId]);

  const incrementDailyGoal = () => {
    setDailyGoalCount(prev => {
      const next = Math.min(10, prev + 1);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`pamwill_daily_goal_${currentTherapistId}`, next.toString());
      }
      return next;
    });
  };

  const resetDailyGoal = () => {
    setDailyGoalCount(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`pamwill_daily_goal_${currentTherapistId}`);
      localStorage.removeItem('pamwill_daily_goal');
    }
  };

  const [therapistCart, setTherapistCart] = useState<{ product: Product; quantity: number }[]>([]);
  const addTherapistToCart = (product: Product, quantity = 1) => {
    setTherapistCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, quantity }];
    });
  };
  const clearTherapistCart = () => setTherapistCart([]);

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

  // Connect With Us & Executive Inquiries State
  const [connectInquiries, setConnectInquiries] = useState<ConnectInquiry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pamwill_connect_inquiries');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return INITIAL_CONNECT_INQUIRIES;
        }
      }
    }
    return INITIAL_CONNECT_INQUIRIES;
  });

  const [connectModalOpen, setConnectModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('pamwill_connect_inquiries', JSON.stringify(connectInquiries));
  }, [connectInquiries]);

  const [incomingBookingModal, setIncomingBookingModal] = useState<Booking | null>(null);
  const [activeTrackingBookingId, setActiveTrackingBookingId] = useState<string | null>(null);

  // Auth & Registration Modals
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'onboarding' | 'login' | 'register'>('login');
  const [authTargetRole, setAuthTargetRole] = useState<'client' | 'therapist'>('client');
  const [isTherapistLoggedIn, setIsTherapistLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTherapistId = localStorage.getItem('pamwill_current_therapist_id');
      const saved = localStorage.getItem('pamwill_therapist_logged_in');
      if (savedTherapistId && saved !== null) {
        try {
          return JSON.parse(saved);
        } catch {
          return false;
        }
      }
    }
    return false;
  });
  const [therapistRegisterModalOpen, setTherapistRegisterModalOpen] = useState<boolean>(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<{ email: string; name: string; photoUrl: string } | null>(() => {
    const saved = localStorage.getItem('pamwill_pending_google_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pamwill_therapist_logged_in', JSON.stringify(isTherapistLoggedIn));
      if (!isTherapistLoggedIn) {
        localStorage.removeItem('pamwill_current_therapist_id');
      }
    }
  }, [isTherapistLoggedIn]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentTherapistId) {
        localStorage.setItem('pamwill_current_therapist_id', currentTherapistId);
      } else {
        localStorage.removeItem('pamwill_current_therapist_id');
      }
    }
  }, [currentTherapistId]);

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

  // Real-time Cross-Portal Chat Messages
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('pamwill_chat_messages');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'pamwill_chat_messages' && e.newValue) {
        try {
          setChatMessages(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    const handleCustomChat = () => {
      try {
        const saved = localStorage.getItem('pamwill_chat_messages');
        if (saved) {
          setChatMessages(JSON.parse(saved));
        }
      } catch (err) {}
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('pamwill_chat_updated', handleCustomChat);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('pamwill_chat_updated', handleCustomChat);
    };
  }, []);


  // Load from Supabase on Mount
  const loadFromSupabase = useCallback(async () => {
    try {
      const [remoteServices, remoteTherapists, remoteBookings, remotePayouts, remoteTrainingApps, remoteInquiries] = await Promise.all([
        dbFetchServices(),
        dbFetchTherapists(),
        dbFetchBookings(),
        dbFetchPayoutRequests(),
        dbFetchTrainingApplications(),
        dbFetchConnectInquiries()
      ]);

      let connected = false;

      if (remoteServices && remoteServices.length > 0) {
        setServices(remoteServices);
        connected = true;
      }
      if (remoteTherapists && remoteTherapists.length > 0) {
        setTherapists(prev => {
          const remoteIds = new Set(remoteTherapists.map(rt => rt.id));
          const mergedRemote = remoteTherapists.map(rt => {
            const loc = prev.find(p => p.id === rt.id);
            if (!loc) return rt;
            return {
              ...rt,
              walletBalance: Math.max(rt.walletBalance || 0, loc.walletBalance || 0),
              completedJobs: Math.max(rt.completedJobs || 0, loc.completedJobs || 0),
              status: rt.status || loc.status,
              documents: (rt.documents && rt.documents.length > 0) ? rt.documents : (loc.documents || [])
            };
          });
          const localOnly = prev.filter(p => !remoteIds.has(p.id));
          const allTherapists = [...localOnly, ...mergedRemote];
          if (typeof window !== 'undefined') {
            localStorage.setItem('pamwill_therapists', JSON.stringify(allTherapists));
          }
          return allTherapists;
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
      if (remoteInquiries && remoteInquiries.length > 0) {
        setConnectInquiries(remoteInquiries);
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
    const handleTherapistUpdated = () => {
      try {
        const saved = localStorage.getItem('pamwill_therapists');
        if (saved) {
          setTherapists(JSON.parse(saved));
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('pamwill_therapist_updated', handleTherapistUpdated);

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
      window.removeEventListener('pamwill_therapist_updated', handleTherapistUpdated);
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

  const currentTherapist = useMemo(() => {
    if (currentTherapistId) {
      const found = therapists.find(t => t.id === currentTherapistId);
      if (found) return found;
    }
    return therapists.find(t => t.status === 'Approved') || therapists[0] || INITIAL_THERAPISTS[0];
  }, [therapists, currentTherapistId]);

  const getBookingMessages = useCallback((bookingId: string): ChatMessage[] => {
    if (chatMessages[bookingId] && chatMessages[bookingId].length > 0) {
      return chatMessages[bookingId];
    }
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (!targetBooking) return [];

    const practitionerName = targetBooking.therapistName || 'Your Certified Practitioner';
    const clientName = targetBooking.customerName || 'Patient';

    const defaultInit: ChatMessage[] = [
      {
        id: `sys-${bookingId}-1`,
        bookingId: bookingId,
        sender: 'system',
        senderName: 'PamWill Concierge',
        text: `Session #${bookingId} confirmed for ${targetBooking.service?.name || 'Treatment'}. Practitioner ${practitionerName} and ${clientName} are connected in this private thread.`,
        timestamp: targetBooking.createdAt ? new Date(targetBooking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    return defaultInit;
  }, [chatMessages, bookings]);

  const sendChatMessage = useCallback((bookingId: string, text: string, sender: 'customer' | 'therapist' | 'system', senderName?: string) => {
    if (!text || !text.trim()) return;

    const targetBooking = bookings.find(b => b.id === bookingId);
    let resolvedSenderName = senderName;
    if (!resolvedSenderName) {
      if (sender === 'customer') {
        resolvedSenderName = user?.name || targetBooking?.customerName || 'Patient';
      } else if (sender === 'therapist') {
        resolvedSenderName = currentTherapist?.fullName || targetBooking?.therapistName || 'Practitioner';
      } else {
        resolvedSenderName = 'PamWill Concierge';
      }
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId,
      sender,
      senderName: resolvedSenderName || 'PamWill Member',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => {
      const existing: ChatMessage[] = (prev[bookingId] && prev[bookingId].length > 0)
        ? prev[bookingId]
        : (targetBooking ? [
            {
              id: `sys-${bookingId}-1`,
              bookingId: bookingId,
              sender: 'system' as const,
              senderName: 'PamWill Concierge',
              text: `Session #${bookingId} confirmed for ${targetBooking.service?.name || 'Treatment'}. Practitioner ${targetBooking.therapistName || 'Practitioner'} and ${targetBooking.customerName || 'Patient'} are connected in this private thread.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ] : []);

      const updated: Record<string, ChatMessage[]> = {
        ...prev,
        [bookingId]: [...existing, newMsg]
      };
      try {
        localStorage.setItem('pamwill_chat_messages', JSON.stringify(updated));
      } catch (err) {}
      window.dispatchEvent(new CustomEvent('pamwill_chat_updated', { detail: { bookingId, message: newMsg } }));
      return updated;
    });
  }, [bookings, user, currentTherapist]);

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
    let updatedDocs: any[] = [];
    setTherapists(prev => {
      const updated = prev.map(t => {
        if (t.id === therapistId) {
          updatedDocs = t.documents.map(d => ({ ...d, verificationStatus: 'verified' as const }));
          return {
            ...t,
            status: 'Approved' as const,
            documents: updatedDocs
          };
        }
        return t;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('pamwill_therapists', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('pamwill_therapist_updated'));
      }
      return updated;
    });
    dbUpdateTherapist(therapistId, { 
      status: 'Approved',
      documents: updatedDocs
    });
  };

  const rejectTherapist = (therapistId: string) => {
    let updatedDocs: any[] = [];
    setTherapists(prev => {
      const updated = prev.map(t => {
        if (t.id === therapistId) {
          updatedDocs = t.documents.map(d => ({ ...d, verificationStatus: 'rejected' as const }));
          return {
            ...t,
            status: 'Suspended' as const,
            documents: updatedDocs
          };
        }
        return t;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('pamwill_therapists', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('pamwill_therapist_updated'));
      }
      return updated;
    });
    dbUpdateTherapist(therapistId, { 
      status: 'Suspended',
      documents: updatedDocs
    });
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
    setTherapists(prev => [newTherapist, ...prev.filter(t => t.id !== newTherapist.id)]);
    setCurrentTherapistId(newTherapist.id);
    setIsTherapistLoggedIn(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pamwill_current_therapist_id', newTherapist.id);
      localStorage.setItem('pamwill_therapist_logged_in', 'true');
    }
  };

  const updateTherapistProfile = (therapistId: string, updates: Partial<Therapist>) => {
    setTherapists(prev => prev.map(t => {
      if (t.id === therapistId) {
        return { ...t, ...updates };
      }
      return t;
    }));
    dbUpdateTherapist(therapistId, updates);
  };

  const logoutTherapist = () => {
    setTherapists(prev => prev.map(t => t.id === currentTherapistId ? { ...t, isOnline: false } : t));
    setIsTherapistLoggedIn(false);
    setCurrentTherapistId('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pamwill_current_therapist_id');
      localStorage.setItem('pamwill_therapist_logged_in', 'false');
      localStorage.removeItem('pamwill_pending_google_user');
    }
  };

  const loginTherapist = (therapistId: string) => {
    setCurrentTherapistId(therapistId);
    setIsTherapistLoggedIn(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pamwill_current_therapist_id', therapistId);
      localStorage.setItem('pamwill_therapist_logged_in', 'true');
    }
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
        websiteTheme,
        setWebsiteTheme,
        toggleWebsiteTheme,
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
        updateTherapistProfile,
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
        connectInquiries,
        submitConnectInquiry: async (inquiryData: Omit<ConnectInquiry, 'id' | 'createdAt' | 'status'>) => {
          const newId = `inq-${Date.now().toString().slice(-6)}`;
          const newInq: ConnectInquiry = {
            id: newId,
            ...inquiryData,
            status: 'New',
            createdAt: new Date().toISOString()
          };

          setConnectInquiries(prev => [newInq, ...prev]);
          await dbInsertConnectInquiry(newInq);
          return { success: true, id: newId };
        },
        updateConnectInquiryStatus: async (id: string, status: InquiryStatus, notes?: string) => {
          setConnectInquiries(prev => prev.map(inq => {
            if (inq.id === id) {
              return {
                ...inq,
                status,
                ...(notes !== undefined ? { adminNotes: notes } : {})
              };
            }
            return inq;
          }));
          await dbUpdateConnectInquiryStatus(id, status, notes);
        },
        connectModalOpen,
        setConnectModalOpen,
        refreshData: loadFromSupabase,

        // Client Navigation & Sub-Pages
        clientSubRoute,
        setClientSubRoute,
        selectedProductId,
        setSelectedProductId,
        clientHomeMode,
        setClientHomeMode,

        // Therapist Navigation & Sub-Pages
        therapistSubRoute,
        setTherapistSubRoute,

        // Wellness Store & Cart
        storeProducts,
        cart,
        cartTotalCount,
        cartTotalPrice,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        storeOrders,
        placeStoreOrder,

        // PamCoins & Loyalty
        pamCoins,
        addPamCoins,
        redeemPamCoins,

        // Vouchers
        vouchers,
        appliedVoucher,
        applyVoucher,
        removeVoucher,

        // Saved Addresses
        savedAddresses,
        addSavedAddress,
        updateSavedAddress,
        deleteSavedAddress,

        // Therapist Daily Goal & Supplies Store
        dailyGoalCount,
        incrementDailyGoal,
        resetDailyGoal,
        therapistCart,
        addTherapistToCart,
        clearTherapistCart,

        // View Mode
        viewMode,
        setViewMode,
        toggleViewMode,

        // Real-time Chat System
        chatMessages,
        sendChatMessage,
        getBookingMessages,

        // Global URL Dispatcher
        navigateTo
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
