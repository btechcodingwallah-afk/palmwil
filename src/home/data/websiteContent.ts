import { TestimonialItem, FaqItem, TherapistBio } from '../types';

export const WHY_CHOOSE_PILLARS = [
  {
    id: 'certified',
    title: 'Certified Master Therapists',
    description: 'Every therapist is background-checked with 500+ hours of accredited clinical training.',
    iconName: 'Award'
  },
  {
    id: 'sanctuary',
    title: '5-Star Sanctuary Kit',
    description: 'We bring sanitized medical-grade linens, heated volcanic stones, and pure botanical oils.',
    iconName: 'Sparkles'
  },
  {
    id: 'security',
    title: 'Dual-OTP Verification',
    description: 'Live GPS dispatch with secure start and end OTP codes ensuring full safety & privacy.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'pricing',
    title: 'Transparent & Gratuity-Free',
    description: 'Fixed all-inclusive pricing with zero surge charges and cashless settlements.',
    iconName: 'CheckCircle2'
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    clientName: 'Sunita Menon',
    location: 'Indiranagar, Bengaluru',
    roleOrContext: 'Senior Design Director',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    treatmentName: 'Swedish & Aromatherapy',
    quote: 'PamWill brings a genuine luxury resort spa into your living room. The therapist arrived on the dot, sterilized everything, and melted away weeks of desk fatigue.',
    verified: true
  },
  {
    id: 't2',
    clientName: 'Arjun Venkatesh',
    location: 'Koramangala 4th Block',
    roleOrContext: 'Tech Founder & Marathoner',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    treatmentName: 'Deep Tissue Recovery',
    quote: 'The clinical knowledge of their therapists is exceptional. Better myofascial release than top sports clinics in town, without having to fight Bangalore traffic afterwards.',
    verified: true
  },
  {
    id: 't3',
    clientName: 'Ananya & Rohan Bose',
    location: 'Sadashivanagar',
    roleOrContext: 'Couple Session',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    treatmentName: 'Signature Balinese Ritual',
    quote: 'The heated volcanic stones and custom essential oils were heavenly. The dual-OTP system gave us complete confidence in safety and punctuality.',
    verified: true
  },
  {
    id: 't4',
    clientName: 'Vikramaditya Rao',
    location: 'Whitefield',
    roleOrContext: 'Corporate Executive',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    treatmentName: 'Ayurvedic Herbal Compress',
    quote: 'Cleanliness standard is 10/10. Freshly sealed towels, soothing acoustic speaker, and total professionalism from start to finish.',
    verified: true
  },
  {
    id: 't5',
    clientName: 'Meera Krishnan',
    location: 'HSR Layout Sector 1',
    roleOrContext: 'Architect & Mother of Two',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    treatmentName: 'Head & Scalp Stress Release',
    quote: 'Being able to put my kids to bed and have a premier spa session in my own quiet room is life-changing. No travel, pure peace.',
    verified: true
  },
  {
    id: 't6',
    clientName: 'Karan Mehra',
    location: 'Lavelle Road',
    roleOrContext: 'Management Consultant',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    treatmentName: 'Four Hands Symphony',
    quote: 'Synchronized four-hand therapy was an otherworldly experience. Seamless booking, transparent billing, and supreme relaxation.',
    verified: true
  }
];

