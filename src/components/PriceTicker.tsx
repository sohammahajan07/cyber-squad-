import React from 'react';
import { MandiRate, Language } from '../types/market';
import { TRANSLATIONS } from '../utils/translations';
import { TrendingUp, TrendingDown, Radio } from 'lucide-react';

interface PriceTickerProps {
  rates: MandiRate[];
  onSelectRate?: (rate: MandiRate) => void;
  currentLang: Language;
}

export const PriceTicker: React.FC<PriceTickerProps> = ({ rates, onSelectRate, currentLang }) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="bg-emerald-950 text-emerald-100 border-b border-emerald-900 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Radio className="w-3.5 h-3.5" />
          <span>{t.liveApmcTicker}</span>
        </div>

        {/* Marquee Ticker */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-6 text-xs whitespace-nowrap py-0.5">
          {rates.map((rate) => {
            const isPositive = rate.changePercent >= 0;
            const displayName =
              currentLang === 'hi'
                ? rate.hindiName || rate.vegetableName
                : currentLang === 'mr'
                ? rate.marathiName || rate.vegetableName
                : rate.vegetableName;

            return (
              <button
                key={rate.id}
                onClick={() => onSelectRate?.(rate)}
                className="inline-flex items-center gap-2 hover:bg-emerald-900/60 px-2 py-0.5 rounded transition text-left cursor-pointer"
                title="Click to view mandi details"
              >
                <span className="font-medium text-white">{displayName}</span>
                <span className="text-emerald-400/80">({rate.mandiName})</span>
                <span className="font-bold text-emerald-200">₹{rate.modalPricePerKg}/kg</span>
                <span
                  className={`inline-flex items-center text-[11px] font-semibold ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                  )}
                  {isPositive ? '+' : ''}
                  {rate.changePercent}%
                </span>

                {/* 7-Day Prediction Pill */}
                {rate.prediction && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-900/90 text-emerald-200 px-1.5 py-0.5 rounded border border-emerald-700/70 font-mono">
                    <span className="text-emerald-400 font-bold">7D:</span>
                    <span>₹{rate.prediction.predictedModal7Day}</span>
                    <span className={rate.prediction.expectedChange7DayPercent >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
                      ({rate.prediction.expectedChange7DayPercent >= 0 ? '+' : ''}{rate.prediction.expectedChange7DayPercent}%)
                    </span>
                  </span>
                )}
              </button>

            );
          })}
        </div>

        <div className="hidden lg:flex items-center text-[11px] text-emerald-400/80 shrink-0">
          {t.updatedRealtime}
        </div>
      </div>
    </div>
  );
};
