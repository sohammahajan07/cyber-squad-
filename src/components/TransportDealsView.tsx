import React, { useState } from 'react';
import {
  ProduceListing,
  MandiRate,
  Language,
  UserProfile,
  TransportBooking
} from '../types/market';
import { TRANSLATIONS } from '../utils/translations';
import {
  DEFAULT_TRANSPORT_DEALS,
  compareTransportDeals,
  createTransportBooking
} from '../utils/transportDeals';
import {
  Truck,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Leaf,
  Users,
  ArrowRight,
  Filter,
  Star,
  Percent,
  X,
  Package,
  Share2,
  Printer
} from 'lucide-react';

interface TransportDealsViewProps {
  currentUser: UserProfile;
  listings: ProduceListing[];
  mandiRates: MandiRate[];
  currentLang: Language;
  onOpenSellModal?: () => void;
  preSelectedListingId?: string;
}

export const TransportDealsView: React.FC<TransportDealsViewProps> = ({
  currentUser,
  listings,
  mandiRates,
  currentLang,
  preSelectedListingId
}) => {
  const t = TRANSLATIONS[currentLang];

  // Active produce lot selection (if farmer has active lots)
  const defaultListing =
    listings.find((l) => l.id === preSelectedListingId) ||
    listings[0] ||
    null;

  const [selectedLotId, setSelectedLotId] = useState<string>(defaultListing?.id || 'custom');
  
  // Custom parameters if no lot or manual adjustment
  const [customCommodity, setCustomCommodity] = useState<string>(defaultListing?.vegetableName || 'Tomato (टोमॅटो)');
  const [customQuantityQtl, setCustomQuantityQtl] = useState<number>(
    defaultListing
      ? defaultListing.unit === 'quintal'
        ? defaultListing.quantity
        : defaultListing.unit === 'crate'
        ? Math.round(defaultListing.quantity * 0.25)
        : Math.round(defaultListing.quantity / 100)
      : 20
  );
  const [customDestination, setCustomDestination] = useState<string>(defaultListing?.mandiYard || 'Pune APMC');
  const [customExpectedRate, setCustomExpectedRate] = useState<number>(defaultListing?.expectedPricePerKg || 32);

  // Filters
  const [dealTypeFilter, setDealTypeFilter] = useState<string>('all');
  
  // Booking state
  const [bookedDeals, setBookedDeals] = useState<TransportBooking[]>([]);
  const [activeBookingModal, setActiveBookingModal] = useState<TransportBooking | null>(null);
  const [bookingSuccessToast, setBookingSuccessToast] = useState<string | null>(null);

  // Determine current active lot parameters
  const currentLot = listings.find((l) => l.id === selectedLotId);

  const activeQtyQtl = currentLot
    ? currentLot.unit === 'quintal'
      ? currentLot.quantity
      : currentLot.unit === 'crate'
      ? Math.round(currentLot.quantity * 0.25)
      : Math.round(currentLot.quantity / 100)
    : customQuantityQtl;

  const activeDestination = currentLot ? currentLot.mandiYard : customDestination;
  const activeExpectedRate = currentLot ? currentLot.expectedPricePerKg : customExpectedRate;
  const activeCommodity = currentLot ? currentLot.vegetableName : customCommodity;

  // Run deal engine to rank and compute net farmer realization
  const comparedResults = compareTransportDeals({
    quantityQuintals: Math.max(1, activeQtyQtl),
    expectedRatePerKg: Math.max(1, activeExpectedRate),
    destinationMandi: activeDestination,
    farmLocation: currentLot?.farmLocation || currentUser.location,
    deals: DEFAULT_TRANSPORT_DEALS
  });

  // Filter deals
  const filteredResults = comparedResults.filter((r) => {
    if (dealTypeFilter === 'all') return true;
    if (dealTypeFilter === 'recommended') return r.isBestDealForFarmer;
    if (dealTypeFilter === 'shared_pool') return r.deal.dealType === 'shared_pool';
    if (dealTypeFilter === 'return_load') return r.deal.dealType === 'return_load';
    if (dealTypeFilter === 'ev_green') return r.deal.dealType === 'ev_green';
    return true;
  });

  // The single best deal for farmer
  const bestResult = comparedResults[0];

  const handleSelectLot = (listing: ProduceListing) => {
    setSelectedLotId(listing.id);
    const qtl =
      listing.unit === 'quintal'
        ? listing.quantity
        : listing.unit === 'crate'
        ? Math.round(listing.quantity * 0.25)
        : Math.round(listing.quantity / 100);
    setCustomQuantityQtl(qtl);
    setCustomCommodity(listing.vegetableName);
    setCustomDestination(listing.mandiYard);
    setCustomExpectedRate(listing.expectedPricePerKg);
  };

  const handleBookDeal = (dealResult: typeof comparedResults[0]) => {
    const booking = createTransportBooking({
      deal: dealResult.deal,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      produceName: `${activeCommodity} (${activeQtyQtl} Quintals)`,
      quantityQuintals: activeQtyQtl,
      pickupLocation: currentLot?.farmLocation || currentUser.location,
      destinationMandi: activeDestination,
      calculatedFreight: dealResult.calculatedFreight,
      savings: dealResult.savingsVsSoloHire
    });

    setBookedDeals([booking, ...bookedDeals]);
    setActiveBookingModal(booking);
    setBookingSuccessToast(t.transportBookingSuccess);
    setTimeout(() => {
      setBookingSuccessToast(null);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {bookingSuccessToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-700 flex items-center gap-2.5 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span className="text-xs font-semibold">{bookingSuccessToast}</span>
        </div>
      )}

      {/* 1. Header Banner & Why Logistics Deals Matter for Farmer */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-emerald-950 text-white rounded-2xl p-6 shadow-xs border border-teal-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-stone-900 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-stone-900" />
                <span>{t.bestTransportDeal}</span>
              </span>
              <span className="bg-teal-800/80 text-teal-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-teal-600/40">
                {currentLang === 'hi'
                  ? 'भाड़े में ४५% तक की सीधी बचत'
                  : currentLang === 'mr'
                  ? 'वाहतूक खर्चात ४५% थेट बचत'
                  : 'Save up to 45% on Mandi Freight'}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t.transportDeals}
            </h2>
            <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
              {currentLang === 'hi'
                ? 'अकेले प्राइवेट वाहन करने के बजाय साझा सामुदायिक ट्रक (Community Pool) या खाली लौटते वाहन (Return Load) से सब्जी भेजें। इससे आपकी शुद्ध कमाई (Net Realization) ₹२ से ₹३ प्रति किलो बढ़ जाती है।'
                : currentLang === 'mr'
                ? 'स्वतंत्र गाडी करण्याऐवजी गावच्या शेतकरी बंधूंसोबत शेअरींग ट्रक (Community Pool) किंवा परतीची रिकामी गाडी (Return Load) निवडा. निव्वळ हातात मिळणारा नफा ₹२ ते ₹३ प्रति किलो वाढवा.'
                : 'Cut middleman transport inflation. Compare shared farmer pool trucks, empty return-load discounts, and EV carriers to maximize your net profit per kg.'}
            </p>
          </div>

          {/* Quick Pillar Highlights */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 bg-teal-950/60 p-3 rounded-xl border border-teal-700/40 text-xs shrink-0">
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                🤝
              </div>
              <div>
                <span className="block font-semibold text-white">
                  {currentLang === 'hi' ? 'पूल शेयरिंग' : currentLang === 'mr' ? 'पूल शेअरींग' : 'Shared Pool'}
                </span>
                <span className="text-[10px] text-teal-300">
                  {currentLang === 'hi' ? '४५% भाड़ा बचत' : currentLang === 'mr' ? '४५% भाडे बचत' : 'Save 45%'}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-teal-700/60 hidden md:block" />

            <div className="flex items-center gap-2 px-2 py-1">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-900 flex items-center justify-center font-bold">
                ⚡
              </div>
              <div>
                <span className="block font-semibold text-white">
                  {currentLang === 'hi' ? 'रिटर्न लोड' : currentLang === 'mr' ? 'रिटर्न लोड' : 'Return Load'}
                </span>
                <span className="text-[10px] text-amber-300">
                  {currentLang === 'hi' ? '४०% तक छूट' : currentLang === 'mr' ? '४०% पर्यंत सूट' : '40% Discount'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Optimizer & Active Produce Lot Picker */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-stone-900">
              {t.selectProduceToOptimize}
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            {currentLang === 'hi'
              ? 'उपज व वजन बदलते ही सबसे अच्छी डील तुरंत अपडेट होगी'
              : currentLang === 'mr'
              ? 'शेतमाल निवडताच सर्वोत्तम डील त्वरित दिसेल'
              : 'Auto-calculates freight & net take-home earnings'}
          </span>
        </div>

        {/* Existing Lots Quick Buttons (if any) */}
        {listings.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 block">
              {currentLang === 'hi' ? 'मेरी पंजीकृत फसलें (लॉट्स):' : currentLang === 'mr' ? 'माझे नोंदणीकृत लॉट्स:' : 'My Listed Produce Lots:'}
            </label>
            <div className="flex flex-wrap gap-2">
              {listings.map((l) => {
                const isSelected = selectedLotId === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => handleSelectLot(l)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold ring-2 ring-emerald-500/20'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>{l.vegetableName}</span>
                    <span className="text-stone-500">
                      ({l.quantity} {l.unit})
                    </span>
                    <span className="text-emerald-700 font-bold">
                      → {l.mandiYard.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
              <button
                onClick={() => setSelectedLotId('custom')}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                  selectedLotId === 'custom'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {currentLang === 'hi' ? '✏️ कस्टम गणना (अलग वजन)' : currentLang === 'mr' ? '✏️ कस्टम मोजमाप' : '✏️ Custom Calculation'}
              </button>
            </div>
          </div>
        )}

        {/* Custom Parameters Form (if custom mode or refining) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/80 text-xs">
          <div>
            <label className="block text-stone-600 font-medium mb-1">
              {currentLang === 'hi' ? 'फसल / सब्जी' : currentLang === 'mr' ? 'भाजीपाला' : 'Commodity'}
            </label>
            <input
              type="text"
              value={customCommodity}
              onChange={(e) => {
                setCustomCommodity(e.target.value);
                if (selectedLotId !== 'custom') setSelectedLotId('custom');
              }}
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1">
              {currentLang === 'hi' ? 'अनुमानित वजन (क्विंटल)' : currentLang === 'mr' ? 'एकूण वजन (क्विंटल)' : 'Weight (Quintals)'}
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={customQuantityQtl}
              onChange={(e) => {
                setCustomQuantityQtl(Number(e.target.value));
                if (selectedLotId !== 'custom') setSelectedLotId('custom');
              }}
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-emerald-900"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1">
              {currentLang === 'hi' ? 'गंतव्य मंडी' : currentLang === 'mr' ? 'बाजार समिती (मंडी)' : 'Target APMC Mandi'}
            </label>
            <select
              value={customDestination}
              onChange={(e) => {
                setCustomDestination(e.target.value);
                if (selectedLotId !== 'custom') setSelectedLotId('custom');
              }}
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Pune APMC">Pune APMC (Market Yard)</option>
              <option value="Vashi APMC">Vashi APMC (Navi Mumbai)</option>
              <option value="Nashik APMC">Nashik APMC</option>
              <option value="Kolhapur APMC">Kolhapur APMC</option>
              <option value="Sangli APMC">Sangli APMC</option>
            </select>
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1">
              {currentLang === 'hi' ? 'अपेक्षित भाव (₹/किलो)' : currentLang === 'mr' ? 'अपेक्षित बाजारभाव (₹/किलो)' : 'Expected Rate (₹/kg)'}
            </label>
            <input
              type="number"
              min="5"
              max="250"
              value={customExpectedRate}
              onChange={(e) => {
                setCustomExpectedRate(Number(e.target.value));
                if (selectedLotId !== 'custom') setSelectedLotId('custom');
              }}
              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
            />
          </div>
        </div>

        {/* 3. Live Deal Comparison Summary Box for Farmer */}
        {bestResult && (
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50/60 rounded-xl p-4 border border-emerald-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>{currentLang === 'hi' ? 'सर्वोत्तम डील' : currentLang === 'mr' ? 'सर्वोत्तम डील' : 'Optimal Deal Identified'}</span>
                </span>
                <span className="text-xs font-bold text-stone-900">
                  {bestResult.deal.vehicleType}
                </span>
              </div>
              <p className="text-xs text-stone-700">
                {bestResult.recommendationReason}
              </p>
            </div>

            {/* Financial Metrics */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-white px-3 py-2 rounded-xl border border-emerald-200 shadow-2xs text-center">
                <span className="block text-[10px] text-stone-500 font-medium">{t.grossValue}</span>
                <span className="text-xs font-bold text-stone-800">
                  ₹{bestResult.grossCropValue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="bg-white px-3 py-2 rounded-xl border border-rose-200 shadow-2xs text-center">
                <span className="block text-[10px] text-stone-500 font-medium">{t.freightCost}</span>
                <span className="text-xs font-bold text-rose-700">
                  -₹{bestResult.calculatedFreight.toLocaleString('en-IN')}
                  <span className="block text-[9px] text-stone-400 font-normal">
                    (₹{bestResult.freightPerKg}/kg)
                  </span>
                </span>
              </div>

              <div className="bg-emerald-900 text-white px-3.5 py-2 rounded-xl shadow-xs text-center">
                <span className="block text-[10px] text-emerald-200 font-medium">{t.netRealization}</span>
                <span className="text-sm font-extrabold text-white">
                  ₹{bestResult.netRealizationPerKg}/kg
                </span>
                <span className="block text-[9px] text-emerald-300 font-semibold">
                  +₹{bestResult.savingsVsSoloHire.toLocaleString('en-IN')} {currentLang === 'hi' ? 'बचत' : currentLang === 'mr' ? 'बचत' : 'saved'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Active Transport Bookings (if any) */}
      {bookedDeals.length > 0 && (
        <div className="bg-emerald-950 text-white rounded-2xl p-5 shadow-xs border border-emerald-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <h3 className="text-sm font-bold text-white">
                {t.activeBookings} ({bookedDeals.length})
              </h3>
            </div>
            <span className="text-xs text-emerald-300 font-medium">
              {currentLang === 'hi' ? 'ड्राइवर से सीधा संपर्क चालू है' : currentLang === 'mr' ? 'चालकाशी थेट संपर्क' : 'Driver confirmed'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bookedDeals.map((b) => (
              <div
                key={b.id}
                className="bg-emerald-900/80 rounded-xl p-3.5 border border-emerald-700/60 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{b.produceName}</span>
                    <span className="bg-emerald-800 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                      {b.vehicleNumber}
                    </span>
                  </div>
                  <p className="text-emerald-200/90 text-[11px]">
                    {b.transporterName} · <a href={`tel:${b.transporterPhone}`} className="text-emerald-300 underline font-semibold">{b.transporterPhone}</a>
                  </p>
                  <p className="text-stone-300 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>{b.pickupTime}</span>
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <span className="bg-emerald-800/90 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      OTP: {b.trackingOtp}
                    </span>
                    <span className="text-emerald-300 font-semibold text-[11px]">
                      {currentLang === 'hi' ? 'कुल भाड़ा:' : currentLang === 'mr' ? 'एकूण भाडे:' : 'Freight:'} ₹{b.totalFreightCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveBookingModal(b)}
                  className="bg-white text-emerald-950 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-50 transition cursor-pointer shrink-0"
                >
                  {currentLang === 'hi' ? 'रसीद देखें' : currentLang === 'mr' ? 'पावती पहा' : 'View Pass'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Filter Bar & Transporter Deal Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-800" />
            <h3 className="text-sm font-bold text-stone-900">
              {currentLang === 'hi'
                ? `उपलब्ध वाहन डील्स (${filteredResults.length})`
                : currentLang === 'mr'
                ? `उपलब्ध वाहतूक डील्स (${filteredResults.length})`
                : `Verified Transporter Deals (${filteredResults.length})`}
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              onClick={() => setDealTypeFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                dealTypeFilter === 'all'
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {t.allDeals}
            </button>
            <button
              onClick={() => setDealTypeFilter('recommended')}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer flex items-center gap-1 ${
                dealTypeFilter === 'recommended'
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{t.bestDealsOnly}</span>
            </button>
            <button
              onClick={() => setDealTypeFilter('shared_pool')}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                dealTypeFilter === 'shared_pool'
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {t.communityPool}
            </button>
            <button
              onClick={() => setDealTypeFilter('return_load')}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                dealTypeFilter === 'return_load'
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {t.returnLoads}
            </button>
            <button
              onClick={() => setDealTypeFilter('ev_green')}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                dealTypeFilter === 'ev_green'
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              🌱 EV
            </button>
          </div>
        </div>

        {/* Transporter Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResults.map((result) => {
            const { deal } = result;
            const isTopDeal = result.isBestDealForFarmer;

            return (
              <div
                key={deal.id}
                className={`rounded-2xl p-5 transition flex flex-col justify-between space-y-4 border ${
                  isTopDeal
                    ? 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white border-stone-200 shadow-xs hover:border-stone-300 hover:shadow-sm'
                }`}
              >
                {/* Card Header & Deal Badge */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        isTopDeal
                          ? 'bg-amber-400 text-stone-900 shadow-2xs font-extrabold'
                          : deal.dealType === 'shared_pool'
                          ? 'bg-emerald-100 text-emerald-800'
                          : deal.dealType === 'return_load'
                          ? 'bg-amber-100 text-amber-900'
                          : deal.dealType === 'ev_green'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {isTopDeal && <Sparkles className="w-3 h-3 fill-stone-900" />}
                      <span>{deal.dealTag}</span>
                    </span>

                    {/* AI Match Score Badge */}
                    <div className="flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-lg text-[11px] font-bold text-stone-800">
                      <span>{t.dealScoreLabel}:</span>
                      <span className={`${result.dealScore >= 95 ? 'text-emerald-700' : 'text-stone-700'}`}>
                        {result.dealScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Transporter Details */}
                  <div className="flex items-start justify-between gap-2 pt-1">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                        <span>{deal.transporterName}</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      </h4>
                      <p className="text-xs text-stone-500">
                        {deal.vehicleType} · <span className="font-semibold text-stone-700">{deal.vehicleNumber}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 justify-end text-xs font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{deal.transporterRating}</span>
                      </div>
                      <span className="text-[10px] text-stone-400">
                        {deal.completedTrips} {currentLang === 'hi' ? 'ट्रिप्स' : currentLang === 'mr' ? 'फेऱ्या' : 'trips'}
                      </span>
                    </div>
                  </div>

                  {/* Route & Schedule */}
                  <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-stone-700">
                      <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span className="truncate">
                        <strong className="text-stone-900">{deal.fromLocation}</strong> → <strong className="text-emerald-800">{deal.toDestination}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{deal.departureSchedule}</span>
                    </div>
                    {deal.coFarmersSharing && deal.coFarmersSharing.length > 0 && (
                      <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-medium pt-0.5">
                        <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          {currentLang === 'hi' ? 'साथी किसान:' : currentLang === 'mr' ? 'सोबतचे शेतकरी:' : 'Co-farmers pooling:'} {deal.coFarmersSharing.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pricing Comparison Box for this Deal */}
                  <div className="grid grid-cols-3 gap-2 bg-stone-100/70 p-2.5 rounded-xl text-center text-xs">
                    <div>
                      <span className="block text-[10px] text-stone-500">{currentLang === 'hi' ? 'दर प्रति क्विंटल' : currentLang === 'mr' ? 'दर / क्विंटल' : 'Rate / Qtl'}</span>
                      <span className="font-bold text-stone-900">₹{deal.ratePerQuintal}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-500">{t.freightCost}</span>
                      <span className="font-bold text-rose-700">₹{result.calculatedFreight.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-500">{t.netRealization}</span>
                      <span className="font-extrabold text-emerald-800">₹{result.netRealizationPerKg}/kg</span>
                    </div>
                  </div>

                  {/* Savings Callout */}
                  <div className="bg-emerald-50 rounded-lg px-2.5 py-1.5 border border-emerald-200/80 flex items-center justify-between text-xs">
                    <span className="text-emerald-900 font-semibold text-[11px]">
                      {deal.dealSavingsNote}
                    </span>
                    <span className="bg-emerald-700 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shrink-0">
                      {currentLang === 'hi' ? 'बचत' : currentLang === 'mr' ? 'बचत' : 'Save'} ₹{result.savingsVsSoloHire.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Perks Checklist */}
                <div className="pt-2 border-t border-stone-100">
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-stone-600 mb-3">
                    {deal.perks.slice(0, 4).map((perk, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{perk}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions: Book / Call Driver */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBookDeal(result)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                        isTopDeal
                          ? 'bg-emerald-800 hover:bg-emerald-900 text-white'
                          : 'bg-stone-900 hover:bg-black text-white'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                      <span>{t.bookThisDeal} (₹{result.calculatedFreight.toLocaleString('en-IN')})</span>
                    </button>

                    <a
                      href={`tel:${deal.transporterPhone}`}
                      className="px-3 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Phone className="w-3.5 h-3.5 text-stone-600" />
                      <span>{t.callTransporter}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Educational Guide Card: Logistics Optimization for Indian Farmers */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-xs border border-stone-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
            💡
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              {currentLang === 'hi'
                ? 'किसान गाइड: परिवहन में बचत और सब्जी की सुरक्षा कैसे बढ़ाएं?'
                : currentLang === 'mr'
                ? 'शेतकरी मार्गदर्शक: वाहतूक खर्च कमी करून निव्वळ नफा कसा वाढवाल?'
                : 'Farmer Guide: 3 Rules to Cut Transport Losses & Boost Net Realization'}
            </h4>
            <p className="text-xs text-stone-400">
              {currentLang === 'hi'
                ? 'भाड़े में होने वाले नुकसान और खराब होने से बचाने की सलाह'
                : currentLang === 'mr'
                ? 'भाडे बचत आणि नाशवंत भाजीपाल्याची काळजी'
                : 'Post-harvest logistics tips from APMC agriculture economists'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700 space-y-1.5">
            <span className="font-bold text-amber-300 block">
              1. {currentLang === 'hi' ? 'नीलामी से पहले मंडी पहुंचें' : currentLang === 'mr' ? 'सकाळी ५ पूर्वी पोहोचणे' : 'Arrival Before 4:30 AM'}
            </span>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              {currentLang === 'hi'
                ? 'सवेरे ५ बजे से पहले मंडी पहुंचने वाली गाड़ियों को पहले खरीदार मिलते हैं और ३-४% अधिक बोली लगती है। हमेशा रात की रवानगी चुनें।'
                : currentLang === 'mr'
                ? 'सकाळी ५ च्या आधी पोहोचणाऱ्या गाड्यांना पहिले मोठे व्यापारी मिळतात. रात्री ७ ते ८ वाजता गाडी निघणे सर्वात फायदेशीर ठरते.'
                : 'Loads arriving before 4:30 AM capture peak wholesale hotel and export bidders, commanding ₹2-₹3/kg higher auction rates.'}
            </p>
          </div>

          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700 space-y-1.5">
            <span className="font-bold text-emerald-300 block">
              2. {currentLang === 'hi' ? 'क्रेट का उपयोग, बोरी नहीं' : currentLang === 'mr' ? 'क्रेट्सचा वापर करा' : 'Always Use Ventilated Crates'}
            </span>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              {currentLang === 'hi'
                ? 'टमाटर और शिमला मिर्च को प्लास्टिक क्रेट में रखने से दबने से होने वाला १५% नुकसान शून्य हो जाता है। हमारे सभी पार्टनर वाहन क्रेट स्टैंड से सुसज्जित हैं।'
                : currentLang === 'mr'
                ? 'टोमॅटो किंवा मिरची पोत्यात भरल्यास १५% माल दबून खराब होतो. क्रेट्समुळे मालाची चकाकी कायम राहून पूर्ण भाव मिळतो.'
                : 'Using plastic crates prevents 15% transit crush damage. Transporters in our pool carry dedicated crate racks.'}
            </p>
          </div>

          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700 space-y-1.5">
            <span className="font-bold text-teal-300 block">
              3. {currentLang === 'hi' ? 'पड़ोसी किसानों से तालमेल' : currentLang === 'mr' ? 'गावातील शेतकऱ्यांशी समन्वय' : 'Coordinate Village Pooling'}
            </span>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              {currentLang === 'hi'
                ? 'यदि आपके पास केवल १० क्विंटल माल है, तो पूरा ट्रक करने के बजाय पड़ोस के किसान के साथ जगह बांटें। भाड़ा सीधे आधा हो जाएगा।'
                : currentLang === 'mr'
                ? '१० क्विंटल मालासाठी पूर्ण गाडी करणे तोट्याचे असते. शेजारच्या शेतकऱ्यांशी शेअरींग केल्यास वाहतूक खर्च ५०% ने कमी होतो.'
                : 'Never dispatch a half-empty solo truck. Pooling with 1-2 neighbors cuts per-quintal freight from ₹140 down to ₹68.'}
            </p>
          </div>
        </div>
      </div>

      {/* 7. Booking Confirmation Modal */}
      {activeBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    {currentLang === 'hi' ? 'वाहन डील बुकिंग पुष्टिकरण' : currentLang === 'mr' ? 'वाहतूक डील बुकिंग पावती' : 'Transport Deal Confirmed'}
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    ID: {activeBookingModal.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveBookingModal(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-600">{currentLang === 'hi' ? 'शेतमाल / उपज:' : currentLang === 'mr' ? 'शेतमाल:' : 'Produce Lot:'}</span>
                <span className="font-bold text-stone-900">{activeBookingModal.produceName}</span>
              </div>

              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-600">{currentLang === 'hi' ? 'ट्रांसपोर्टर / चालक:' : currentLang === 'mr' ? 'वाहन चालक:' : 'Transporter:'}</span>
                <span className="font-bold text-stone-900">{activeBookingModal.transporterName}</span>
              </div>

              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-600">{currentLang === 'hi' ? 'गाड़ी नंबर एवं प्रकार:' : currentLang === 'mr' ? 'गाडी क्रमांक:' : 'Vehicle:'}</span>
                <span className="font-bold text-emerald-800">{activeBookingModal.vehicleNumber} ({activeBookingModal.vehicleType})</span>
              </div>

              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-600">{currentLang === 'hi' ? 'ड्राइवर का मोबाइल:' : currentLang === 'mr' ? 'चालकाचा फोन:' : 'Driver Phone:'}</span>
                <a href={`tel:${activeBookingModal.transporterPhone}`} className="font-bold text-emerald-700 underline">
                  {activeBookingModal.transporterPhone}
                </a>
              </div>

              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-600">{currentLang === 'hi' ? 'रवानगी समय:' : currentLang === 'mr' ? 'निघण्याची वेळ:' : 'Departure Window:'}</span>
                <span className="font-semibold text-stone-800">{activeBookingModal.pickupTime}</span>
              </div>

              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-600">{currentLang === 'hi' ? 'मंडी गेट पास OTP:' : currentLang === 'mr' ? 'मंडी गेट पास OTP:' : 'Gate Verification OTP:'}</span>
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-extrabold text-sm tracking-wider">
                  {activeBookingModal.trackingOtp}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-stone-700 font-bold">{currentLang === 'hi' ? 'कुल देय भाड़ा:' : currentLang === 'mr' ? 'एकूण देय भाडे:' : 'Total Agreed Freight:'}</span>
                <span className="text-base font-extrabold text-rose-700">
                  ₹{activeBookingModal.totalFreightCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Savings Callout in modal */}
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-semibold">
              <span>{currentLang === 'hi' ? 'इस डील से आपकी बचत:' : currentLang === 'mr' ? 'या डीलमुळे झालेली बचत:' : 'Estimated Savings on this deal:'}</span>
              <span className="text-sm font-extrabold text-emerald-800">
                +₹{activeBookingModal.estimatedSavings.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={`tel:${activeBookingModal.transporterPhone}`}
                className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>{currentLang === 'hi' ? 'ड्राइवर को कॉल करें' : currentLang === 'mr' ? 'चालकाला कॉल करा' : 'Call Driver Now'}</span>
              </a>

              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{currentLang === 'hi' ? 'प्रिंट' : currentLang === 'mr' ? 'प्रिंट' : 'Print'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
