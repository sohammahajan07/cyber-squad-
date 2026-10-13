import {
  ProduceListing,
  BidOffer,
  MandiRate,
  TransportDeal,
  Language
} from '../types/market';
import { DEFAULT_TRANSPORT_DEALS } from './transportDeals';
import { generateRatePrediction } from './ratePredictor';

export interface FinancialChannelOption {
  id: string;
  channelName: string;
  channelType: 'vendor_bid' | 'mandi_auction' | 'forecast_hold' | 'direct_procurement';
  buyerName: string;
  buyerPhone?: string;
  location: string;
  grossPricePerKg: number;
  grossTotalValue: number;
  paymentTerms: string;
  mandiCessDeduction: number;
  riskLevel: 'Low (Guaranteed)' | 'Medium (Auction Volatility)' | 'High (Holding Spoilage Risk)';
  description: string;
  bidId?: string;
}

export interface TransportChannelOption {
  deal: TransportDeal;
  freightCost: number;
  freightPerKg: number;
  savingsVsSoloHire: number;
  vehicleType: string;
  departureSchedule: string;
  dealType: string;
}

export interface CombinedBestDealVerdict {
  listingId?: string;
  commodityName: string;
  quantityKg: number;
  quantityQuintals: number;

  // Selected Best Financial Channel
  financialChannel: FinancialChannelOption;

  // Selected Best Transport Channel
  transportChannel: TransportChannelOption;

  // Net Calculations
  grossCropValue: number;
  freightDeduction: number;
  cessDeduction: number;
  netTakeHomeCash: number;
  netRealizationPerKg: number;

  // Benchmark Comparisons
  baselineLocalAuctionNet: number;
  extraProfitGained: number;
  extraProfitPercent: number;
  transportSavings: number;

  // Verdict & Guidance
  overallScore: number; // 0-100
  badgeTitle: string;
  summaryExplanationEn: string;
  summaryExplanationHi: string;
  summaryExplanationMr: string;
  actionRecommendation: string;

  // Alternative Deals
  alternativeCombos: {
    title: string;
    sellingOption: string;
    transportOption: string;
    netRealizationPerKg: number;
    totalNetEarnings: number;
    keyTradeoff: string;
  }[];
}

/**
 * Evaluates all financial selling routes and transportation options
 * to identify the optimal net deal for the farmer.
 */