export const MASTER_THERAPISTS: TherapistBio[] = [
  {
    id: 'th-1',
    name: 'Maya Sharma',
    title: 'Senior Wellness Specialist',
    experienceYears: 8,
    specialties: ['Deep Tissue Myofascial', 'Sports Recovery', 'Trigger Point'],
    certifications: ['CIDESCO International Diploma', 'Certified Thai Bodywork Specialist'],
    avatarUrl: 'https://images.unsplash.com/photo-1594824813589-3c320d778d9d?auto=format&fit=crop&w=400&q=80',
    quote: 'True restorative therapy listens to each muscle knot and releases stress at the root.',
    rating: 4.96,
    completedSessions: 840
  },
  {
    id: 'th-2',
    name: 'Priya Nair',
    title: 'Ayurvedic & Balinese Master',
    experienceYears: 7,
    specialties: ['Balinese Acupressure', 'Ayurvedic Kizhi', 'Aromatherapy'],
    certifications: ['Govt. Kerala Ayurveda Therapy Certification', 'Balinese Spa Academy Bali'],
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    quote: 'Harmonizing warm botanical oils with rhythmic strokes restores internal equilibrium.',
    rating: 4.98,
    completedSessions: 1120
  },
  {
    id: 'th-3',
    name: 'Rajesh K. Verma',
    title: 'Clinical Mobility & Posture Lead',
    experienceYears: 10,
    specialties: ['Swedish Massage', 'Thai Yoga Stretch', 'Spinal Decompression'],
    certifications: ['National Board Certified Therapeutic Massage', 'Kinesiology Specialist'],
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    quote: 'Restoring functional mobility empowers the body to heal and perform at its best.',
    rating: 4.94,
    completedSessions: 1350
  }
];

export const FAQS: FaqItem[] = [
  {
    category: 'booking',
    question: 'How far in advance should I book my session?',
    answer: 'You can book on-demand with as little as 45–60 minutes notice subject to therapist availability in your zone, or pre-schedule up to 7 days in advance.'
  },
  {
    category: 'booking',
    question: 'Can I book couple sessions or back-to-back treatments?',
    answer: 'Yes. You can select simultaneous couple therapies (two therapists arriving together) or consecutive back-to-back treatments through our booking concierge.'
  },
  {
    category: 'service',
    question: 'What do I need to prepare in my room before the therapist arrives?',
    answer: 'Simply a clear floor space of approximately 6x7 feet. The therapist brings an ergonomic massage bed/mat, fresh medical linens, heated stones, and ambient audio.'
  },
  {
    category: 'service',
    question: 'What oils and botanical products do you use?',
    answer: 'We exclusively use 100% cold-pressed organic carrier oils (sweet almond, jojoba) infused with pure French lavender, lemongrass, and sandalwood essential oils.'
  },
  {
    category: 'cancellation',
    question: 'What is your cancellation and rescheduling policy?',
    answer: 'Rescheduling or cancellation is completely free up to 2 hours before your scheduled appointment time. Later cancellations carry a nominal transit compensation fee.'
  },
  {
    category: 'cancellation',
    question: 'Is tipping or gratuity required?',
    answer: 'PamWill is strictly gratuity-free. All therapist compensation, transit, and premium equipment costs are fully included in the transparent upfront rate.'
  },
  {
    category: 'safety',
    question: 'How are therapists verified for safety and hygiene?',
    answer: 'Every therapist undergoes police background checks, identity audits, and medical fitness tests. Linens are autoclaved and single-use, with dual-OTP verification for every visit.'
  },
  {
    category: 'safety',
    question: 'Can I request a specific gender or therapist?',
    answer: 'Absolutely. You can filter by female or male therapists during booking, or request your favorite therapist from previous sessions.'
  }
];

export const SERVICE_AREAS = [
  { name: 'Indiranagar & Domlur', status: 'Instant (30-45m)', zip: '560038' },
  { name: 'Koramangala (All Blocks)', status: 'Instant (30-45m)', zip: '560034' },
  { name: 'HSR Layout & Bellandur', status: 'Instant (30-45m)', zip: '560102' },
  { name: 'Whitefield & ITPL', status: 'Scheduled & Express', zip: '560066' },
  { name: 'Sadashivanagar & Malleshwaram', status: 'Instant (30-45m)', zip: '560080' },
  { name: 'Jayanagar & JP Nagar', status: 'Scheduled & Express', zip: '560041' },
  { name: 'MG Road, CBD & Lavelle Rd', status: 'Instant (30-45m)', zip: '560001' },
  { name: 'Electronic City Phase 1 & 2', status: 'Scheduled & Express', zip: '560100' }
];
