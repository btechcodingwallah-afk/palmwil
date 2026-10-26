import { Product } from '../types';

export const INITIAL_STORE_PRODUCTS: Product[] = [
  {
    id: 'prod_kumkumadi',
    name: 'Kumkumadi Miraculous Beauty Fluid',
    tagline: '100% Authentic Ayurvedic Saffron & Lotus Radiance Nectar',
    description: 'A legendary Ayurvedic formulation prescribed for glowing, youthful skin. Infused with pure Kashmiri saffron, Indian lotus, and 24 therapeutic botanical extracts, this luxurious oil deeply nourishes, visibly evens tone, and imparts a luminous golden luster.',
    price: 1850,
    originalPrice: 2200,
    category: 'Ayurvedic Oils',
    volumeOrWeight: '30 ml / 1.0 fl oz',
    stock: 35,
    inStock: true,
    rating: 4.9,
    reviewsCount: 142,
    featured: true,
    isEnabled: true,
    images: [
      'https://images.unsplash.com/photo-1608248597359-0f6667954592?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop',
    ],
    specifications: [
      { label: 'Key Ingredients', value: 'Kashmiri Saffron, Indian Madder, Sandalwood, Lotus' },
      { label: 'Skin Type', value: 'All Skin Types (Ideal for Dull or Aging Skin)' },
      { label: 'Origin', value: 'Kerala Ayurvedic Sanctuary, India' },
      { label: 'Certification', value: '100% Ayurvedic Pharmacopoeia Grade' },
      { label: 'Shelf Life', value: '24 Months from packaging' }
    ]
  },
  {
    id: 'prod_mahanarayana',
    name: 'Mahanarayana Tailam Orthopedic Oil',
    tagline: 'Deep Tissue & Neuromuscular Joint Relief Elixir',
    description: 'Classical Ayurvedic medicated oil fortified with Bilva, Ashwagandha, and Shatavari in cold-pressed sesame. Recommended by PamWill certified physiotherapists for alleviating severe stiffness, muscle spasms, and post-session restorative circulation.',
    price: 890,
    originalPrice: 1050,
    category: 'Ayurvedic Oils',
    volumeOrWeight: '200 ml',
    stock: 50,
    inStock: true,
    rating: 4.8,
    reviewsCount: 98,
    featured: false,
    isEnabled: true,
    images: [
      'https://images.unsplash.com/photo-1608248597359-0f6667954592?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Formulation', value: 'Classical Bhaishajya Ratnavali Recipe' },
      { label: 'Base Oil', value: 'Cold-Pressed Black Sesame Oil' },
      { label: 'Application', value: 'Warm gently and massage over joints & spine' },
      { label: 'Therapeutic Use', value: 'Vata pacifying, joint mobility & muscle relief' }
    ]
  },
  {
    id: 'prod_lavender_oil',
    name: 'Wild Himalayan Lavender Essential Oil',
    tagline: 'High-Altitude Calming & Sleep Sanctuary Concentrate',
    description: 'Steam-distilled at 7,500 feet in Himachal Pradesh, this pristine essential oil contains peak linalool concentration. Promotes deep REM slumber, eases nervous tension, and elevates your evening sanctuary bath or aromatherapy diffuser rituals.',
    price: 950,
    originalPrice: 1200,
    category: 'Aromatherapy',
    volumeOrWeight: '15 ml',
    stock: 28,
    inStock: true,
    rating: 5.0,
    reviewsCount: 84,
    featured: true,
    isEnabled: true,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1000&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Botanical Name', value: 'Lavandula angustifolia' },
      { label: 'Extraction', value: 'Steam Distillation (Wildcrafted)' },
      { label: 'Aroma Notes', value: 'Floral, herbaceous, sweet honey undertones' },
      { label: 'Purity', value: '100% Pure Undiluted Therapeutic Grade' }
    ]
  },
  {
    id: 'prod_kansa_wand',
    name: 'Sacred Ayurvedic Kansa Wand Massager',
    tagline: 'Hand-Cast Healing Bronze (Copper & Tin) Detox Tool',
    description: 'Revered for millennia as India’s "queen of healing metals." Crafted from sacred bronze (78% copper, 22% tin) and hand-carved teak wood. Draws out excess acidity and toxins, balances marma points, and rejuvenates facial muscles when used with therapeutic oils.',
    price: 1750,
    originalPrice: 2400,
    category: 'Therapy Tools',
    volumeOrWeight: '1 Ergonomic Wand + Velvet Pouch',
    stock: 22,
    inStock: true,
    rating: 4.9,
    reviewsCount: 110,
    featured: true,
    isEnabled: true,
    images: [
      'https://images.unsplash.com/photo-1512290900672-1f55b9e0750c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Material', value: '78% Pure Copper, 22% Pure Tin with Teakwood Handle' },
      { label: 'Function', value: 'Lymphatic drainage, toxin extraction, Marma alignment' },
      { label: 'Care Instructions', value: 'Clean with lemon & salt paste or dry microfiber cloth' }
    ]
  },
  {
    id: 'prod_rose_quartz',
    name: 'Natural Rose Quartz Facial Roller & Gua Sha Set',
    tagline: 'Authentic Brazilian Crystal for Lymphatic Sculpting',
    description: 'Cut from grade-A genuine rose quartz crystals. Known as the stone of unconditional love and harmony, it cools inflamed tissues, de-puffs the eye contour, and stimulates collagen synthesis for an instant sculpted glow.',
    price: 1499,
    originalPrice: 1999,
    category: 'Therapy Tools',
    volumeOrWeight: 'Dual-Roller + Heart Gua Sha Set',
    stock: 40,
    inStock: true,
    rating: 4.8,
    reviewsCount: 76,
    featured: false,
    isEnabled: true,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512290900672-1f55b9e0750c?q=80&w=1000&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Gemstone', value: '100% Natural Brazilian Rose Quartz' },
      { label: 'Frame', value: 'Reinforced Rose Gold Welded Zinc Alloy (Zero Squeak)' },
      { label: 'Best Paired With', value: 'Kumkumadi Oil or Hydrating Rose Water' }
    ]
  },
  {
    id: 'prod_sandalwood_scrub',
    name: 'Sandalwood & Saffron Body Polisher',
    tagline: 'Royal Ubtan Exfoliating Scrub with Sweet Almond Oil',
    description: 'Inspired by ancient royal bath ceremonies. Finely ground raw walnut shells, pure Mysore sandalwood paste, organic turmeric, and saffron threads suspended in sweet almond oil gently buff away dead cells while infusing velvety hydration.',
    price: 1250,
    originalPrice: 1600,
    category: 'Bath & Body',
    volumeOrWeight: '200 g / 7.0 oz',
    stock: 30,
    inStock: true,
    rating: 4.9,
    reviewsCount: 65,
    featured: false,
    isEnabled: true,
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Exfoliant Type', value: 'Micro-ground Walnut & Raw Cane Sugar' },
      { label: 'Key Oils', value: 'Sweet Almond, Jojoba & Mysore Sandalwood Oil' },
      { label: 'Scent Profile', value: 'Warm, woody, regal saffron notes' }
    ]
  },
  {
    id: 'prod_potli_set',
    name: 'Herbal Compress Potlis (Pack of 4)',
    tagline: 'Traditional Kizhi Bundles for Thermal Pain Therapy',
    description: 'Hand-tied organic muslin potlis packed with 12 analgesic herbs including Ginger, Camphor, Eucalyptus, and Rock Salt. Simply warm in hot sesame or mustard oil and press rhythmically onto sore back, knees, and shoulders.',
    price: 990,
    originalPrice: 1350,
    category: 'Therapy Tools',
    volumeOrWeight: 'Set of 4 Reusable Potlis',
    stock: 18,
    inStock: true,
    rating: 4.7,
    reviewsCount: 43,
    featured: false,
    isEnabled: true,
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608248597359-0f6667954592?q=80&w=1000&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Contents', value: '100% Natural Dried Herbs & Himalayan Pink Salt' },
      { label: 'Cloth', value: 'Unbleached Organic Breathable Muslin' },
      { label: 'Usage', value: 'Warm oil poultice application (8-10 uses per potli)' }
    ]
  },
  {
    id: 'prod_frankincense',
    name: 'Kashmiri Mogra & Frankincense Diffuser Oil',
    tagline: 'Temple Sanctuary Aromatherapeutic Ambience Blend',
    description: 'Imbue your living quarters with the transcendent serenity of an ancient Indian temple. Handcrafted with nocturnal jasmine sambac (Mogra) and sacred Oman frankincense resin. Dispels anxious thoughts and purifies home energy.',
    price: 1100,
    originalPrice: 1450,
    category: 'Aromatherapy',
    volumeOrWeight: '30 ml',
    stock: 25,
    inStock: true,
    rating: 5.0,
    reviewsCount: 52,
    featured: true,
    isEnabled: true,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Fragrance Profile', value: 'Ethereal White Floral with Deep Amber Incense' },
      { label: 'Formulation', value: 'Pure Essential & Absolute Oil Diffusion Blend' },
      { label: 'Usage', value: '5-8 drops in ultrasonic diffuser or candle burner' }
    ]
  },
  {
    id: 'prod_ashwagandha_tea',
    name: 'Organic Ashwagandha & Brahmi Sanctuary Tea',
    tagline: 'Adaptogenic Mind-Calming Herbal Infusion',
    description: 'Certified organic whole-root Ashwagandha, memory-enhancing Brahmi, Chamomile buds, and Tulsi leaves. Naturally caffeine-free. Helps regulate cortisol stress hormones and facilitates deep, rejuvenating restorative sleep.',
    price: 650,
    originalPrice: 850,
    category: 'Wellness Teas',
    volumeOrWeight: '100 g (Approx. 40 Servings)',
    stock: 60,
    inStock: true,
    rating: 4.8,
    reviewsCount: 91,
    featured: false,
    isEnabled: true,
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=1000&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Ingredients', value: 'Organic Ashwagandha, Brahmi, Krishna Tulsi, Chamomile' },
      { label: 'Caffeine Content', value: '0% Caffeine' },
      { label: 'Packaging', value: 'UV-blocking tin with airtight aroma seal' }
    ]
  },
  {
    id: 'prod_sesame_oil',
    name: 'Cold-Pressed Black Sesame Abhyanga Base Oil',
    tagline: 'Single-Origin Unrefined Golden Elixir for Daily Self-Massage',
    description: 'Extracted from organically harvested black sesame seeds using slow wood-churning (Ghani) at low temperatures. Retains all natural antioxidants, zinc, and vitamin E. Warm and deeply penetrative for traditional daily Abhyanga rituals.',
    price: 799,
    originalPrice: 950,
    category: 'Ayurvedic Oils',
    volumeOrWeight: '500 ml',
    stock: 45,
    inStock: true,
    rating: 4.9,
    reviewsCount: 115,
    featured: false,
    isEnabled: true,
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608248597359-0f6667954592?q=80&w=1000&auto=format&fit=crop'
    ],
    specifications: [
      { label: 'Extraction Method', value: 'Cold Wooden Pressed (Kachi Ghani)' },
      { label: 'Aroma', value: 'Rich, natural toasted sesame notes' },
      { label: 'Suitability', value: 'Best for Vata and Pitta constitutions' }
    ]
  }
];
