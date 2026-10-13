export type Role = 'farmer' | 'vendor' | 'apmc';
export type QualityGrade = 'Grade A' | 'Grade B' | 'Grade C';
export type Language = 'en' | 'hi' | 'mr';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserProfile {
  id: string;
  name: string;
  role: Role;
  phone: string;
  organization?: string;
  location: string;
  avatar?: string;
  verified: boolean;
}

export interface VegetableItem {
  id: string;
  name: string;
  hindiName: string;
  marathiName: string;
  category: 'Vegetables' | 'Tubers' | 'Leafy Greens' | 'Exotic';
  defaultUnit: 'kg' | 'quintal' | 'crate';
  sampleImages: string[];
}

export interface ProduceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmLocation: string; // e.g., District / Mandi zone (public)
  exactFarmAddress: string; // Private, revealed only on enquiry approval
  mandiYard: string;
  vegetableId: string;
  vegetableName: string;
  variety: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'crate';
  expectedPricePerKg: number;
  qualityGrade: QualityGrade;
  imageUrl: string;
  harvestDate: string;
  dispatchReadyDate: string;
  description: string;
  status: 'active' | 'negotiating' | 'sold' | 'dispatched';
  qualityMetrics: {
    freshnessScore: number;
    uniformityScore: number;
    defectFreeScore: number;
    moistureEstimate: string;
    aiVerificationNotes: string;
  };
  createdAt: string;
  bidsCount: number;
}

export interface BidOffer {
  id: string;
  listingId: string;
  vendorId: string;
  vendorName: string;
  vendorType: 'Wholesaler' | 'Retail Chain' | 'Exporter' | 'Hotel/HoReCa';
  vendorLocation: string;
  vendorPhone: string; // Private until enquiry approval
  offeredPricePerKg: number;
  offeredQuantity: number;
  unit: 'kg' | 'quintal' | 'crate';
  logistics: 'Farmer Delivery' | 'Vendor Mandi Pickup' | 'Farmgate Pickup';
  message: string;
  status: 'pending' | 'accepted' | 'countered' | 'rejected';
  counterPricePerKg?: number;
  createdAt: string;
}

export interface VendorRequirement {
  id: string;
  vendorId: string;
  vendorName: string;
  companyName: string;
  vendorPhone: string; // Private until enquiry approved
  exactDeliveryAddress: string; // Private
  deliveryLocation: string; // Public general zone
  preferredMandi: string;
  vegetableName: string;
  requiredQuantity: number;
  unit: 'kg' | 'quintal' | 'crate';
  targetPricePerKg: number;
  qualityGradeRequired: QualityGrade;
  neededByDate: string;
  paymentTerm: 'Immediate Mandi Cash' | '50% Advance UPI' | 'APMC Escrow Settlement';
  specialRequirements: string;
  status: 'open' | 'partially_fulfilled' | 'fulfilled' | 'closed';
  createdAt: string;
  matchedListingsCount: number;
}

export interface PricePredictionPoint {
  dayOffset: number; // 1 to 7
  dateStr: string;
  dayName: string;
  predictedModalPrice: number;
  predictedMinPrice: number;
  predictedMaxPrice: number;
  expectedChangePercent: number;
  confidencePercent: number;
  expectedArrivalVolumeQuintals: number;
  marketNote: string;
}

export interface RatePredictionIntelligence {
  predictedModal7Day: number;
  expectedChange7DayPercent: number;
  trendOutlook: 'Bullish' | 'Bearish' | 'Stable';
  confidenceScorePercent: number;
  peakDay: string;
  lowDay: string;
  recommendationFarmer: string;
  recommendationVendor: string;
  
  // Factor 1: Last 30 Days Trend
  last30Days: {
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    priceChange30dPercent: number;
    avgDailyArrivalsQuintals: number;
    arrivalTrend: 'rising' | 'declining' | 'stable';
    trendSummary: string;
    historyPoints: { dayLabel: string; price: number; arrivals: number }[];
  };

  // Factor 2: Last Year Historical Benchmark
  lastYear: {
    samePeriodPrice: number;
    yoyPriceChangePercent: number;
    seasonalTrendNote: string;
    historicalPeakMonth: string;
    yoyComparisonNote: string;
  };

