export type ServiceCategory =
  | "Relaxation & Wellness"
  | "Therapeutic"
  | "Luxury & Spa"
  | "Beauty & Wellness"
  | "Specialized";

export interface MassageService {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  benefits: string[];
  contraindications: string[];
  durationOptionsMin: number[];
  basePricePerDuration: Record<number, number>;
  imageUrl: string;
  popularTag?: "Popular" | "Therapeutic" | "Luxury" | "Wellness" | "Athletic";
  addOnCompatible: boolean;
  requiresCertification?: string;
}

export interface AddOn {
  id: string;
  name: string;
  priceDelta: number;
  durationDeltaMin?: number;
  description?: string;
  icon?: string;
}

export type TherapistStatus = "Pending" | "Under Review" | "Approved" | "Suspended";

export interface TherapistDocument {
  id: string;
  title: string;
  type: "aadhaar" | "police" | "certificate" | "bank";
  url: string;
  verificationStatus: "verified" | "pending" | "rejected";
}

export interface Therapist {
  id: string;
  fullName: string;
  photoUrl: string;
  phone: string;
  email: string;
  status: TherapistStatus;
  gender: "Female" | "Male";
  rating: number;
  reviewCount: number;
  completedJobs: number;
  experienceYears: number;
  languages: string[];
  availableCities: string[];
  workingHours: string;
  isOnline: boolean;
  walletBalance: number;
  bankAccount: string;
  upiId: string;
  certifications: string[];
  documents: TherapistDocument[];
  currentLocation?: {
    latitude: number;
    longitude: number;
    area: string;
  };
  isAuthenticated?: boolean;
  aadhaarNumber?: string;
  panNumber?: string;
}

export type BookingStatus =
  | "Pending"
  | "Accepted"
  | "On the Way"
  | "Arrived"
  | "Service Started"
  | "Service Completed"
  | "Cancelled";

export interface BookingReview {
  overallRating: number;
  therapistRating: number;
  serviceQuality: number;
  cleanliness: number;
  punctuality: number;
  comment?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  therapistId?: string;
  therapistName?: string;
  therapistPhoto?: string;
  therapistRating?: number;
  therapistPhone?: string;
  service: MassageService;
  durationMin: number;
  addOns: AddOn[];
  therapistGenderPref: "Female" | "Male" | "No Preference";
  scheduledDate: string;
  scheduledTime: string;
  locationType: "Home" | "Hotel" | "Office" | "Spa Partner";
  address: string;
  city: string;
  specialNotes?: string;
  basePrice: number;
  addOnsPrice: number;
  couponDiscount: number;
  membershipDiscount: number;
  totalPaid: number;
  platformCommission: number;
  therapistPayout: number;
  paymentMethod: "UPI" | "Card" | "Net Banking" | "Wallet" | "Membership Credits";
  status: BookingStatus;
  createdAt: string;
  etaMinutes?: number;
  sosTriggered?: boolean;
  review?: BookingReview;
  startOtp?: string;
  endOtp?: string;
  sessionStartedAt?: string;
  sessionCompletedAt?: string;
  liveLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    sharedAt: string;
    placeName?: string;
  };
}

export interface MembershipPlan {
  id: "silver" | "gold" | "platinum";
  name: string;
  monthlyPrice: number;
  sessionsIncluded: number;
  discountAddOnsPercent: number;
  badge: string;
  features: string[];
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  sender: "customer" | "therapist" | "system";
  senderName: string;
  text: string;
  timestamp: string;
}

export interface PayoutRequest {
  id: string;
  therapistId: string;
  therapistName: string;
  therapistPhoto?: string;
  therapistPhone?: string;
  upiId: string;
  amount: number;
  status: 'Pending' | 'Paid' | 'Rejected';
  requestedAt: string;
  paidAt?: string;
  transactionRef?: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: "Female" | "Male" | "Other";
  age: number;
  address: string;
  city: string;
  medicalConditions: string[];
  preferredTherapistGender: "Female" | "Male" | "No Preference";
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  membershipTier?: "silver" | "gold" | "platinum";
  membershipCredits: number;
  savedAddresses: Array<{
    id: string;
    label: "Home" | "Hotel" | "Office" | "Other";
    address: string;
    city: string;
  }>;
  isAuthenticated?: boolean;
  avatarUrl?: string;
}

export type ProgramType = 
  | 'Therapist Certification Training'
  | 'Spa Operations & Wellness Internship'
  | 'Ayurvedic & Holistic Apprenticeship'
  | 'Clinical Physiotherapy Support Internship';

export type ApplicationStatus = 'Pending' | 'Under Review' | 'Shortlisted' | 'Enrolled' | 'Rejected';

export interface TrainingApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  programType: ProgramType;
  experienceLevel: 'Fresher / No Prior Experience' | '6 Months – 1 Year' | '1 – 3 Years' | '3+ Years';
  availability: 'Full-Time (3-Month Intensive)' | 'Part-Time Weekend Program' | '6-Month Apprenticeship';
  qualification: string;
  statement: string;
  status: ApplicationStatus;
  appliedAt: string;
  adminNotes?: string;
}

export type InquiryType = 
  | 'Therapist Partner Onboarding'
  | 'Hotel & Resort Concierge Partnership'
  | 'Corporate Wellness & Retreats'
  | 'VIP Booking & Concierge Support'
  | 'General Inquiry & Feedback';

export type InquiryStatus = 'New' | 'In Progress' | 'Contacted' | 'Resolved' | 'Closed';

export interface ConnectInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  inquiryType: InquiryType;
  organization?: string;
  message: string;
  preferredContactMethod: 'WhatsApp' | 'Phone Call' | 'Email';
  status: InquiryStatus;
  createdAt: string;
  adminNotes?: string;
}

