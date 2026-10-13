import React, { useState } from 'react';
import { Role, UserProfile, Language } from '../types/market';
import { DEMO_USERS } from '../data/mockData';
import { TRANSLATIONS } from '../utils/translations';
import {
  X,
  Sprout,
  Store,
  Building2,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Lock,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  FileCheck
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  currentLang: Language;
  initialRole?: Role;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentLang,
  initialRole = 'farmer',
}) => {
  const t = TRANSLATIONS[currentLang];
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('4821');

  if (!isOpen) return null;

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setOtpSent(false);
    const demo = DEMO_USERS.find((u) => u.role === role);
    if (demo) {
      setName(demo.name);
      setPhone(demo.phone);
      setOrganization(demo.organization || '');
      setLocation(demo.location);
    }
  };

  const handleQuickDemoLogin = (demoUser: UserProfile) => {
    onLogin(demoUser);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `${selectedRole}-${Date.now()}`,
      name: name || (selectedRole === 'farmer' ? 'Ramesh Patil' : selectedRole === 'vendor' ? 'Deepak Agrawal' : 'Officer S. K. Deshmukh'),
      role: selectedRole,
      phone: phone || '+91 98221 45678',
      organization: organization || (selectedRole === 'farmer' ? 'Patil Farm' : 'FreshKart Logistics'),
      location: location || (selectedRole === 'farmer' ? 'Niphad, Nashik' : 'Vashi APMC, Navi Mumbai'),
      verified: true,
    };
    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-lg my-6 overflow-hidden text-stone-900 dark:text-stone-100 transition-colors">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-950 text-white px-6 py-5 flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-600/40 text-emerald-100 flex items-center justify-center shadow-xs">
              <Lock className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  {currentLang === 'hi'
                    ? 'व्यक्तिगत लॉगिन पोर्टल'
                    : currentLang === 'mr'
                    ? 'वैयक्तिक लॉगिन पोर्टल'
                    : 'Individual Login Portal'}
                </h2>
                <span className="text-[10px] font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full uppercase">
                  Verified
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                {currentLang === 'hi'
                  ? 'किसान और व्यापारी के लिए अलग-अलग व्यक्तिगत लॉगिन'
                  : currentLang === 'mr'
                  ? 'शेतकरी आणि व्यापाऱ्यांसाठी स्वतंत्र वैयक्तिक लॉगिन'
                  : 'Dedicated Individual Login for Farmers & Vendors'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Individual Portal Switcher Tabs */}
        <div className="p-5 sm:p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-2.5">
              {currentLang === 'hi'
                ? 'लॉगिन प्रकार चुनें (Select Individual Portal):'
                : currentLang === 'mr'
                ? 'लॉगिन प्रकार निवडा:'
                : 'Select Individual Portal:'}
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* Farmer Portal Button */}
              <button
                type="button"
                onClick={() => handleRoleSelect('farmer')}
                className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-2 cursor-pointer ${
                  selectedRole === 'farmer'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/30 shadow-xs'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/40'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedRole === 'farmer' ? 'bg-emerald-600 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'}`}>
                  <Sprout className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold block">{t.farmerRole}</span>
                  <span className="text-[10px] opacity-75">{currentLang === 'hi' ? 'सब्जी विक्रेता' : 'Crop Seller'}</span>
                </div>
              </button>

              {/* Vendor Portal Button */}
              <button
                type="button"
                onClick={() => handleRoleSelect('vendor')}
                className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-2 cursor-pointer ${
                  selectedRole === 'vendor'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/30 shadow-xs'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/40'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedRole === 'vendor' ? 'bg-emerald-600 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'}`}>
                  <Store className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold block">{t.vendorRole}</span>
                  <span className="text-[10px] opacity-75">{currentLang === 'hi' ? 'खरीदार व्यापारी' : 'Buyer/Wholesaler'}</span>
                </div>
              </button>

              {/* APMC Mandi Officer Button */}
              <button
                type="button"
                onClick={() => handleRoleSelect('apmc')}
                className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-2 cursor-pointer col-span-2 sm:col-span-1 ${
                  selectedRole === 'apmc'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/30 shadow-xs'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/40'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedRole === 'apmc' ? 'bg-emerald-600 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'}`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold block">{t.apmcRole}</span>
                  <span className="text-[10px] opacity-75">Board / Gate Pass</span>
                </div>
              </button>
            </div>
          </div>

          {/* Quick 1-Click Verified Individual Accounts */}
          <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                {selectedRole === 'farmer'
                  ? (currentLang === 'hi' ? 'किसान सत्यापित खाते (1-क्लिक लॉगिन)' : 'Verified Farmer Accounts (1-Click Login)')
                  : selectedRole === 'vendor'
                  ? (currentLang === 'hi' ? 'व्यापारी सत्यापित खाते (1-क्लिक लॉगिन)' : 'Verified Vendor Accounts (1-Click Login)')
                  : 'Official APMC Accounts (1-Click Login)'}
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                Instant Access
              </span>
            </div>

            <div className="space-y-2">
              {DEMO_USERS.filter((demo) => demo.role === selectedRole).map((demo) => (
                <button
                  type="button"
                  key={demo.id}
                  onClick={() => handleQuickDemoLogin(demo)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-400 dark:hover:border-emerald-700 shadow-2xs text-xs text-left transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 flex items-center justify-center font-bold text-xs shrink-0">
                      {demo.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="block text-stone-900 dark:text-stone-100 font-bold group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                          {demo.name}
                        </strong>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      </div>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                        {demo.organization} · {demo.location}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0">
                    <span>{currentLang === 'hi' ? 'प्रवेश' : 'Login'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Individual Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="border-t border-stone-200 dark:border-stone-700 pt-3">
              <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block mb-2">
                {currentLang === 'hi' ? 'अथवा नया खाता / मोबाइल नंबर दर्ज करें:' : 'Or Enter Custom Phone & Credentials:'}
              </span>
            </div>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                {selectedRole === 'farmer'
                  ? (currentLang === 'hi' ? 'किसान का पूरा नाम (Farmer Name)' : 'Farmer Full Name')
                  : selectedRole === 'vendor'
                  ? (currentLang === 'hi' ? 'व्यापारी / फर्म का नाम (Trader Name)' : 'Vendor / Trading Firm Name')
                  : 'Official Inspector Name'}
              </label>
              <input
                type="text"
                required
                placeholder={selectedRole === 'farmer' ? 'e.g. Ramesh Patil' : 'e.g. Deepak Agrawal'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white dark:bg-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Mobile Number (OTP Verification)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white dark:bg-stone-900"
                  />
                  {!otpSent && phone.length >= 10 && (
                    <button
                      type="button"
                      onClick={() => setOtpSent(true)}
                      className="absolute right-1.5 top-1.5 bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg"
                    >
                      Send OTP
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  {selectedRole === 'farmer'
                    ? (currentLang === 'hi' ? 'खेत / गांव का नाम' : 'Farm / Village')
                    : (currentLang === 'hi' ? 'कंपनी / GSTIN' : 'Company / GSTIN')}
                </label>
                <input
                  type="text"
                  placeholder={selectedRole === 'farmer' ? 'e.g. Patil Organic Farm, Niphad' : 'e.g. FreshKart Direct Logistics'}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white dark:bg-stone-900"
                />
              </div>
            </div>

            {otpSent && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-300 dark:border-emerald-700 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                    OTP sent to {phone}: Auto-filled: <strong>4821</strong>
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                  Verified
                </span>
              </div>
            )}

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                {currentLang === 'hi' ? 'जिला / मंडी क्षेत्र (Location)' : 'Location / Mandi Zone'}
              </label>
              <input
                type="text"
                placeholder={selectedRole === 'farmer' ? 'e.g. Niphad, Nashik, Maharashtra' : 'e.g. Vashi APMC, Navi Mumbai'}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white dark:bg-stone-900"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-xs font-medium cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <span>
                  {currentLang === 'hi'
                    ? `${selectedRole === 'farmer' ? 'किसान' : selectedRole === 'vendor' ? 'व्यापारी' : 'APMC'} खाते में प्रवेश करें`
                    : `Login to ${selectedRole.toUpperCase()} Portal`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
