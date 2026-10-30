import { Therapist, MembershipPlan, UserProfile, Booking } from '../types';
import { MASSAGE_SERVICES } from './services';

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "silver",
    name: "Silver Sanctuary",
    monthlyPrice: 999,
    sessionsIncluded: 1,
    discountAddOnsPercent: 10,
    badge: "Essential Luxury",
    features: [
      "1 Complimentary 60-min Swedish or Balinese session / month",
      "10% off all botanical add-ons & stone upgrades",
      "Complimentary cancellation up to 2 hours before arrival",
      "Priority customer concierge"
    ]
  },
  {
    id: "gold",
    name: "Gold Pavilion",
    monthlyPrice: 2499,
    sessionsIncluded: 2,
    discountAddOnsPercent: 15,
    badge: "Most Popular",
    features: [
      "2 Complimentary 60-min or 90-min sessions / month",
      "15% off all add-ons & specialized rituals",
      "Guaranteed priority matching within 30 minutes",
      "Free Aromatherapy oil upgrade on every session",
      "Exclusive access to Master Therapists (5+ years exp)"
    ]
  },
  {
    id: "platinum",
    name: "Platinum Sovereign",
    monthlyPrice: 4999,
    sessionsIncluded: 4,
    discountAddOnsPercent: 20,
    badge: "Ultra Luxury",
    features: [
      "4 Complimentary 90-min sessions across any category",
      "20% off all services & add-ons for family members",
      "Complimentary Four Hands & Ayurvedic Potli access",
      "Dedicated 24/7 Wellness Butler on WhatsApp",
      "Unlimited free rescheduling & zero cancellation fees"
    ]
  }
];

import { Voucher, DeliveryAddress, StoreOrder, TrainingApplication, ConnectInquiry } from '../types';

