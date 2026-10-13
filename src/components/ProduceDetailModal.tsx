import React, { useState } from 'react';
import { ProduceListing, MandiRate, BidOffer, Language, ContactEnquiry, UserProfile } from '../types/market';
import { TRANSLATIONS } from '../utils/translations';
import {
  X,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Truck,
  Phone,
  Send,
  ShieldCheck,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';

interface ProduceDetailModalProps {
  listing: ProduceListing | null;
  isOpen: boolean;
  onClose: () => void;
  mandiRates: MandiRate[];
  onPlaceBid: (bid: Omit<BidOffer, 'id' | 'createdAt' | 'status'>) => void;
  onRequestEnquiry: (listing: ProduceListing) => void;
  enquiries: ContactEnquiry[];
  currentUser: UserProfile;
  currentRole: 'farmer' | 'vendor' | 'apmc';
  currentLang: Language;
}

export const ProduceDetailModal: React.FC<ProduceDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
  mandiRates,
  onPlaceBid,
  onRequestEnquiry,
  enquiries,
  currentUser,
  currentRole,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [offeredPrice, setOfferedPrice] = useState<number>(
    listing ? listing.expectedPricePerKg : 25
  );
  const [offeredQuantity, setOfferedQuantity] = useState<number>(
    listing ? listing.quantity : 100
  );
  const [vendorName, setVendorName] = useState<string>(currentUser.name);
  const [vendorPhone, setVendorPhone] = useState<string>(currentUser.phone);
  const [vendorLocation, setVendorLocation] = useState<string>(currentUser.location);
  const [logistics, setLogistics] = useState<'Farmer Delivery' | 'Vendor Mandi Pickup' | 'Farmgate Pickup'>(
    'Vendor Mandi Pickup'
  );
  const [message, setMessage] = useState<string>(
    'We are ready to take this entire lot. Vehicle can reach your farmgate or mandi yard today.'
  );
  const [bidSubmitted, setBidSubmitted] = useState<boolean>(false);

  if (!isOpen || !listing) return null;

  const matchingRate = mandiRates.find((r) =>
    r.vegetableName.toLowerCase().includes(listing.vegetableName.split(' ')[0].toLowerCase())
  );

  const priceDiff = matchingRate ? listing.expectedPricePerKg - matchingRate.modalPricePerKg : 0;
  const priceDiffPercent = matchingRate
    ? ((priceDiff / matchingRate.modalPricePerKg) * 100).toFixed(1)
    : '0';

  const totalKg =
    listing.unit === 'quintal'
      ? offeredQuantity * 100
      : listing.unit === 'crate'
      ? offeredQuantity * 25
      : offeredQuantity;
  const totalOfferAmount = totalKg * offeredPrice;

  // Check if contact has been approved by the farmer for this lot
  const isContactApproved = enquiries.some(
    (e) => e.referenceId === listing.id && e.status === 'approved'
  );

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceBid({
      listingId: listing.id,
      vendorId: currentUser.id,
      vendorName,
      vendorType: 'Retail Chain',
      vendorLocation,
      vendorPhone,
      offeredPricePerKg: Number(offeredPrice),
      offeredQuantity: Number(offeredQuantity),
      unit: listing.unit,
      logistics,
      message,
    });
    setBidSubmitted(true);
    setTimeout(() => {
      setBidSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-4xl my-6 overflow-hidden">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-800 text-emerald-100 text-xs font-bold px-2.5 py-1 rounded-md">
              {listing.qualityGrade}
            </div>
            <div>
              <h2 className="text-lg font-bold">{listing.vegetableName}</h2>
              <p className="text-xs text-emerald-300">
                {t.variety}: {listing.variety} · Farmer: {listing.farmerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[80vh] overflow-y-auto">
          
          {/* Left Column: Photo Inspection & Quality Metrics */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-stone-200 space-y-5 bg-stone-50/50">
            {/* Main high-res image */}
            <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-stone-200 shadow-xs group">
              <img
                src={listing.imageUrl}
                alt={listing.vegetableName}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-102"
              />
              <div className="absolute top-3 left-3 bg-stone-950/80 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.verifiedUser}</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-stone-950/80 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-xs">
                {listing.quantity} {listing.unit}
              </div>
            </div>

            {/* Quality Scorecard */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{t.aiQualityCheck}</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {listing.qualityGrade} Certified
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">{t.freshnessScore}</span>
                  <span className="text-base font-bold text-emerald-700">{listing.qualityMetrics.freshnessScore}%</span>
                </div>
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">{t.uniformityScore}</span>
                  <span className="text-base font-bold text-emerald-700">{listing.qualityMetrics.uniformityScore}%</span>
                </div>
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
                  <span className="text-[10px] text-stone-500 uppercase font-semibold block">{t.defectFreeScore}</span>
                  <span className="text-base font-bold text-emerald-700">{listing.qualityMetrics.defectFreeScore}%</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 leading-relaxed">
                {listing.qualityMetrics.aiVerificationNotes}
              </p>
            </div>

            {/* Farmer & Harvest details with Privacy Safeguard */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider">
                  {t.farmLocation}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-stone-500">
                  {isContactApproved ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>{t.enquiryApproved}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-stone-500">
                      <Lock className="w-3.5 h-3.5 text-stone-400" />
                      <span>Privacy Shielded</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-stone-600 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Farmer:</span>
                  <span className="font-medium text-stone-900">{listing.farmerName}</span>
                </div>

                {/* Masked vs Approved Contact Details */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-1.5">
                  {isContactApproved ? (
                    <div className="space-y-2 text-emerald-950">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Direct Phone:</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-stone-900">{listing.farmerPhone}</strong>
                          <a
                            href={`tel:${listing.farmerPhone.replace(/\s+/g, '')}`}
                            className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[11px] font-semibold"
                          >
                            Call
                          </a>
                          <a
                            href={`https://wa.me/${listing.farmerPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-0.5 bg-green-600 text-white rounded text-[11px] font-semibold"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold shrink-0">Farm Address:</span>
                        <span className="text-stone-800 text-right">{listing.exactFarmAddress}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-stone-500">
                        <span>Direct Contact:</span>
                        <span>{t.phoneMasked}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        {t.privacyNoticeDesc}
                      </p>
                      <button
                        type="button"
                        onClick={() => onRequestEnquiry(listing)}
                        className="w-full py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold rounded text-xs transition"
                      >
                        {t.applyForEnquiry}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-500">{t.mandiYard}:</span>
                  <span className="font-medium text-stone-900">{listing.mandiYard}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">{t.dispatchTimeline}:</span>
                  <span className="font-medium text-emerald-700">{listing.dispatchReadyDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing Analysis & Bid / Buy Action */}
          <div className="p-6 space-y-5">
            
            {/* Live APMC Comparison Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>{t.mandiBenchmark}</span>
                </div>
                {matchingRate && (
                  <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {matchingRate.mandiName}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                  <span className="text-[10px] text-stone-500 uppercase block">{t.expectedPrice}</span>
                  <span className="text-lg font-bold text-stone-900">₹{listing.expectedPricePerKg}/kg</span>
                </div>
                {matchingRate && (
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-stone-500 uppercase block">{t.modalPrice}</span>
                    <span className="text-lg font-bold text-emerald-700">₹{matchingRate.modalPricePerKg}/kg</span>
                  </div>
                )}
              </div>

              {matchingRate && (
                <p className="text-[11px] text-stone-600">
                  Mandi Range: ₹{matchingRate.minPricePerKg} - ₹{matchingRate.maxPricePerKg}/kg. (Non-editable official benchmark).
                </p>
              )}
            </div>

            {/* Bidding Form */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-stone-900">
                  {t.placeBid}
                </h3>
                <span className="text-[11px] text-stone-500">
                  {listing.bidsCount} offers received
                </span>
              </div>

              {bidSubmitted ? (
                <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 mx-auto" />
                  <p className="font-bold text-sm">Bid Successfully Submitted!</p>
                  <p className="text-xs text-emerald-700">
                    Farmer has received your offer of ₹{offeredPrice}/kg for {offeredQuantity} {listing.unit}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitBid} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                        {t.offeredPrice}
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min={1}
                        required
                        value={offeredPrice}
                        onChange={(e) => setOfferedPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                        {t.offeredQuantity} ({listing.unit})
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={listing.quantity}
                        required
                        value={offeredQuantity}
                        onChange={(e) => setOfferedQuantity(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Total payout math */}
                  <div className="bg-stone-100 p-3 rounded-lg flex items-center justify-between text-stone-700">
                    <span>Lot: {totalKg} kg ({offeredQuantity} {listing.unit})</span>
                    <span>{t.totalDealAmount}: <strong className="text-emerald-700 text-sm">₹{totalOfferAmount.toLocaleString('en-IN')}</strong></span>
                  </div>

                  {/* Logistics preference */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                      {t.logisticsPickup}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Vendor Mandi Pickup', 'Farmgate Pickup', 'Farmer Delivery'] as const).map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setLogistics(opt)}
                          className={`p-2 rounded-lg border text-[11px] font-medium transition text-center ${
                            logistics === opt
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                      Terms / Notes
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.placeBid}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
