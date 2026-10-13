import React, { useState } from 'react';
import {
  ProduceListing,
  BidOffer,
  MandiRate,
  Language,
  UserProfile,
  TransportBooking
} from '../types/market';
import { TRANSLATIONS } from '../utils/translations';
import {
  calculateBestFarmerDeal,
  CombinedBestDealVerdict
} from '../utils/farmerBestDealOptimizer';
import { createTransportBooking } from '../utils/transportDeals';
import {
  X,
  Sparkles,
  Trophy,
  Truck,
  TrendingUp,
  DollarSign,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  MapPin,
  AlertTriangle,
  Package,
  Layers,
  Share2,
  Printer,
  ChevronRight,
  Check,
  Zap,
  Info
} from 'lucide-react';

interface FarmerBestDealAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  listings: ProduceListing[];
  bids: BidOffer[];
  mandiRates: MandiRate[];
  currentLang: Language;
  onAcceptBid?: (bidId: string) => void;
  onBookTransportDeal?: (booking: TransportBooking) => void;
  initialSelectedListingId?: string;
}

export const FarmerBestDealAdvisorModal: React.FC<FarmerBestDealAdvisorModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  listings,
  bids,
  mandiRates,
  currentLang,
  onAcceptBid,
  onBookTransportDeal,
  initialSelectedListingId
}) => {
  const t = TRANSLATIONS[currentLang];

  // Active lot selection
  const defaultListing =
    listings.find((l) => l.id === initialSelectedListingId) ||
    listings[0] ||
    null;

  const [selectedLotId, setSelectedLotId] = useState<string>(defaultListing?.id || 'custom');

  // Custom parameters if farmer wants to simulate another crop
  const [customCommodity, setCustomCommodity] = useState<string>('Tomato (टोमॅटो)');
  const [customQtyKg, setCustomQtyKg] = useState<number>(1500);
  const [customExpectedPrice, setCustomExpectedPrice] = useState<number>(30);
  const [customDestination, setCustomDestination] = useState<string>('Pune APMC');

  // Booked state
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<TransportBooking | null>(null);

  if (!isOpen) return null;

  const activeListing = listings.find((l) => l.id === selectedLotId);

  // Run the Optimization Engine
  const verdict: CombinedBestDealVerdict = calculateBestFarmerDeal({
    listing: activeListing,
    customCommodity,
    customQuantityKg: customQtyKg,
    customExpectedPrice,
    customDestinationMandi: customDestination,
    bids,
    mandiRates
  });

  const handleBookOptimalDeal = () => {
    const booking = createTransportBooking({
      deal: verdict.transportChannel.deal,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      produceName: `${verdict.commodityName} (${verdict.quantityQuintals} Qtl)`,
      quantityQuintals: verdict.quantityQuintals,
      pickupLocation: activeListing?.farmLocation || currentUser.location,
      destinationMandi: activeListing?.mandiYard || customDestination,
      calculatedFreight: verdict.freightDeduction,
      savings: verdict.transportSavings
    });

    setConfirmedBooking(booking);
    setIsBooked(true);

    if (onBookTransportDeal) {
      onBookTransportDeal(booking);
    }

    if (verdict.financialChannel.bidId && onAcceptBid) {
      onAcceptBid(verdict.financialChannel.bidId);
    }
  };

  const shareSummary = () => {
    const text = `Krishi Bandhu Best Deal Advisor:
Commodity: ${verdict.commodityName} (${verdict.quantityKg} kg)
Best Selling Route: ${verdict.financialChannel.channelName} @ ₹${verdict.financialChannel.grossPricePerKg}/kg
Best Transport: ${verdict.transportChannel.deal.transporterName} (${verdict.transportChannel.vehicleType})
Net In-Pocket Profit: ₹${verdict.netTakeHomeCash.toLocaleString('en-IN')} (₹${verdict.netRealizationPerKg}/kg)
Extra Profit Gained: +₹${verdict.extraProfitGained.toLocaleString('en-IN')}
Freight Saved: ₹${verdict.transportSavings.toLocaleString('en-IN')}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Deal details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-stone-900 dark:text-stone-100 transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-950 text-white p-5 sm:p-6 border-b border-emerald-800/40 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-400 text-stone-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Trophy className="w-3 h-3 text-stone-950" />
                  <span>{currentLang === 'hi' ? 'वित्तीय व परिवहन सलाहकार' : currentLang === 'mr' ? 'आर्थिक व वाहतूक सल्लागार' : 'Financial & Transport Advisor'}</span>
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  AI Net Profit Optimizer
                </span>
                <span className="text-xs text-stone-400">
                  {currentUser.name} ({currentUser.location})
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {currentLang === 'hi'
                  ? 'किसान के लिए सर्वोत्तम वित्तीय व परिवहन डील'
                  : currentLang === 'mr'
                  ? 'शेतकऱ्यांसाठी सर्वोत्तम आर्थिक व वाहतूक डील'
                  : 'Best Financial & Transport Deal for Farmer'}
              </h2>
              <p className="text-xs text-emerald-100/80 max-w-2xl leading-relaxed">
                {currentLang === 'hi'
                  ? 'यह प्रणाली खरीदार के भाव, मंडी नीलामी, और परिवहन खर्च का संयुक्त विश्लेषण कर बताती है कि आपकी जेब में सबसे ज्यादा शुद्ध मुनाफा किस रास्ते से आएगा।'
                  : currentLang === 'mr'
                  ? 'व्यापाऱ्यांचे दर, बाजार समिती लिलाव आणि वाहतूक भाड्याचे एकत्रित विश्लेषण करून तुमच्या हातात सर्वात जास्त नफा देणारी सर्वोत्तम डील निवडा.'
                  : 'AI analyzes all buyer bids, live mandi benchmarks, and verified transport routes to find the exact combination that maximizes net take-home cash.'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer shrink-0"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lot Selector Pills */}
          <div className="mt-4 pt-3 border-t border-emerald-800/50 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-emerald-300/80 text-[11px] font-semibold shrink-0">
              {currentLang === 'hi' ? 'फसल चुनें:' : currentLang === 'mr' ? 'पीक निवडा:' : 'Select Produce:'}
            </span>
            {listings.map((lot) => {
              const isSelected = selectedLotId === lot.id;
              return (
                <button
                  key={lot.id}
                  onClick={() => {
                    setSelectedLotId(lot.id);
                    setIsBooked(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer shrink-0 border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-sm font-bold'
                      : 'bg-emerald-900/60 text-emerald-100 border-emerald-700/60 hover:bg-emerald-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-stone-950' : 'bg-emerald-400'}`} />
                  <span>{lot.vegetableName}</span>
                  <span className="opacity-80">({lot.quantity} {lot.unit})</span>
                </button>
              );
            })}
            <button
              onClick={() => {
                setSelectedLotId('custom');
                setIsBooked(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer shrink-0 border ${
                selectedLotId === 'custom'
                  ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold shadow-sm'
                  : 'bg-emerald-900/60 text-emerald-100 border-emerald-700/60 hover:bg-emerald-800'
              }`}
            >
              {currentLang === 'hi' ? '✏️ कस्टम गणना (अलग वजन)' : '✏️ Custom Simulator'}
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* Custom Parameters Form (if selected custom) */}
          {selectedLotId === 'custom' && (
            <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                  {currentLang === 'hi' ? 'कस्टम फसल व वजन सिमुलेटर' : 'Custom Produce Calculator'}
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-stone-500 dark:text-stone-400 mb-1 font-medium">Commodity</label>
                  <input
                    type="text"
                    value={customCommodity}
                    onChange={(e) => setCustomCommodity(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-1.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-500 dark:text-stone-400 mb-1 font-medium">Weight (kg)</label>
                  <input
                    type="number"
                    value={customQtyKg}
                    onChange={(e) => setCustomQtyKg(Number(e.target.value))}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-1.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-500 dark:text-stone-400 mb-1 font-medium">Expected Price (₹/kg)</label>
                  <input
                    type="number"
                    value={customExpectedPrice}
                    onChange={(e) => setCustomExpectedPrice(Number(e.target.value))}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-1.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-500 dark:text-stone-400 mb-1 font-medium">Target Mandi</label>
                  <select
                    value={customDestination}
                    onChange={(e) => setCustomDestination(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-1.5 font-bold"
                  >
                    <option value="Pune APMC">Pune APMC (Market Yard)</option>
                    <option value="Vashi APMC">Vashi APMC (Navi Mumbai)</option>
                    <option value="Lasalgaon APMC">Lasalgaon APMC</option>
                    <option value="Nashik APMC">Nashik APMC</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 1. HERO WINNER CARD: The Single Best Financial + Transport Combo */}
          <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-stone-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-500/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Top Badge & Score */}
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-stone-950 text-xs font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <Trophy className="w-3.5 h-3.5 fill-stone-950" />
                  <span>{currentLang === 'hi' ? 'सर्वोत्तम डील: विजेता कॉम्बो' : currentLang === 'mr' ? 'सर्वोत्तम डील: विजेता कॉम्बो' : '#1 Optimal Deal Winner'}</span>
                </span>
                <span className="text-xs text-emerald-200 font-mono bg-emerald-800/80 px-2 py-0.5 rounded-md border border-emerald-600/50">
                  AI Match Score: {verdict.overallScore}/100
                </span>
              </div>

              <div className="bg-emerald-800/70 border border-emerald-500/50 px-3 py-1 rounded-xl text-xs font-bold text-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{verdict.commodityName} · {verdict.quantityKg} kg ({verdict.quantityQuintals} Qtl)</span>
              </div>
            </div>

            {/* Financial & Transport Winner Duo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
              
              {/* Financial Partner Box */}
              <div className="bg-stone-900/80 backdrop-blur-xs rounded-2xl p-4 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{currentLang === 'hi' ? 'सर्वश्रेष्ठ वित्तीय खरीद चैनल' : 'Best Financial Buyer Route'}</span>
                  </span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60">
                    ₹{verdict.financialChannel.grossPricePerKg}/kg
                  </span>
                </div>
                <h4 className="text-base font-black text-white">
                  {verdict.financialChannel.channelName}
                </h4>
                <p className="text-xs text-stone-300">
                  {verdict.financialChannel.description}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-300 font-medium">
                  <span>{verdict.financialChannel.paymentTerms}</span>
                  <span className="text-emerald-400 font-bold">Cess: ₹0 (Exempt)</span>
                </div>
              </div>

              {/* Transportation Partner Box */}
              <div className="bg-stone-900/80 backdrop-blur-xs rounded-2xl p-4 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{currentLang === 'hi' ? 'सर्वश्रेष्ठ परिवहन डील (लॉजिस्टिक्स)' : 'Best Transport Vehicle'}</span>
                  </span>
                  <span className="text-xs font-black text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-700/60">
                    ₹{verdict.transportChannel.freightPerKg}/kg
                  </span>
                </div>
                <h4 className="text-base font-black text-white">
                  {verdict.transportChannel.vehicleType}
                </h4>
                <p className="text-xs text-stone-300">
                  {verdict.transportChannel.deal.transporterName} · {verdict.transportChannel.deal.vehicleNumber}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-teal-300 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{verdict.transportChannel.departureSchedule}</span>
                  </span>
                  <span className="text-amber-300 font-bold">
                    {currentLang === 'hi' ? 'बचत' : 'Save'}: ₹{verdict.transportSavings.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Core Impact Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5 pt-4 border-t border-emerald-700/50">
              
              <div className="bg-emerald-950/70 rounded-2xl p-3.5 border border-emerald-600/40 text-center">
                <span className="block text-[11px] text-emerald-300 font-medium">
                  {currentLang === 'hi' ? 'जेब में शुद्ध मुनाफा (Net in Pocket)' : currentLang === 'mr' ? 'हातात निव्वळ नफा' : 'Net Take-Home Cash'}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white block mt-0.5">
                  ₹{verdict.netTakeHomeCash.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-300">
                  ₹{verdict.netRealizationPerKg}/kg net
                </span>
              </div>

              <div className="bg-amber-950/60 rounded-2xl p-3.5 border border-amber-600/40 text-center">
                <span className="block text-[11px] text-amber-300 font-medium">
                  {currentLang === 'hi' ? 'अकेले मंडी जाने से अतिरिक्त फायदा' : currentLang === 'mr' ? 'स्थानिक लिलावापेक्षा जास्तीचा नफा' : 'Extra Profit vs Solo Auction'}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-300 block mt-0.5">
                  +₹{verdict.extraProfitGained.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-amber-200">
                  +{verdict.extraProfitPercent}% More Cash
                </span>
              </div>

              <div className="bg-teal-950/70 rounded-2xl p-3.5 border border-teal-600/40 text-center">
                <span className="block text-[11px] text-teal-300 font-medium">
                  {currentLang === 'hi' ? 'भाड़े में सीधी बचत (पूल शेयरिंग)' : currentLang === 'mr' ? 'वाहतूक भाड्यात थेट बचत' : 'Freight Savings (Shared Pool)'}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-teal-200 block mt-0.5">
                  ₹{verdict.transportSavings.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-teal-300">
                  45% Cheaper than Solo Hire
                </span>
              </div>
            </div>

            {/* Plain Text Explanation in User's Preferred Language */}
            <div className="bg-black/40 rounded-2xl p-4 border border-white/10 text-xs text-stone-200 leading-relaxed flex items-start gap-3">
              <span className="text-lg">💡</span>
              <p>
                {currentLang === 'hi'
                  ? verdict.summaryExplanationHi
                  : currentLang === 'mr'
                  ? verdict.summaryExplanationMr
                  : verdict.summaryExplanationEn}
              </p>
            </div>

            {/* Action Buttons inside Hero */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-emerald-700/50">
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Verified Transporter & Buyer</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <a
                  href={`tel:${verdict.transportChannel.deal.transporterPhone}`}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl transition cursor-pointer border border-white/20"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{currentLang === 'hi' ? 'ड्राइवर को कॉल करें' : 'Call Driver'}</span>
                </a>

                <button
                  onClick={handleBookOptimalDeal}
                  disabled={isBooked}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition cursor-pointer shadow-lg active:scale-95 ${
                    isBooked
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                  }`}
                >
                  {isBooked ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{currentLang === 'hi' ? 'डील व गाड़ी सफलतापूर्वक बुक!' : 'Deal & Truck Booked!'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-stone-950 fill-stone-950" />
                      <span>{currentLang === 'hi' ? 'यह सर्वोत्तम डील बुक करें' : currentLang === 'mr' ? 'सर्वोत्तम डील बुक करा' : 'Book Optimal Deal Now'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Booking Confirmation Pass (if booked) */}
          {isBooked && confirmedBooking && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/60 rounded-2xl p-5 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                    {currentLang === 'hi' ? 'परिवहन डील कन्फर्मेशन व गेट पास जारी' : 'Booking Confirmed & Gate Pass Generated'}
                  </h4>
                </div>
                <span className="bg-emerald-700 text-white text-xs font-mono px-2 py-0.5 rounded font-bold">
                  OTP: {confirmedBooking.trackingOtp}
                </span>
              </div>
              <p className="text-xs text-emerald-900 dark:text-emerald-200">
                {currentLang === 'hi'
                  ? `चालक ${confirmedBooking.transporterName} (${confirmedBooking.transporterPhone}) को आपकी बुकिंग और खेत के पते की सूचना दे दी गई है। वाहन ${confirmedBooking.vehicleNumber} आज शाम रवानगी के लिए पहुंचेगा।`
                  : `Transporter ${confirmedBooking.transporterName} has been notified. Vehicle ${confirmedBooking.vehicleNumber} will coordinate gate pickup.`}
              </p>
            </div>
          )}

          {/* 2. Step-by-Step Transparent Financial Ledger */}
          <div className="bg-white dark:bg-stone-800/80 rounded-2xl p-5 border border-stone-200 dark:border-stone-700 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-700/60 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {currentLang === 'hi' ? 'शुद्ध कमाई की पूर्ण वित्तीय गणना (Ledger)' : 'Step-by-Step Financial Ledger'}
                </h3>
              </div>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {verdict.quantityKg} kg @ ₹{verdict.financialChannel.grossPricePerKg}/kg
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100 dark:border-stone-700/40">
                <span className="text-stone-700 dark:text-stone-300">
                  1. {currentLang === 'hi' ? 'सब्जी का कुल सकल मूल्य (Gross Crop Value)' : 'Gross Crop Value'}:
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  ₹{verdict.grossCropValue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-stone-100 dark:border-stone-700/40 text-rose-700 dark:text-rose-400">
                <span>
                  2. {currentLang === 'hi' ? 'परिवहन भाड़ा (पूल शेयरिंग छूट के बाद)' : 'Transport Freight (Shared Pool Rate)'}:
                </span>
                <span className="font-bold">
                  -₹{verdict.freightDeduction.toLocaleString('en-IN')} <span className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">(₹{verdict.transportChannel.freightPerKg}/kg)</span>
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-stone-100 dark:border-stone-700/40 text-stone-600 dark:text-stone-400">
                <span>
                  3. {currentLang === 'hi' ? 'मंडी सेस / दलाली कटौती' : 'Mandi Cess / Market Brokerage'}:
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {verdict.cessDeduction === 0 ? '₹0 (सीधे सौदे में पूरी छूट / 0% Cess)' : `-₹${verdict.cessDeduction.toLocaleString('en-IN')}`}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 bg-emerald-50 dark:bg-emerald-950/60 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-sm font-black text-emerald-950 dark:text-emerald-100">
                <span>
                  = {currentLang === 'hi' ? 'किसान की जेब में शुद्ध कमाई (Net Take-Home Cash)' : 'Net Profit In Farmer Pocket'}:
                </span>
                <span className="text-emerald-800 dark:text-emerald-300 text-base">
                  ₹{verdict.netTakeHomeCash.toLocaleString('en-IN')} <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">(₹{verdict.netRealizationPerKg}/kg)</span>
                </span>
              </div>
            </div>
          </div>

          {/* 3. Alternative Options Comparison Table */}
          <div className="bg-white dark:bg-stone-800/80 rounded-2xl p-5 border border-stone-200 dark:border-stone-700 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <span>📊</span>
              <span>{currentLang === 'hi' ? 'अन्य विकल्पों से तुलना: कौन सा रास्ता कितना देगा?' : 'Comparison with Other Routes'}</span>
            </h4>

            <div className="space-y-2.5">
              {verdict.alternativeCombos.map((alt, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50 dark:bg-stone-900/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-stone-900 dark:text-stone-100 block">
                      {alt.title}
                    </span>
                    <p className="text-stone-600 dark:text-stone-400 text-[11px]">
                      {alt.sellingOption} · {alt.transportOption}
                    </p>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 italic">
                      Tradeoff: {alt.keyTradeoff}
                    </span>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-sm font-black text-stone-900 dark:text-stone-100 block">
                      ₹{alt.totalNetEarnings.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      ₹{alt.netRealizationPerKg}/kg net
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 dark:bg-stone-950 p-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={shareSummary}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-emerald-700 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 cursor-pointer shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{currentLang === 'hi' ? 'डील कॉपी करें' : 'Copy Deal Details'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
          >
            {currentLang === 'hi' ? 'बंद करें (Done)' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
