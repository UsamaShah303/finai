import { esgData } from '../../data/mockData';
import { Leaf, Globe, Users, Landmark, ArrowUpRight } from 'lucide-react';

const getScoreColor = (s) => s >= 75 ? 'text-emerald-500' : s >= 50 ? 'text-amber-500' : 'text-red-500';
const getScoreBg = (s) => s >= 75 ? 'bg-emerald-100 dark:bg-emerald-500/10' : s >= 50 ? 'bg-amber-100 dark:bg-amber-500/10' : 'bg-red-100 dark:bg-red-500/10';
const getLabel = (s) => s >= 80 ? 'Excellent' : s >= 65 ? 'Good' : s >= 50 ? 'Average' : 'Poor';

const pillarData = [
  {
    key: 'environmental',
    label: 'Environmental',
    score: esgData.environmental,
    icon: Globe,
    color: '#22c55e',
    desc: 'Measures the carbon footprint, clean energy adoption, and environmental impact of portfolio holdings.',
    factors: [
      { name: 'Carbon Emissions', score: 85 },
      { name: 'Clean Energy', score: 78 },
      { name: 'Waste Management', score: 72 },
      { name: 'Biodiversity Impact', score: 80 },
    ],
  },
  {
    key: 'social',
    label: 'Social',
    score: esgData.social,
    icon: Users,
    color: '#3b82f6',
    desc: 'Evaluates diversity & inclusion, labor practices, and community engagement of invested companies.',
    factors: [
      { name: 'Diversity & Inclusion', score: 72 },
      { name: 'Labor Practices', score: 68 },
      { name: 'Community Impact', score: 75 },
      { name: 'Customer Privacy', score: 70 },
    ],
  },
  {
    key: 'governance',
    label: 'Governance',
    score: esgData.governance,
    icon: Landmark,
    color: '#8b5cf6',
    desc: 'Assesses board independence, executive compensation, anti-corruption policies, and shareholder rights.',
    factors: [
      { name: 'Board Independence', score: 80 },
      { name: 'Executive Pay', score: 65 },
      { name: 'Anti-Corruption', score: 78 },
      { name: 'Shareholder Rights', score: 74 },
    ],
  },
];

export default function ESGPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white">ESG & Sustainability</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Environmental, Social, and Governance ratings for your portfolio.</p>
      </div>

      {/* Overall ESG */}
      <div className="neo-card p-8 relative overflow-hidden group">
        {/* Background Graphic */}
        <svg className="absolute -bottom-16 -right-16 w-64 h-64 opacity-5 text-emerald-600 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
          <path d="M43.7,-70.7C55.4,-64.1,62.8,-48.9,71.2,-34.5C79.6,-20.1,89,-6.4,87.6,6.3C86.1,18.9,73.8,30.5,62.9,41.9C52.1,53.2,42.7,64.3,30.2,71.1C17.7,77.9,2,80.3,-12.3,77.8C-26.6,75.3,-39.5,67.8,-51.8,58.8C-64.1,49.8,-75.8,39.3,-80.7,26.1C-85.6,12.9,-83.8,-3.1,-78.3,-17.8C-72.8,-32.5,-63.6,-45.9,-51.1,-52.1C-38.6,-58.3,-22.8,-57.4,-7.8,-45.2C7.2,-33,22.4,-15,32.1,-77.4L43.7,-70.7Z" transform="translate(50 50) scale(1.1)" />
        </svg>

        <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
          <div className="relative w-40 h-40 flex-shrink-0 filter drop-shadow-xl transition-transform duration-500 group-hover:scale-105">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100 dark:text-slate-800" />
              <circle cx="60" cy="60" r="54" fill="none" strokeWidth="10" strokeDasharray={`${esgData.overall * 3.39} 339.3`} strokeLinecap="round"
                className={esgData.overall >= 70 ? 'text-[#84cc16] drop-shadow-md' : esgData.overall >= 50 ? 'text-amber-500 drop-shadow-md' : 'text-red-500 drop-shadow-md'} stroke="currentColor" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-black/20 rounded-full m-3 backdrop-blur-sm border border-white/40 shadow-inner">
              <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{esgData.overall}</span>
              <span className="text-[11px] font-bold text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 flex items-center justify-center border border-emerald-200/50 shadow-sm">
                <Leaf className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Overall ESG Score</h2>
            </div>
            <p className={`text-lg font-extrabold mb-3 ${getScoreColor(esgData.overall)} tracking-tight`}>{getLabel(esgData.overall)} Rating</p>
            <p className="text-[15px] text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed font-medium">
              Your portfolio scores well on sustainability metrics. Holdings emphasize clean energy, diverse boards, and ethical business practices. Consider increasing green energy allocation to improve further.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed breakdown cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {esgData.breakdown.map(({ category, score, icon }) => (
          <div key={category} className="neo-card p-6 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110">{icon}</span>
              <span className={`text-3xl font-black ${getScoreColor(score)}`}>{score}</span>
            </div>
            <h3 className="text-[13px] font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">{category}</h3>
            <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800/50 overflow-hidden mt-3 shadow-inner border border-black/5">
              <div className="h-full rounded-full transition-all duration-700 shadow-sm relative"
                style={{ width: `${score}%`, backgroundColor: score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444' }}>
                <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pillar deep dive */}
      <div className="space-y-6">
        {pillarData.map(({ key, label, score, icon: Icon, color, desc, factors }) => (
          <div key={key} className="neo-card p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex items-start gap-4 md:w-1/3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white">{label}</h3>
                  <p className="text-3xl font-black mt-1" style={{ color }}>{score}</p>
                  <p className={`text-sm font-medium ${getScoreColor(score)}`}>{getLabel(score)}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-2 leading-relaxed">{desc}</p>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {factors.map(({ name, score: fScore }) => (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-surface-600 dark:text-surface-400">{name}</span>
                      <span className={`font-bold ${getScoreColor(fScore)}`}>{fScore}</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${fScore}%`, backgroundColor: fScore >= 75 ? '#22c55e' : fScore >= 50 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
