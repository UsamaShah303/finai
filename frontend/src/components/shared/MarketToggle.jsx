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
    <div className="bg-white rounded-2xl p-1 inline-flex gap-1 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {options.map(({ value, label, sublabel, flag }) => {
        const active = marketPreference === value;
        return (
          <button
            key={value}
            onClick={() => setMarketPreference(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${active
                ? 'text-white shadow-lg'
                : 'text-gray-500 hover:bg-gray-50'
              }`}
            style={active ? { background: 'linear-gradient(135deg, #00C853, #4CAF50)' } : {}}
          >
            <span className="text-base">{flag}</span>
            <div className="text-left hidden sm:block">
              <div className={`text-sm font-semibold ${active ? 'text-white' : ''}`}>{label}</div>
              <div className={`text-[10px] ${active ? 'text-white/70' : 'text-gray-500'}`}>{sublabel}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
