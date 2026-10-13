import React, { useState } from 'react';
import { VendorRequirement, MandiRate, QualityGrade, Language, UserProfile } from '../types/market';
import { VEGETABLE_CATALOG } from '../data/mockData';
import { TRANSLATIONS } from '../utils/translations';
import { X, TrendingUp } from 'lucide-react';

interface PostRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (requirement: Omit<VendorRequirement, 'id' | 'createdAt' | 'matchedListingsCount'>) => void;
  mandiRates: MandiRate[];
  currentUser: UserProfile;
  currentLang: Language;
}

export const PostRequirementModal: React.FC<PostRequirementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mandiRates,
  currentUser,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [selectedVegId, setSelectedVegId] = useState<string>('tomato');
  const [vendorName, setVendorName] = useState<string>(currentUser.name);
  const [companyName, setCompanyName] = useState<string>(currentUser.organization || 'FreshKart Direct Logistics');
  const [deliveryLocation, setDeliveryLocation] = useState<string>(currentUser.location || 'Vashi Sector 19 Cold Hub');
  const [exactDeliveryAddress, setExactDeliveryAddress] = useState<string>(
    'Plot B-4, Commercial Complex, Sector 19, Vashi, Navi Mumbai - 400703'
  );
  const [preferredMandi, setPreferredMandi] = useState<string>('Vashi APMC');
  const [requiredQuantity, setRequiredQuantity] = useState<number>(1500);
  const [unit, setUnit] = useState<'kg' | 'quintal' | 'crate'>('kg');
  const [targetPrice, setTargetPrice] = useState<number>(27);
  const [qualityGradeRequired, setQualityGradeRequired] = useState<QualityGrade>('Grade A');
  const [neededByDate, setNeededByDate] = useState<string>('Tomorrow by 6:00 AM');
  const [paymentTerm, setPaymentTerm] = useState<
    'Immediate Mandi Cash' | '50% Advance UPI' | 'APMC Escrow Settlement'
  >('APMC Escrow Settlement');
  const [specialRequirements, setSpecialRequirements] = useState<string>(
    'Plastic crates preferred. Need firm semi-ripe batch with high skin luster for retail distribution.'
  );

  if (!isOpen) return null;

  const currentVeg = VEGETABLE_CATALOG.find((v) => v.id === selectedVegId) || VEGETABLE_CATALOG[0];
  const matchingRate = mandiRates.find((r) =>
    r.vegetableName.toLowerCase().includes(currentVeg.name.split(' ')[0].toLowerCase())
  ) || mandiRates[0];

  const handleVegetableChange = (vegId: string) => {
    setSelectedVegId(vegId);
    const veg = VEGETABLE_CATALOG.find((v) => v.id === vegId);
    if (veg) {
      const rate = mandiRates.find((r) =>
        r.vegetableName.toLowerCase().includes(veg.name.split(' ')[0].toLowerCase())
      );
      if (rate) {
        setTargetPrice(rate.modalPricePerKg);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      vendorId: currentUser.id,
      vendorName,
      companyName,
      vendorPhone: currentUser.phone,
      deliveryLocation,
      exactDeliveryAddress,
      preferredMandi,
      vegetableName: currentVeg.name,
      requiredQuantity: Number(requiredQuantity),
      unit,
      targetPricePerKg: Number(targetPrice),
      qualityGradeRequired,
      neededByDate,
      paymentTerm,
      specialRequirements,
      status: 'open',
    });
    onClose();
  };

  const totalKg = unit === 'quintal' ? requiredQuantity * 100 : unit === 'crate' ? requiredQuantity * 25 : requiredQuantity;
  const estimatedOrderBudget = totalKg * targetPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl my-8 overflow-hidden">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">{t.postRequirement}</h2>
            <p className="text-xs text-emerald-300 mt-0.5">
              Specify vegetable demand, target rate, quality grade, and delivery timeline for farmers
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Commodity select */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              {t.selectVegetable}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                    className={`flex flex-col text-left p-2 rounded-xl border text-xs transition cursor-pointer ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-700'
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

          {/* APMC Benchmark notice */}
          {matchingRate && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-stone-700">
                  {matchingRate.mandiName} {t.modalPrice}: <strong className="text-stone-900">₹{matchingRate.modalPricePerKg}/kg</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTargetPrice(matchingRate.modalPricePerKg)}
                className="text-emerald-800 hover:underline font-semibold text-[11px]"
              >
                Match APMC
              </button>
            </div>
          )}

          {/* Quantity & Unit & Target Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                {t.quantity}
              </label>
              <input
                type="number"
                min={1}
                required
                value={requiredQuantity}
                onChange={(e) => setRequiredQuantity(Number(e.target.value))}
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
                {t.targetPrice}
              </label>
              <input
                type="number"
                step="0.5"
                min={1}
                required
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Budget estimate */}
          <div className="bg-stone-100 p-3 rounded-xl flex items-center justify-between text-xs text-stone-700">
            <span>Volume: <strong>{totalKg} kg</strong> ({requiredQuantity} {unit})</span>
            <span>Total Purchase Budget: <strong className="text-emerald-700 text-sm">₹{estimatedOrderBudget.toLocaleString('en-IN')}</strong></span>
          </div>

          {/* Quality Grade Required & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                {t.qualityGrade}
              </label>
              <div className="flex items-center gap-2">
                {(['Grade A', 'Grade B', 'Grade C'] as QualityGrade[]).map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setQualityGradeRequired(g)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition ${
                      qualityGradeRequired === g
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                {t.neededTimeline}
              </label>
              <input
                type="text"
                required
                value={neededByDate}
                onChange={(e) => setNeededByDate(e.target.value)}
                placeholder="e.g. Tomorrow by 6 AM"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Delivery Location (Public) vs Exact Address (Private) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Delivery Hub / General Zone (Public)
              </label>
              <input
                type="text"
                required
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="e.g. Vashi Sector 19 Cold Hub"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Exact Delivery Address (Protected - Shared on Enquiry Approval)
              </label>
              <input
                type="text"
                required
                value={exactDeliveryAddress}
                onChange={(e) => setExactDeliveryAddress(e.target.value)}
                placeholder="Warehouse plot, road, pin..."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Preferred APMC Mandi Yard in Maharashtra */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Preferred Maharashtra APMC Mandi (पसंदीदा मंडी)
            </label>
            <select
              value={preferredMandi}
              onChange={(e) => setPreferredMandi(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
            >
              <option value="Vashi APMC">Vashi APMC (Navi Mumbai, Maharashtra)</option>
              <option value="Lasalgaon APMC">Lasalgaon APMC (Nashik District, Maharashtra)</option>
              <option value="Nashik APMC">Nashik APMC (Panchavati, Nashik, Maharashtra)</option>
              <option value="Pune APMC">Pune APMC (Gultekdi Market Yard, Pune, Maharashtra)</option>
              <option value="Baramati APMC">Baramati APMC (Baramati, Pune, Maharashtra)</option>
              <option value="Kolhapur APMC">Kolhapur APMC (Shahu Market Yard, Maharashtra)</option>
            </select>
          </div>

          {/* Payment Terms */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              {t.paymentTerm}
            </label>
            <select
              value={paymentTerm}
              onChange={(e) => setPaymentTerm(e.target.value as any)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            >
              <option value="APMC Escrow Settlement">APMC Escrow Settlement</option>
              <option value="Immediate Mandi Cash">Immediate Mandi Cash</option>
              <option value="50% Advance UPI">50% Advance UPI</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Grading & Packaging Instructions
            </label>
            <textarea
              rows={2}
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            />
          </div>

          {/* Submit */}
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
              {t.broadcastDemand}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
