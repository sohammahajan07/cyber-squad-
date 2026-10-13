import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode, Language } from '../types/market';
import { TRANSLATIONS } from '../utils/translations';

interface ThemeToggleProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  currentLang: Language;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onThemeChange,
  currentLang,
  compact = false,
}) => {
  const t = TRANSLATIONS[currentLang];
  const isDark = theme === 'dark';

  const toggle = () => {
    onThemeChange(isDark ? 'light' : 'dark');
  };

  if (compact) {
    return (
      <button
        onClick={toggle}
        className="relative p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:border-stone-700 dark:text-amber-400"
        title={isDark ? (t.lightMode || 'Switch to Light Mode') : (t.darkMode || 'Switch to Dark Mode')}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-stone-700 transition-transform hover:-rotate-12" />
        )}
      </button>
    );
  }

  return (
    <div
      className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700 shadow-2xs"
      role="group"
      aria-label="Theme mode selector"
    >
      <button
        type="button"
        onClick={() => onThemeChange('light')}
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
          !isDark
            ? 'bg-white text-amber-700 shadow-xs font-bold'
            : 'text-stone-500 hover:text-stone-300'
        }`}
        title={t.lightMode || 'Light Mode'}
      >
        <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500 fill-amber-400/20' : 'text-stone-400'}`} />
        <span className="hidden lg:inline">{t.lightMode ? t.lightMode.split(' ')[0] : 'Light'}</span>
      </button>

      <button
        type="button"
        onClick={() => onThemeChange('dark')}
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
          isDark
            ? 'bg-stone-900 text-amber-400 shadow-xs font-bold border border-stone-700'
            : 'text-stone-600 hover:text-stone-900'
        }`}
        title={t.darkMode || 'Dark Mode'}
      >
        <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400 fill-amber-400/30' : 'text-stone-400'}`} />
        <span className="hidden lg:inline">{t.darkMode ? t.darkMode.split(' ')[0] : 'Dark'}</span>
      </button>
    </div>
  );
};