export const INITIAL_THERAPISTS: Therapist[] = [
  {
    id: "ther-1793003027409",
    fullName: "Pooja Sharma",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    phone: "+91 98765 43210",
    email: "pooja.pamwill@gmail.com",
    status: "Approved",
    role: "spa_therapist",
    gender: "Female",
    rating: 4.96,
    reviewCount: 42,
    completedJobs: 38,
    experienceYears: 6,
    languages: ["English", "Hindi"],
    availableCities: ["Delhi NCR", "Gurugram"],
    workingHours: "08:00 AM - 08:30 PM",
    isOnline: true,
    walletBalance: 4250,
    bankAccount: "HDFC Bank •••• 4091",
    upiId: "pooja@okhdfcbank",
    certifications: [
      "CIDESCO Diploma in Swedish & Deep Tissue",
      "ITEC Level 4 Sports Massage"
    ],
    documents: [],
    currentLocation: {
      latitude: 28.4680,
      longitude: 77.0850,
      area: "DLF Cyber City, Gurugram"
    },
    serviceRadiusKm: 10
  },
  {
    id: "ther-pb-1",
    fullName: "Simran Kaur",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    phone: "+91 98140 33445",
    email: "simran.kaur@pamwill.com",
    status: "Approved",
    role: "spa_therapist",
    gender: "Female",
    rating: 4.97,
    reviewCount: 56,
    completedJobs: 49,
    experienceYears: 7,
    languages: ["Punjabi", "Hindi", "English"],
    availableCities: ["Punjab", "Jalandhar", "Kapurthala", "Delhi NCR"],
    workingHours: "08:00 AM - 09:00 PM",
    isOnline: true,
    walletBalance: 6400,
    bankAccount: "HDFC Bank •••• 7712",
    upiId: "simran@okhdfcbank",
    certifications: [
      "CIDESCO Diploma in Swedish & Deep Tissue",
      "Ayurvedic Abhyanga & Marma Therapy Master"
    ],
    documents: [],
    currentLocation: {
      latitude: 31.2522,
      longitude: 75.6995,
      area: "Civil Lines & Model Town, Jalandhar / Kapurthala"
    },
    serviceRadiusKm: 15
  },
  {
    id: "ther-pb-2",
    fullName: "Dr. Harpreet Singh",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    phone: "+91 98722 66778",
    email: "dr.harpreet@pamwill.com",
    status: "Approved",
    role: "physiotherapist",
    gender: "Male",
    rating: 4.99,
    reviewCount: 82,
    completedJobs: 71,
    experienceYears: 10,
    languages: ["Punjabi", "English", "Hindi"],
    availableCities: ["Punjab", "Jalandhar", "Kapurthala"],
    workingHours: "07:30 AM - 08:00 PM",
    isOnline: true,
    walletBalance: 11200,
    bankAccount: "Axis Bank •••• 3041",
    upiId: "dr.harpreet@okaxis",
    certifications: [
      "Master of Physiotherapy (MPT Sports & Spine)",
      "Certified Chiropractic & Spinal Decompression"
    ],
    documents: [],
    currentLocation: {
      latitude: 31.2550,
      longitude: 75.7010,
      area: "Model Town & Urban Estate, Jalandhar / Kapurthala"
    },
    serviceRadiusKm: 15
  },
  {
    id: "ther-doc-1",
    fullName: "Dr. Ananya Iyer",
    photoUrl: "https://images.unsplash.com/photo-1594824813571-638f026385a1?auto=format&fit=crop&w=600&q=80",
    phone: "+91 98111 22334",
    email: "dr.ananya@pamwill.com",
    status: "Approved",
    role: "physiotherapist",
    gender: "Female",
    rating: 4.98,
    reviewCount: 68,
    completedJobs: 54,
    experienceYears: 8,
    languages: ["English", "Hindi", "Tamil"],
    availableCities: ["Delhi NCR", "Gurugram"],
    workingHours: "07:30 AM - 07:00 PM",
    isOnline: true,
    walletBalance: 8600,
    bankAccount: "ICICI Bank •••• 8821",
    upiId: "dr.ananya@okicici",
    certifications: [
      "Master of Physiotherapy (MPT Ortho)",
      "Certified Dry Needling & Kinesiology"
    ],
    documents: [],
    currentLocation: {
      latitude: 28.4595,
      longitude: 77.0945,
      area: "DLF Phase 5, Golf Course Road, Gurugram"
    },
    serviceRadiusKm: 10
  },
  {
    id: "ther-blr-1",
    fullName: "Rajesh Nair",
    photoUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
    phone: "+91 97400 55667",
    email: "rajesh.nair@pamwill.com",
    status: "Approved",
    role: "spa_therapist",
    gender: "Male",
    rating: 4.94,
    reviewCount: 39,
    completedJobs: 31,
    experienceYears: 7,
    languages: ["English", "Hindi", "Kannada", "Malayalam"],
    availableCities: ["Bengaluru"],
    workingHours: "08:00 AM - 09:00 PM",
    isOnline: true,
    walletBalance: 3900,
    bankAccount: "Axis Bank •••• 1204",
    upiId: "rajesh@okaxis",
    certifications: [
      "Kerala Ayurvedic Panchakarma Master",
      "Thai Yoga Bodywork Certified"
    ],
    documents: [],
    currentLocation: {
      latitude: 12.9784,
      longitude: 77.6408,
      area: "100 Feet Road, Indiranagar, Bengaluru"
    },
    serviceRadiusKm: 10
  },
  {
    id: "ther-blr-2",
    fullName: "Priya Menon",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    phone: "+91 96200 44332",
    email: "priya.menon@pamwill.com",
    status: "Approved",
    role: "spa_therapist",
    gender: "Female",
    rating: 4.97,
    reviewCount: 52,
    completedJobs: 47,
    experienceYears: 5,
    languages: ["English", "Hindi", "Kannada"],
    availableCities: ["Bengaluru"],
    workingHours: "09:00 AM - 08:30 PM",
    isOnline: true,
    walletBalance: 5100,
    bankAccount: "HDFC Bank •••• 9931",
    upiId: "priya.menon@okhdfcbank",
    certifications: [
      "Aromatherapy Specialist",
      "Deep Tissue & Reflexology Diploma"
    ],
    documents: [],
    currentLocation: {
      latitude: 12.9352,
      longitude: 77.6245,
      area: "5th Block, Koramangala, Bengaluru"
    },
    serviceRadiusKm: 10
  },
  {
    id: "ther-far-1",
    fullName: "Vikas Verma",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    phone: "+91 95555 77889",
    email: "vikas.verma@pamwill.com",
    status: "Approved",
    role: "spa_therapist",
    gender: "Male",
    rating: 4.88,
    reviewCount: 15,
    completedJobs: 12,
    experienceYears: 4,
    languages: ["English", "Hindi"],
    availableCities: ["Delhi NCR"],
    workingHours: "10:00 AM - 07:00 PM",
    isOnline: true,
    walletBalance: 1200,
    bankAccount: "SBI •••• 4401",
    upiId: "vikas@oksbi",
    certifications: [
      "Holistic Wellness Diploma"
    ],
    documents: [],
    currentLocation: {
      latitude: 28.3200,
      longitude: 77.5400,
      area: "Pari Chowk, Greater Noida (>35km from Gurugram)"
    },
    serviceRadiusKm: 10
  }
];

