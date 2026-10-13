import React, { useState, useId } from 'react';
import { VegetableItem, MandiRate, ProduceListing, QualityGrade, Language, UserProfile } from '../types/market';
import { VEGETABLE_CATALOG } from '../data/mockData';
import { TRANSLATIONS } from '../utils/translations';
import {
  X,
  Upload,
  Sparkles,
  TrendingUp,
  MapPin,
  ShieldCheck
} from 'lucide-react';

interface PostProduceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (listing: Omit<ProduceListing, 'id' | 'createdAt' | 'bidsCount'>) => void;
  mandiRates: MandiRate[];
  currentUser: UserProfile;
  currentLang: Language;
}

export const PostProduceModal: React.FC<PostProduceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mandiRates,
  currentUser,
  currentLang,
}) => {
  const photoInputId = useId();
  const t = TRANSLATIONS[currentLang];
  const [selectedVegId, setSelectedVegId] = useState<string>('tomato');
  const [variety, setVariety] = useState<string>('Hybrid Semi-Ripe');
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState<'kg' | 'quintal' | 'crate'>('kg');
  const [expectedPrice, setExpectedPrice] = useState<number>(28);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A');
  const [farmLocation, setFarmLocation] = useState<string>(currentUser.location || 'Niphad, Nashik, Maharashtra');
  const [exactFarmAddress, setExactFarmAddress] = useState<string>(
    'Gat No. 42, Pimpalgaon Road, Niphad Taluka, Nashik - 422209'
  );
  const [mandiYard, setMandiYard] = useState<string>('Nashik / Lasalgaon APMC');
  const [harvestDate, setHarvestDate] = useState<string>('Today 6 AM');
  const [dispatchDate, setDispatchDate] = useState<string>('Immediate');
  const [description, setDescription] = useState<string>('Freshly harvested, uniform sizing, clean sorting in standard crates.');
  
  // Image & AI Quality Diagnostics state
  const currentVeg = VEGETABLE_CATALOG.find((v) => v.id === selectedVegId) || VEGETABLE_CATALOG[0];
  const [imageUrl, setImageUrl] = useState<string>(currentVeg.sampleImages[0]);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [freshnessScore, setFreshnessScore] = useState<number>(95);
  const [uniformityScore, setUniformityScore] = useState<number>(92);
  const [defectFreeScore, setDefectFreeScore] = useState<number>(96);
  const [aiNotes, setAiNotes] = useState<string>(
    'AI Quality Scan: High skin luster, uniform color distribution, 0% soft decay detected. Certified Grade A standard.'
  );

  if (!isOpen) return null;

  const matchingRate = mandiRates.find((r) =>
    r.vegetableName.toLowerCase().includes(currentVeg.name.split(' ')[0].toLowerCase())
  ) || mandiRates[0];

  const handleVegetableChange = (vegId: string) => {
    setSelectedVegId(vegId);
    const veg = VEGETABLE_CATALOG.find((v) => v.id === vegId);
    if (veg) {
      setImageUrl(veg.sampleImages[0]);
      const rate = mandiRates.find((r) =>
        r.vegetableName.toLowerCase().includes(veg.name.split(' ')[0].toLowerCase())
      );
      if (rate) {
        setExpectedPrice(rate.modalPricePerKg);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          setImageUrl(url);
          runAiScanSimulation();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const runAiScanSimulation = () => {
    setIsAnalyzingImage(true);
    setTimeout(() => {
      const fresh = Math.floor(Math.random() * 8) + 92;
      const unif = Math.floor(Math.random() * 10) + 88;
      const defect = Math.floor(Math.random() * 6) + 93;
      setFreshnessScore(fresh);
      setUniformityScore(unif);
      setDefectFreeScore(defect);
      setQualityGrade(fresh >= 92 && unif >= 88 ? 'Grade A' : 'Grade B');
      setAiNotes(
        `AI Quality Scan: Freshness index ${fresh}%, surface uniformity ${unif}%, zero blossom-end defects. Quality complies with APMC Grade A standards.`
      );
      setIsAnalyzingImage(false);
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      farmLocation,
      exactFarmAddress,
      mandiYard,
      vegetableId: selectedVegId,
      vegetableName: currentVeg.name,
      variety,
      quantity: Number(quantity),
      unit,
      expectedPricePerKg: Number(expectedPrice),
      qualityGrade,
      imageUrl,
      harvestDate,
      dispatchReadyDate: dispatchDate,
      description,
      status: 'active',
      qualityMetrics: {
        freshnessScore,
        uniformityScore,
        defectFreeScore,
        moistureEstimate: 'Optimum Field Moisture',
        aiVerificationNotes: aiNotes,
      },
    });
    onClose();
  };

  const totalKg = unit === 'quintal' ? quantity * 100 : unit === 'crate' ? quantity * 25 : quantity;
  const estimatedTotalEarnings = totalKg * expectedPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-3xl my-8 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">{t.sellProduce}</h2>
            <p className="text-xs text-emerald-200 mt-0.5">
              {t.uploadPhotoDesc}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Select Vegetable */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              {t.selectVegetable}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {VEGETABLE_CATALOG.slice(0, 8).map((veg) => {
                const isSelected = selectedVegId === veg.id;
                const vegTitle =
                  currentLang === 'hi'
                    ? veg.hindiName
                    : currentLang === 'mr'
                    ? veg.marathiName
                    : veg.name.split(' (')[0];

                return (
                  <button
                    type="button"
                    key={veg.id}
                    onClick={() => handleVegetableChange(veg.id)}
                    className={`flex flex-col text-left p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-medium ring-1 ring-emerald-700'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                    }`}
                  >
                    <span className="font-semibold">{vegTitle}</span>
                    <span className="text-[11px] text-stone-500">{veg.name.split(' (')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* APMC Live Benchmark Card (Read only benchmark) */}
          {matchingRate && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>{t.mandiBenchmark} ({matchingRate.mandiName})</span>
                </div>
                <p className="text-stone-600 mt-0.5">
                  {t.modalPrice}: <span className="font-bold text-stone-900">₹{matchingRate.modalPricePerKg}/kg</span> (Min: ₹{matchingRate.minPricePerKg} - Max: ₹{matchingRate.maxPricePerKg})
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExpectedPrice(matchingRate.modalPricePerKg)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition shrink-0"
                >
                  Use Mandi Benchmark (₹{matchingRate.modalPricePerKg}/kg)
                </button>
              </div>
            </div>
          )}

          {/* Photo & Quality Inspection Section */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-stone-800 uppercase tracking-wider block">
                  {t.uploadPhoto}
                </span>
                <span className="text-xs text-stone-500">
                  {t.uploadPhotoDesc}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.aiQualityCheck}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Photo Preview & Upload Controls */}
              <div className="space-y-3">
                <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group">
                  <img
                    src={imageUrl}
                    alt="Vegetable quality preview"
                    className="w-full h-full object-cover"
                  />
                  {isAnalyzingImage && (
                    <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center text-white text-xs font-semibold backdrop-blur-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{t.scanningPhoto}</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-stone-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                    {qualityGrade} Verified
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor={photoInputId}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-stone-300 hover:border-emerald-600 px-3 py-2 rounded-lg text-xs font-medium text-stone-700 hover:text-emerald-700 cursor-pointer transition shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t.uploadPhoto}</span>
                  </label>
                  <input
                    id={photoInputId}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={runAiScanSimulation}
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-medium px-3 py-2 rounded-lg transition"
                  >
                    {t.reScan}
                  </button>
                </div>
              </div>

              {/* Quality Diagnostics Output */}
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="font-semibold text-stone-800">{t.aiQualityCheck}</span>
                  <span className="font-bold text-emerald-700 text-sm">{qualityGrade}</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-stone-500">{t.freshnessScore}</span>
                      <span className="font-semibold text-stone-800">{freshnessScore}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${freshnessScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-stone-500">{t.uniformityScore}</span>
                      <span className="font-semibold text-stone-800">{uniformityScore}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${uniformityScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-stone-500">{t.defectFreeScore}</span>
                      <span className="font-semibold text-stone-800">{defectFreeScore}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${defectFreeScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Grade Selector override */}
                <div className="pt-1">
                  <span className="text-[11px] text-stone-500 block mb-1">{t.qualityGrade}:</span>
                  <div className="flex items-center gap-1.5">
                    {(['Grade A', 'Grade B', 'Grade C'] as QualityGrade[]).map((g) => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setQualityGrade(g)}
                        className={`flex-1 py-1 text-[11px] font-semibold rounded border transition ${
                          qualityGrade === g
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity, Unit & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                {t.quantity}
              </label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                {t.unit}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'kg' | 'quintal' | 'crate')}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="quintal">Quintals (100 kg)</option>
                <option value="crate">Crates (~25 kg)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                {t.expectedPrice}
              </label>
              <input
                type="number"
                step="0.5"
                min={1}
                required
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Earnings helper */}
          <div className="bg-stone-100 p-3 rounded-xl flex items-center justify-between text-xs text-stone-700">
            <span>
              Total Lot Volume: <strong className="text-stone-900">{totalKg} kg</strong> ({quantity} {unit})
            </span>
            <span>
              Est. Gross Value: <strong className="text-emerald-700 text-sm">₹{estimatedTotalEarnings.toLocaleString('en-IN')}</strong>
            </span>
          </div>

          {/* Farm Location (Public) vs Exact Address (Private) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Farm District / General Zone (Public)
              </label>
              <input
                type="text"
                required
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                placeholder="e.g. Niphad, Nashik, Maharashtra"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Exact Farm Address (Protected - Shared on Enquiry Approval)
              </label>
              <input
                type="text"
                required
                value={exactFarmAddress}
                onChange={(e) => setExactFarmAddress(e.target.value)}
                placeholder="Gat No, Wasti, Taluka..."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Mandi yard & Variety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                {t.variety}
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                {t.mandiYard} (महाराष्ट्र मंडी)
              </label>
              <select
                value={mandiYard}
                onChange={(e) => setMandiYard(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              >
                <option value="Lasalgaon APMC">Lasalgaon APMC (Nashik District)</option>
                <option value="Nashik APMC">Nashik APMC (Panchavati, Nashik)</option>
                <option value="Vashi APMC">Vashi APMC (Navi Mumbai)</option>
                <option value="Pune APMC">Pune APMC (Market Yard, Gultekdi)</option>
                <option value="Baramati APMC">Baramati APMC (Pune Rural)</option>
                <option value="Kolhapur APMC">Kolhapur APMC (Shahu Market Yard)</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium rounded-lg transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-98 cursor-pointer"
            >
              {t.publishProduce}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
