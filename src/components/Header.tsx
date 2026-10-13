import React from 'react';
import { Role, Language, UserProfile, ThemeMode } from '../types/market';
import { TRANSLATIONS } from '../utils/translations';
import { ThemeToggle } from './ThemeToggle';
import {
  Sprout,
  Store,
  Building2,
  Plus,
  Languages,
  ShieldCheck,
  User,
  LogOut,
  Mail,
  Lock
} from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onOpenSellProduce: () => void;
  onOpenPostRequirement: () => void;
  onOpenLoginModal: (role?: Role) => void;
  onOpenPresentation?: () => void;
  pendingEnquiriesCount: number;
  unreadBidsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentRole,
  onRoleChange,
  currentLang,
  onLangChange,
  currentTheme,
  onThemeChange,
  onOpenSellProduce,
  onOpenPostRequirement,
  onOpenLoginModal,
  onOpenPresentation,
  pendingEnquiriesCount,
  unreadBidsCount,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                <Sprout className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-stone-900">
                    {currentLang === 'hi' ? (
                      <>कृषि<span className="text-emerald-700"> बंधु</span></>
                    ) : currentLang === 'mr' ? (
                      <>कृषी<span className="text-emerald-700"> बंधू</span></>
                    ) : (
                      <>Krishi<span className="text-emerald-700">Bandhu</span></>
                    )}
                  </h1>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    APMC Maharashtra
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-medium">
                  {t.tagline}
                </p>
              </div>
            </div>

            {/* Mobile theme toggle, language toggle & Mobile PPT video button */}
            <div className="flex md:hidden items-center gap-1.5">
              <ThemeToggle
                theme={currentTheme}
                onThemeChange={onThemeChange}
                currentLang={currentLang}
                compact
              />
              {onOpenPresentation && (
                <button
                  onClick={onOpenPresentation}
                  className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-xs transition"
                  title="2-Min Farmer Presentation Video"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>2m PPT Video</span>
                </button>
              )}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
                {(['en', 'hi', 'mr'] as Language[]).map((lng) => (
                  <button
                    key={lng}
                    onClick={() => onLangChange(lng)}
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      currentLang === lng
                        ? 'bg-white text-stone-900 shadow-xs font-bold'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {lng === 'en' ? 'EN' : lng === 'hi' ? 'हिं' : 'मरा'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Central Role Selector with Individual Login Indicators */}
          <div className="flex items-center justify-center">
            <nav className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200 w-full sm:w-auto" aria-label="Role switcher">
              <button
                onClick={() => onRoleChange('farmer')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  currentRole === 'farmer'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Sprout className="w-4 h-4" />
                <span>{t.farmerRole}</span>
                {currentRole === 'farmer' && pendingEnquiriesCount > 0 && (
                  <span className="bg-amber-400 text-emerald-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                    {pendingEnquiriesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onRoleChange('vendor')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  currentRole === 'vendor'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>{t.vendorRole}</span>
                {currentRole === 'vendor' && pendingEnquiriesCount > 0 && (
                  <span className="bg-amber-400 text-emerald-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                    {pendingEnquiriesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onRoleChange('apmc')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  currentRole === 'apmc'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{t.apmcRole}</span>
              </button>
            </nav>
          </div>

          {/* Right Action Buttons & Language selector & User Profile */}
          <div className="flex items-center gap-2 justify-end">
            {/* Desktop Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle
                theme={currentTheme}
                onThemeChange={onThemeChange}
                currentLang={currentLang}
              />
            </div>

            {/* Desktop 2-Min Video Presentation Button */}
            {onOpenPresentation && (
              <button
                onClick={onOpenPresentation}
                className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs transition active:scale-98 cursor-pointer"
                title="Play 2-Minute Farmer Presentation Video with voice commentary"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>
                  {currentLang === 'hi' ? 'किसान प्रस्तुति (२ मिनट वीडियो)' : currentLang === 'mr' ? 'शेतकरी सादरीकरण (२ मि. व्हिडिओ)' : 'Farmer PPT Video (2 Min)'}
                </span>
              </button>
            )}

            {/* Desktop language toggle */}
            <div className="hidden md:flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs font-medium text-stone-600">
              <Languages className="w-3.5 h-3.5 ml-1 text-stone-400" />
              {(['en', 'hi', 'mr'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  onClick={() => onLangChange(lng)}
                  className={`px-2 py-1 rounded transition ${
                    currentLang === lng
                      ? 'bg-white text-stone-900 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {lng === 'en' ? 'EN' : lng === 'hi' ? 'हिन्दी' : 'मराठी'}
                </button>
              ))}
            </div>

            {/* Individual Logged In Profile Badge with Switch Account button */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenLoginModal(currentRole)}
                className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/70 dark:hover:bg-stone-700/60 border border-stone-200 dark:border-stone-700 px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer"
                title={t.switchRole}
              >
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-stone-900 dark:text-stone-100 truncate max-w-[110px]">{currentUser.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  </div>
                  <span className="text-[10px] text-stone-600 dark:text-stone-400 uppercase font-semibold">
                    {currentUser.role === 'farmer' ? t.farmerRole : currentUser.role === 'vendor' ? t.vendorRole : t.apmcRole}
                  </span>
                </div>
                <span className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-emerald-800 dark:text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-bold shadow-2xs">
                  {currentLang === 'hi' ? 'लॉगिन / बदलें' : currentLang === 'mr' ? 'लॉगिन / बदला' : 'Login / Switch'}
                </span>
              </button>

              {/* Direct Quick Individual Login shortcut for other role */}
              {currentRole === 'farmer' ? (
                <button
                  onClick={() => onOpenLoginModal('vendor')}
                  className="hidden lg:flex items-center gap-1 text-[11px] font-semibold text-stone-600 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 px-2 py-1.5 rounded-lg border border-dashed border-stone-300 dark:border-stone-700 hover:border-emerald-500 cursor-pointer transition"
                  title="Direct Individual Vendor Login"
                >
                  <Store className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{currentLang === 'hi' ? 'व्यापारी लॉगिन' : currentLang === 'mr' ? 'व्यापारी लॉगिन' : 'Vendor Login'}</span>
                </button>
              ) : (
                <button
                  onClick={() => onOpenLoginModal('farmer')}
                  className="hidden lg:flex items-center gap-1 text-[11px] font-semibold text-stone-600 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 px-2 py-1.5 rounded-lg border border-dashed border-stone-300 dark:border-stone-700 hover:border-emerald-500 cursor-pointer transition"
                  title="Direct Individual Farmer Login"
                >
                  <Sprout className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{currentLang === 'hi' ? 'किसान लॉगिन' : currentLang === 'mr' ? 'शेतकरी लॉगिन' : 'Farmer Login'}</span>
                </button>
              )}
            </div>

            {/* Contextual Primary Action Button */}
            {currentRole === 'farmer' && (
              <button
                onClick={onOpenSellProduce}
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-xs transition active:scale-98 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.sellProduce}</span>
              </button>
            )}

            {currentRole === 'vendor' && (
              <button
                onClick={onOpenPostRequirement}
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-xs transition active:scale-98 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.postRequirement}</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