export const INITIAL_USER: UserProfile = {
  id: "guest",
  name: "Guest Client",
  phone: "",
  email: "",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
  isAuthenticated: false,
  gender: "Other",
  age: 0,
  address: "",
  city: "Bengaluru",
  medicalConditions: [],
  preferredTherapistGender: "No Preference",
  emergencyContact: {
    name: "",
    phone: "",
    relationship: ""
  },
  membershipCredits: 0,
  savedAddresses: []
};

export const INITIAL_SAVED_ADDRESSES: DeliveryAddress[] = [];

export const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: "vouch_1",
    code: "WELCOME500",
    title: "Flat ₹500 Off First Sanctuary Ritual",
    description: "Applicable on any 60-min, 90-min, or 120-min signature spa or physiotherapy therapy.",
    discountType: "fixed",
    discountValue: 500,
    minSpend: 1800,
    expiryDate: "2026-12-31",
    category: "All",
    tag: "Welcome Gift",
    accentColor: "#A9812F",
    isActive: true
  },
  {
    id: "vouch_2",
    code: "PAMWILL20",
    title: "20% Off Wellness Store Products",
    description: "Enjoy 20% discount on cold-pressed Ayurvedic oils, luxury robes, and essential aroma diffusers.",
    discountType: "percentage",
    discountValue: 20,
    minSpend: 999,
    expiryDate: "2026-11-30",
    category: "Wellness",
    tag: "Store Special",
    accentColor: "#0D9488",
    isActive: true
  },
  {
    id: "vouch_3",
    code: "HEALPHYSIO",
    title: "Flat ₹350 Off Clinical Doctor Session",
    description: "Valid on all home visits conducted by licensed MPT / BPT Doctor Physiotherapists.",
    discountType: "fixed",
    discountValue: 350,
    minSpend: 1500,
    expiryDate: "2026-12-31",
    category: "Therapy",
    tag: "Doctor Care",
    accentColor: "#4F46E5",
    isActive: true
  },
  {
    id: "vouch_4",
    code: "AYURVEDA15",
    title: "15% Off Authentic Kerala Panchakarma",
    description: "Valid for Abhyanga, Shirodhara, and Herbal Potli Kizhi rejuvenation therapies.",
    discountType: "percentage",
    discountValue: 15,
    minSpend: 2200,
    expiryDate: "2026-11-15",
    category: "Ayurveda",
    tag: "Herbal Revival",
    accentColor: "#9333EA",
    isActive: true
  }
];

export const INITIAL_BOOKINGS: Booking[] = [];

export const INITIAL_TRAINING_APPLICATIONS: TrainingApplication[] = [];

export const INITIAL_CONNECT_INQUIRIES: ConnectInquiry[] = [];

