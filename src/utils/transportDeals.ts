import {
  TransportDeal,
  TransportComparisonResult,
  ProduceListing,
  MandiRate,
  TransportBooking
} from '../types/market';

/**
 * Verified Transporter Deals operating across Maharashtra APMC corridors
 */
export const DEFAULT_TRANSPORT_DEALS: TransportDeal[] = [
  {
    id: 'tr-pool-01',
    transporterName: 'Santosh Gaikwad (Krishi Sahayog Pool)',
    transporterPhone: '+91 98224 51890',
    transporterRating: 4.9,
    completedTrips: 412,
    vehicleType: 'Shared Eicher 14ft (4.0 Ton)',
    vehicleNumber: 'MH-14-GH-3829',
    dealType: 'shared_pool',
    dealTag: '🏆 Best Value Community Pool (Save up to 45%)',
    isRecommendedDeal: true,
    fromLocation: 'Narayangaon / Junnar / Manchar',
    toDestination: 'Pune APMC (Market Yard, Gultekdi)',
    distanceKm: 78,
    ratePerQuintal: 68, // ₹68 per quintal (vs standard solo ~₹140/qtl)
    baseTripFare: 650,
    transitDurationHours: '2.5 hrs (Reaches 4:30 AM early auction)',
    coolingOrCover: 'Ventilated Crate Racks',
    capacityTotalQuintals: 40,
    capacityAvailableQuintals: 18,
    coFarmersSharing: ['Ramesh Patil (12 Qtl Tomato)', 'Dnyaneshwar More (10 Qtl Cabbage)'],
    departureSchedule: 'Today 7:00 PM (Direct auction delivery)',
    perks: [
      'Ventilated crate racks (zero crushing)',
      '2 farmers already sharing route',
      'Direct APMC Gate 2 pass delivery',
      'Free unloading assistance at yard'
    ],
    dealSavingsNote: 'Shared pooling divides fuel & toll among 3 farmers, cutting your freight by 45%.',
    farmerNetBenefit: 'Saves ~₹1,800 on a 20-quintal load vs hiring solo vehicle.',
    recommendedCommodities: ['Tomato', 'Cabbage', 'Cauliflower', 'Capsicum', 'Onion']
  },
  {
    id: 'tr-return-02',
    transporterName: 'Manoj Shinde (Return Load Logistics)',
    transporterPhone: '+91 94220 88214',
    transporterRating: 4.8,
    completedTrips: 320,
    vehicleType: 'Return-Load Eicher Pro (5.0 Ton)',
    vehicleNumber: 'MH-12-RN-6541',
    dealType: 'return_load',
    dealTag: '⚡ Return Load 40% Discount (Hot Deal)',
    isRecommendedDeal: false,
    fromLocation: 'Otur / Alephata / Sangamner Belt',
    toDestination: 'Vashi APMC (Navi Mumbai Terminal)',
    distanceKm: 145,
    ratePerQuintal: 85, // ₹85 per quintal for Vashi (normally ₹155+)
    baseTripFare: 800,
    transitDurationHours: '3.8 hrs (Reaches 3:45 AM before gate opening)',
    coolingOrCover: 'Insulated Canopy',
    capacityTotalQuintals: 50,
    capacityAvailableQuintals: 32,
    departureSchedule: 'Tonight 8:30 PM (Empty truck returning from rural delivery)',
    perks: [
      'Empty return journey gives huge price cut',
      'Insulated canopy protects leafy greens from night fog',
      'GPS live sharing via SMS / WhatsApp',
      'APMC weighbridge certified driver'
    ],
    dealSavingsNote: 'Transporter dropped industrial goods in Alephata and returns empty to Mumbai; accepts heavy discount.',
    farmerNetBenefit: 'Saves ~₹2,200 on long haul to high-paying Vashi Mandi.',
    recommendedCommodities: ['Tomato', 'Capsicum', 'Green Chilli', 'French Beans', 'Ginger']
  },
  {
    id: 'tr-ev-03',
    transporterName: 'Green Mandi EV Fleet (Khed-Rajgurunagar)',
    transporterPhone: '+91 97631 44520',
    transporterRating: 4.95,
    completedTrips: 185,
    vehicleType: 'Green EV Cargo Loader (1.2 Ton)',
    vehicleNumber: 'MH-14-EV-9022',
    dealType: 'ev_green',
    dealTag: '🌱 Subsidized Green EV Deal (Lowest Local Cost)',
    isRecommendedDeal: false,
    fromLocation: 'Khed / Chakan / Rajgurunagar Belt',
    toDestination: 'Pune APMC (Market Yard) / Pimpri Mandi',
    distanceKm: 42,
    ratePerQuintal: 55, // Zero fuel surcharge
    baseTripFare: 500,
    transitDurationHours: '1.5 hrs (Smooth quiet transit)',
    coolingOrCover: 'Tarpaulin Crate Hood',
    capacityTotalQuintals: 12,
    capacityAvailableQuintals: 12,
    departureSchedule: 'Flexible / On-call within 45 mins',
    perks: [
      'Zero diesel surcharge; subsidized eco rate',
      'Super smooth electric drive (no vibration bruising)',
      'Direct farmgate door pickup',
      'APMC Green Corridor priority gate entry'
    ],
    dealSavingsNote: 'Zero diesel cost saves 35% compared to regular diesel 3-wheelers.',
    farmerNetBenefit: 'Ideal for 5 to 12 quintal lots within 50 km.',
    recommendedCommodities: ['Tomato', 'Spinach', 'Coriander', 'Methi', 'Brinjal', 'Lady Finger']
  },
  {
    id: 'tr-bolero-04',
    transporterName: 'Dnyandev Jadhav (Express Farmgate Logistics)',
    transporterPhone: '+91 99238 77103',
    transporterRating: 4.7,
    completedTrips: 580,
    vehicleType: 'Mahindra Bolero Maxi Truck (1.7 Ton)',
    vehicleNumber: 'MH-14-BT-4109',
    dealType: 'dedicated_express',
    dealTag: '🚀 Dedicated Solo Express (Fast Farmgate Pickup)',
    isRecommendedDeal: false,
    fromLocation: 'Junnar / Narayangaon / Khed',
    toDestination: 'Pune APMC or Direct Buyer Warehouse',
    distanceKm: 75,
    ratePerQuintal: 110,
    baseTripFare: 1600,
    transitDurationHours: '2.0 hrs (Express non-stop)',
    coolingOrCover: 'Tarpaulin Crate Hood',
    capacityTotalQuintals: 17,
    capacityAvailableQuintals: 17,
    departureSchedule: 'Instant Departure (Within 1 hour of call)',
    perks: [
      '100% dedicated to your single lot only',
      'Non-stop farmgate to mandi express transit',
      'Heavy duty suspension for rough field roads',
      'Driver helps with weighing and lot unloading'
    ],
    dealSavingsNote: 'Full truck booking for when your produce is ultra-perishable and cannot wait for pool coordination.',
    farmerNetBenefit: 'Fastest dispatch time; arrival guaranteed before 4:00 AM auction.',
    recommendedCommodities: ['Exotic Vegetables', 'Tomato', 'Capsicum', 'Okra']
  },
  {
    id: 'tr-ape-05',
    transporterName: 'Pandurang Gite (Gramin Cargo)',
    transporterPhone: '+91 98901 33281',
    transporterRating: 4.6,
    completedTrips: 240,
    vehicleType: 'Piaggio Ape Cargo 3-Wheeler (750 kg)',
    vehicleNumber: 'MH-14-AG-7721',
    dealType: 'budget_loader',
    dealTag: '💰 Local Budget Loader (Best for small 3-7 Qtl)',
    isRecommendedDeal: false,
    fromLocation: 'Local Taluka & Village Belts',
    toDestination: 'Local Sub-Mandi (Manchar / Otur / Junnar Yard)',
    distanceKm: 25,
    ratePerQuintal: 60,
    baseTripFare: 400,
    transitDurationHours: '45 mins (Quick short hop)',
    coolingOrCover: 'Open Carrier',
    capacityTotalQuintals: 7,
    capacityAvailableQuintals: 7,
    departureSchedule: 'Anytime morning / evening',
    perks: [
      'Low minimum fare for tiny harvest yields',
      'Can enter narrow farm pathways and mud trails',
      'Immediate cash or UPI settlement'
    ],
    dealSavingsNote: 'Lowest minimum hiring cost (₹400) for small harvest quantities.',
    farmerNetBenefit: 'Great for small marginal farmers with 3-7 quintals.',
    recommendedCommodities: ['Green Chilli', 'Coriander', 'Spinach', 'French Beans', 'Ginger']
  },
  {
    id: 'tr-nashik-pool-06',
    transporterName: 'Kailash Sonawane (Kisan Rath Logistics)',
    transporterPhone: '+91 98230 65129',
    transporterRating: 4.85,
    completedTrips: 490,
    vehicleType: 'Shared Tata 1109 (6.0 Ton)',
    vehicleNumber: 'MH-15-EG-2219',
    dealType: 'shared_pool',
    dealTag: '🤝 Nashik Corridor Pool (Save 42% to Vashi/Pune)',
    isRecommendedDeal: true,
    fromLocation: 'Nashik / Pimpalgaon / Dindori Belt',
    toDestination: 'Vashi APMC (Navi Mumbai) / Pune APMC',
    distanceKm: 180,
    ratePerQuintal: 78,
    baseTripFare: 900,
    transitDurationHours: '4.5 hrs (Reaches 3:30 AM)',
    coolingOrCover: 'Ventilated Crate Racks',
    capacityTotalQuintals: 60,
    capacityAvailableQuintals: 24,
    coFarmersSharing: ['Balasaheb Pawar (20 Qtl Onion)', 'Sanjay Kadam (16 Qtl Tomato)'],
    departureSchedule: 'Today 6:00 PM',
    perks: [
      'Daily scheduled departure to Vashi & Pune mandis',
      'Includes crate tracking barcodes',
      'Free transit insurance against physical in-transit spoilage',
      'Driver coordinates directly with commission agent (Adatiya)'
    ],
    dealSavingsNote: 'Large 6-ton vehicle pooling slashes per-quintal freight to only ₹78 on long routes.',
    farmerNetBenefit: 'Saves over ₹2,400 per 20-quintal dispatch compared to local agent rates.',
    recommendedCommodities: ['Onion', 'Tomato', 'Cabbage', 'Potato', 'Cauliflower']
  }
];

