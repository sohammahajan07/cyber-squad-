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
import { DEMO_USERS } from '../data/mockData';
import { TRANSLATIONS } from '../utils/translations';
import {
  Plus,
  TrendingUp,
  Package,
  Sparkles,
  MapPin,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Eye,
  ArrowRight,
  ShieldCheck,
  Lock,
  Unlock,
  Phone,
  Mail,
  UserCheck,
  Send,
  MessageCircle,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  Play,
  Film,
  Download,
  Trophy
} from 'lucide-react';
import { PredictionDetailModal } from './PredictionDetailModal';
import { generateRatePrediction } from '../utils/ratePredictor';
import { TransportDealsView } from './TransportDealsView';
import { suggestBestDealForListing } from '../utils/transportDeals';
import { FarmerInlineVideoPlayer } from './FarmerInlineVideoPlayer';
import { FarmerBestDealAdvisorModal } from './FarmerBestDealAdvisorModal';
import { calculateBestFarmerDeal } from '../utils/farmerBestDealOptimizer';

interface FarmerViewProps {
  currentUser: UserProfile;
  listings: ProduceListing[];
  requirements: VendorRequirement[];
  bids: BidOffer[];
  mandiRates: MandiRate[];
  enquiries: ContactEnquiry[];
  onOpenSellModal: () => void;
  onInspectProduce: (listing: ProduceListing) => void;
  onAcceptBid: (bid: BidOffer, listing: ProduceListing) => void;
  onCounterBid: (bidId: string, counterPrice: number) => void;
  onRejectBid: (bidId: string) => void;
  onRequestVendorEnquiry: (req: VendorRequirement) => void;
  onApproveEnquiry: (enquiryId: string) => void;
  onRejectEnquiry: (enquiryId: string) => void;
  onSwitchUser?: (user: UserProfile) => void;
  onOpenLoginModal?: () => void;
  onOpenPresentation?: () => void;
  currentLang: Language;
}

