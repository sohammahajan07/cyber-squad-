import React, { useState } from 'react';
import {
  MandiRate,
  GatePass,
  Language,
  ProduceListing,
  BidOffer,
  UserProfile
} from '../types/market';
import { TRANSLATIONS } from '../utils/translations';
import {
  Building2,
  TrendingUp,
  TrendingDown,
  FileText,
  Printer,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Radio,
  Info,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from 'lucide-react';
import { PredictionDetailModal } from './PredictionDetailModal';
import { generateRatePrediction } from '../utils/ratePredictor';

interface ApmcViewProps {
  currentUser: UserProfile;
  mandiRates: MandiRate[];
  gatePasses: GatePass[];
  onCreateGatePass: (gatePass: GatePass) => void;
  onViewGatePass: (gatePass: GatePass) => void;
  listings: ProduceListing[];
  bids: BidOffer[];
  currentLang: Language;
}

export const ApmcView: React.FC<ApmcViewProps> = ({
  currentUser,
  mandiRates,
  gatePasses,
  onCreateGatePass,
  onViewGatePass,
  listings,
  bids,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [activeTab, setActiveTab] = useState<'rates' | 'gate-passes' | 'new-gate-pass'>('rates');
  const [selectedMandiYard, setSelectedMandiYard] = useState<string>('All');
  const [selectedPredictionRate, setSelectedPredictionRate] = useState<MandiRate | null>(null);

  // Gate Pass form state
  const [farmerName, setFarmerName] = useState<string>('Ramesh Patil (Nashik)');
  const [vendorName, setVendorName] = useState<string>('Deepak Agrawal (FreshKart)');
  const [mandiName, setMandiName] = useState<string>('Vashi APMC Navi Mumbai');
  const [commodity, setCommodity] = useState<string>('Tomato (Hybrid) - Grade A');
  const [quantity, setQuantity] = useState<number>(1200);
  const [unit, setUnit] = useState<string>('kg');
  const [ratePerKg, setRatePerKg] = useState<number>(27);
  const [vehicleNumber, setVehicleNumber] = useState<string>('MH-15-EG-4921');
  const [gateNumber, setGateNumber] = useState<string>('Gate No. 4 (Vegetable Yard)');

  const totalArrivalsQtl = mandiRates.reduce((acc, curr) => acc + curr.dailyArrivalQuintals, 0);

  const handleGenerateGatePass = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = quantity * ratePerKg;
    const mandiFeePercent = 1.05;
    const mandiFeeAmount = Math.round((totalAmount * mandiFeePercent) / 100);

    const newPass: GatePass = {
      passNumber: `APMC/${mandiName.slice(0, 3).toUpperCase()}/2026/G-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerName,
      vendorName,
      mandiName,
      commodity,
      quantity,
      unit,
      ratePerKg,
      totalAmount,
      mandiFeePercent,
      mandiFeeAmount,
      vehicleNumber,
      gateNumber,
      issueTimestamp: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      qrData: `APMC-VERIFIED-${Date.now()}`,
      status: 'ISSUED',
    };

    onCreateGatePass(newPass);
    onViewGatePass(newPass);
    setActiveTab('gate-passes');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / APMC Authority Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 rounded-2xl p-6 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {t.apmcRole}
              </span>
              <span className="text-[11px] bg-emerald-800/80 text-white px-2 py-0.5 rounded-full border border-emerald-600/40">
                {t.verifiedUser}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {currentLang === 'hi'
                ? 'लाइव मंडी भाव बुलेटिन व आधिकारिक गेट पास'
                : currentLang === 'mr'
                ? 'थेट बाजारभाव बुलेटिन व अधिकृत गेट पास'
                : 'Live Mandi Auction Bulletin & Gate Clearance'}
            </h2>
            <p className="text-xs text-stone-300 max-w-2xl">
              {t.officialMandiFeed}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('new-gate-pass')}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-sm transition active:scale-98 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{t.generateGatePass}</span>
            </button>
          </div>
        </div>

        {/* APMC Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-800 text-xs">
          <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[11px]">{t.todayArrivals}</span>
            <span className="text-xl font-bold text-white">{totalArrivalsQtl.toLocaleString('en-IN')} Qtl</span>
          </div>
          <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[11px]">Active Mandis</span>
            <span className="text-xl font-bold text-emerald-400">{mandiRates.length} Yards</span>
          </div>
          <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[11px]">Cleared Gate Passes</span>
            <span className="text-xl font-bold text-white">{gatePasses.length}</span>
          </div>
          <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[11px]">{t.mandiCess}</span>
            <span className="text-xl font-bold text-emerald-300">1.05% Statutory</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('rates')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'rates'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.liveMandiRates} ({mandiRates.length})
          </button>
          <button
            onClick={() => setActiveTab('gate-passes')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'gate-passes'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {currentLang === 'hi' ? 'जारी किए गए गेट पास' : currentLang === 'mr' ? 'जारी केलेले गेट पास' : 'Issued Gate Passes'} ({gatePasses.length})
          </button>
          <button
            onClick={() => setActiveTab('new-gate-pass')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'new-gate-pass'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.generateGatePass}
          </button>
        </div>

        {/* Read-Only Notice Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">
          <Lock className="w-3.5 h-3.5 text-stone-500" />
          <span className="font-medium">{t.readOnlyNotice}</span>
        </div>
      </div>

      {/* Tab 1: Live Mandi Rates Board (READ ONLY - NOT EDITABLE) */}
      {activeTab === 'rates' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-0">
          
          {/* Header notification about non-editable official rate */}
          <div className="p-4 bg-emerald-50/70 border-b border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  {currentLang === 'hi'
                    ? 'आधिकारिक APMC दैनिक नीलामी भाव'
                    : currentLang === 'mr'
                    ? 'अधिकृत APMC दैनिक लिलाव भाव'
                    : 'Official APMC Daily Auction Benchmark'}
                </h3>
                <p className="text-xs text-stone-600">
                  {t.readOnlyNotice}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-200">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>{t.officialMandiFeed}</span>
            </div>
          </div>

          {/* Mandi Yard Filter Bar for Maharashtra Mandis */}
          <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="font-semibold text-stone-700 shrink-0">
              {currentLang === 'hi' ? 'महाराष्ट्र मंडी चुनें:' : currentLang === 'mr' ? 'महाराष्ट्र बाजार समिती:' : 'Maharashtra Mandi:'}
            </span>
            {['All Maharashtra Mandis', 'Vashi APMC', 'Lasalgaon APMC', 'Nashik APMC', 'Pune APMC', 'Baramati APMC', 'Kolhapur APMC'].map((yard) => {
              const isActive = selectedMandiYard === yard || (yard === 'All Maharashtra Mandis' && selectedMandiYard === 'All');
              return (
                <button
                  key={yard}
                  type="button"
                  onClick={() => setSelectedMandiYard(yard === 'All Maharashtra Mandis' ? 'All' : yard)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:border-emerald-600 hover:text-emerald-700'
                  }`}
                >
                  {yard === 'All Maharashtra Mandis'
                    ? currentLang === 'hi'
                      ? 'सभी 6 महाराष्ट्र मंडियां'
                      : currentLang === 'mr'
                      ? 'सर्व 6 महाराष्ट्र बाजार समित्या'
                      : 'All 6 Maharashtra Mandis'
                    : yard}
                  {isActive && (
                    <span className="ml-1 text-[10px] opacity-80">✓</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="overflow-x-auto">
            {/* Informational banner about 7-Day rate prediction */}
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <strong className="text-emerald-300 font-bold block">
                    {currentLang === 'hi'
                      ? '7-दिवसीय भाव भविष्यवाणी प्रणाली (30 दिन, पिछला वर्ष व स्टॉक आधारित)'
                      : currentLang === 'mr'
                      ? '७-दिवसीय दर अंदाज प्रणाली (३० दिवस, मागील वर्ष व साठा आधारित)'
                      : '7-Day Price Forecast Engine (30D Trend, YoY Seasonal & Stock Telemetry)'}
                  </strong>
                  <p className="text-stone-300 text-[11px]">
                    {currentLang === 'hi'
                      ? 'अलग "7-दिवसीय भविष्यवाणी" कॉलम में देखें कि अगले 7 दिनों में भाव कहां जा रहे हैं। क्लिक करके संपूर्ण 4-घटक विश्लेषण देखें।'
                      : currentLang === 'mr'
                      ? 'स्वतंत्र "७-दिवसीय अंदाज" कॉलममध्ये पुढील ७ दिवसांचे दर पहा. सविस्तर विश्लेषणासाठी क्लिक करा.'
                      : 'Separate 7-Day Prediction column provides day-by-day forecasted modal rates and inventory pressure signals.'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-emerald-200 bg-white/10 px-2.5 py-1 rounded-lg shrink-0 border border-white/10">
                Model: 30D MA + YoY + Stock
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
                  {/* Separate 7-Day Prediction Column Header */}
                  <th className="px-4 py-3 bg-emerald-950/5 text-emerald-950 border-x border-emerald-200/80 font-bold">
                    <div className="flex items-center gap-1.5 text-emerald-900">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t.predictionColumn}</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {mandiRates
                  .filter((rate) => {
                    if (selectedMandiYard === 'All' || selectedMandiYard === 'All Maharashtra Mandis') return true;
                    return rate.mandiName.toLowerCase().includes(selectedMandiYard.split(' ')[0].toLowerCase());
                  })
                  .map((rate) => {
                  const displayName =
                    currentLang === 'hi'
                      ? rate.hindiName || rate.vegetableName
                      : currentLang === 'mr'
                      ? rate.marathiName || rate.vegetableName
                      : rate.vegetableName;

                  const pred = rate.prediction || generateRatePrediction(rate);
                  const isBullish = pred.trendOutlook === 'Bullish';
                  const isBearish = pred.trendOutlook === 'Bearish';

                  return (
                    <tr key={rate.id} className="hover:bg-stone-50 transition">
                      <td className="px-4 py-3 font-bold text-stone-900">
                        {displayName}
                        <span className="text-stone-500 font-normal block text-[11px]">{rate.vegetableName}</span>
                      </td>
                      <td className="px-4 py-3 text-stone-700">
                        <span className="font-semibold text-stone-900">{rate.mandiName}</span>
                        <span className="text-stone-500 block text-[11px]">{rate.district}, {rate.state}</span>
                      </td>

                      {/* Min Price */}
                      <td className="px-4 py-3 text-stone-600 font-medium">
                        ₹{rate.minPricePerKg} / kg
                      </td>

                      {/* Modal Price */}
                      <td className="px-4 py-3 font-black text-emerald-800 text-sm">
                        ₹{rate.modalPricePerKg} / kg
                      </td>

                      {/* Max Price */}
                      <td className="px-4 py-3 text-stone-600 font-medium">
                        ₹{rate.maxPricePerKg} / kg
                      </td>

                      {/* Arrivals */}
                      <td className="px-4 py-3 text-stone-700 font-medium">
                        {rate.dailyArrivalQuintals.toLocaleString('en-IN')} Qtl
                      </td>

                      {/* 24h Trend */}
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold inline-flex items-center gap-0.5 ${
                            rate.changePercent >= 0 ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {rate.changePercent >= 0 ? '+' : ''}{rate.changePercent}%
                        </span>
                      </td>

                      {/* SEPARATE PREDICTION COLUMN */}
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
                            <span>{currentLang === 'hi' ? 'पूर्वानुमान देखें' : currentLang === 'mr' ? 'दर अंदाज पहा' : 'View 7D Forecast'}</span>
                          </button>
                        </div>
                      </td>

                      {/* Official Verified Status */}
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Official</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Issued Gate Passes */}
      {activeTab === 'gate-passes' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                {currentLang === 'hi' ? 'जारी किए गए APMC इलेक्ट्रॉनिक गेट पास' : currentLang === 'mr' ? 'जारी केलेले इलेक्ट्रॉनिक गेट पास' : 'Official APMC Electronic Gate Passes'}
              </h3>
              <p className="text-xs text-stone-500">
                {currentLang === 'hi'
                  ? 'किसान और व्यापारी के मध्य संपन्न सौदों के अधिकृत ई-पास'
                  : currentLang === 'mr'
                  ? 'शेतकरी आणि व्यापाऱ्यांमधील अधिकृत ई-पास'
                  : 'Verified trade passes issued for vegetable lot dispatches'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('new-gate-pass')}
              className="px-3.5 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition"
            >
              + {t.generateGatePass}
            </button>
          </div>

          {gatePasses.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500 space-y-2">
              <FileText className="w-8 h-8 text-stone-300 mx-auto" />
              <p>No gate passes issued yet.</p>
              <button
                onClick={() => setActiveTab('new-gate-pass')}
                className="text-emerald-700 font-bold hover:underline"
              >
                Create an official electronic pass
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {gatePasses.map((pass) => (
                <div key={pass.passNumber} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-stone-50 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                        {pass.passNumber}
                      </span>
                      <span className="font-bold text-emerald-800 text-sm">{pass.commodity}</span>
                    </div>
                    <p className="text-stone-600">
                      Farmer: <strong>{pass.farmerName}</strong> &rarr; Buyer: <strong>{pass.vendorName}</strong>
                    </p>
                    <p className="text-stone-500 text-[11px]">
                      Vehicle: <span className="font-mono font-semibold">{pass.vehicleNumber}</span> · Gate: {pass.gateNumber} · Issued: {pass.issueTimestamp}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-right shrink-0">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase block">{t.totalDealAmount}</span>
                      <strong className="text-sm font-bold text-stone-900">
                        ₹{pass.totalAmount.toLocaleString('en-IN')}
                      </strong>
                      <span className="text-[10px] text-emerald-700 block">
                        Cess: ₹{pass.mandiFeeAmount}
                      </span>
                    </div>

                    <button
                      onClick={() => onViewGatePass(pass)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{t.viewGatePass}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Create New Gate Pass */}
      {activeTab === 'new-gate-pass' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-bold text-stone-900">{t.generateGatePass}</h3>
            <p className="text-xs text-stone-500">
              Generate an official APMC pass with weight measurement, vehicle registration, and statutory cess calculation
            </p>
          </div>

          <form onSubmit={handleGenerateGatePass} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Farmer Name (किसान)
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Buyer / Vendor Name (व्यापारी)
                </label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  {t.mandiYard} (महाराष्ट्र मंडी)
                </label>
                <select
                  value={mandiName}
                  onChange={(e) => setMandiName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white font-medium"
                >
                  <option value="Vashi APMC Navi Mumbai">Vashi APMC (Navi Mumbai)</option>
                  <option value="Lasalgaon APMC Nashik">Lasalgaon APMC (Nashik District)</option>
                  <option value="Nashik APMC Panchavati">Nashik APMC (Panchavati, Nashik)</option>
                  <option value="Pune APMC Market Yard">Pune APMC (Gultekdi Market Yard)</option>
                  <option value="Baramati APMC">Baramati APMC (Pune Rural)</option>
                  <option value="Kolhapur APMC Shahu Yard">Kolhapur APMC (Shahu Market Yard)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  {t.vegetable}
                </label>
                <input
                  type="text"
                  required
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  {t.quantity}
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  {t.unit}
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-white"
                >
                  <option value="kg">kg (Kilograms)</option>
                  <option value="quintal">quintal (100 kg)</option>
                  <option value="crate">crates (~25 kg)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Contracted Rate (₹/kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min={1}
                  required
                  value={ratePerKg}
                  onChange={(e) => setRatePerKg(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  {t.vehicleNo}
                </label>
                <input
                  type="text"
                  required
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Gate Number / Weighbridge
                </label>
                <input
                  type="text"
                  required
                  value={gateNumber}
                  onChange={(e) => setGateNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Calculations preview */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-700">
                <span>{t.totalDealAmount}:</span>
                <strong>₹{(quantity * ratePerKg).toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>{t.mandiCess}:</span>
                <strong>₹{Math.round(((quantity * ratePerKg) * 1.05) / 100).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setActiveTab('rates')}
                className="px-4 py-2 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-sm"
              >
                {t.generateGatePass}
              </button>
            </div>
          </form>
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
