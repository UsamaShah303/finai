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
      <div className="glass-card p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="relative w-40 h-40 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="10" className="text-surface-200 dark:text-surface-700" />
              <circle cx="60" cy="60" r="54" fill="none" strokeWidth="10" strokeDasharray={`${esgData.overall * 3.39} 339.3`} strokeLinecap="round"
                className={esgData.overall >= 70 ? 'text-emerald-500' : esgData.overall >= 50 ? 'text-amber-500' : 'text-red-500'} stroke="currentColor" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-surface-900 dark:text-white">{esgData.overall}</span>
              <span className="text-sm text-surface-400">/ 100</span>
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start mb-2">
              <Leaf className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl font-black text-surface-900 dark:text-white">Overall ESG Score</h2>
            </div>
            <p className={`text-lg font-bold mb-2 ${getScoreColor(esgData.overall)}`}>{getLabel(esgData.overall)}</p>
            <p className="text-sm text-surface-500 dark:text-surface-400 max-w-lg leading-relaxed">
              Your portfolio scores well on sustainability metrics. Holdings emphasize clean energy, diverse boards, and ethical business practices. Consider increasing green energy allocation to improve further.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed breakdown cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {esgData.breakdown.map(({ category, score, icon }) => (
          <div key={category} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{icon}</span>
              <span className={`text-2xl font-black ${getScoreColor(score)}`}>{score}</span>
            </div>
            <h3 className="text-sm font-bold text-surface-900 dark:text-white">{category}</h3>
            <div className="h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden mt-2">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${score}%`, backgroundColor: score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Pillar deep dive */}
      <div className="space-y-6">
        {pillarData.map(({ key, label, score, icon: Icon, color, desc, factors }) => (
          <div key={key} className="glass-card p-6">
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
