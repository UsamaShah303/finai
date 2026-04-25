import { useAuth } from '../../context/AuthContext';
import { Globe, MapPin, Layers } from 'lucide-react';

const options = [
  { value: 'pakistan', label: 'Pakistan', sublabel: 'PSX Only', icon: MapPin, flag: '🇵🇰' },
  { value: 'international', label: 'International', sublabel: 'Global', icon: Globe, flag: '🌍' },
  { value: 'both', label: 'Both Markets', sublabel: 'Recommended', icon: Layers, flag: '🌐' },
];

export default function MarketToggle() {
  const { marketPreference, setMarketPreference } = useAuth();

  return (
    <div className="glass-card p-1 inline-flex gap-1">
      {options.map(({ value, label, sublabel, icon: Icon, flag }) => {
        const active = marketPreference === value;
        return (
          <button
            key={value}
            onClick={() => setMarketPreference(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${active
                ? 'gradient-primary text-white shadow-lg shadow-primary-500/25'
                : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
          >
            <span className="text-base">{flag}</span>
            <div className="text-left hidden sm:block">
              <div className={`text-sm font-semibold ${active ? 'text-white' : ''}`}>{label}</div>
              <div className={`text-[10px] ${active ? 'text-white/70' : 'text-surface-400'}`}>{sublabel}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
