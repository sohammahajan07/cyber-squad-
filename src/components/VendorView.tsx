import React, { useState } from 'react';
import {
  ProduceListing,
  VendorRequirement,
  BidOffer,
  MandiRate,
  Language,
  UserProfile,
  ContactEnquiry
} from '../types/market';
import { VEGETABLE_CATALOG, DEMO_USERS } from '../data/mockData';
import { TRANSLATIONS } from '../utils/translations';
import {
  Plus,
  Search,
  Sparkles,
  MapPin,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Phone,
  Send,
  Building,
  UserCheck,
  User,
  ArrowRight,
  MessageCircle,
  ExternalLink,
  TrendingUp,
  Building2
} from 'lucide-react';
import { PredictionDetailModal } from './PredictionDetailModal';
import { generateRatePrediction } from '../utils/ratePredictor';

interface VendorViewProps {
  currentUser: UserProfile;
  listings: ProduceListing[];
  requirements: VendorRequirement[];
  bids: BidOffer[];
  mandiRates: MandiRate[];
  enquiries: ContactEnquiry[];
  onOpenRequirementModal: () => void;
  onInspectProduce: (listing: ProduceListing) => void;
  onRequestFarmerEnquiry: (listing: ProduceListing) => void;
  onApproveEnquiry: (enquiryId: string) => void;
  onRejectEnquiry: (enquiryId: string) => void;
  onSwitchUser?: (user: UserProfile) => void;
  onOpenLoginModal?: () => void;
  currentLang: Language;
}