export function calculateBestFarmerDeal(params: {
  listing?: ProduceListing;
  customCommodity?: string;
  customQuantityKg?: number;
  customExpectedPrice?: number;
  customLocation?: string;
  customDestinationMandi?: string;
  bids?: BidOffer[];
  mandiRates?: MandiRate[];
}): CombinedBestDealVerdict {
  const {
    listing,
    customCommodity = 'Tomato (टोमॅटो)',
    customQuantityKg = 1200,
    customExpectedPrice = 28,
    customLocation = 'Niphad, Nashik',
    customDestinationMandi = 'Lasalgaon APMC',
    bids = [],
    mandiRates = []
  } = params;

  // 1. Determine base commodity parameters
  const commodityName = listing ? listing.vegetableName : customCommodity;
  const quantityKg = listing
    ? listing.unit === 'quintal'
      ? listing.quantity * 100
      : listing.unit === 'crate'
      ? listing.quantity * 25
      : listing.quantity
    : customQuantityKg;

  const quantityQuintals = Number((quantityKg / 100).toFixed(1));
  const askingPricePerKg = listing ? listing.expectedPricePerKg : customExpectedPrice;
  const mandiYard = listing ? listing.mandiYard : customDestinationMandi;
  const farmLocation = listing ? listing.farmLocation : customLocation;

  // Find matching mandi rates for benchmarks
  const normName = commodityName.toLowerCase();
  const matchedRate = mandiRates.find((r) =>
    r.vegetableName.toLowerCase().includes(normName.slice(0, 4)) ||
    (r.hindiName && r.hindiName.includes(normName.slice(0, 3)))
  ) || mandiRates[0];

  const currentBenchmarkModalRate = matchedRate ? matchedRate.modalPricePerKg : askingPricePerKg;

  // 2. Financial Channels Available
  const financialChannels: FinancialChannelOption[] = [];

  // Channel 1: Incoming Vendor Bids (if any)
  const listingBids = listing ? bids.filter((b) => b.listingId === listing.id) : bids;
  const bestBid = listingBids.length > 0
    ? [...listingBids].sort((a, b) => b.offeredPricePerKg - a.offeredPricePerKg)[0]
    : null;

  if (bestBid) {
    financialChannels.push({
      id: 'fc-vendor-bid',
      channelName: `Direct Buyer Bid (${bestBid.vendorName})`,
      channelType: 'vendor_bid',
      buyerName: bestBid.vendorName,
      buyerPhone: bestBid.vendorPhone,
      location: bestBid.vendorLocation,
      grossPricePerKg: bestBid.offeredPricePerKg,
      grossTotalValue: Math.round(quantityKg * bestBid.offeredPricePerKg),
      paymentTerms: 'Immediate UPI / Mandi Gate Cash (Zero default risk)',
      mandiCessDeduction: 0, // Direct trade exemption
      riskLevel: 'Low (Guaranteed)',
      description: `Firm buyer bid from verified vendor. Direct gate handover, no market deduction.`,
      bidId: bestBid.id
    });
  } else {
    // Simulated verified buyer inquiry rate (FreshKart / Swastik Agro)
    const simulatedBidRate = Number((currentBenchmarkModalRate * 1.06).toFixed(1));
    financialChannels.push({
      id: 'fc-vendor-simulated',
      channelName: 'Verified Direct Buyer (FreshKart / Swastik Agro)',
      channelType: 'vendor_bid',
      buyerName: 'FreshKart Wholesale Chain',
      buyerPhone: '+91 98190 77221',
      location: 'Vashi / Pune Hub',
      grossPricePerKg: simulatedBidRate,
      grossTotalValue: Math.round(quantityKg * simulatedBidRate),
      paymentTerms: '100% Guaranteed Bank Transfer / Gate Cash',
      mandiCessDeduction: 0,
      riskLevel: 'Low (Guaranteed)',
      description: `Direct supermarket procurement offering ₹${simulatedBidRate}/kg with 0% middleman commission.`
    });
  }

  // Channel 2: APMC Mandi Auction Today (with standard 4% market cess/labor)
  const mandiAuctionPrice = currentBenchmarkModalRate;
  const mandiCess = Math.round(quantityKg * mandiAuctionPrice * 0.04);
  financialChannels.push({
    id: 'fc-mandi-today',
    channelName: `${mandiYard} Today's Live Auction`,
    channelType: 'mandi_auction',
    buyerName: 'APMC Open Auction / Adatiya Commission',
    location: mandiYard,
    grossPricePerKg: mandiAuctionPrice,
    grossTotalValue: Math.round(quantityKg * mandiAuctionPrice),
    paymentTerms: 'APMC Electronic e-NAM settlement (24-48 hrs)',
    mandiCessDeduction: mandiCess,
    riskLevel: 'Medium (Auction Volatility)',
    description: `Official regulated yard auction. Modal rate ₹${mandiAuctionPrice}/kg minus 4% market cess (₹${mandiCess}).`
  });

  // Channel 3: Higher Hub Mandi (Vashi / Pune)
  const vashiRate = mandiRates.find((r) => r.mandiName.includes('Vashi'))?.modalPricePerKg || currentBenchmarkModalRate + 3;
  const vashiCess = Math.round(quantityKg * vashiRate * 0.045);
  financialChannels.push({
    id: 'fc-mandi-vashi',
    channelName: `Vashi APMC Navi Mumbai (High Demand Terminal)`,
    channelType: 'mandi_auction',
    buyerName: 'Vashi Wholesale Terminal',
    location: 'Vashi APMC, Navi Mumbai',
    grossPricePerKg: vashiRate,
    grossTotalValue: Math.round(quantityKg * vashiRate),
    paymentTerms: 'Direct Terminal Payment',
    mandiCessDeduction: vashiCess,
    riskLevel: 'Medium (Auction Volatility)',
    description: `Mumbai terminal attracts premium rates (₹${vashiRate}/kg) for export/urban demand.`
  });

  // Channel 4: 7-Day Peak Prediction (Holding Arbitrage)
  if (matchedRate) {
    const pred = matchedRate.prediction || generateRatePrediction(matchedRate);
    if (pred.predictedModal7Day > currentBenchmarkModalRate) {
      financialChannels.push({
        id: 'fc-forecast-hold',
        channelName: `Hold 3 Days for Forecast Peak (₹${pred.predictedModal7Day}/kg)`,
        channelType: 'forecast_hold',
        buyerName: 'Upcoming Mandi Demand Surge',
        location: mandiYard,
        grossPricePerKg: pred.predictedModal7Day,
        grossTotalValue: Math.round(quantityKg * pred.predictedModal7Day),
        paymentTerms: 'Future Mandi Settlement',
        mandiCessDeduction: Math.round(quantityKg * pred.predictedModal7Day * 0.04),
        riskLevel: 'High (Holding Spoilage Risk)',
        description: `AI Model predicts +${pred.expectedChange7DayPercent}% price rise due to weather and weekend supply dips.`
      });
    }
  }

  // 3. Transportation Channels Evaluated
  const standardSoloCost = Math.max(2600, Math.round(quantityQuintals * 135));

  const transportOptions: TransportChannelOption[] = DEFAULT_TRANSPORT_DEALS.map((deal) => {
    const rawCost = Math.max(deal.baseTripFare, quantityQuintals * deal.ratePerQuintal);
    const freightCost = Math.round(rawCost);
    const freightPerKg = Number((freightCost / Math.max(1, quantityKg)).toFixed(2));
    const savingsVsSoloHire = Math.max(0, standardSoloCost - freightCost);

    return {
      deal,
      freightCost,
      freightPerKg,
      savingsVsSoloHire,
      vehicleType: deal.vehicleType,
      departureSchedule: deal.departureSchedule,
      dealType: deal.dealType
    };
  });

  // Sort transport options by lowest freight and highest savings
  transportOptions.sort((a, b) => {
    // Prefer shared pool or return load
    const aBonus = (a.deal.dealType === 'shared_pool' ? 30 : a.deal.dealType === 'return_load' ? 25 : 10);
    const bBonus = (b.deal.dealType === 'shared_pool' ? 30 : b.deal.dealType === 'return_load' ? 25 : 10);
    return (b.savingsVsSoloHire + bBonus * 50) - (a.savingsVsSoloHire + aBonus * 50);
  });

  // 4. Find the Absolute Best Financial + Transport Combo
  let bestCombo: {
    fin: FinancialChannelOption;
    tr: TransportChannelOption;
    netCash: number;
    netPerKg: number;
    score: number;
  } | null = null;

  for (const fin of financialChannels) {
    for (const tr of transportOptions) {
      // If financial channel is vendor bid with farmgate pickup, freight might be zero or subsidized!
      const actualFreight = fin.id === 'fc-vendor-bid' && bestBid?.logistics === 'Vendor Mandi Pickup'
        ? Math.round(tr.freightCost * 0.3) // Vendor handles major part
        : tr.freightCost;

      const netCash = fin.grossTotalValue - actualFreight - fin.mandiCessDeduction;
      const netPerKg = Number((netCash / Math.max(1, quantityKg)).toFixed(2));

      // Scoring: Net profit (50%), Transport savings (25%), Risk/certainty (25%)
      const riskBonus = fin.riskLevel.includes('Low') ? 25 : fin.riskLevel.includes('Medium') ? 18 : 10;
      const trBonus = tr.deal.dealType === 'shared_pool' ? 20 : tr.deal.dealType === 'return_load' ? 18 : 12;
      const profitScore = Math.min(55, Math.round((netPerKg / askingPricePerKg) * 45));

      const totalScore = Math.min(99, profitScore + trBonus + riskBonus);

      if (!bestCombo || totalScore > bestCombo.score) {
        bestCombo = {
          fin,
          tr,
          netCash,
          netPerKg,
          score: totalScore
        };
      }
    }
  }

  // Fallback if needed
  const selectedFin = bestCombo ? bestCombo.fin : financialChannels[0];
  const selectedTr = bestCombo ? bestCombo.tr : transportOptions[0];

  const grossCropValue = selectedFin.grossTotalValue;
  const freightDeduction = selectedTr.freightCost;
  const cessDeduction = selectedFin.mandiCessDeduction;
  const netTakeHomeCash = Math.max(0, grossCropValue - freightDeduction - cessDeduction);
  const netRealizationPerKg = Number((netTakeHomeCash / Math.max(1, quantityKg)).toFixed(2));

  // Baseline Comparison: Default local mandi auction + solo vehicle
  const baselineGross = Math.round(quantityKg * currentBenchmarkModalRate);
  const baselineFreight = standardSoloCost;
  const baselineCess = Math.round(baselineGross * 0.04);
  const baselineLocalAuctionNet = Math.max(0, baselineGross - baselineFreight - baselineCess);

  const extraProfitGained = Math.max(0, netTakeHomeCash - baselineLocalAuctionNet);
  const extraProfitPercent = baselineLocalAuctionNet > 0
    ? Number(((extraProfitGained / baselineLocalAuctionNet) * 100).toFixed(1))
    : 18.5;

  const transportSavings = selectedTr.savingsVsSoloHire;

  // Clear multilingual explanations
  const summaryExplanationEn = `Choosing ${selectedFin.channelName} (at ₹${selectedFin.grossPricePerKg}/kg) paired with ${selectedTr.deal.transporterName}'s ${selectedTr.vehicleType} yields ₹${netTakeHomeCash.toLocaleString('en-IN')} net in your pocket (₹${netRealizationPerKg}/kg). You make +₹${extraProfitGained.toLocaleString('en-IN')} (+${extraProfitPercent}%) more than local solo mandi auction and save ₹${transportSavings.toLocaleString('en-IN')} on transport freight.`;

  const summaryExplanationHi = `${selectedFin.channelName} (भाव ₹${selectedFin.grossPricePerKg}/किग्रा) और ${selectedTr.deal.transporterName} की ${selectedTr.vehicleType} (पूल शेयरिंग) चुनना आपके लिए सबसे फायदेमंद है। इससे आपको शुद्ध ₹${netTakeHomeCash.toLocaleString('en-IN')} (₹${netRealizationPerKg}/किग्रा) की कमाई होगी। सामान्य अकेले मंडी जाने की तुलना में आपको +₹${extraProfitGained.toLocaleString('en-IN')} (+${extraProfitPercent}%) अधिक मुनाफा मिलेगा और भाड़े में ₹${transportSavings.toLocaleString('en-IN')} की सीधी बचत होगी।`;

  const summaryExplanationMr = `${selectedFin.channelName} (दर ₹${selectedFin.grossPricePerKg}/किलो) आणि ${selectedTr.deal.transporterName} यांची ${selectedTr.vehicleType} (शेअरींग) निवडणे सर्वात फायदेशीर आहे. यातून तुमच्या हातात निव्वळ ₹${netTakeHomeCash.toLocaleString('en-IN')} (₹${netRealizationPerKg}/किलो) मिळतील. स्थानिक लिलावापेक्षा +₹${extraProfitGained.toLocaleString('en-IN')} (+${extraProfitPercent}%) जास्तीचा नफा आणि भाड्यात ₹${transportSavings.toLocaleString('en-IN')} ची बचत होईल.`;

  // Alternatives for comparison
  const alternativeCombos = [
    {
      title: '⚡ Fast Farmgate Pickup (Immediate Cash)',
      sellingOption: 'Direct Buyer Pickup (No Mandi Waiting)',
      transportOption: 'Buyer Handles Primary Transit',
      netRealizationPerKg: Number((selectedFin.grossPricePerKg * 0.95).toFixed(2)),
      totalNetEarnings: Math.round(quantityKg * selectedFin.grossPricePerKg * 0.95),
      keyTradeoff: 'Guaranteed cash within 1 hour, zero transit risk'
    },
    {
      title: '📈 High-Price Terminal Route (Vashi / Navi Mumbai)',
      sellingOption: 'Vashi APMC Wholesale Terminal (₹27-₹34/kg)',
      transportOption: 'Manoj Shinde Return-Load Eicher (40% off)',
      netRealizationPerKg: Number(((vashiRate * quantityKg - 1800) / quantityKg).toFixed(2)),
      totalNetEarnings: Math.round(vashiRate * quantityKg - 1800),
      keyTradeoff: 'Higher gross selling price; 4 hour transit time'
    },
    {
      title: '⚠️ Traditional Solo Mandi Route (Not Recommended)',
      sellingOption: 'Local Mandi Open Auction (Unpredictable Rate)',
      transportOption: 'Private Solo Vehicle Hire (Full Cost)',
      netRealizationPerKg: Number((baselineLocalAuctionNet / quantityKg).toFixed(2)),
      totalNetEarnings: baselineLocalAuctionNet,
      keyTradeoff: `Loses ₹${extraProfitGained.toLocaleString('en-IN')} in excessive freight and middleman cuts`
    }
  ];

  return {
    listingId: listing?.id,
    commodityName,
    quantityKg,
    quantityQuintals,
    financialChannel: selectedFin,
    transportChannel: selectedTr,
    grossCropValue,
    freightDeduction,
    cessDeduction,
    netTakeHomeCash,
    netRealizationPerKg,
    baselineLocalAuctionNet,
    extraProfitGained,
    extraProfitPercent,
    transportSavings,
    overallScore: bestCombo ? bestCombo.score : 95,
    badgeTitle: '🏆 AI #1 Optimal Financial & Transport Match',
    summaryExplanationEn,
    summaryExplanationHi,
    summaryExplanationMr,
    actionRecommendation: 'Accept this buyer deal and confirm the shared pool truck reservation before 6:30 PM departure.',
    alternativeCombos
  };
}
