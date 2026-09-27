export type WebsitePage = 'home' | 'services' | 'about' | 'how-it-works' | 'contact';

export type ThemeMode = 'light' | 'dark';

export interface TestimonialItem {
  id: string;
  clientName: string;
  location: string;
  roleOrContext: string;
  avatarUrl: string;
  rating: number;
  treatmentName: string;
  quote: string;
  verified: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'booking' | 'service' | 'cancellation' | 'safety';
}

export interface TherapistBio {
  id: string;
  name: string;
  title: string;
  experienceYears: number;
  specialties: string[];
  certifications: string[];
  avatarUrl: string;
  quote: string;
  rating: number;
  completedSessions: number;
}
