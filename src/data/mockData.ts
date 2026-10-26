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
    fullName: "EduNiketan Pvt. Ltd.",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    phone: "+91 98765 43210",
    email: "eduniketanpvtltd@gmail.com",
    status: "Approved",
    role: "spa_therapist",
    gender: "Female",
    rating: 5.0,
    reviewCount: 0,
    completedJobs: 0,
    experienceYears: 5,
    languages: ["English", "Hindi"],
    availableCities: ["Delhi NCR", "Gurugram", "Bengaluru"],
    workingHours: "08:00 AM - 08:30 PM",
    isOnline: true,
    walletBalance: 0,
    bankAccount: "Direct Deposit",
    upiId: "eduniketan@okhdfcbank",
    certifications: [
      "Certified Master Practitioner"
    ],
    documents: []
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

