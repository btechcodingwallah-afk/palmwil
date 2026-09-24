export interface IndianCity {
  id: string;
  name: string;
  state: string;
  tier: 1 | 2;
  popular?: boolean;
}

export const INDIAN_CITIES: IndianCity[] = [
  // Metro Tier 1
  { id: "delhi-ncr", name: "Delhi NCR (Gurugram / Noida)", state: "Delhi", tier: 1, popular: true },
  { id: "mumbai", name: "Mumbai (MMR & Suburbs)", state: "Maharashtra", tier: 1, popular: true },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", tier: 1, popular: true },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", tier: 1, popular: true },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", tier: 1, popular: true },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", tier: 1, popular: true },
  { id: "pune", name: "Pune", state: "Maharashtra", tier: 1, popular: true },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", tier: 1, popular: true },

  // Key Tier 2 & Wellness Destinations
  { id: "goa", name: "Goa (North & South)", state: "Goa", tier: 2, popular: true },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", tier: 2, popular: true },
  { id: "chandigarh", name: "Chandigarh Tricity", state: "Punjab/Haryana", tier: 2, popular: true },
  { id: "kochi", name: "Kochi", state: "Kerala", tier: 2, popular: true },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", tier: 2 },
  { id: "indore", name: "Indore", state: "Madhya Pradesh", tier: 2 },
  { id: "coimbatore", name: "Coimbatore", state: "Tamil Nadu", tier: 2 },
  { id: "surat", name: "Surat", state: "Gujarat", tier: 2 },
  { id: "nagpur", name: "Nagpur", state: "Maharashtra", tier: 2 },
  { id: "vadodara", name: "Vadodara", state: "Gujarat", tier: 2 },
  { id: "visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh", tier: 2 },
  { id: "bhubaneswar", name: "Bhubaneswar", state: "Odisha", tier: 2 },
  { id: "dehradun", name: "Dehradun / Rishikesh", state: "Uttarakhand", tier: 2, popular: true },
  { id: "mysuru", name: "Mysuru", state: "Karnataka", tier: 2 },
  { id: "udaipur", name: "Udaipur", state: "Rajasthan", tier: 2, popular: true },
  { id: "amritsar", name: "Amritsar", state: "Punjab", tier: 2 },
  { id: "guwahati", name: "Guwahati", state: "Assam", tier: 2 }
];

export const ALL_INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];