/**
 * Compare all available deals against a farmer's specific produce lot
 * and calculate net realization, profit after transport, and savings.
 */
export function compareTransportDeals(params: {
  quantityQuintals: number;
  expectedRatePerKg: number;
  destinationMandi?: string;
  farmLocation?: string;
  deals?: TransportDeal[];
}): TransportComparisonResult[] {
  const {
    quantityQuintals = 20,
    expectedRatePerKg = 30,
    destinationMandi,
    deals = DEFAULT_TRANSPORT_DEALS
  } = params;

  const validQty = Math.max(1, quantityQuintals);
  const totalWeightKg = validQty * 100;
  const grossCropValue = totalWeightKg * expectedRatePerKg;

  // Standard solo vehicle market baseline (e.g. standard local agent hiring ₹3,000 to ₹3,600)
  const standardSoloHireCost = Math.max(2600, Math.round(validQty * 135));

  const results: TransportComparisonResult[] = deals.map((deal) => {
    // Check destination match boost
    let destinationMultiplier = 1.0;
    if (destinationMandi && !destinationMandi.toLowerCase().includes('all')) {
      const mandiKey = destinationMandi.toLowerCase();
      const dealDest = deal.toDestination.toLowerCase();
      if (dealDest.includes(mandiKey.slice(0, 4))) {
        destinationMultiplier = 0.95; // Slight efficiency discount for direct lane
      }
    }

    // Calculated freight cost based on rate per quintal vs minimum trip fare
    const calculatedRawFreight = Math.max(deal.baseTripFare, validQty * deal.ratePerQuintal * destinationMultiplier);
    const calculatedFreight = Math.round(calculatedRawFreight);
    const freightPerKg = Number((calculatedFreight / totalWeightKg).toFixed(2));
    const netFarmerEarnings = Math.max(0, grossCropValue - calculatedFreight);
    const netRealizationPerKg = Number((expectedRatePerKg - freightPerKg).toFixed(2));
    const savingsVsSoloHire = Math.max(0, standardSoloHireCost - calculatedFreight);

    // AI Deal Score (out of 100)
    // 40% based on low cost per kg
    // 25% based on transporter rating
    // 20% based on vehicle suitability & perks (crates, ventilation)
    // 15% based on transit schedule / early arrival
    const costScore = Math.min(40, Math.max(10, Math.round(40 - (freightPerKg / 2.5) * 20)));
    const ratingScore = Math.round((deal.transporterRating / 5.0) * 25);
    const perkScore = deal.dealType === 'shared_pool' ? 20 : deal.dealType === 'return_load' ? 18 : deal.dealType === 'ev_green' ? 19 : 14;
    const timeScore = deal.departureSchedule.toLowerCase().includes('today') || deal.departureSchedule.toLowerCase().includes('early') ? 15 : 10;
    const dealScore = Math.min(99, Math.max(65, costScore + ratingScore + perkScore + timeScore));

    // Recommendation reason
    let recommendationReason = '';
    if (deal.dealType === 'shared_pool') {
      recommendationReason = `Top Choice: Sharing truck space with nearby farmers saves ₹${savingsVsSoloHire.toLocaleString('en-IN')} and yields ₹${netRealizationPerKg}/kg net profit.`;
    } else if (deal.dealType === 'return_load') {
      recommendationReason = `Discount Deal: Returning empty carrier offers 40% cut; saves ₹${savingsVsSoloHire.toLocaleString('en-IN')} on long haul.`;
    } else if (deal.dealType === 'ev_green') {
      recommendationReason = `Eco Economy: Electric carrier with zero diesel surcharge, ideal smooth ride for delicate produce.`;
    } else if (deal.dealType === 'dedicated_express') {
      recommendationReason = `Urgent Express: Solo vehicle picks up at farm gate in 60 mins; fastest route to early morning auction.`;
    } else {
      recommendationReason = `Local Low Cost: Small 3-wheeler loader for short hops to nearby taluka mandi yard.`;
    }

    return {
      deal,
      calculatedFreight,
      freightPerKg,
      grossCropValue,
      netFarmerEarnings,
      netRealizationPerKg,
      savingsVsSoloHire,
      dealScore,
      recommendationReason,
      isBestDealForFarmer: false // Assigned after ranking below
    };
  });

  // Rank by highest deal score and lowest freight per kg
  results.sort((a, b) => b.dealScore - a.dealScore);

  // Mark the top 1 (or 2 if very close) as Best Deal for Farmer
  if (results.length > 0) {
    results[0].isBestDealForFarmer = true;
  }

  return results;
}