export const FarmerView: React.FC<FarmerViewProps> = ({
  currentUser,
  listings,
  requirements,
  bids,
  mandiRates,
  enquiries,
  onOpenSellModal,
  onInspectProduce,
  onAcceptBid,
  onCounterBid,
  onRejectBid,
  onRequestVendorEnquiry,
  onApproveEnquiry,
  onRejectEnquiry,
  onSwitchUser,
  onOpenLoginModal,
  onOpenPresentation,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [activeTab, setActiveTab] = useState<'listings' | 'requirements' | 'enquiries' | 'mandi' | 'transport' | 'video'>('listings');
  const [selectedMandiYard, setSelectedMandiYard] = useState<string>('All');
  const [counterInputId, setCounterInputId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(0);
  const [selectedPredictionRate, setSelectedPredictionRate] = useState<MandiRate | null>(null);
  const [selectedTransportListingId, setSelectedTransportListingId] = useState<string | undefined>(undefined);
  const [isBestDealModalOpen, setIsBestDealModalOpen] = useState<boolean>(false);
  const [bestDealTargetListingId, setBestDealTargetListingId] = useState<string | undefined>(undefined);

  // AI Best Financial & Transport Deal evaluation
  const primaryBestDeal = calculateBestFarmerDeal({
    listing: listings[0],
    bids,
    mandiRates
  });

  // Derived stats
  const totalVolumeKg = listings.reduce((acc, curr) => {
    const kg = curr.unit === 'quintal' ? curr.quantity * 100 : curr.unit === 'crate' ? curr.quantity * 25 : curr.quantity;
    return acc + kg;
  }, 0);

  // Filter enquiries relevant to this farmer
  const incomingEnquiries = enquiries.filter(
    (e) => e.toRole === 'farmer' || e.toUserId === currentUser.id
  );
  const outgoingEnquiries = enquiries.filter(
    (e) => e.fromRole === 'farmer' && (e.fromUserId === currentUser.id || !currentUser.id.startsWith('vendor'))
  );

  const pendingIncomingCount = incomingEnquiries.filter((e) => e.status === 'pending').length;

  return (
    <div className="space-y-6">
      
      {/* 1. Account Status & Quick Profile Bar */}
      <div className="bg-emerald-950 text-white p-3.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{currentUser.name}</span>
              <span className="bg-emerald-800 text-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>{t.farmerRole}</span>
              </span>
            </div>
            <p className="text-xs text-emerald-200/90">
              {currentUser.organization || 'Farmer'} · {currentUser.location} · {currentUser.phone}
            </p>
          </div>
        </div>

        {/* Quick Demo Switcher for fast verification */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          <span className="text-[11px] text-emerald-300 font-medium mr-1 hidden sm:inline">
            {currentLang === 'hi' ? 'त्वरित किसान खाता:' : currentLang === 'mr' ? 'शेतकरी प्रोफाईल:' : 'Farmer Profile:'}
          </span>
          {DEMO_USERS.filter((u) => u.role === 'farmer').map((farmerUser) => (
            <button
              key={farmerUser.id}
              onClick={() => onSwitchUser && onSwitchUser(farmerUser)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                currentUser.id === farmerUser.id
                  ? 'bg-white text-emerald-950 font-bold'
                  : 'bg-emerald-900/80 text-emerald-200 hover:bg-emerald-800'
              }`}
            >
              {farmerUser.name.split(' ')[0]}
            </button>
          ))}
          {onOpenLoginModal && (
            <button
              onClick={onOpenLoginModal}
              className="px-2.5 py-1 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-300 rounded-lg text-xs font-semibold cursor-pointer border border-emerald-700/60"
            >
              {currentLang === 'hi' ? '+ नया लॉगिन' : currentLang === 'mr' ? '+ नवीन लॉगिन' : '+ Login'}
            </button>
          )}
        </div>
      </div>

      {/* Top Banner / Farmer Welcome */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                {t.farmerRole}
              </span>
              <span className="text-[11px] bg-emerald-700/60 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>{t.verifiedUser}</span>
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {currentLang === 'hi'
                ? 'सत्यापित व्यापारियों को अपनी सब्जी सीधे बेचें'
                : currentLang === 'mr'
                ? 'प्रमाणित व्यापाऱ्यांना थेट भाजीपाला विका'
                : 'Sell Vegetables Directly with Quality Verification'}
            </h2>
            <p className="text-xs text-emerald-100/80 max-w-2xl leading-relaxed">
              {currentLang === 'hi'
                ? 'गोपनीयता सुरक्षित प्रणाली: व्यापारियों को फोन और खेत का पता तभी मिलेगा जब आप पूछताछ (Enquiry) स्वीकार करेंगे। ऐसे ही आप व्यापारियों की मांग के लिए संपर्क पूछ सकते हैं।'
                : currentLang === 'mr'
                ? 'गोपनीयता सुरक्षित: व्यापाऱ्यांशी संपर्क माहिती फक्त तुम्ही संमती दिल्यावरच सामायिक होईल. व्यापाऱ्यांच्या मागण्यांसाठी तुम्हीही थेट चौकशी पाठवू शकता.'
                : 'Privacy Protected: Direct phone numbers and farm addresses are shared only upon mutual enquiry approval.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {onOpenPresentation && (
              <button
                onClick={onOpenPresentation}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3.5 py-2.5 rounded-xl text-xs shadow-md transition active:scale-98 cursor-pointer"
                title="Play 2-minute video presentation on how Krishi Bandhu benefits farmers"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span>
                  {currentLang === 'hi' ? '२ मिनट वीडियो प्रस्तुति देखें' : currentLang === 'mr' ? '२ मिनिटांचे व्हिडिओ सादरीकरण' : 'Watch 2-Min Video / PPT'}
                </span>
              </button>
            )}
            <button
              onClick={onOpenSellModal}
              className="flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 px-4 py-2.5 rounded-xl font-semibold text-xs shadow-sm transition active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>{t.sellProduce}</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-700/50 text-xs">
          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-700/40">
            <span className="text-emerald-300/80 block text-[11px]">{t.activeListings}</span>
            <span className="text-xl font-bold text-white">{listings.length} Lots</span>
          </div>
          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-700/40">
            <span className="text-emerald-300/80 block text-[11px]">{t.quantity}</span>
            <span className="text-xl font-bold text-white">{(totalVolumeKg / 100).toFixed(1)} Qtl</span>
          </div>
          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-700/40">
            <span className="text-emerald-300/80 block text-[11px]">
              {currentLang === 'hi' ? 'संपर्क पूछताछ' : currentLang === 'mr' ? 'चौकशी विनंत्या' : 'Contact Enquiries'}
            </span>
            <span className="text-xl font-bold text-amber-300">
              {incomingEnquiries.length} {pendingIncomingCount > 0 && `(${pendingIncomingCount} pending)`}
            </span>
          </div>
          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-700/40">
            <span className="text-emerald-300/80 block text-[11px]">{t.mandiBenchmark}</span>
            <span className="text-xl font-bold text-emerald-300">₹{mandiRates[0]?.modalPricePerKg || 27}/kg</span>
          </div>
        </div>

        {/* AI Best Financial & Transportation Deal Banner */}
        <div className="mt-4 pt-3.5 border-t border-emerald-700/50 bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-950 p-4 rounded-2xl border border-amber-400/40 text-xs text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              <Trophy className="w-5 h-5 fill-stone-950 text-stone-950" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-400 text-stone-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  {currentLang === 'hi' ? 'सर्वोत्तम डील मैच' : currentLang === 'mr' ? 'सर्वोत्तम डील मॅच' : '#1 Optimal Deal Match'}
                </span>
                <span className="text-emerald-200 font-bold text-xs">
                  {primaryBestDeal.commodityName} ({primaryBestDeal.quantityKg} kg)
                </span>
                <span className="bg-emerald-800 text-emerald-200 text-[10px] px-1.5 py-0.2 rounded font-mono">
                  Score: {primaryBestDeal.overallScore}/100
                </span>
              </div>
              <p className="text-emerald-100 text-xs font-semibold leading-relaxed">
                <span className="text-amber-300 font-bold">
                  {currentLang === 'hi' ? 'वित्तीय + परिवहन कॉम्बो:' : 'Financial + Transport Combo:'}
                </span>{' '}
                {primaryBestDeal.financialChannel.channelName} (₹{primaryBestDeal.financialChannel.grossPricePerKg}/kg) + {primaryBestDeal.transportChannel.vehicleType}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-stone-300 pt-0.5 flex-wrap">
                <span className="text-white font-bold bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-600/50">
                  {currentLang === 'hi' ? 'जेब में शुद्ध मुनाफा:' : 'Net In Pocket:'} ₹{primaryBestDeal.netTakeHomeCash.toLocaleString('en-IN')} (₹{primaryBestDeal.netRealizationPerKg}/kg)
                </span>
                <span className="text-amber-300 font-bold">
                  +{currentLang === 'hi' ? 'अतिरिक्त लाभ' : 'Extra Cash'}: +₹{primaryBestDeal.extraProfitGained.toLocaleString('en-IN')} (+{primaryBestDeal.extraProfitPercent}%)
                </span>
                <span className="text-teal-300 font-bold">
                  {currentLang === 'hi' ? 'भाड़े में बचत:' : 'Freight Saved:'} ₹{primaryBestDeal.transportSavings.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
            <button
              onClick={() => {
                setBestDealTargetListingId(listings[0]?.id);
                setIsBestDealModalOpen(true);
              }}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black rounded-xl text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Trophy className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
              <span>{currentLang === 'hi' ? 'सर्वोत्तम डील विश्लेषण देखें' : currentLang === 'mr' ? 'सर्वोत्तम डील विश्लेषण पहा' : 'View Best Deal Analysis'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2-Minute Playable Video Showcase & Download Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-lg text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-inner">
            <Film className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                {currentLang === 'hi' ? '२-मिनट वीडियो गाइड' : currentLang === 'mr' ? '२-मिनिटे व्हिडिओ मार्गदर्शक' : '2-Min Video Guide'}
              </span>
              <span className="text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                <span>🎙️</span>
                <span>{currentLang === 'hi' ? 'स्वाभाविक हिंदी आवाज़' : 'Realistic Hindi Voice'}</span>
              </span>
              <span className="text-xs text-stone-400 font-mono">
                HD 1280x720 · 2:00 MIN
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {currentLang === 'hi'
                ? 'कृषि बंधु से किसान का शुद्ध लाभ: ७-दिन भाव भविष्यवाणी, सस्ता ट्रांसपोर्ट व ₹३४,८०० की बचत'
                : currentLang === 'mr'
                ? 'कृषी बंधूचे फायदे: ७ दिवसांचा भाव अंदाज, स्वस्त वाहतूक आणि ₹३४,८०० चा निव्वळ नफा'
                : 'How Krishi Bandhu Benefits Farmers: 7-Day Forecast, 45% Transport Savings & +₹34,800 Net'}
            </h3>
            <p className="text-xs text-stone-300 mt-0.5 line-clamp-1">
              {currentLang === 'hi'
                ? 'वीडियो में देखें कैसे सही समय पर तोडाई और शेयरिंग गाड़ी से प्रति ५ टन पर ₹३४,८०० अधिक कमाई होती है।'
                : 'Watch how peak rate timing and shared pooling generate ₹34,800 in extra net earnings.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap w-full md:w-auto justify-end">
          <button
            onClick={() => setActiveTab('video')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md cursor-pointer active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{currentLang === 'hi' ? 'वीडियो देखें (Watch Video)' : currentLang === 'mr' ? 'व्हिडिओ पहा' : 'Play Video'}</span>
          </button>

          {onOpenPresentation && (
            <button
              onClick={onOpenPresentation}
              className="flex items-center justify-center gap-1 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold px-3 py-2.5 rounded-xl text-xs transition cursor-pointer border border-stone-700"
              title="Open Fullscreen Cinema Mode"
            >
              <span>{currentLang === 'hi' ? 'फुलस्क्रीन' : 'Fullscreen'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'listings'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.myLotsAndBids} ({listings.length})
          </button>
          
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'enquiries'
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
            onClick={() => setActiveTab('requirements')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'requirements'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.buyerRequirements} ({requirements.length})
          </button>

          <button
            onClick={() => setActiveTab('mandi')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'mandi'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.liveMandiRates}
          </button>

          {/* Transport & Logistics Deals Tab */}
          <button
            onClick={() => setActiveTab('transport')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'transport'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.transportDeals}</span>
            <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
              {currentLang === 'hi' ? '४५% बचत' : currentLang === 'mr' ? '४५% बचत' : 'Save 45%'}
            </span>
          </button>

          {/* Best Deal Advisor Tab Trigger */}
          <button
            onClick={() => {
              setBestDealTargetListingId(listings[0]?.id);
              setIsBestDealModalOpen(true);
            }}
            className="pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer border-transparent text-amber-700 dark:text-amber-400 hover:text-amber-900 bg-amber-50/70 dark:bg-amber-950/40 rounded-t-lg shadow-2xs"
            title="Open AI Best Financial & Transport Deal Advisor"
          >
            <Trophy className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{currentLang === 'hi' ? 'सर्वोत्तम डील (Best Deal)' : currentLang === 'mr' ? 'सर्वोत्तम डील (Best Deal)' : 'Best Deal Advisor'}</span>
            <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
              AI #1
            </span>
          </button>

          {/* 2-Min Express Video Tab */}
          <button
            onClick={() => setActiveTab('video')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'video'
                ? 'border-emerald-700 text-emerald-800 font-extrabold bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-amber-700 hover:text-amber-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <Film className="w-3.5 h-3.5 text-amber-600" />
            <span>{currentLang === 'hi' ? 'किसान वीडियो व डाउनलोड (२ मिनट)' : currentLang === 'mr' ? 'शेतकरी व्हिडिओ व डाउनलोड (२ मि.)' : 'Farmer Video & Download (2 Min)'}</span>
            <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
              HD
            </span>
          </button>
        </div>

        <button
          onClick={onOpenSellModal}
          className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1 mb-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.sellProduce}</span>
        </button>
      </div>

      {/* Tab 1: My Produce Lots & Incoming Bids */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          {listings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <Package className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-800">{t.noListingsFound}</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                {t.uploadPhotoDesc}
              </p>
              <button
                onClick={onOpenSellModal}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.sellProduce}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {listings.map((listing) => {
                const listingBids = bids.filter((b) => b.listingId === listing.id);
                const matchingRate = mandiRates.find((r) =>
                  r.vegetableName.toLowerCase().includes(listing.vegetableName.split(' ')[0].toLowerCase())
                );
                const lotApprovedEnquiry = enquiries.find(
                  (e) => e.referenceId === listing.id && e.status === 'approved'
                );

                return (
                  <div
                    key={listing.id}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 transition"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                      
                      {/* Produce Photo + Visual AI Quality Index */}
                      <div className="lg:col-span-4 relative bg-stone-100 flex flex-col justify-between p-4 min-h-[240px]">
                        <img
                          src={listing.imageUrl}
                          alt={listing.vegetableName}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/30"></div>

                        {/* Top Quality Badge */}
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="bg-emerald-800 text-emerald-100 text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                            {listing.qualityGrade}
                          </span>
                          <span className="bg-stone-900/80 text-white text-xs font-semibold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{listing.qualityMetrics.freshnessScore}% Fresh</span>
                          </span>
                        </div>

                        {/* Bottom Photo Inspection Overlay */}
                        <div className="relative z-10 space-y-2 text-white">
                          <div className="bg-stone-900/80 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 text-xs space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-stone-300">
                              <span>Uniformity: {listing.qualityMetrics.uniformityScore}%</span>
                              <span>Defect-Free: {listing.qualityMetrics.defectFreeScore}%</span>
                            </div>
                            <p className="text-[10px] text-emerald-300 italic truncate">
                              {listing.qualityMetrics.aiVerificationNotes}
                            </p>
                          </div>

                          <button
                            onClick={() => onInspectProduce(listing)}
                            className="w-full py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg backdrop-blur-xs transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Zoom & Inspect Batch</span>
                          </button>
                        </div>
                      </div>

                      {/* Lot Specifications & Pricing */}
                      <div className="lg:col-span-8 p-5 sm:p-6 flex flex-col justify-between space-y-5">
                        
                        <div>
                          {/* Heading + Asking Price */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-stone-100 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-stone-900">{listing.vegetableName}</h3>
                                <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-medium">
                                  {listing.variety}
                                </span>
                              </div>
                              <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                <span>{listing.farmLocation} · Preferred Mandi: {listing.mandiYard}</span>
                              </p>
                            </div>

                            <div className="text-left sm:text-right shrink-0">
                              <span className="text-[10px] text-stone-500 uppercase font-semibold block">{t.expectedPrice}</span>
                              <div className="flex items-baseline gap-1 sm:justify-end">
                                <span className="text-2xl font-black text-emerald-800">₹{listing.expectedPricePerKg}</span>
                                <span className="text-xs text-stone-500">/kg</span>
                              </div>
                            </div>
                          </div>

                          {/* Volume & Market Rate Benchmark Comparison */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 text-xs">
                            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                              <span className="text-stone-500 text-[10px] uppercase font-semibold block">{t.quantity}</span>
                              <strong className="text-sm text-stone-900">{listing.quantity} {listing.unit}</strong>
                            </div>
                            
                            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                              <span className="text-stone-500 text-[10px] uppercase font-semibold block">{listing.mandiYard} Rate</span>
                              <strong className="text-sm text-stone-900">
                                {matchingRate ? `₹${matchingRate.modalPricePerKg}/kg` : '₹26/kg'}
                              </strong>
                            </div>

                            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                              <span className="text-stone-500 text-[10px] uppercase font-semibold block">Incoming Bids</span>
                              <strong className="text-sm text-emerald-700">{listingBids.length} Offers</strong>
                            </div>

                            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                              <span className="text-stone-500 text-[10px] uppercase font-semibold block">Privacy Shield</span>
                              <strong className="text-sm text-stone-700 flex items-center gap-1">
                                {lotApprovedEnquiry ? (
                                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                                    <Unlock className="w-3 h-3" />
                                    <span>Shared</span>
                                  </span>
                                ) : (
                                  <span className="text-stone-500 flex items-center gap-1">
                                    <Lock className="w-3 h-3 text-stone-400" />
                                    <span>Protected</span>
                                  </span>
                                )}
                              </strong>
                            </div>
                          </div>

                          {/* 7-Day Market Prediction Insight for this commodity */}
                          {matchingRate && (() => {
                            const pred = matchingRate.prediction || generateRatePrediction(matchingRate);
                            return (
                              <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-3 my-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                <div className="flex items-start gap-2">
                                  <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                                  <div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-bold text-emerald-950">
                                        7D Forecast: ₹{pred.predictedModal7Day}/kg ({pred.trendOutlook} {pred.expectedChange7DayPercent >= 0 ? '+' : ''}{pred.expectedChange7DayPercent}%)
                                      </span>
                                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                                        Confidence: {pred.confidenceScorePercent}%
                                      </span>
                                    </div>
                                    <span className="text-[11px] text-emerald-800 block mt-0.5">
                                      💡 <strong>Advice:</strong> {pred.recommendationFarmer}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setSelectedPredictionRate(matchingRate)}
                                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-300 shrink-0 cursor-pointer shadow-2xs self-start sm:self-center"
                                >
                                  {currentLang === 'hi' ? 'पूर्वानुमान देखें' : currentLang === 'mr' ? 'अंदाज पहा' : 'Forecast Details'}
                                </button>
                              </div>
                            );
                          })()}

                          {/* Suggested Best Transport Deal for this Lot */}
                          {(() => {
                            const bestDeal = suggestBestDealForListing(listing, matchingRate);
                            if (!bestDeal) return null;
                            return (
                              <div className="mt-3 p-3 bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50/70 rounded-xl border border-teal-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-amber-400 text-stone-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                                      <Truck className="w-3 h-3 text-stone-900" />
                                      <span>{currentLang === 'hi' ? 'सर्वोत्तम परिवहन डील' : currentLang === 'mr' ? 'सर्वोत्तम वाहतूक डील' : 'Best Transport Deal'}</span>
                                    </span>
                                    <span className="text-[11px] font-bold text-stone-800">
                                      {bestDeal.deal.vehicleType}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-teal-950 font-medium">
                                    {bestDeal.recommendationReason}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px] text-stone-600">
                                    <span className="text-rose-700 font-semibold">
                                      {currentLang === 'hi' ? 'भाड़ा:' : currentLang === 'mr' ? 'भाडे:' : 'Freight:'} ₹{bestDeal.calculatedFreight.toLocaleString('en-IN')} (₹{bestDeal.freightPerKg}/kg)
                                    </span>
                                    <span>•</span>
                                    <span className="text-emerald-800 font-bold">
                                      {currentLang === 'hi' ? 'शुद्ध कमाई:' : currentLang === 'mr' ? 'निव्वळ नफा:' : 'Net Realization:'} ₹{bestDeal.netRealizationPerKg}/kg
                                    </span>
                                    <span>•</span>
                                    <span className="bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                                      +{currentLang === 'hi' ? 'बचत' : currentLang === 'mr' ? 'बचत' : 'Save'} ₹{bestDeal.savingsVsSoloHire.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setBestDealTargetListingId(listing.id);
                                      setIsBestDealModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-[11px] font-black rounded-lg shrink-0 cursor-pointer shadow-xs flex items-center gap-1 transition active:scale-95"
                                    title="View combined Best Financial & Transport Deal for this lot"
                                  >
                                    <Trophy className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
                                    <span>{currentLang === 'hi' ? 'सर्वोत्तम डील' : currentLang === 'mr' ? 'सर्वोत्तम डील' : 'Best Deal'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedTransportListingId(listing.id);
                                      setActiveTab('transport');
                                    }}
                                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold rounded-lg shrink-0 cursor-pointer shadow-xs flex items-center gap-1 transition"
                                  >
                                    <span>{currentLang === 'hi' ? 'गाड़ी बुक करें' : currentLang === 'mr' ? 'गाडी बुक करा' : 'Book Truck'}</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Incoming Buyer Bids for this Lot */}
                          <div className="mt-4 pt-3 border-t border-stone-100 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Incoming Purchase Bids from Vendors ({listingBids.length})</span>
                              </h4>
                            </div>

                            {listingBids.length === 0 ? (
                              <div className="p-4 bg-stone-50 rounded-xl text-center text-xs text-stone-500">
                                No vendor bids received yet for this lot.
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {listingBids.map((bid) => {
                                  const totalBidAmount =
                                    (bid.unit === 'quintal' ? bid.offeredQuantity * 100 : bid.offeredQuantity) *
                                    bid.offeredPricePerKg;
                                  const isCountering = counterInputId === bid.id;
                                  const isBidContactApproved = lotApprovedEnquiry || bid.status === 'accepted';

                                  return (
                                    <div
                                      key={bid.id}
                                      className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-white transition text-xs space-y-2"
                                    >
                                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <span className="font-bold text-stone-900">{bid.vendorName}</span>
                                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                                              {bid.vendorType}
                                            </span>
                                            <span className="text-stone-400">· {bid.vendorLocation}</span>
                                          </div>

                                          {/* Contact phone masked or approved */}
                                          <div className="mt-1 text-[11px]">
                                            {isBidContactApproved ? (
                                              <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                                                <Unlock className="w-3 h-3 text-emerald-600" />
                                                <span>Direct Phone: {bid.vendorPhone}</span>
                                                <a
                                                  href={`tel:${bid.vendorPhone.replace(/\s+/g, '')}`}
                                                  className="px-1.5 py-0.2 bg-emerald-700 text-white rounded text-[10px] font-semibold"
                                                >
                                                  Call
                                                </a>
                                              </span>
                                            ) : (
                                              <span className="text-stone-500 flex items-center gap-1">
                                                <Lock className="w-3 h-3 text-stone-400" />
                                                <span>{t.phoneMasked}</span>
                                              </span>
                                            )}
                                          </div>

                                          <p className="text-stone-600 mt-1 italic text-[11px]">
                                            &ldquo;{bid.message}&rdquo;
                                          </p>
                                          <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-1">
                                            <span>{t.logisticsPickup}: <strong>{bid.logistics}</strong></span>
                                            <span>·</span>
                                            <span>{t.quantity}: <strong>{bid.offeredQuantity} {bid.unit}</strong></span>
                                          </div>
                                        </div>

                                        <div className="text-left sm:text-right shrink-0">
                                          <span className="text-[10px] text-stone-500 uppercase block">{t.offeredPrice}</span>
                                          <span className="text-lg font-bold text-emerald-800">
                                            ₹{bid.offeredPricePerKg}/kg
                                          </span>
                                          <span className="text-[11px] text-stone-700 block">
                                            {t.totalDealAmount}: ₹{totalBidAmount.toLocaleString('en-IN')}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Counter Offer Input */}
                                      {isCountering && (
                                        <div className="mt-3 pt-3 border-t border-stone-200 flex items-center gap-2">
                                          <input
                                            type="number"
                                            step="0.5"
                                            placeholder="Enter counter price ₹/kg"
                                            value={counterPrice || ''}
                                            onChange={(e) => setCounterPrice(Number(e.target.value))}
                                            className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs w-48 font-bold"
                                          />
                                          <button
                                            onClick={() => {
                                              if (counterPrice > 0) {
                                                onCounterBid(bid.id, counterPrice);
                                                setCounterInputId(null);
                                              }
                                            }}
                                            className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                                          >
                                            Send Counter Rate
                                          </button>
                                          <button
                                            onClick={() => setCounterInputId(null)}
                                            className="px-2 py-1.5 text-stone-500 hover:text-stone-700 text-xs cursor-pointer"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      )}

                                      {/* Bid Actions */}
                                      <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                                        <span className="text-[10px] text-stone-500">
                                          Received {bid.createdAt}
                                        </span>

                                        <div className="flex items-center gap-2">
                                          {bid.status === 'pending' ? (
                                            <>
                                              <button
                                                onClick={() => onAcceptBid(bid, listing)}
                                                className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition cursor-pointer"
                                              >
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>{t.acceptBid}</span>
                                              </button>

                                              <button
                                                onClick={() => {
                                                  setCounterInputId(bid.id);
                                                  setCounterPrice(listing.expectedPricePerKg);
                                                }}
                                                className="flex items-center gap-1 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-medium px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                                              >
                                                <span>{t.counterBid}</span>
                                              </button>

                                              <button
                                                onClick={() => onRejectBid(bid.id)}
                                                className="text-stone-400 hover:text-rose-600 p-1 rounded transition cursor-pointer"
                                                title="Decline Offer"
                                              >
                                                <XCircle className="w-4 h-4" />
                                              </button>
                                            </>
                                          ) : bid.status === 'accepted' ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100 px-2.5 py-1 rounded-md text-xs">
                                              <CheckCircle2 className="w-3.5 h-3.5" />
                                              <span>Deal Finalized · APMC Gate Pass Issued</span>
                                            </span>
                                          ) : (
                                            <span className="text-stone-400 text-xs">Declined</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Harvest timestamp */}
                        <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
                          <span>Harvested: {listing.harvestDate} · Dispatch: {listing.dispatchReadyDate}</span>
                          <span className="font-medium text-stone-600">Lot #{listing.id}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Contact Enquiries & Privacy Approvals */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-start gap-3 text-xs">
            <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-stone-900 text-sm">{t.privacyNotice}</h3>
              <p className="text-stone-600 mt-0.5 leading-relaxed">
                {currentLang === 'hi'
                  ? 'व्यापारियों को आपका फोन और खेत का पूरा पता केवल तभी मिलता है जब आप उनकी पूछताछ स्वीकार करते हैं। इसी तरह, व्यापारियों की मांग के लिए भेजी गई आपकी पूछताछ यहां ट्रैक की जाती है।'
                  : currentLang === 'mr'
                  ? 'व्यापाऱ्यांना तुमचा फोन आणि शेताचा पत्ता फक्त तुम्ही संमती दिल्यावरच मिळतो. तसेच व्यापाऱ्यांच्या खरेदी मागणीसाठी तुम्ही पाठवलेली चौकशी येथे पाहता येते.'
                  : 'Vendors only receive your direct phone and farm location when you approve their inquiry. Unlocked details appear below.'}
              </p>
            </div>
          </div>

          {/* 1. Incoming Enquiries from Vendors to this Farmer */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-emerald-50/70 border-b border-emerald-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-emerald-950 text-sm">
                  {currentLang === 'hi' ? 'व्यापारियों से प्राप्त पूछताछ (अनुमोदन आवश्यक)' : currentLang === 'mr' ? 'व्यापाऱ्यांकडून आलेल्या चौकशी विनंत्या' : 'Incoming Enquiries from Vendors'}
                </h3>
                <p className="text-xs text-stone-600">
                  {currentLang === 'hi' ? 'स्वीकार करने पर व्यापारी को आपका फोन व खेत का पता साझा होगा' : currentLang === 'mr' ? 'संमती दिल्यावर व्यापाऱ्याला तुमचा फोन व शेताचा पत्ता मिळेल' : 'Approve to unlock and share direct contact details'}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                {incomingEnquiries.length} total
              </span>
            </div>

            {incomingEnquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No incoming enquiries from vendors yet.
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {incomingEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:bg-stone-50/70 transition"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{enq.fromUserName}</span>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium">
                          {enq.fromRole === 'vendor' ? t.vendorRole : t.farmerRole}
                        </span>
                        <span className="text-stone-400">· {enq.fromLocation}</span>
                      </div>

                      <div className="text-stone-700 font-medium">
                        Regarding: <strong className="text-emerald-800">{enq.referenceTitle}</strong>
                      </div>

                      <p className="text-stone-600 italic bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                        &ldquo;{enq.message}&rdquo;
                      </p>

                      {enq.status === 'approved' && (
                        <div className="mt-2 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-950 space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                            <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{t.sharedContactDetails}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                            <div>
                              <span className="text-stone-500 block text-[10px] uppercase font-semibold">Buyer Direct Phone</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <strong className="text-stone-900">{enq.vendorContact?.phone || enq.fromPhone}</strong>
                                <a
                                  href={`tel:${(enq.vendorContact?.phone || enq.fromPhone).replace(/\s+/g, '')}`}
                                  className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[11px] font-semibold"
                                >
                                  Call
                                </a>
                              </div>
                            </div>
                            <div>
                              <span className="text-stone-500 block text-[10px] uppercase font-semibold">Delivery Warehouse / Yard</span>
                              <span className="text-stone-800">{enq.vendorContact?.deliveryAddress || enq.fromLocation}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {enq.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => onApproveEnquiry(enq.id)}
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>{t.approveAndShare}</span>
                          </button>
                          <button
                            onClick={() => onRejectEnquiry(enq.id)}
                            className="px-3 py-2 border border-stone-300 text-stone-600 hover:bg-stone-50 rounded-lg text-xs transition cursor-pointer"
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
                ))}
              </div>
            )}
          </div>

          {/* 2. Outgoing Enquiries Sent by this Farmer to Vendors */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  {currentLang === 'hi' ? 'मेरी भेजी गई पूछताछ (व्यापारियों को)' : currentLang === 'mr' ? 'मी व्यापाऱ्यांना पाठवलेल्या चौकशी' : 'My Enquiries Sent to Vendors'}
                </h3>
                <p className="text-xs text-stone-500">
                  Enquiries sent to supply buyer procurement requirements
                </p>
              </div>
              <span className="text-xs text-stone-500">{outgoingEnquiries.length} total</span>
            </div>

            {outgoingEnquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No enquiries sent to buyers yet. Click &ldquo;Apply for Enquiry&rdquo; under Buyer Requirements.
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {outgoingEnquiries.map((enq) => (
                  <div key={enq.id} className="p-4 text-xs space-y-2 hover:bg-stone-50 transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-stone-900 text-sm">{enq.referenceTitle}</span>
                        <span className="text-stone-500 block">Recipient Buyer: {enq.toUserName}</span>
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
                            Buyer Direct Phone: <strong>{enq.vendorContact?.phone || '+91 98190 77221'}</strong>
                          </div>
                          <div>
                            Delivery Address: <strong>{enq.vendorContact?.deliveryAddress || 'Sector 19, Vashi APMC'}</strong>
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

      {/* Tab 3: Buyer Requirements Matching */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requirements.map((req) => {
              // Check if enquiry sent by farmer on this requirement
              const approvedEnquiry = enquiries.find(
                (e) => e.referenceId === req.id && e.status === 'approved'
              );
              const pendingEnquiry = enquiries.find(
                (e) => e.referenceId === req.id && e.status === 'pending'
              );

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-stone-300 transition space-y-4"
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
                        Company: {req.companyName} ({req.vendorName})
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
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Preferred Mandi:</span>
                      <strong className="text-stone-900">{req.preferredMandi}</strong>
                    </div>
                  </div>

                  {/* Privacy-Protected Phone Mask & Enquiry Status */}
                  <div className="pt-1 text-xs">
                    {approvedEnquiry ? (
                      <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-950 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-800 flex items-center gap-1">
                            <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{t.sharedContactDetails}</span>
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                            Approved
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-bold text-stone-900">
                          <span>Buyer Phone: {req.vendorPhone}</span>
                          <a
                            href={`tel:${req.vendorPhone.replace(/\s+/g, '')}`}
                            className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[11px] font-semibold"
                          >
                            Call
                          </a>
                        </div>
                        <div className="text-[11px] text-stone-600">
                          Warehouse: {req.exactDeliveryAddress}
                        </div>
                      </div>
                    ) : pendingEnquiry ? (
                      <div className="flex items-center justify-between bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900 font-medium">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{t.enquiryPending}</span>
                        </span>
                        <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded font-bold">
                          Awaiting Buyer Approval
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-stone-400" />
                          <span>{t.phoneMasked}</span>
                        </span>

                        <button
                          onClick={() => onRequestVendorEnquiry(req)}
                          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>{t.applyForEnquiry}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Live APMC Rates for Farmer Reference (Non-editable) */}
      {activeTab === 'mandi' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-0">
          
          <div className="p-4 bg-emerald-50/70 border-b border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  {currentLang === 'hi' ? 'महाराष्ट्र APMC लाइव मंडी भाव' : currentLang === 'mr' ? 'महाराष्ट्र APMC थेट बाजारभाव' : 'Live Maharashtra APMC Mandi Benchmark'}
                </h3>
                <p className="text-xs text-stone-600">{t.readOnlyNotice}</p>
              </div>
            </div>
          </div>

          {/* Mandi Yard Filter Bar for Maharashtra Mandis */}
          <div className="px-4 py-2 bg-stone-50 border-b border-stone-200 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
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
            {/* 7-Day Prediction explanation banner */}
            <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-950 to-stone-900 text-white flex items-center justify-between text-xs border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-emerald-200">
                  {currentLang === 'hi'
                    ? '7-दिवसीय भाव भविष्यवाणी: 30 दिन, पिछला वर्ष व वर्तमान/भावी फसल स्टॉक के आधार पर'
                    : currentLang === 'mr'
                    ? '७-दिवसीय दर अंदाज: मागील ३० दिवस, मागील वर्ष व साठ्यावर आधारित'
                    : '7-Day Price Forecast: Grounded in 30D Trends, YoY Seasonality & Live Stock Telemetry'}
                </span>
              </div>
              <span className="text-[10px] text-stone-300 hidden sm:inline">
                Click any rate row to view full 4-factor intelligence
              </span>
            </div>

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

                    const pred = rate.prediction || generateRatePrediction(rate);
                    const isBullish = pred.trendOutlook === 'Bullish';
                    const isBearish = pred.trendOutlook === 'Bearish';

                    return (
                      <tr key={rate.id} className="hover:bg-stone-50/80 transition">
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

                        {/* SEPARATE 7-DAY PREDICTION COLUMN */}
                        <td className="px-4 py-3 bg-emerald-50/40 border-x border-emerald-100">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-emerald-950 text-sm">
                                ₹{pred.predictedModal7Day}
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
                                {isBullish ? '▲' : isBearish ? '▼' : '⬌'} {pred.expectedChange7DayPercent >= 0 ? '+' : ''}{pred.expectedChange7DayPercent}%
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedPredictionRate(rate)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 transition cursor-pointer w-fit shadow-2xs"
                            >
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>{currentLang === 'hi' ? 'सलाह व विश्लेषण' : currentLang === 'mr' ? 'सल्ला व विश्लेषण' : 'Advice & Forecast'}</span>
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

      {/* Tab 5: Transport & Logistics Deals View */}
      {activeTab === 'transport' && (
        <TransportDealsView
          currentUser={currentUser}
          listings={listings}
          mandiRates={mandiRates}
          currentLang={currentLang}
          onOpenSellModal={onOpenSellModal}
          preSelectedListingId={selectedTransportListingId}
        />
      )}

      {/* Tab 6: 2-Minute Playable Video Presentation */}
      {activeTab === 'video' && (
        <FarmerInlineVideoPlayer
          currentLang={currentLang}
          onOpenModal={onOpenPresentation}
        />
      )}

      {/* 7-Day Rate Prediction & 4-Factor Intelligence Modal */}
      <PredictionDetailModal
        rate={selectedPredictionRate}
        onClose={() => setSelectedPredictionRate(null)}
        currentLang={currentLang}
      />

      {/* 8. AI Best Financial & Transportation Deal Advisor Modal */}
      <FarmerBestDealAdvisorModal
        isOpen={isBestDealModalOpen}
        onClose={() => setIsBestDealModalOpen(false)}
        currentUser={currentUser}
        listings={listings}
        bids={bids}
        mandiRates={mandiRates}
        currentLang={currentLang}
        onAcceptBid={(bidId) => {
          const matchedBid = bids.find((b) => b.id === bidId);
          const matchedListing = listings.find((l) => l.id === matchedBid?.listingId);
          if (matchedBid && matchedListing) {
            onAcceptBid(matchedBid, matchedListing);
          }
        }}
        initialSelectedListingId={bestDealTargetListingId}
      />

    </div>
  );
};
