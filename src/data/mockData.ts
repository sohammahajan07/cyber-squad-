import { VegetableItem, MandiRate, ProduceListing, VendorRequirement, BidOffer, UserProfile, ContactEnquiry } from '../types/market';
import { enrichMandiRatesWithPredictions } from '../utils/ratePredictor';

export const DEMO_USERS: UserProfile[] = [
  // Farmers
  {
    id: 'farmer-ramesh',
    name: 'Ramesh Patil',
    role: 'farmer',
    phone: '+91 98221 45678',
    organization: 'Patil Organic Farms, Niphad',
    location: 'Nashik, Maharashtra',
    verified: true,
  },
  {
    id: 'farmer-shivaji',
    name: 'Shivaji Ghadge',
    role: 'farmer',
    phone: '+91 94230 89123',
    organization: 'Ghadge Krishi Farm, Daund',
    location: 'Pune, Maharashtra',
    verified: true,
  },
  {
    id: 'farmer-balu',
    name: 'Balu Shinde',
    role: 'farmer',
    phone: '+91 99754 11223',
    organization: 'Shinde Polyhouse Agro, Ozar',
    location: 'Nashik, Maharashtra',
    verified: true,
  },

  // Vendors / Buyers
  {
    id: 'vendor-deepak',
    name: 'Deepak Agrawal',
    role: 'vendor',
    phone: '+91 98190 77221',
    organization: 'FreshKart Direct Logistics',
    location: 'Navi Mumbai / Vashi APMC',
    verified: true,
  },
  {
    id: 'vendor-swastik',
    name: 'Mahesh Shah',
    role: 'vendor',
    phone: '+91 98205 33412',
    organization: 'Swastik Agro Exporters',
    location: 'Panvel / JNPT Port Hub',
    verified: true,
  },
  {
    id: 'vendor-sachin',
    name: 'Sachin Kadam',
    role: 'vendor',
    phone: '+91 98600 44551',
    organization: 'Kadam Wholesale Fruits & Veggies',
    location: 'Pune Market Yard, Gultekdi',
    verified: true,
  },

  // APMC Mandi Officials
  {
    id: 'apmc-vashi',
    name: 'Officer S. K. Deshmukh',
    role: 'apmc',
    phone: '+91 98230 11990',
    organization: 'Vashi APMC Mandi Directorate',
    location: 'Sector 19, Vashi, Navi Mumbai',
    verified: true,
  },
  {
    id: 'apmc-nashik',
    name: 'Inspector P. R. Jadhav',
    role: 'apmc',
    phone: '+91 98500 22334',
    organization: 'Nashik & Lasalgaon APMC Board',
    location: 'Panchavati, Nashik',
    verified: true,
  }
];

