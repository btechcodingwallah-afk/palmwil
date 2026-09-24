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

export const INITIAL_THERAPISTS: Therapist[] = [];

export const INITIAL_USER: UserProfile = {
  id: "guest",
  name: "",
  phone: "",
  email: "",
  avatarUrl: undefined,
  isAuthenticated: false,
  gender: "Other",
  age: 0,
  address: "",
  city: "Delhi NCR",
  medicalConditions: [],
  preferredTherapistGender: "No Preference",
  emergencyContact: {
    name: "",
    phone: "",
    relationship: ""
  },
  membershipTier: undefined,
  membershipCredits: 0,
  savedAddresses: []
};

export const INITIAL_BOOKINGS: Booking[] = [];

export const INITIAL_TRAINING_APPLICATIONS = [
  {
    id: "app-tr-101",
    fullName: "Priya Sharma",
    email: "priya.sharma22@gmail.com",
    phone: "+91 98450 12389",
    city: "Bengaluru",
    programType: "Therapist Certification Training" as const,
    experienceLevel: "Fresher / No Prior Experience" as const,
    availability: "Full-Time (3-Month Intensive)" as const,
    qualification: "Bachelor of Arts / Diploma in Cosmetology",
    statement: "I have always been deeply passionate about holistic wellness and neuromuscular relaxation. I want to build a certified career with PamWill's luxury standard.",
    status: "Pending" as const,
    appliedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    adminNotes: "Contacted for preliminary phone screening scheduled for tomorrow."
  },
  {
    id: "app-tr-102",
    fullName: "Rohan Verma",
    email: "rohan.v.wellness@outlook.com",
    phone: "+91 98201 44521",
    city: "Mumbai",
    programType: "Spa Operations & Wellness Internship" as const,
    experienceLevel: "6 Months – 1 Year" as const,
    availability: "6-Month Apprenticeship" as const,
    qualification: "BBA in Hospitality & Luxury Management",
    statement: "Seeking hands-on operational leadership experience in marketplace logistics, mobile spa consignment, and client concierge standards.",
    status: "Under Review" as const,
    appliedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    adminNotes: "Hospitality background verified. Good fit for Mumbai operations coordinator intern."
  },
  {
    id: "app-tr-103",
    fullName: "Ananya Sen",
    email: "ananya.sen.ayur@gmail.com",
    phone: "+91 98110 99876",
    city: "Delhi NCR",
    programType: "Ayurvedic & Holistic Apprenticeship" as const,
    experienceLevel: "1 – 3 Years" as const,
    availability: "Part-Time Weekend Program" as const,
    qualification: "Diploma in Ayurvedic Panchakarma & Naturopathy",
    statement: "Looking to advance my Abhyanga, Kizhi, and marma therapy skills under PamWill's senior Ayurvedic master practitioners.",
    status: "Shortlisted" as const,
    appliedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    adminNotes: "Panchakarma diploma verified. Approved for in-person masterclass audition."
  }
];