  // Factor 3: Present Stock & Market Inflow
  presentStock: {
    currentArrivalsQuintals: number;
    yardInventoryStatus: 'Low / Shortage' | 'Adequate / Balanced' | 'Surplus / Heavy Inflow';
    estimatedDaysOfCoverage: number;
    mandiBufferLevel: string;
    supplyPressureScore: number;
    stockSummary: string;
  };

  // Factor 4: Future Stock & Harvest Supply Pipeline
  futureStock: {
    upcomingHarvestArrivalForecastQuintals: number;
    farmerPipelineChangePercent: number;
    expectedSupplyPhase: 'Constrained supply incoming' | 'Flush harvest peak expected' | 'Steady replenishment';
    harvestOutlookNote: string;
    regionalBeltSupply: string;
  };

  // Day-by-Day Forecast points (Day +1 to Day +7)
  sevenDayForecast: PricePredictionPoint[];
}

export interface MandiRate {
  id: string;
  vegetableName: string;
  hindiName: string;
  marathiName: string;
  mandiName: string;
  district: string;
  state: string;
  minPricePerKg: number;
  modalPricePerKg: number;
  maxPricePerKg: number;
  dailyArrivalQuintals: number;
  changePercent: number;
  lastUpdated: string;
  unit: '₹/kg';
  prediction?: RatePredictionIntelligence;
}

export interface GatePass {
  passNumber: string;
  farmerName: string;
  vendorName: string;
  mandiName: string;
  commodity: string;
  quantity: number;
  unit: string;
  ratePerKg: number;
  totalAmount: number;
  mandiFeePercent: number;
  mandiFeeAmount: number;
  vehicleNumber: string;
  gateNumber: string;
  issueTimestamp: string;
  qrData: string;
  status: 'ISSUED' | 'CHECKED_IN' | 'CLEARED';
}

export interface ContactEnquiry {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromRole: Role;
  fromPhone: string;
  fromLocation: string;
  toUserId: string;
  toUserName: string;
  toRole: Role;
  referenceType: 'produce' | 'requirement';
  referenceId: string;
  referenceTitle: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  farmerContact?: {
    name: string;
    phone: string;
    farmAddress: string;
    location: string;
  };
  vendorContact?: {
    name: string;
    companyName: string;
    phone: string;
    deliveryAddress: string;
    location: string;
  };
}

export type TransportDealType = 'shared_pool' | 'return_load' | 'dedicated_express' | 'ev_green' | 'budget_loader';

export interface TransportDeal {
  id: string;
  transporterName: string;
  transporterPhone: string;
  transporterRating: number;
  completedTrips: number;
  vehicleType: string;
  vehicleNumber: string;
  dealType: TransportDealType;
  dealTag: string; // e.g. '🏆 Best Value Deal (Save ₹1,850)', '⚡ Return Load 38% Off', '🤝 Farmer Pool Deal'
  isRecommendedDeal: boolean;
  fromLocation: string;
  toDestination: string;
  distanceKm: number;
  ratePerQuintal: number; // ₹ per quintal (100 kg)
  baseTripFare: number;
  transitDurationHours: string;
  coolingOrCover: 'Tarpaulin Crate Hood' | 'Ventilated Crate Racks' | 'Insulated Canopy' | 'Open Carrier';
  capacityTotalQuintals: number;
  capacityAvailableQuintals: number;
  coFarmersSharing?: string[];
  departureSchedule: string;
  perks: string[];
  dealSavingsNote: string;
  farmerNetBenefit: string;
  recommendedCommodities?: string[];
}

export interface TransportComparisonResult {
  deal: TransportDeal;
  calculatedFreight: number;
  freightPerKg: number;
  grossCropValue: number;
  netFarmerEarnings: number;
  netRealizationPerKg: number;
  savingsVsSoloHire: number;
  dealScore: number;
  recommendationReason: string;
  isBestDealForFarmer: boolean;
}

export interface TransportBooking {
  id: string;
  dealId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  produceName: string;
  quantityQuintals: number;
  pickupLocation: string;
  destinationMandi: string;
  totalFreightCost: number;
  transporterName: string;
  transporterPhone: string;
  vehicleNumber: string;
  vehicleType: string;
  dealType: TransportDealType;
  bookingTime: string;
  pickupTime: string;
  status: 'confirmed' | 'dispatched' | 'delivered';
  trackingOtp: string;
  estimatedSavings: number;
}
