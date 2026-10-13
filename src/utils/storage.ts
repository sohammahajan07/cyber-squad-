import {
  ProduceListing,
  VendorRequirement,
  BidOffer,
  MandiRate,
  GatePass,
  Role,
  Language,
  UserProfile,
  ContactEnquiry,
  ThemeMode
} from '../types/market';
import {
  INITIAL_PRODUCE_LISTINGS,
  INITIAL_VENDOR_REQUIREMENTS,
  INITIAL_MANDI_RATES,
  INITIAL_BIDS,
  DEMO_USERS,
  INITIAL_ENQUIRIES
} from '../data/mockData';
import { enrichMandiRatesWithPredictions } from './ratePredictor';

const STORAGE_KEYS = {
  LISTINGS: 'kisan_listings_v2',
  REQUIREMENTS: 'kisan_requirements_v2',
  MANDI_RATES: 'kisan_mandi_rates_v5',
  BIDS: 'kisan_bids_v2',
  GATE_PASSES: 'kisan_gate_passes_v2',
  ACTIVE_ROLE: 'kisan_active_role_v2',
  LANG: 'kisan_lang_v2',
  CURRENT_USER: 'kisan_current_user_v2',
  ENQUIRIES: 'kisan_enquiries_v2',
  THEME: 'kisan_theme_v1',
};

export const getStoredUser = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
    return DEMO_USERS[0]; // Default Farmer
  } catch {
    return DEMO_USERS[0];
  }
};

export const saveStoredUser = (user: UserProfile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user', e);
  }
};

export const getStoredEnquiries = (): ContactEnquiry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    return raw ? JSON.parse(raw) : INITIAL_ENQUIRIES;
  } catch {
    return INITIAL_ENQUIRIES;
  }
};

export const saveStoredEnquiries = (enquiries: ContactEnquiry[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
  } catch (e) {
    console.error('Failed to save enquiries', e);
  }
};

export const getStoredListings = (): ProduceListing[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LISTINGS);
    return raw ? JSON.parse(raw) : INITIAL_PRODUCE_LISTINGS;
  } catch {
    return INITIAL_PRODUCE_LISTINGS;
  }
};

export const saveStoredListings = (listings: ProduceListing[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  } catch (e) {
    console.error('Failed to save listings to localStorage', e);
  }
};

export const getStoredRequirements = (): VendorRequirement[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUIREMENTS);
    return raw ? JSON.parse(raw) : INITIAL_VENDOR_REQUIREMENTS;
  } catch {
    return INITIAL_VENDOR_REQUIREMENTS;
  }
};

export const saveStoredRequirements = (reqs: VendorRequirement[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REQUIREMENTS, JSON.stringify(reqs));
  } catch (e) {
    console.error('Failed to save requirements to localStorage', e);
  }
};

export const getStoredMandiRates = (): MandiRate[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MANDI_RATES);
    const parsed = raw ? JSON.parse(raw) : INITIAL_MANDI_RATES;
    return enrichMandiRatesWithPredictions(parsed);
  } catch {
    return INITIAL_MANDI_RATES;
  }
};

export const saveStoredMandiRates = (rates: MandiRate[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MANDI_RATES, JSON.stringify(rates));
  } catch (e) {
    console.error('Failed to save mandi rates to localStorage', e);
  }
};

export const getStoredBids = (): BidOffer[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BIDS);
    return raw ? JSON.parse(raw) : INITIAL_BIDS;
  } catch {
    return INITIAL_BIDS;
  }
};

export const saveStoredBids = (bids: BidOffer[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(bids));
  } catch (e) {
    console.error('Failed to save bids to localStorage', e);
  }
};

export const getStoredGatePasses = (): GatePass[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GATE_PASSES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredGatePasses = (passes: GatePass[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.GATE_PASSES, JSON.stringify(passes));
  } catch (e) {
    console.error('Failed to save gate passes to localStorage', e);
  }
};

export const getStoredRole = (): Role => {
  try {
    const user = getStoredUser();
    return user.role;
  } catch {
    return 'farmer';
  }
};

export const saveStoredRole = (role: Role) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
  } catch (e) {
    console.error('Failed to save role to localStorage', e);
  }
};

export const getStoredLang = (): Language => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LANG);
    if (raw === 'en' || raw === 'hi' || raw === 'mr') return raw;
    return 'en';
  } catch {
    return 'en';
  }
};

export const saveStoredLang = (lang: Language) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  } catch (e) {
    console.error('Failed to save lang to localStorage', e);
  }
};

export const getStoredTheme = (): ThemeMode => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
    // Check if system prefers dark
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
};

export const saveStoredTheme = (theme: ThemeMode) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.error('Failed to save theme to localStorage', e);
  }
};
