import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, Shield, TrendingUp, Leaf, Target, Sparkles, CheckCircle } from 'lucide-react';

const PROFILE_ALLOCATIONS = {
  Conservative: {
    color: '#3b82f6',
    emoji: '🛡️',
    assets: [
      { name: 'Government Bonds', value: 40, color: '#3b82f6' },
      { name: 'Fixed Deposits', value: 25, color: '#06b6d4' },
      { name: 'Blue-chip Stocks', value: 20, color: '#22c55e' },
      { name: 'Gold', value: 10, color: '#f59e0b' },
      { name: 'Cash', value: 5, color: '#64748b' },
    ],
    stats: { expectedReturn: '5–7%', risk: 'Low', horizon: '1–3 years', volatility: 'Very Low' },
    highlights: [
      'Capital preservation is the priority',
      'Regular income from bond interest',
      'Minimal exposure to stock market swings',
    ],
  },
  'Moderately Conservative': {
    color: '#22c55e',
    emoji: '🌿',
    assets: [
      { name: 'Bonds', value: 45, color: '#22c55e' },
      { name: 'Dividend Stocks', value: 25, color: '#3b82f6' },
      { name: 'Fixed Deposits', value: 15, color: '#06b6d4' },
      { name: 'Gold', value: 10, color: '#f59e0b' },
      { name: 'Cash', value: 5, color: '#64748b' },
    ],
    stats: { expectedReturn: '6–9%', risk: 'Low–Medium', horizon: '3–5 years', volatility: 'Low' },
    highlights: [
      'Steady income with modest growth potential',
      'Bond cushion protects against market drops',
      'Dividend stocks provide reliable payouts',
    ],
  },
  Moderate: {
    color: '#eab308',
    emoji: '⚖️',
    assets: [
      { name: 'Stocks', value: 40, color: '#3b82f6' },
      { name: 'Bonds', value: 35, color: '#22c55e' },
      { name: 'REITs', value: 10, color: '#8b5cf6' },
      { name: 'Gold', value: 10, color: '#f59e0b' },
      { name: 'Cash', value: 5, color: '#64748b' },
    ],
    stats: { expectedReturn: '8–11%', risk: 'Medium', horizon: '5–10 years', volatility: 'Moderate' },
    highlights: [
      'Balanced growth and income',
      'Real estate adds inflation protection',
      'Well-diversified across asset classes',
    ],
  },
  'Moderately Aggressive': {
    color: '#f59e0b',
    emoji: '📈',
    assets: [
      { name: 'Growth Stocks', value: 50, color: '#3b82f6' },
      { name: 'International Stocks', value: 20, color: '#06b6d4' },
      { name: 'Bonds', value: 15, color: '#22c55e' },
      { name: 'REITs', value: 10, color: '#8b5cf6' },
      { name: 'Gold', value: 5, color: '#f59e0b' },
    ],
    stats: { expectedReturn: '10–14%', risk: 'Medium–High', horizon: '7–15 years', volatility: 'Moderate–High' },
    highlights: [
      'Strong long-term growth potential',
      'Global diversification reduces country risk',
      'Small bond allocation as a buffer',
    ],
  },
  Aggressive: {
    color: '#ef4444',
    emoji: '🚀',
    assets: [
      { name: 'Growth Stocks', value: 55, color: '#3b82f6' },
      { name: 'Emerging Markets', value: 20, color: '#ef4444' },
      { name: 'International Stocks', value: 15, color: '#06b6d4' },
      { name: 'Alternative Assets', value: 7, color: '#8b5cf6' },
      { name: 'Cash', value: 3, color: '#64748b' },
    ],
    stats: { expectedReturn: '12–18%', risk: 'High', horizon: '10+ years', volatility: 'High' },
    highlights: [
      'Maximum long-term growth potential',
      'Emerging markets offer high-upside exposure',
      'Ideal for investors with 10+ year horizons',
    ],
  },
};

