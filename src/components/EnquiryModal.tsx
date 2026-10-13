import React, { useState } from 'react';
import { ContactEnquiry, UserProfile, Language } from '../types/market';
import { TRANSLATIONS } from '../utils/translations';
import { X, ShieldCheck, Lock, Send, AlertCircle } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  targetId: string;
  targetName: string;
  targetRole: 'farmer' | 'vendor';
  referenceType: 'produce' | 'requirement';
  referenceId: string;
  referenceTitle: string;
  onSubmitEnquiry: (enquiry: Omit<ContactEnquiry, 'id' | 'createdAt' | 'status'>) => void;
  currentLang: Language;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  targetId,
  targetName,
  targetRole,
  referenceType,
  referenceId,
  referenceTitle,
  onSubmitEnquiry,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [message, setMessage] = useState<string>(
    currentUser.role === 'vendor'
      ? `Hello, we are interested in purchasing this lot of ${referenceTitle}. Please approve our enquiry to share contact and farmgate location.`
      : `Hello, we can supply this requirement of ${referenceTitle}. Please approve our enquiry to connect directly.`
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitEnquiry({
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromRole: currentUser.role,
      fromPhone: currentUser.phone,
      fromLocation: currentUser.location,
      toUserId: targetId,
      toUserName: targetName,
      toRole: targetRole,
      referenceType,
      referenceId,
      referenceTitle,
      message,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md my-6 overflow-hidden">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold">{t.requestContactModalTitle}</h3>
              <p className="text-[11px] text-emerald-300">Privacy & Matchmaking Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Privacy Note */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-start gap-2.5 text-stone-700">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-stone-900 block">{t.privacyNotice}</span>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {t.privacyNoticeDesc}
              </p>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-stone-500 uppercase block mb-1">
              Produce / Tender Reference
            </span>
            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-950 font-bold">
              {referenceTitle}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-stone-500 uppercase block mb-1">
              Recipient
            </span>
            <div className="text-stone-800 font-medium">
              {targetName} ({targetRole === 'farmer' ? t.farmerRole : t.vendorRole})
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
              Enquiry Message / Purchase Intent
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.enquiryMessagePlaceholder}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.sendEnquiryButton}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
