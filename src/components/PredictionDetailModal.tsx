import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Calendar,
  History,
  Boxes,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Building2,
  Activity,
  Warehouse,
  BarChart3
} from 'lucide-react';
import { MandiRate, Language } from '../types/market';
import { TRANSLATIONS } from '../utils/translations';
import { generateRatePrediction } from '../utils/ratePredictor';

interface PredictionDetailModalProps {
  rate: MandiRate | null;
  onClose: () => void;
  currentLang: Language;
}

export const PredictionDetailModal: React.FC<PredictionDetailModalProps> = ({
  rate,
  onClose,
  currentLang
}) => {
  const [activeTab, setActiveTab] = useState<'forecast' | 'factors'>('forecast');
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(1);

  if (!rate) return null;

  const t = TRANSLATIONS[currentLang];
  const prediction = rate.prediction || generateRatePrediction(rate);

  const displayName =
    currentLang === 'hi'
      ? rate.hindiName || rate.vegetableName
      : currentLang === 'mr'
      ? rate.marathiName || rate.vegetableName
      : rate.vegetableName;

  const isBullish = prediction.trendOutlook === 'Bullish';
  const isBearish = prediction.trendOutlook === 'Bearish';

  const selectedPoint =
    prediction.sevenDayForecast.find((p) => p.dayOffset === selectedDayOffset) ||
    prediction.sevenDayForecast[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{t.predictedRate}</span>
            </span>
            <span className="bg-white/10 text-stone-200 text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Building2 className="w-3 h-3 text-stone-300" />
              <span>{rate.mandiName} ({rate.district})</span>
            </span>
            <span className="bg-white/10 text-stone-200 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
              Confidence: {prediction.confidenceScorePercent}%
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-1">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{displayName}</span>
              </h2>
              <p className="text-xs text-stone-300 mt-0.5">
                {rate.vegetableName} · Maharashtra APMC Benchmark
              </p>
            </div>

            {/* Current vs Day 7 Prediction Comparison */}
            <div className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-300 font-semibold block">
                  Today's Rate
                </span>
                <span className="text-xl font-bold text-stone-100">
                  ₹{rate.modalPricePerKg}
                  <span className="text-xs font-normal text-stone-300">/kg</span>
                </span>
              </div>

              <div className="text-stone-400 font-bold text-lg">→</div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold block">
                  Day 7 Target
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-emerald-400">
                    ₹{prediction.predictedModal7Day}
                    <span className="text-xs font-normal text-emerald-300">/kg</span>
                  </span>
                  <span
                    className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                      isBullish
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : isBearish
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                        : 'bg-stone-500/20 text-stone-200 border border-stone-400/40'
                    }`}
                  >
                    {isBullish ? <ArrowUpRight className="w-3.5 h-3.5" /> : isBearish ? <ArrowDownRight className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    <span>{prediction.expectedChange7DayPercent >= 0 ? '+' : ''}{prediction.expectedChange7DayPercent}%</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-stone-200 bg-stone-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('forecast')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'forecast'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{t.forecastTimeline}</span>
          </button>
          <button
            onClick={() => setActiveTab('factors')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'factors'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>{t.factorsBreakdown}</span>
          </button>
        </div>

        {/* Tab 1: 7-Day Forecast Trajectory */}
        {activeTab === 'forecast' && (
          <div className="p-6 space-y-6">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  {t.priceOutlook}
                </span>
                <span
                  className={`text-base font-black flex items-center gap-1 mt-1 ${
                    isBullish ? 'text-emerald-700' : isBearish ? 'text-rose-600' : 'text-stone-800'
                  }`}
                >
                  {isBullish ? <TrendingUp className="w-4 h-4" /> : isBearish ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  <span>{prediction.trendOutlook} Market</span>
                </span>
                <span className="text-[11px] text-stone-500 mt-0.5 block">
                  {prediction.expectedChange7DayPercent >= 0 ? '+' : ''}{prediction.expectedChange7DayPercent}% projected in 7 days
                </span>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  {t.peakDayLabel}
                </span>
                <span className="text-sm font-bold text-stone-900 mt-1 block">
                  {prediction.peakDay}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium block">
                  Best price window
                </span>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  {t.lowDayLabel}
                </span>
                <span className="text-sm font-bold text-stone-900 mt-1 block">
                  {prediction.lowDay}
                </span>
                <span className="text-[11px] text-stone-500 font-medium block">
                  Support level
                </span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                  {t.confidenceScore}
                </span>
                <span className="text-xl font-black text-emerald-900 mt-0.5 block">
                  {prediction.confidenceScorePercent}%
                </span>
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>30D & Stock Grounded</span>
                </span>
              </div>
            </div>

            {/* Strategic Recommendations for Farmer and Buyer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Farmer Advice */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-300 p-4 rounded-2xl space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wide">
                  <Lightbulb className="w-4 h-4 text-emerald-700" />
                  <span>{t.farmerRecommendation}</span>
                </div>
                <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                  {prediction.recommendationFarmer}
                </p>
              </div>

              {/* Vendor Advice */}
              <div className="bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-300 p-4 rounded-2xl space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-stone-800 font-bold text-xs uppercase tracking-wide">
                  <Building2 className="w-4 h-4 text-stone-700" />
                  <span>{t.vendorRecommendation}</span>
                </div>
                <p className="text-xs text-stone-800 font-medium leading-relaxed">
                  {prediction.recommendationVendor}
                </p>
              </div>
            </div>

            {/* 7-Day Visual Trajectory Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>Day-by-Day Forecasted Trajectory (अगले 7 दिन)</span>
                </h3>
                <span className="text-xs text-stone-500">
                  Click any day to inspect details
                </span>
              </div>

              {/* Interactive Day Selector Carousel */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {prediction.sevenDayForecast.map((point) => {
                  const isSelected = selectedDayOffset === point.dayOffset;
                  const isPositive = point.expectedChangePercent >= 0;
                  return (
                    <button
                      key={point.dayOffset}
                      type="button"
                      onClick={() => setSelectedDayOffset(point.dayOffset)}
                      className={`p-3 rounded-2xl text-left transition border cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-900 text-white border-emerald-900 shadow-md scale-[1.02]'
                          : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-emerald-300' : 'text-stone-500'}`}>
                          Day +{point.dayOffset}
                        </span>
                        <span className={`text-[10px] font-bold ${
                          isSelected
                            ? 'text-emerald-200'
                            : isPositive
                            ? 'text-emerald-700'
                            : 'text-rose-600'
                        }`}>
                          {isPositive ? '+' : ''}{point.expectedChangePercent}%
                        </span>
                      </div>

                      <div className="mt-1">
                        <span className="text-xs font-semibold block truncate">
                          {point.dayName}
                        </span>
                        <span className={`text-base font-black ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                          ₹{point.predictedModalPrice}
                          <span className={`text-[10px] font-normal ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`}>/kg</span>
                        </span>
                      </div>

                      <div className={`mt-2 pt-2 border-t text-[10px] ${isSelected ? 'border-white/20 text-emerald-200' : 'border-stone-100 text-stone-500'}`}>
                        Range: ₹{point.predictedMinPrice} - ₹{point.predictedMaxPrice}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Deep-Dive Card */}
            {selectedPoint && (
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                      Selected Day Deep-Dive (Day +{selectedPoint.dayOffset})
                    </span>
                    <h4 className="font-bold text-stone-900 text-base">
                      {selectedPoint.dateStr} ({selectedPoint.dayName})
                    </h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-stone-500 uppercase block">Expected Modal</span>
                      <span className="text-xl font-black text-emerald-800">
                        ₹{selectedPoint.predictedModalPrice} / kg
                      </span>
                    </div>
                    <div className="bg-white px-2.5 py-1 rounded-xl border border-stone-200 text-xs font-bold text-stone-700">
                      Confidence: {selectedPoint.confidencePercent}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">{t.modalCorridor}</span>
                    <strong className="text-stone-900 font-bold text-sm">
                      ₹{selectedPoint.predictedMinPrice} - ₹{selectedPoint.predictedMaxPrice} / kg
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">Expected Daily Arrivals</span>
                    <strong className="text-stone-900 font-bold text-sm">
                      {selectedPoint.expectedArrivalVolumeQuintals.toLocaleString('en-IN')} Quintals
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">Price Delta vs Today</span>
                    <strong className={`font-bold text-sm ${selectedPoint.expectedChangePercent >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {selectedPoint.expectedChangePercent >= 0 ? '+' : ''}{selectedPoint.expectedChangePercent}% (₹{(selectedPoint.predictedModalPrice - rate.modalPricePerKg).toFixed(1)}/kg)
                    </strong>
                  </div>
                </div>

                <p className="text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200 italic">
                  💡 <strong>Market Note:</strong> {selectedPoint.marketNote}
                </p>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: 4-Factor Intelligence Breakdown */}
        {activeTab === 'factors' && (
          <div className="p-6 space-y-6">
            
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3">
              <Activity className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-900 text-sm">
                  Transparent 4-Pillar Algorithmic Formulation
                </h4>
                <p className="text-emerald-800/90 mt-0.5 leading-relaxed">
                  The Krishi Bandhu 7-Day rate prediction blends <strong>(1) 30-Day moving price momentum</strong>, <strong>(2) YoY seasonal historical cycle</strong>, <strong>(3) Present yard arrivals and stock buffers</strong>, and <strong>(4) Future field harvest pipeline data</strong> from registered farm belts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Factor 1: Last 30 Days Trend */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-emerald-700" />
                    <h4 className="font-bold text-stone-900 text-sm">
                      1. {t.last30DaysTrend}
                    </h4>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    prediction.last30Days.priceChange30dPercent >= 0
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {prediction.last30Days.priceChange30dPercent >= 0 ? '+' : ''}
                    {prediction.last30Days.priceChange30dPercent}% in 30d
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-stone-500 block text-[10px]">30-Day Moving Avg</span>
                    <strong className="text-stone-900 font-bold text-sm">₹{prediction.last30Days.avgPrice}/kg</strong>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-stone-500 block text-[10px]">30-Day Range</span>
                    <strong className="text-stone-900 font-bold text-sm">₹{prediction.last30Days.minPrice} - ₹{prediction.last30Days.maxPrice}</strong>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-stone-500 block text-[10px]">Avg Daily Arrivals</span>
                    <strong className="text-stone-900 font-bold text-sm">{prediction.last30Days.avgDailyArrivalsQuintals.toLocaleString('en-IN')} Qtl</strong>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-stone-500 block text-[10px]">Arrival Volume Trend</span>
                    <strong className="text-stone-900 font-bold capitalize text-sm">{prediction.last30Days.arrivalTrend}</strong>
                  </div>
                </div>

                <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
                  {prediction.last30Days.trendSummary}
                </p>

                {/* 30-Day Timeline Mini Visualization */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1.5">
                    Sampled 30-Day Price Progression (₹/kg)
                  </span>
                  <div className="flex items-end gap-1.5 h-16 pt-2 bg-stone-50 p-2 rounded-xl border border-stone-100">
                    {prediction.last30Days.historyPoints.map((pt, i) => {
                      const maxP = Math.max(...prediction.last30Days.historyPoints.map((p) => p.price));
                      const minP = Math.min(...prediction.last30Days.historyPoints.map((p) => p.price));
                      const heightPercent = Math.max(25, Math.round(((pt.price - minP + 1) / (maxP - minP + 1)) * 100));
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                          <div
                            className={`w-full rounded-t transition ${
                              i === prediction.last30Days.historyPoints.length - 1
                                ? 'bg-emerald-700'
                                : 'bg-stone-300 group-hover:bg-emerald-500'
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          />
                          <span className="text-[9px] text-stone-500 font-medium truncate w-full text-center">
                            ₹{pt.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Factor 2: Last Year Historical Benchmark */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <h4 className="font-bold text-stone-900 text-sm">
                      2. {t.lastYearBenchmark}
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {prediction.lastYear.yoyPriceChangePercent >= 0 ? '+' : ''}{prediction.lastYear.yoyPriceChangePercent}% YoY
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-stone-500 block text-[10px]">Same Week Last Year</span>
                    <strong className="text-stone-900 font-bold text-sm">₹{prediction.lastYear.samePeriodPrice} / kg</strong>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-stone-500 block text-[10px]">Annual Price Difference</span>
                    <strong className="text-emerald-700 font-bold text-sm">
                      +₹{(rate.modalPricePerKg - prediction.lastYear.samePeriodPrice).toFixed(1)} / kg
                    </strong>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl col-span-2">
                    <span className="text-stone-500 block text-[10px]">Historical Annual Peak Month</span>
                    <strong className="text-stone-900 font-bold text-sm">{prediction.lastYear.historicalPeakMonth}</strong>
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-1 text-xs">
                  <span className="font-bold text-stone-900 block text-[11px]">Seasonal Pattern Analysis:</span>
                  <p className="text-stone-600 leading-relaxed">
                    {prediction.lastYear.seasonalTrendNote}
                  </p>
                </div>

                <p className="text-[11px] text-stone-500 italic">
                  {prediction.lastYear.yoyComparisonNote}
                </p>
              </div>

              {/* Factor 3: Present Stock & Market Inflow */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-emerald-700" />
                    <h4 className="font-bold text-stone-900 text-sm">
                      3. {t.presentStock}
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
                    {prediction.presentStock.yardInventoryStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-stone-500 block text-[10px]">Today's Recorded Inflow</span>
                    <strong className="text-stone-900 font-bold text-sm">
                      {prediction.presentStock.currentArrivalsQuintals.toLocaleString('en-IN')} Quintals
                    </strong>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-stone-500 block text-[10px]">Yard Coverage Buffer</span>
                    <strong className="text-stone-900 font-bold text-sm">
                      {prediction.presentStock.estimatedDaysOfCoverage} Days
                    </strong>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl col-span-2">
                    <span className="text-stone-500 block text-[10px]">Mandi Clearing Buffer</span>
                    <strong className="text-stone-900 font-bold text-sm">
                      {prediction.presentStock.mandiBufferLevel}
                    </strong>
                  </div>
                </div>

                <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
                  {prediction.presentStock.stockSummary}
                </p>
              </div>

              {/* Factor 4: Future Stock & Harvest Pipeline */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Warehouse className="w-4 h-4 text-emerald-700" />
                    <h4 className="font-bold text-stone-900 text-sm">
                      4. {t.futureStock}
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {prediction.futureStock.expectedSupplyPhase}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-stone-500 block text-[10px]">Upcoming Inflow Forecast (7-14d)</span>
                    <strong className="text-stone-900 font-bold text-sm">
                      {prediction.futureStock.upcomingHarvestArrivalForecastQuintals.toLocaleString('en-IN')} Qtl
                    </strong>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-stone-500 block text-[10px]">Farmer Registered Pipeline</span>
                    <strong className={`font-bold text-sm ${prediction.futureStock.farmerPipelineChangePercent >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {prediction.futureStock.farmerPipelineChangePercent >= 0 ? '+' : ''}{prediction.futureStock.farmerPipelineChangePercent}% vs norm
                    </strong>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl col-span-2">
                    <span className="text-stone-500 block text-[10px]">Regional Farming Belts Coverage</span>
                    <strong className="text-stone-900 font-bold text-sm">
                      {prediction.futureStock.regionalBeltSupply}
                    </strong>
                  </div>
                </div>

                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80 space-y-1 text-xs text-emerald-950">
                  <span className="font-bold block text-[11px]">Upcoming Harvest Outlook:</span>
                  <p className="leading-relaxed">
                    {prediction.futureStock.harvestOutlookNote}
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600 rounded-b-3xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Krishi Bandhu Predictive Rate Intelligence · Calibrated against Maharashtra Mandi Auction telemetry
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition cursor-pointer self-end sm:self-auto"
          >
            {t.cancel || 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