const STAT_ICONS = {
  expectedReturn: TrendingUp,
  risk: Shield,
  horizon: Target,
  volatility: Leaf,
};

const STAT_LABELS = {
  expectedReturn: 'Expected Return',
  risk: 'Risk Level',
  horizon: 'Ideal Horizon',
  volatility: 'Volatility',
};

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-lg bg-surface-900 text-white text-xs shadow-xl">
        <span className="font-semibold">{payload[0].name}</span>
        <span className="ml-2 text-surface-300">{payload[0].value}%</span>
      </div>
    );
  }
  return null;
}

export default function PreviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const profileKey = user?.riskProfile || 'Moderate';
  const profile = PROFILE_ALLOCATIONS[profileKey] || PROFILE_ALLOCATIONS['Moderate'];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Hero banner */}
      <div
        className="glass-card p-7 mb-6 text-center relative overflow-hidden"
        style={{ borderColor: `${profile.color}30` }}
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${profile.color}, transparent 70%)` }}
        />
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl animate-float"
            style={{ backgroundColor: `${profile.color}18` }}
          >
            {profile.emoji}
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Your Portfolio Preview</span>
          </div>
          <h1 className="text-3xl font-black text-surface-900 dark:text-white mb-2">
            {profileKey} Profile
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm max-w-md mx-auto">
            Based on your quiz answers, here's the investment portfolio we'd build for you.
            Everything is tailored to match your comfort level with risk.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Pie chart */}
        <div className="glass-card p-6">
          <h2 className="text-base font-bold text-surface-900 dark:text-white mb-1">Asset Allocation</h2>
          <p className="text-xs text-surface-500 mb-4">How your money would be spread across investments</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={profile.assets}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                {profile.assets.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {profile.assets.map((a) => (
              <div key={a.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: a.color }} />
                  <span className="text-xs text-surface-600 dark:text-surface-400">{a.name}</span>
                </div>
                <span className="text-xs font-bold text-surface-900 dark:text-white">{a.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats + highlights */}
        <div className="flex flex-col gap-4">
          {/* Stats grid */}
          <div className="glass-card p-5">
            <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4">Key Metrics</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(profile.stats).map(([key, value]) => {
                const Icon = STAT_ICONS[key];
                return (
                  <div key={key} className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3.5 h-3.5" style={{ color: profile.color }} />
                      <span className="text-xs text-surface-500">{STAT_LABELS[key]}</span>
                    </div>
                    <p className="text-sm font-bold text-surface-900 dark:text-white">{value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Highlights */}
          <div className="glass-card p-5 flex-1">
            <h2 className="text-base font-bold text-surface-900 dark:text-white mb-3">Why This Works For You</h2>
            <div className="space-y-3">
              {profile.highlights.map((h) => (
                <div key={h} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: profile.color }} />
                  <span className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What's next */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4">What Happens Next?</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: '1', icon: '🎯', title: 'Set Your Goals', desc: "Tell us what you're saving for — a home, retirement, education." },
            { step: '2', icon: '💰', title: 'Connect Your Income', desc: 'Use the paycheck splitter to see how much you can invest monthly.' },
            { step: '3', icon: '📊', title: 'Track & Grow', desc: 'Watch your portfolio grow with real-time charts and AI insights.' },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="flex flex-col items-center text-center p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
              <div className="w-8 h-8 rounded-full gradient-primary text-white text-xs font-black flex items-center justify-center mb-2">{step}</div>
              <span className="text-2xl mb-2">{icon}</span>
              <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-1">{title}</h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => navigate('/risk-quiz')}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 font-semibold hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm"
        >
          Retake Quiz
        </button>
        <button
          onClick={() => navigate('/goals')}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 font-semibold hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm"
        >
          <Target className="w-4 h-4" />
          Set My Goals
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-bold hover:shadow-lg hover:shadow-primary-500/25 transition-all group text-sm"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