export const VEGETABLE_CATALOG: VegetableItem[] = [
  {
    id: 'tomato',
    name: 'Tomato (Hybrid / Desi)',
    hindiName: 'टमाटर',
    marathiName: 'टोमॅटो',
    category: 'Vegetables',
    defaultUnit: 'crate',
    sampleImages: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546470427-227c7369a941?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=800&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'onion',
    name: 'Red Onion (Nashik Special)',
    hindiName: 'प्याज (लाल)',
    marathiName: 'कांदा (नाशिक)',
    category: 'Vegetables',
    defaultUnit: 'quintal',
    sampleImages: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'potato',
    name: 'Potato (Jyoti / Pukhraj)',
    hindiName: 'आलू',
    marathiName: 'बटाटा',
    category: 'Tubers',
    defaultUnit: 'quintal',
    sampleImages: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=800&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'green-chilli',
    name: 'Green Chilli (G4 / Teja)',
    hindiName: 'हरी मिर्च',
    marathiName: 'हिरवी मिरची',
    category: 'Vegetables',
    defaultUnit: 'kg',
    sampleImages: [
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower (Snowball)',
    hindiName: 'फूलगोभी',
    marathiName: 'फुलकोबी',
    category: 'Vegetables',
    defaultUnit: 'quintal',
    sampleImages: [
      'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'cabbage',
    name: 'Green Cabbage',
    hindiName: 'पत्तागोभी',
    marathiName: 'कोबी',
    category: 'Vegetables',
    defaultUnit: 'quintal',
    sampleImages: [
      'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'capsicum',
    name: 'Capsicum (Green Bell Pepper)',
    hindiName: 'शिमला मिर्च',
    marathiName: 'ढोबळी मिरची',
    category: 'Vegetables',
    defaultUnit: 'kg',
    sampleImages: [
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1525607551316-4a9e525166a0?w=800&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'okra',
    name: 'Okra / Ladyfinger (Radhika)',
    hindiName: 'भिंडी',
    marathiName: 'भेंडी',
    category: 'Vegetables',
    defaultUnit: 'kg',
    sampleImages: [
      'https://images.unsplash.com/photo-1627916607164-7b20241db935?w=800&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'brinjal',
    name: 'Eggplant / Brinjal (Round/Long)',
    hindiName: 'बैंगन',
    marathiName: 'वांगे',
    category: 'Vegetables',
    defaultUnit: 'kg',
    sampleImages: [
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'garlic',
    name: 'Garlic (Desi / Mandsaur)',
    hindiName: 'लहसुन',
    marathiName: 'लसूण',
    category: 'Tubers',
    defaultUnit: 'quintal',
    sampleImages: [
      'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&auto=format&fit=crop&q=80',
    ]
  },
  {
    id: 'ginger',
    name: 'Fresh Ginger',
    hindiName: 'अदरक',
    marathiName: 'आले',
    category: 'Tubers',
    defaultUnit: 'kg',
    sampleImages: [
      'https://images.unsplash.com/photo-1615485290176-bf10344d56be?w=800&auto=format&fit=crop&q=80',
    ]
  }
];

const RAW_MANDI_RATES: MandiRate[] = [
  // 1. Vashi APMC (Navi Mumbai)
  {
    id: 'rate-vashi-tomato',
    vegetableName: 'Tomato (Hybrid / Semi-Ripe)',
    hindiName: 'टमाटर (वाशी हाइब्रिड)',
    marathiName: 'टोमॅटो (वाशी हायब्रिड)',
    mandiName: 'Vashi APMC',
    district: 'Navi Mumbai',
    state: 'Maharashtra',
    minPricePerKg: 22,
    modalPricePerKg: 27,
    maxPricePerKg: 34,
    dailyArrivalQuintals: 5800,
    changePercent: 3.8,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },
  {
    id: 'rate-vashi-onion',
    vegetableName: 'Red Onion (Premium Wholesales)',
    hindiName: 'प्याज (वाशी लाल)',
    marathiName: 'कांदा (वाशी लाल)',
    mandiName: 'Vashi APMC',
    district: 'Navi Mumbai',
    state: 'Maharashtra',
    minPricePerKg: 22,
    modalPricePerKg: 28,
    maxPricePerKg: 33,
    dailyArrivalQuintals: 12400,
    changePercent: 1.5,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },
  {
    id: 'rate-vashi-capsicum',
    vegetableName: 'Capsicum (Green Bell Pepper)',
    hindiName: 'शिमला मिर्च (वाशी हरी)',
    marathiName: 'ढोबळी मिरची (वाशी)',
    mandiName: 'Vashi APMC',
    district: 'Navi Mumbai',
    state: 'Maharashtra',
    minPricePerKg: 36,
    modalPricePerKg: 44,
    maxPricePerKg: 52,
    dailyArrivalQuintals: 2100,
    changePercent: 4.1,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },

  // 2. Lasalgaon APMC (Nashik)
  {
    id: 'rate-lasalgaon-onion',
    vegetableName: 'Red Onion (Garwa Lal Storage Grade)',
    hindiName: 'प्याज (लासलगांव गरवा लाल)',
    marathiName: 'कांदा (लासलगाव गरवा लाल)',
    mandiName: 'Lasalgaon APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    minPricePerKg: 19.5,
    modalPricePerKg: 25.5,
    maxPricePerKg: 31,
    dailyArrivalQuintals: 22400,
    changePercent: 2.2,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },
  {
    id: 'rate-lasalgaon-tomato',
    vegetableName: 'Tomato (Niphad / Lasalgaon Farmgate)',
    hindiName: 'टमाटर (लासलगांव खेत आवक)',
    marathiName: 'टोमॅटो (लासलगाव आवक)',
    mandiName: 'Lasalgaon APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    minPricePerKg: 18,
    modalPricePerKg: 24,
    maxPricePerKg: 30,
    dailyArrivalQuintals: 4900,
    changePercent: -1.2,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },
  {
    id: 'rate-lasalgaon-garlic',
    vegetableName: 'Garlic (Desi Lasalgaon)',
    hindiName: 'लहसुन (लासलगांव देशी)',
    marathiName: 'लसूण (लासलगाव गावरान)',
    mandiName: 'Lasalgaon APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    minPricePerKg: 110,
    modalPricePerKg: 135,
    maxPricePerKg: 160,
    dailyArrivalQuintals: 1200,
    changePercent: 1.8,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },

  // 3. Nashik APMC (Panchavati / Dindori Road, Nashik)
  {
    id: 'rate-nashik-tomato',
    vegetableName: 'Tomato (Nashik Panchavati Hybrid)',
    hindiName: 'टमाटर (नाशिक पंचवटी)',
    marathiName: 'टोमॅटो (नाशिक पंचवटी यार्ड)',
    mandiName: 'Nashik APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    minPricePerKg: 20,
    modalPricePerKg: 26,
    maxPricePerKg: 32,
    dailyArrivalQuintals: 7400,
    changePercent: 2.1,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },
  {
    id: 'rate-nashik-onion',
    vegetableName: 'Red Onion (Nashik Special)',
    hindiName: 'प्याज (नाशिक लाल स्पेशल)',
    marathiName: 'कांदा (नाशिक स्पेशल)',
    mandiName: 'Nashik APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    minPricePerKg: 20.5,
    modalPricePerKg: 26,
    maxPricePerKg: 31.5,
    dailyArrivalQuintals: 16200,
    changePercent: 1.7,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },
  {
    id: 'rate-nashik-cauli',
    vegetableName: 'Cauliflower (Nashik Snowball)',
    hindiName: 'फूलगोभी (नाशिक स्नोबॉल)',
    marathiName: 'फुलकोबी (नाशिक स्नोबॉल)',
    mandiName: 'Nashik APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    minPricePerKg: 15,
    modalPricePerKg: 20,
    maxPricePerKg: 25,
    dailyArrivalQuintals: 3100,
    changePercent: -1.5,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },
  {
    id: 'rate-nashik-chilli',
    vegetableName: 'Green Chilli (Nashik G4)',
    hindiName: 'हरी मिर्च (नाशिक G4)',
    marathiName: 'हिरवी मिरची (नाशिक G4)',
    mandiName: 'Nashik APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    minPricePerKg: 38,
    modalPricePerKg: 46,
    maxPricePerKg: 54,
    dailyArrivalQuintals: 2800,
    changePercent: 3.4,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },

  // 4. Pune APMC (Market Yard, Gultekdi)
  {
    id: 'rate-pune-tomato',
    vegetableName: 'Tomato (Narayangaon / Junnar)',
    hindiName: 'टमाटर (पुणे मार्केट यार्ड)',
    marathiName: 'टोमॅटो (पुणे मार्केट यार्ड)',
    mandiName: 'Pune APMC',
    district: 'Pune',
    state: 'Maharashtra',
    minPricePerKg: 19,
    modalPricePerKg: 25,
    maxPricePerKg: 31,
    dailyArrivalQuintals: 6200,
    changePercent: 2.5,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },
  {
    id: 'rate-pune-potato',
    vegetableName: 'Potato (Manchar / Khed Special)',
    hindiName: 'आलू (पुणे मंचर)',
    marathiName: 'बटाटा (पुणे मंचर)',
    mandiName: 'Pune APMC',
    district: 'Pune',
    state: 'Maharashtra',
    minPricePerKg: 17,
    modalPricePerKg: 21,
    maxPricePerKg: 26,
    dailyArrivalQuintals: 11400,
    changePercent: 1.1,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },
  {
    id: 'rate-pune-cauli',
    vegetableName: 'Cauliflower (Snowball Curd)',
    hindiName: 'फूलगोभी (पुणे स्नोबॉल)',
    marathiName: 'फुलकोबी (पुणे स्नोबॉल)',
    mandiName: 'Pune APMC',
    district: 'Pune',
    state: 'Maharashtra',
    minPricePerKg: 16,
    modalPricePerKg: 22,
    maxPricePerKg: 28,
    dailyArrivalQuintals: 3600,
    changePercent: -2.0,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },

  // 5. Baramati APMC (Pune District)
  {
    id: 'rate-baramati-onion',
    vegetableName: 'Red Onion (Baramati / Daund Belt)',
    hindiName: 'लाल प्याज (बारामती मंडी)',
    marathiName: 'लाल कांदा (बारामती बाजार समिती)',
    mandiName: 'Baramati APMC',
    district: 'Pune',
    state: 'Maharashtra',
    minPricePerKg: 18,
    modalPricePerKg: 23.5,
    maxPricePerKg: 29,
    dailyArrivalQuintals: 8100,
    changePercent: 1.4,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },
  {
    id: 'rate-baramati-cabbage',
    vegetableName: 'Green Cabbage (Baramati Agri)',
    hindiName: 'पत्तागोभी (बारामती)',
    marathiName: 'कोबी (बारामती कृषी उत्पन्न)',
    mandiName: 'Baramati APMC',
    district: 'Pune',
    state: 'Maharashtra',
    minPricePerKg: 13,
    modalPricePerKg: 17,
    maxPricePerKg: 22,
    dailyArrivalQuintals: 2400,
    changePercent: 0.5,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },
  {
    id: 'rate-baramati-okra',
    vegetableName: 'Okra / Ladyfinger (Radhika / Baramati)',
    hindiName: 'भिंडी (बारामती राधिका)',
    marathiName: 'भेंडी (बारामती राधिका)',
    mandiName: 'Baramati APMC',
    district: 'Pune',
    state: 'Maharashtra',
    minPricePerKg: 24,
    modalPricePerKg: 30,
    maxPricePerKg: 37,
    dailyArrivalQuintals: 1650,
    changePercent: 2.8,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },

  // 6. Kolhapur APMC (Shahu Market Yard)
  {
    id: 'rate-kolhapur-chilli',
    vegetableName: 'Green Chilli (Kolhapur G4 / Teja)',
    hindiName: 'हरी मिर्च (कोल्हापुर तेजा लवंगी)',
    marathiName: 'हिरवी मिरची (कोल्हापूर शाहू मार्केट)',
    mandiName: 'Kolhapur APMC',
    district: 'Kolhapur',
    state: 'Maharashtra',
    minPricePerKg: 40,
    modalPricePerKg: 49,
    maxPricePerKg: 58,
    dailyArrivalQuintals: 2800,
    changePercent: 5.4,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },
  {
    id: 'rate-kolhapur-ginger',
    vegetableName: 'Fresh Ginger (Kolhapur Shahu Yard)',
    hindiName: 'अदरक (कोल्हापुर ताजा आले)',
    marathiName: 'आले (कोल्हापूर शाहू मार्केट यार्ड)',
    mandiName: 'Kolhapur APMC',
    district: 'Kolhapur',
    state: 'Maharashtra',
    minPricePerKg: 62,
    modalPricePerKg: 76,
    maxPricePerKg: 90,
    dailyArrivalQuintals: 950,
    changePercent: 3.2,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  },
  {
    id: 'rate-kolhapur-tomato',
    vegetableName: 'Tomato (Kolhapur Local Yard)',
    hindiName: 'टमाटर (कोल्हापुर मंडी)',
    marathiName: 'टोमॅटो (कोल्हापूर स्थानिक)',
    mandiName: 'Kolhapur APMC',
    district: 'Kolhapur',
    state: 'Maharashtra',
    minPricePerKg: 20,
    modalPricePerKg: 26,
    maxPricePerKg: 32,
    dailyArrivalQuintals: 3700,
    changePercent: 1.8,
    lastUpdated: 'Official Maharashtra Mandi Feed',
    unit: '₹/kg'
  }
];

export const INITIAL_MANDI_RATES: MandiRate[] = enrichMandiRatesWithPredictions(RAW_MANDI_RATES);

export const INITIAL_PRODUCE_LISTINGS: ProduceListing[] = [
  {
    id: 'listing-1',
    farmerId: 'farmer-ramesh',
    farmerName: 'Ramesh Patil',
    farmerPhone: '+91 98221 45678',
    farmLocation: 'Niphad, Nashik District, Maharashtra',
    exactFarmAddress: 'Survey No. 44/2, Patil Farm, Post Pimpalgaon Baswant, Taluka Niphad, Nashik - 422209',
    mandiYard: 'Lasalgaon APMC',
    vegetableId: 'tomato',
    vegetableName: 'Tomato (Hybrid Semi-Ripe)',
    variety: 'Abhinav 1057',
    quantity: 1200,
    unit: 'kg',
    expectedPricePerKg: 28,
    qualityGrade: 'Grade A',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
    harvestDate: 'Today (Early Morning 5 AM)',
    dispatchReadyDate: 'Immediate / Today',
    description: 'Freshly handpicked firm tomatoes. High skin luster, sorted in 25kg plastic crates.',
    status: 'active',
    qualityMetrics: {
      freshnessScore: 96,
      uniformityScore: 92,
      defectFreeScore: 98,
      moistureEstimate: 'Optimum (89%)',
      aiVerificationNotes: 'AI Scan: High firmness, 94% color uniformity, zero skin breakage detected. Certified Grade A.'
    },
    createdAt: '2 hours ago',
    bidsCount: 3
  },
  {
    id: 'listing-2',
    farmerId: 'farmer-shivaji',
    farmerName: 'Shivaji Ghadge',
    farmerPhone: '+91 94230 89123',
    farmLocation: 'Daund, Pune Rural, Maharashtra',
    exactFarmAddress: 'Gat No. 118, Ghadge Wasti, Kashti Road, Daund, Pune - 413801',
    mandiYard: 'Pune APMC',
    vegetableId: 'onion',
    vegetableName: 'Red Onion (Nashik Special)',
    variety: 'Garwa Lal (Storage Grade)',
    quantity: 35,
    unit: 'quintal',
    expectedPricePerKg: 25,
    qualityGrade: 'Grade A',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
    harvestDate: 'Yesterday Afternoon',
    dispatchReadyDate: 'Immediate',
    description: 'Cured under shade, dry outer peel, tight neck, 50-65mm bulb diameter.',
    status: 'active',
    qualityMetrics: {
      freshnessScore: 94,
      uniformityScore: 89,
      defectFreeScore: 96,
      moistureEstimate: 'Dry outer coat (<11%)',
      aiVerificationNotes: 'AI Scan: Well-cured skin, uniform spherical sizing, zero sprouting detected.'
    },
    createdAt: '4 hours ago',
    bidsCount: 2
  },
  {
    id: 'listing-3',
    farmerId: 'farmer-balu',
    farmerName: 'Balu Shinde',
    farmerPhone: '+91 99754 11223',
    farmLocation: 'Ozar, Nashik, Maharashtra',
    exactFarmAddress: 'Plot 12, Airport Road, Sukena Phata, Ozar, Nashik - 422206',
    mandiYard: 'Nashik APMC',
    vegetableId: 'capsicum',
    vegetableName: 'Capsicum (Green Bell Pepper)',
    variety: 'Indra F1 Polyhouse',
    quantity: 650,
    unit: 'kg',
    expectedPricePerKg: 44,
    qualityGrade: 'Grade A',
    imageUrl: 'https://images.unsplash.com/photo-1525607551316-4a9e525166a0?w=800&auto=format&fit=crop&q=80',
    harvestDate: 'Harvesting Today 6 AM',
    dispatchReadyDate: 'Today 2 PM',
    description: 'Polyhouse grown thick-walled dark green capsicum. Blocky 4-lobe shape.',
    status: 'active',
    qualityMetrics: {
      freshnessScore: 98,
      uniformityScore: 95,
      defectFreeScore: 99,
      moistureEstimate: 'High Crispness',
      aiVerificationNotes: 'AI Scan: Premium export-spec gloss, zero sun-scald or mechanical marks.'
    },
    createdAt: '1 hour ago',
    bidsCount: 4
  }
];

export const INITIAL_VENDOR_REQUIREMENTS: VendorRequirement[] = [
  {
    id: 'req-1',
    vendorId: 'vendor-deepak',
    vendorName: 'Deepak Agrawal',
    companyName: 'FreshKart Direct Logistics',
    vendorPhone: '+91 98190 77221',
    deliveryLocation: 'Vashi Sector 19 Cold Hub / APMC Gate 3',
    exactDeliveryAddress: 'Warehouse #B-4, APMC Commercial Complex, Sector 19, Vashi, Navi Mumbai - 400703',
    preferredMandi: 'Vashi APMC',
    vegetableName: 'Tomato (Hybrid)',
    requiredQuantity: 2500,
    unit: 'kg',
    targetPricePerKg: 26,
    qualityGradeRequired: 'Grade A',
    neededByDate: 'Tomorrow by 6:00 AM',
    paymentTerm: 'APMC Escrow Settlement',
    specialRequirements: 'Need in crates with plastic liners. Prefer semi-ripe (orange-red) for retail distribution.',
    status: 'open',
    createdAt: '3 hours ago',
    matchedListingsCount: 2
  },
  {
    id: 'req-2',
    vendorId: 'vendor-swastik',
    vendorName: 'Mahesh Shah',
    companyName: 'Swastik Agro Exporters',
    vendorPhone: '+91 98205 33412',
    deliveryLocation: 'JNPT Port CFS / Panvel Warehouse',
    exactDeliveryAddress: 'Unit 9, Agro Logistics Park, Palaspe Phata, Panvel, Raigad - 410206',
    preferredMandi: 'Nashik APMC',
    vegetableName: 'Red Onion (Nashik Special)',
    requiredQuantity: 100,
    unit: 'quintal',
    targetPricePerKg: 24,
    qualityGradeRequired: 'Grade A',
    neededByDate: 'Within 48 Hours',
    paymentTerm: '50% Advance UPI',
    specialRequirements: 'Gulf export grade, 55mm+ uniform diameter, dried roots, mesh net bags of 25kg.',
    status: 'open',
    createdAt: '6 hours ago',
    matchedListingsCount: 1
  },
  {
    id: 'req-3',
    vendorId: 'vendor-sachin',
    vendorName: 'Sachin Kadam',
    companyName: 'Kadam Wholesale Fruits & Veggies',
    vendorPhone: '+91 98600 44551',
    deliveryLocation: 'Pune Market Yard, Gate 2, Gultekdi',
    exactDeliveryAddress: 'Shop #41, Bhusari Division, Gultekdi Market Yard, Pune - 411037',
    preferredMandi: 'Pune APMC',
    vegetableName: 'Green Chilli (G4 / Teja)',
    requiredQuantity: 800,
    unit: 'kg',
    targetPricePerKg: 45,
    qualityGradeRequired: 'Grade A',
    neededByDate: 'Daily Morning by 5 AM',
    paymentTerm: 'Immediate Mandi Cash',
    specialRequirements: 'Dark green, sharp pungent aroma, packed in 10kg gunny mesh.',
    status: 'open',
    createdAt: '1 hour ago',
    matchedListingsCount: 1
  }
];

export const INITIAL_BIDS: BidOffer[] = [
  {
    id: 'bid-1',
    listingId: 'listing-1',
    vendorId: 'vendor-deepak',
    vendorName: 'Deepak Agrawal (FreshKart)',
    vendorType: 'Retail Chain',
    vendorLocation: 'Vashi Hub, Navi Mumbai',
    vendorPhone: '+91 98190 77221',
    offeredPricePerKg: 27,
    offeredQuantity: 1200,
    unit: 'kg',
    logistics: 'Vendor Mandi Pickup',
    message: 'Can pick up entire 1200kg lot at Vashi APMC gate or your Niphad loading point today evening.',
    status: 'pending',
    createdAt: '45 mins ago'
  }
];

export const INITIAL_ENQUIRIES: ContactEnquiry[] = [
  {
    id: 'enq-1',
    fromUserId: 'vendor-deepak',
    fromUserName: 'Deepak Agrawal (FreshKart Logistics)',
    fromRole: 'vendor',
    fromPhone: '+91 98190 77221',
    fromLocation: 'Vashi APMC, Navi Mumbai',
    toUserId: 'farmer-ramesh',
    toUserName: 'Ramesh Patil',
    toRole: 'farmer',
    referenceType: 'produce',
    referenceId: 'listing-1',
    referenceTitle: 'Tomato (Hybrid Semi-Ripe) - 1200 kg',
    message: 'Hello Ramesh ji, we want to buy your 1200kg Tomato lot. Please approve this enquiry to share farm address and direct mobile for truck dispatch.',
    status: 'pending',
    createdAt: '30 mins ago'
  },
  {
    id: 'enq-2',
    fromUserId: 'farmer-shivaji',
    fromUserName: 'Shivaji Ghadge',
    fromRole: 'farmer',
    fromPhone: '+91 94230 89123',
    fromLocation: 'Daund, Pune Rural',
    toUserId: 'vendor-swastik',
    toUserName: 'Mahesh Shah (Swastik Agro)',
    toRole: 'vendor',
    referenceType: 'requirement',
    referenceId: 'req-2',
    referenceTitle: 'Red Onion (Nashik Special) - 100 quintal',
    message: 'Namaste Mahesh ji, I have 100+ quintal export quality Garwa onion ready in my storage shed in Daund. Please approve to connect.',
    status: 'pending',
    createdAt: '15 mins ago'
  },
  {
    id: 'enq-3',
    fromUserId: 'vendor-swastik',
    fromUserName: 'Mahesh Shah (Swastik Agro)',
    fromRole: 'vendor',
    fromPhone: '+91 98205 33412',
    fromLocation: 'Panvel / JNPT Hub',
    toUserId: 'farmer-balu',
    toUserName: 'Balu Shinde',
    toRole: 'farmer',
    referenceType: 'produce',
    referenceId: 'listing-3',
    referenceTitle: 'Capsicum (Green Bell Pepper) - 650 kg',
    message: 'Enquiry approved! Mutual contact exchanged for Ozar polyhouse capsicum dispatch.',
    status: 'approved',
    createdAt: '1 hour ago',
    farmerContact: {
      name: 'Balu Shinde',
      phone: '+91 99754 11223',
      farmAddress: 'Plot 12, Airport Road, Sukena Phata, Ozar, Nashik - 422206',
      location: 'Ozar, Nashik, Maharashtra'
    },
    vendorContact: {
      name: 'Mahesh Shah',
      companyName: 'Swastik Agro Exporters',
      phone: '+91 98205 33412',
      deliveryAddress: 'Unit 9, Agro Logistics Park, Palaspe Phata, Panvel, Raigad - 410206',
      location: 'Panvel, Maharashtra'
    }
  }
];
