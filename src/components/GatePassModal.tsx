import React from 'react';
import { GatePass, Language } from '../types/market';
import { TRANSLATIONS } from '../utils/translations';
import { X, Printer, ShieldCheck } from 'lucide-react';

interface GatePassModalProps {
  gatePass: GatePass | null;
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Language;
}

export const GatePassModal: React.FC<GatePassModalProps> = ({
  gatePass,
  isOpen,
  onClose,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang];
  if (!isOpen || !gatePass) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-xl my-6 overflow-hidden">
        
        {/* Modal Top Actions */}
        <div className="bg-emerald-950 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold">
              {currentLang === 'hi'
                ? 'आधिकारिक APMC इलेक्ट्रॉनिक गेट पास'
                : currentLang === 'mr'
                ? 'अधिकृत APMC इलेक्ट्रॉनिक गेट पास'
                : 'APMC Official Electronic Gate Pass'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.printSlip}</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Slip */}
        <div className="p-8 space-y-6 text-stone-900 bg-stone-50/30 font-sans print:p-0 print:bg-white">
          
          {/* Header */}
          <div className="text-center border-b-2 border-stone-800 pb-4 space-y-1">
            <div className="inline-block px-3 py-1 bg-emerald-900 text-white text-[11px] font-bold rounded uppercase tracking-wider mb-1">
              Government of India · e-NAM & APMC Market Yard Network
            </div>
            <h1 className="text-xl font-black uppercase tracking-tight text-stone-900">
              {gatePass.mandiName}
            </h1>
            <p className="text-xs text-stone-600 font-medium">
              Agricultural Produce Market Committee · Electronic Trade & Weighbridge Inward Pass
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-stone-700 pt-1">
              <span>{t.gatePassNo}: {gatePass.passNumber}</span>
              <span>·</span>
              <span>DATE: {gatePass.issueTimestamp}</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-4 text-xs border border-stone-300 rounded-xl p-4 bg-white">
            <div className="space-y-2">
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Farmer (विक्रेता किसान)</span>
                <span className="font-bold text-stone-900 text-sm">{gatePass.farmerName}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">{t.vegetable}</span>
                <span className="font-bold text-stone-900">{gatePass.commodity}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">{t.quantity}</span>
                <span className="font-bold text-stone-900">{gatePass.quantity} {gatePass.unit}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">{t.vehicleNo}</span>
                <span className="font-mono font-bold text-stone-900">{gatePass.vehicleNumber}</span>
              </div>
            </div>

            <div className="space-y-2 border-l border-stone-200 pl-4">
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Buyer / Vendor (व्यापारी)</span>
                <span className="font-bold text-stone-900 text-sm">{gatePass.vendorName}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Rate</span>
                <span className="font-bold text-stone-900">₹{gatePass.ratePerKg} / kg</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">{t.totalDealAmount}</span>
                <span className="font-bold text-emerald-800 text-sm">₹{gatePass.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Inward Gate</span>
                <span className="font-bold text-stone-900">{gatePass.gateNumber}</span>
              </div>
            </div>
          </div>

          {/* APMC Cess & Market Fee Breakdown */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-stone-700">
              <span>{t.mandiCess} ({gatePass.mandiFeePercent}%):</span>
              <span className="font-semibold text-stone-900">₹{gatePass.mandiFeeAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-stone-700">
              <span>Weighbridge & Electronic Levy:</span>
              <span className="font-semibold text-stone-900">₹50.00</span>
            </div>
            <div className="pt-1.5 border-t border-emerald-200 flex items-center justify-between font-bold text-stone-900">
              <span>Total Gate Cleared Payable:</span>
              <span className="text-emerald-800 text-sm">
                ₹{(gatePass.totalAmount + gatePass.mandiFeeAmount + 50).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* QR Code & Official Signature */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-stone-900 p-1 rounded-lg flex items-center justify-center">
                <div className="w-full h-full border-2 border-dashed border-white flex items-center justify-center text-[9px] font-mono text-white text-center">
                  e-NAM<br/>VERIFIED
                </div>
              </div>
              <div className="text-[11px] text-stone-600">
                <span className="font-bold text-stone-900 block">Digital Verification QR</span>
                <span>Scan at Yard Gate & Weighbridge</span>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block border-2 border-emerald-800 text-emerald-800 font-black text-[10px] px-2 py-1 rounded uppercase tracking-wider -rotate-3">
                APMC VERIFIED · CLEARED
              </div>
              <span className="block text-[10px] text-stone-700 mt-1">Authorized Market Secretary</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