/**
 * Get the single best recommended transport deal for a specific ProduceListing
 */
export function suggestBestDealForListing(
  listing: ProduceListing,
  mandiRate?: MandiRate
): TransportComparisonResult {
  const qtyQtl = listing.unit === 'quintal'
    ? listing.quantity
    : listing.unit === 'crate'
    ? Number((listing.quantity * 0.25).toFixed(1))
    : Number((listing.quantity / 100).toFixed(1));

  const expectedRate = listing.expectedPricePerKg || (mandiRate?.modalPricePerKg ?? 28);

  const comparisons = compareTransportDeals({
    quantityQuintals: Math.max(1, qtyQtl),
    expectedRatePerKg: expectedRate,
    destinationMandi: listing.mandiYard,
    farmLocation: listing.farmLocation
  });

  return comparisons[0];
}

/**
 * Generate a new booking receipt
 */
export function createTransportBooking(params: {
  deal: TransportDeal;
  farmerName: string;
  farmerPhone: string;
  produceName: string;
  quantityQuintals: number;
  pickupLocation: string;
  destinationMandi: string;
  calculatedFreight: number;
  savings: number;
}): TransportBooking {
  const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
  return {
    id: `tb-${Date.now()}`,
    dealId: params.deal.id,
    farmerId: 'f-current',
    farmerName: params.farmerName,
    farmerPhone: params.farmerPhone,
    produceName: params.produceName,
    quantityQuintals: params.quantityQuintals,
    pickupLocation: params.pickupLocation,
    destinationMandi: params.destinationMandi,
    totalFreightCost: params.calculatedFreight,
    transporterName: params.deal.transporterName,
    transporterPhone: params.deal.transporterPhone,
    vehicleNumber: params.deal.vehicleNumber,
    vehicleType: params.deal.vehicleType,
    dealType: params.deal.dealType,
    bookingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    pickupTime: params.deal.departureSchedule,
    status: 'confirmed',
    trackingOtp: randomOtp,
    estimatedSavings: params.savings
  };
}