export const VendorView: React.FC<VendorViewProps> = ({
  currentUser,
  listings,
  requirements,
  bids,
  mandiRates,
  enquiries,
  onOpenRequirementModal,
  onInspectProduce,
  onRequestFarmerEnquiry,
  onApproveEnquiry,
  onRejectEnquiry,
  onSwitchUser,
  onOpenLoginModal,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-requirements' | 'placed-bids' | 'my-enquiries' | 'mandi-forecast'>('catalog');
  const [selectedVegFilter, setSelectedVegFilter] = useState<string>('all');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPredictionRate, setSelectedPredictionRate] = useState<MandiRate | null>(null);
  const [selectedMandiYard, setSelectedMandiYard] = useState<string>('All');

  const filteredListings = listings.filter((l) => {
    const matchesVeg = selectedVegFilter === 'all' || l.vegetableId === selectedVegFilter;
    const matchesGrade = selectedGradeFilter === 'all' || l.qualityGrade === selectedGradeFilter;
    const matchesSearch =
      searchQuery === '' ||
      l.vegetableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.farmLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.mandiYard.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVeg && matchesGrade && matchesSearch;
  });

  // Enquiries received by this vendor from farmers (e.g. farmers applying to supply vendor requirements)
  const incomingEnquiries = enquiries.filter(
    (e) => e.toRole === 'vendor' || e.toUserId === currentUser.id
  );

  // Enquiries sent by this vendor to farmers (e.g. requesting farmer produce contact)
  const outgoingEnquiries = enquiries.filter(
    (e) => e.fromRole === 'vendor' && (e.fromUserId === currentUser.id || !currentUser.id.startsWith('farmer'))
  );

  const pendingIncomingCount = incomingEnquiries.filter((e) => e.status === 'pending').length;

  return (
    <div className="space-y-6">
      
      {/* 1. Account Status & Quick Profile Bar */}
      <div className="bg-stone-900 text-white p-3.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{currentUser.name}</span>
              <span className="bg-emerald-800 text-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>{t.vendorRole}</span>
              </span>
            </div>
            <p className="text-xs text-stone-300">
              {currentUser.organization || 'Wholesale Trader'} · {currentUser.location} · {currentUser.phone}
            </p>
          </div>
        </div>

        {/* Quick Demo Switcher for fast verification */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          <span className="text-[11px] text-stone-400 font-medium mr-1 hidden sm:inline">
            {currentLang === 'hi' ? 'त्वरित व्यापारी खाता:' : currentLang === 'mr' ? 'व्यापारी प्रोफाईल:' : 'Vendor Profile:'}
          </span>
          {DEMO_USERS.filter((u) => u.role === 'vendor').map((vendorUser) => (
            <button
              key={vendorUser.id}
              onClick={() => onSwitchUser && onSwitchUser(vendorUser)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                currentUser.id === vendorUser.id
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {vendorUser.name.split(' ')[0]}
            </button>
          ))}
          {onOpenLoginModal && (
            <button
              onClick={onOpenLoginModal}
              className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-emerald-400 rounded-lg text-xs font-semibold cursor-pointer border border-stone-700"
            >
              {currentLang === 'hi' ? '+ नया लॉगिन' : currentLang === 'mr' ? '+ नवीन लॉगिन' : '+ Login'}
            </button>
          )}
        </div>
      </div>

      {/* Top Banner / Vendor Welcome */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 rounded-2xl p-6 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {t.vendorRole}
              </span>
              <span className="text-[11px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{t.verifiedUser}</span>
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {currentLang === 'hi'
                ? 'गुणवत्ता-प्रमाणित सब्जी सीधे किसानों से खरीदें'
                : currentLang === 'mr'
                ? 'प्रतवारी प्रमाणित भाजीपाला थेट शेतकऱ्यांकडून खरेदी करा'
                : 'Source Verified Farmgate Produce with AI Quality Score'}
            </h2>
            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              {currentLang === 'hi'
                ? 'सुरक्षित प्रणाली: किसानों और व्यापारियों की संपर्क जानकारी केवल आपसी पूछताछ (Enquiry) की स्वीकृति पर ही साझा की जाती है।'
                : currentLang === 'mr'
                ? 'गोपनीयता नियम: शेतकरी आणि व्यापाऱ्यांचे संपर्क तपशील केवळ दोन्ही बाजूंच्या चौकशी संमतीनंतरच उघड केले जातात.'
                : 'Privacy Protected: Direct phone numbers and farm/delivery addresses are locked until an enquiry is approved by both parties.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenRequirementModal}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-sm transition active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.postRequirement}</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-700/60 text-xs">
          <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700/60">
            <span className="text-stone-400 block text-[11px]">{t.activeListings}</span>
            <span className="text-xl font-bold text-white">{listings.length} Lots</span>
          </div>
          <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700/60">
            <span className="text-stone-400 block text-[11px]">{t.myTenders}</span>
            <span className="text-xl font-bold text-emerald-400">{requirements.length}</span>
          </div>
          <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700/60">
            <span className="text-stone-400 block text-[11px]">{t.myOffers}</span>
            <span className="text-xl font-bold text-amber-400">{bids.length}</span>
          </div>
          <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700/60">
            <span className="text-stone-400 block text-[11px]">{t.enquiriesTab}</span>
            <span className="text-xl font-bold text-emerald-300">
              {enquiries.length} {pendingIncomingCount > 0 && `(${pendingIncomingCount} pending)`}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'catalog'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.browseProduce} ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('my-requirements')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'my-requirements'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.myTenders} ({requirements.length})
          </button>
          <button
            onClick={() => setActiveTab('placed-bids')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'placed-bids'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.myOffers} ({bids.length})
          </button>
          <button
            onClick={() => setActiveTab('my-enquiries')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'my-enquiries'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>{t.enquiriesTab}</span>
            {pendingIncomingCount > 0 && (
              <span className="bg-amber-500 text-stone-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingIncomingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('mandi-forecast')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'mandi-forecast'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentLang === 'hi' ? 'मंडी भाव व 7-दिवसीय भविष्यवाणी' : currentLang === 'mr' ? 'बाजारभाव व ७-दिवसीय अंदाज' : 'Mandi Rates & 7D Forecast'}</span>
          </button>
        </div>

        <button
          onClick={onOpenRequirementModal}
          className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1 mb-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.postRequirement}</span>
        </button>
      </div>

      {/* Tab 1: Catalog of Available Farmer Produce */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          
          {/* Search & Filter Controls */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
              </div>

              {/* Quality Grade filter */}
              <div className="flex items-center gap-1.5 shrink-0 text-xs">
                <span className="text-stone-500 font-medium">{t.filterByGrade}:</span>
                {(['all', 'Grade A', 'Grade B', 'Grade C'] as const).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGradeFilter(grade)}
                    className={`px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                      selectedGradeFilter === grade
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {grade === 'all' ? t.allGrades : grade}
                  </button>
                ))}
              </div>
            </div>

            {/* Vegetable commodity horizontal bar */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 text-xs">
              <button
                onClick={() => setSelectedVegFilter('all')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                  selectedVegFilter === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {t.allVegetables} ({listings.length})
              </button>
              {VEGETABLE_CATALOG.slice(0, 10).map((veg) => {
                const count = listings.filter((l) => l.vegetableId === veg.id).length;
                const vegName =
                  currentLang === 'hi'
                    ? veg.hindiName
                    : currentLang === 'mr'
                    ? veg.marathiName
                    : veg.name.split(' ')[0];

                return (
                  <button
                    key={veg.id}
                    onClick={() => setSelectedVegFilter(veg.id)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                      selectedVegFilter === veg.id
                        ? 'bg-emerald-700 text-white font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {vegName} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Produce Cards Grid */}
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-xs text-stone-500">
              {t.noListingsFound}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => {
                const matchingRate = mandiRates.find((r) =>
                  r.vegetableName.toLowerCase().includes(listing.vegetableName.split(' ')[0].toLowerCase())
                );

                // Check if this vendor has an approved enquiry for this lot
                const approvedEnquiry = enquiries.find(
                  (e) => e.referenceId === listing.id && e.status === 'approved'
                );
                const pendingEnquiry = enquiries.find(
                  (e) => e.referenceId === listing.id && e.status === 'pending'
                );

                const pred = matchingRate ? (matchingRate.prediction || generateRatePrediction(matchingRate)) : null;

                return (
                  <div
                    key={listing.id}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Image + Badges */}
                      <div className="relative aspect-16/10 bg-stone-100 overflow-hidden group">
                        <img
                          src={listing.imageUrl}
                          alt={listing.vegetableName}
                          className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="bg-emerald-800 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                            {listing.qualityGrade}
                          </span>
                          <span className="bg-stone-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span>{listing.qualityMetrics.freshnessScore}% Fresh</span>
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 right-2.5 bg-stone-900/80 text-white text-[11px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                          {listing.quantity} {listing.unit}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-3">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="font-bold text-stone-900 text-base leading-snug">
                              {listing.vegetableName}
                            </h3>
                            <div className="text-right shrink-0">
                              <span className="text-lg font-black text-emerald-800">
                                ₹{listing.expectedPricePerKg}
                              </span>
                              <span className="text-[11px] text-stone-500">/kg</span>
                            </div>
                          </div>
                          <p className="text-xs text-stone-500">
                            {t.variety}: {listing.variety} · Farmer: {listing.farmerName}
                          </p>
                        </div>

                        {/* Location (Public Zone) */}
                        <div className="flex items-center gap-2 text-xs text-stone-600">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="truncate">{listing.farmLocation} · {listing.mandiYard}</span>
                        </div>

                        {/* 7-Day Market Prediction Chip for Vendor */}
                        {matchingRate && pred && (
                          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <div className="text-[11px]">
                                <span className="font-bold text-emerald-950">
                                  7D Forecast: ₹{pred.predictedModal7Day}/kg ({pred.trendOutlook} {pred.expectedChange7DayPercent >= 0 ? '+' : ''}{pred.expectedChange7DayPercent}%)
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedPredictionRate(matchingRate)}
                              className="text-[10px] font-bold text-emerald-800 bg-white hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 cursor-pointer shadow-2xs"
                            >
                              Details
                            </button>
                          </div>
                        )}

                        {/* Privacy Details Status (Mutual Protection) */}
                        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs">
                          {approvedEnquiry ? (
                            <div className="space-y-1.5 text-emerald-950">
                              <div className="flex items-center justify-between">
                                <span className="font-bold flex items-center gap-1 text-emerald-800">
                                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{t.sharedContactDetails}</span>
                                </span>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                                  Approved
                                </span>
                              </div>
                              <div className="font-bold text-stone-900 flex items-center justify-between">
                                <span>Phone: {listing.farmerPhone}</span>
                                <div className="flex items-center gap-1.5">
                                  <a
                                    href={`tel:${listing.farmerPhone.replace(/\s+/g, '')}`}
                                    className="p-1 bg-emerald-700 text-white rounded hover:bg-emerald-800"
                                    title="Call Farmer"
                                  >
                                    <Phone className="w-3 h-3" />
                                  </a>
                                  <a
                                    href={`https://wa.me/${listing.farmerPhone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
                                    title="WhatsApp Farmer"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                              <div className="text-[11px] text-stone-600">
                                Farm: {listing.exactFarmAddress}
                              </div>
                            </div>
                          ) : pendingEnquiry ? (
                            <div className="flex items-center justify-between text-amber-800 font-medium">
                              <span className="flex items-center gap-1">
                                <Lock className="w-3.5 h-3.5 text-amber-600" />
                                <span>{t.enquiryPending}</span>
                              </span>
                              <span className="text-[10px] bg-amber-100 px-2 py-0.5 rounded text-amber-900 font-bold">
                                Awaiting Farmer
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between text-stone-500">
                                <span className="flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-stone-400" />
                                  <span className="text-[11px]">{t.phoneMasked}</span>
                                </span>
                              </div>
                              <button
                                onClick={() => onRequestFarmerEnquiry(listing)}
                                className="w-full py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold rounded-lg text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Send className="w-3 h-3" />
                                <span>{t.applyForEnquiry}</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* APMC Live Benchmark */}
                        {matchingRate && (
                          <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg p-2 flex items-center justify-between text-xs">
                            <span className="text-stone-600">
                              {matchingRate.mandiName} {t.modalPrice}:
                            </span>
                            <strong className="text-stone-900">₹{matchingRate.modalPricePerKg}/kg</strong>
                          </div>
                        )}

                        {/* Quality Diagnostics Bar */}
                        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-[11px] text-stone-600">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              {t.freshnessScore}:
                            </span>
                            <strong className="text-stone-800">{listing.qualityMetrics.freshnessScore}%</strong>
                          </div>
                          <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{ width: `${listing.qualityMetrics.freshnessScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="p-4 pt-0 space-y-2">
                      <button
                        onClick={() => onInspectProduce(listing)}
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{t.inspectProduce}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Procurement Demands */}
      {activeTab === 'my-requirements' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requirements.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {req.qualityGradeRequired}
                    </span>
                    <h4 className="text-base font-bold text-stone-900 mt-1">
                      {req.vegetableName}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Company: {req.companyName}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 uppercase font-semibold block">{t.targetPrice}</span>
                    <span className="text-lg font-bold text-emerald-800">₹{req.targetPricePerKg}/kg</span>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-xl p-3 text-xs space-y-1.5 border border-stone-100">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">{t.quantity}:</span>
                    <strong className="text-stone-900">{req.requiredQuantity} {req.unit}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">{t.neededTimeline}:</span>
                    <strong className="text-stone-900">{req.neededByDate}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Delivery Hub:</span>
                    <strong className="text-stone-900">{req.deliveryLocation}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">{t.paymentTerm}:</span>
                    <strong className="text-emerald-700">{req.paymentTerm}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active Broadcast</span>
                  </span>
                  <span className="text-stone-400">Preferred Mandi: {req.preferredMandi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: My Placed Bids */}
      {activeTab === 'placed-bids' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm">{t.myOffers}</h3>
            <span className="text-xs text-stone-500">{bids.length} total</span>
          </div>

          <div className="divide-y divide-stone-100">
            {bids.map((bid) => {
              const matchedListing = listings.find((l) => l.id === bid.listingId);

              return (
                <div key={bid.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-stone-50 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-stone-900 text-sm">
                        {matchedListing?.vegetableName || 'Vegetable Lot'}
                      </h4>
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium">
                        Lot #{bid.listingId}
                      </span>
                    </div>
                    <p className="text-stone-600 mt-0.5">
                      Offered to farmer: <strong>₹{bid.offeredPricePerKg}/kg</strong> for <strong>{bid.offeredQuantity} {bid.unit}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-right shrink-0">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase block">{t.totalDealAmount}</span>
                      <strong className="text-sm font-bold text-stone-900">
                        ₹{(bid.offeredQuantity * bid.offeredPricePerKg).toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-md font-bold text-xs ${
                        bid.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : bid.status === 'rejected'
                          ? 'bg-stone-100 text-stone-500'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {bid.status === 'accepted' ? 'Accepted' : bid.status === 'rejected' ? 'Declined' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Contact Enquiries & Mutual Privacy Approvals */}
      {activeTab === 'my-enquiries' && (
        <div className="space-y-6">
          
          {/* Privacy Protocol Alert Banner */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-start gap-3 text-xs">
            <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-stone-900 text-sm">{t.privacyNotice}</h3>
              <p className="text-stone-600 mt-0.5 leading-relaxed">
                {currentLang === 'hi'
                  ? 'किसानों का फोन और खेत का पता केवल तभी दिखाई देगा जब वे आपकी पूछताछ स्वीकार करेंगे। इसी प्रकार, जब किसान आपकी खरीद मांग के लिए पूछताछ भेजते हैं, तो आप उसे स्वीकार करके अपना विवरण साझा कर सकते हैं।'
                  : currentLang === 'mr'
                  ? 'शेतकऱ्यांचा फोन आणि शेताचा पत्ता फक्त त्यांनी संमती दिल्यावरच दिसेल. त्याचप्रमाणे शेतकऱ्यांनी तुमच्या मागणीसाठी पाठवलेली चौकशी तुम्ही येथे संमत करू शकता.'
                  : 'Farmer phone numbers and addresses are protected until approved. Likewise, when farmers send supply inquiries on your requirements, you can approve them here to exchange contacts.'}
              </p>
            </div>
          </div>

          {/* 1. Incoming Enquiries from Farmers to this Vendor */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-emerald-50/70 border-b border-emerald-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-emerald-950 text-sm">
                  {currentLang === 'hi' ? 'किसानों से प्राप्त पूछताछ (अनुमोदन आवश्यक)' : currentLang === 'mr' ? 'शेतकऱ्यांकडून आलेल्या चौकशी विनंत्या' : 'Incoming Enquiries from Farmers'}
                </h3>
                <p className="text-xs text-stone-600">
                  {currentLang === 'hi' ? 'स्वीकार करने पर किसान को आपका फोन व गोदाम का पता मिलेगा' : currentLang === 'mr' ? 'संमती दिल्यावर शेतकऱ्याला तुमचे संपर्क तपशील मिळतील' : 'Approve to unlock two-way contact details exchange'}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                {incomingEnquiries.length} total
              </span>
            </div>

            {incomingEnquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No incoming enquiries from farmers yet.
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {incomingEnquiries.map((enq) => (
                  <div key={enq.id} className="p-4 text-xs space-y-3 hover:bg-stone-50/80 transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">{enq.fromUserName}</span>
                          <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                            Farmer · {enq.fromLocation}
                          </span>
                        </div>
                        <span className="text-stone-500 text-xs block mt-0.5">
                          Regarding: <strong className="text-emerald-800">{enq.referenceTitle}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {enq.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => onApproveEnquiry(enq.id)}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              <span>{t.approveAndShare}</span>
                            </button>
                            <button
                              onClick={() => onRejectEnquiry(enq.id)}
                              className="px-2.5 py-1.5 border border-stone-300 text-stone-600 hover:bg-stone-100 rounded-lg text-xs transition cursor-pointer"
                            >
                              {t.declineEnquiry}
                            </button>
                          </>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t.enquiryApproved}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-stone-600 bg-stone-50 p-2.5 rounded-lg italic border border-stone-100">
                      &ldquo;{enq.message}&rdquo;
                    </p>

                    {enq.status === 'approved' && (
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-950 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                          <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{t.sharedContactDetails}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-stone-500 block text-[10px] uppercase font-semibold">Farmer Direct Phone</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <strong className="text-stone-900">{enq.farmerContact?.phone || enq.fromPhone}</strong>
                              <a
                                href={`tel:${(enq.farmerContact?.phone || enq.fromPhone).replace(/\s+/g, '')}`}
                                className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[11px] font-semibold"
                              >
                                Call
                              </a>
                            </div>
                          </div>
                          <div>
                            <span className="text-stone-500 block text-[10px] uppercase font-semibold">Farmer Location / Address</span>
                            <span className="text-stone-800">{enq.farmerContact?.farmAddress || enq.fromLocation}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Outgoing Enquiries Sent by this Vendor to Farmers */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  {currentLang === 'hi' ? 'मेरी भेजी गई पूछताछ (किसानों को)' : currentLang === 'mr' ? 'मी शेतकऱ्यांना पाठवलेल्या चौकशी' : 'My Enquiries Sent to Farmers'}
                </h3>
                <p className="text-xs text-stone-500">
                  Track whether farmers approved contact sharing for vegetable lots
                </p>
              </div>
              <span className="text-xs text-stone-500">{outgoingEnquiries.length} total</span>
            </div>

            {outgoingEnquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No enquiries sent to farmers yet. Click &ldquo;Apply for Enquiry&rdquo; on any vegetable lot.
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {outgoingEnquiries.map((enq) => (
                  <div key={enq.id} className="p-4 text-xs space-y-2 hover:bg-stone-50 transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-stone-900 text-sm">{enq.referenceTitle}</span>
                        <span className="text-stone-500 block">Recipient Farmer: {enq.toUserName}</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-md font-bold text-xs ${
                          enq.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : enq.status === 'rejected'
                            ? 'bg-stone-100 text-stone-500'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {enq.status === 'approved' ? t.enquiryApproved : enq.status === 'rejected' ? t.enquiryRejected : t.enquiryPending}
                      </span>
                    </div>

                    <p className="text-stone-600 bg-stone-50 p-2 rounded-lg italic">
                      &ldquo;{enq.message}&rdquo;
                    </p>

                    {enq.status === 'approved' && (
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-900 font-medium space-y-1.5">
                        <span className="block font-bold flex items-center gap-1">
                          <Unlock className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{t.sharedContactDetails}</span>
                        </span>
                        <div className="flex flex-wrap items-center gap-4 text-xs">
                          <div>
                            Farmer Direct Phone: <strong>{enq.farmerContact?.phone || '+91 98221 45678'}</strong>
                          </div>
                          <div>
                            Farm Address: <strong>{enq.farmerContact?.farmAddress || 'Niphad, Nashik, Maharashtra'}</strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 5: Mandi Rates & 7-Day Forecast for Wholesalers/Vendors */}
      {activeTab === 'mandi-forecast' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-0">
          <div className="p-4 bg-emerald-50/70 border-b border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  {currentLang === 'hi' ? 'महाराष्ट्र APMC लाइव भाव व 7-दिवसीय भविष्यवाणी' : currentLang === 'mr' ? 'महाराष्ट्र APMC बाजारभाव व ७-दिवसीय अंदाज' : 'Maharashtra APMC Benchmark & 7-Day Rate Forecast'}
                </h3>
                <p className="text-xs text-stone-600">
                  {t.readOnlyNotice}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shrink-0">
              Procurement Intelligence
            </span>
          </div>

          {/* Mandi Yard Filter Bar */}
          <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="font-semibold text-stone-700 shrink-0">
              {currentLang === 'hi' ? 'मंडी चुनें:' : currentLang === 'mr' ? 'बाजार समिती:' : 'Filter Mandi:'}
            </span>
            {['All Maharashtra Mandis', 'Vashi APMC', 'Lasalgaon APMC', 'Nashik APMC', 'Pune APMC', 'Baramati APMC', 'Kolhapur APMC'].map((yard) => {
              const isActive = selectedMandiYard === yard || (yard === 'All Maharashtra Mandis' && selectedMandiYard === 'All');
              return (
                <button
                  key={yard}
                  type="button"
                  onClick={() => setSelectedMandiYard(yard === 'All Maharashtra Mandis' ? 'All' : yard)}
                  className={`px-3 py-1 rounded-lg whitespace-nowrap font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:border-emerald-600'
                  }`}
                >
                  {yard}
                </button>
              );
            })}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 text-stone-600 uppercase text-[10px] tracking-wider border-b border-stone-200 font-bold">
                <tr>
                  <th className="px-4 py-3">{t.vegetable}</th>
                  <th className="px-4 py-3">{t.mandiYard}</th>
                  <th className="px-4 py-3">{t.minPrice}</th>
                  <th className="px-4 py-3 text-emerald-900">{t.modalPrice}</th>
                  <th className="px-4 py-3">{t.maxPrice}</th>
                  <th className="px-4 py-3">{t.todayArrivals}</th>
                  <th className="px-4 py-3">{t.trend24h}</th>
                  {/* Separate Prediction Column Header */}
                  <th className="px-4 py-3 bg-emerald-950/5 text-emerald-950 border-x border-emerald-200/80 font-bold">
                    <div className="flex items-center gap-1.5 text-emerald-900">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t.predictionColumn}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {mandiRates
                  .filter((r) => selectedMandiYard === 'All' || r.mandiName.toLowerCase().includes(selectedMandiYard.toLowerCase().replace(' apmc', '')))
                  .map((rate) => {
                    const vegDisplayName =
                      currentLang === 'hi'
                        ? rate.hindiName
                        : currentLang === 'mr'
                        ? rate.marathiName
                        : rate.vegetableName;

                    const predRate = rate.prediction || generateRatePrediction(rate);
                    const isBullish = predRate.trendOutlook === 'Bullish';
                    const isBearish = predRate.trendOutlook === 'Bearish';

                    return (
                      <tr key={rate.id} className="hover:bg-stone-50 transition">
                        <td className="px-4 py-3 font-bold text-stone-900">{vegDisplayName}</td>
                        <td className="px-4 py-3 font-semibold text-emerald-800">{rate.mandiName} ({rate.district})</td>
                        <td className="px-4 py-3 text-stone-600">₹{rate.minPricePerKg}/kg</td>
                        <td className="px-4 py-3 font-black text-stone-900 text-sm bg-emerald-50/50">
                          ₹{rate.modalPricePerKg}/kg
                        </td>
                        <td className="px-4 py-3 text-stone-600">₹{rate.maxPricePerKg}/kg</td>
                        <td className="px-4 py-3 font-medium text-stone-700">
                          {rate.dailyArrivalQuintals.toLocaleString('en-IN')} Qtl
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-bold inline-flex items-center gap-0.5 ${
                              rate.changePercent >= 0 ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {rate.changePercent >= 0 ? '+' : ''}
                            {rate.changePercent}%
                          </span>
                        </td>

                        {/* Separate Prediction Column for Vendor */}
                        <td className="px-4 py-3 bg-emerald-50/40 border-x border-emerald-100">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-emerald-950 text-sm">
                                ₹{predRate.predictedModal7Day}
                                <span className="text-[10px] font-normal text-stone-500">/kg</span>
                              </span>
                              <span
                                className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  isBullish
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : isBearish
                                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                    : 'bg-stone-200 text-stone-800 border border-stone-300'
                                }`}
                              >
                                {isBullish ? '▲' : isBearish ? '▼' : '⬌'} {predRate.expectedChange7DayPercent >= 0 ? '+' : ''}{predRate.expectedChange7DayPercent}%
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedPredictionRate(rate)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 transition cursor-pointer w-fit shadow-2xs"
                            >
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>{currentLang === 'hi' ? 'खरीद सलाह व विश्लेषण' : currentLang === 'mr' ? 'खरेदी सल्ला व अंदाज' : 'Procure Advice & Forecast'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7-Day Rate Prediction & 4-Factor Intelligence Modal */}
      <PredictionDetailModal
        rate={selectedPredictionRate}
        onClose={() => setSelectedPredictionRate(null)}
        currentLang={currentLang}
      />

    </div>
  );
};
