import { useAuth } from '../../context/AuthContext';
import MarketToggle from '../../components/shared/MarketToggle';
import {
  portfolioData, wealthSummary, paycheckSplit, goalsData,
  esgData, sentimentData, backtestData, comparisonMetrics, performanceData,
} from '../../data/mockData';
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend, BarChart, Bar, CartesianGrid, Area, AreaChart,
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Target, Leaf,
  BarChart3, Brain, Wallet, ArrowUpRight, ArrowDownRight, Info
} from 'lucide-react';
import { useState } from 'react';

const formatCurrency = (v) => `$${v.toLocaleString()}`;
const formatPct = (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`;

export default function DashboardPage() {
  const { marketPreference, user } = useAuth();
  const portfolio = portfolioData[marketPreference] || portfolioData.both;

  // Paycheck slider state
  const [splits, setSplits] = useState({
    needs: paycheckSplit.aiRecommendation.needs,
    wants: paycheckSplit.aiRecommendation.wants,
    savings: paycheckSplit.aiRecommendation.savings,
    investments: paycheckSplit.aiRecommendation.investments,
  });

  const updateSplit = (key, val) => {
    const remaining = 100 - val;
    const others = Object.keys(splits).filter(k => k !== key);
    const currentOthersTotal = others.reduce((s, k) => s + splits[k], 0);
    const newSplits = { ...splits, [key]: val };
    others.forEach(k => {
      newSplits[k] = currentOthersTotal > 0
        ? Math.round((splits[k] / currentOthersTotal) * remaining)
        : Math.round(remaining / others.length);
    });
    setSplits(newSplits);
  };

  const splitColors = { needs: '#3b82f6', wants: '#8b5cf6', savings: '#22c55e', investments: '#f59e0b' };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-surface-800 p-3 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 text-sm">
        <p className="font-semibold text-surface-900 dark:text-white mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {typeof entry.value === 'number' && entry.value > 100 ? formatCurrency(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Here's your financial overview for today.</p>
        </div>
        <MarketToggle />
      </div>

      {/* Wealth + Portfolio Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Wealth */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Current Wealth</h3>
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-black text-surface-900 dark:text-white">{formatCurrency(wealthSummary.totalWealth)}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`flex items-center gap-1 text-sm font-semibold ${wealthSummary.change24h >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {wealthSummary.change24h >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {formatPct(wealthSummary.change24h)}
            </span>
            <span className="text-xs text-surface-400">({formatCurrency(wealthSummary.changeAmount)}) today</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
              <p className="text-xs text-surface-400 mb-1">Invested</p>
              <p className="text-sm font-bold text-surface-900 dark:text-white">{formatCurrency(wealthSummary.invested)}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
              <p className="text-xs text-surface-400 mb-1">Total Returns</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(wealthSummary.returns)} ({wealthSummary.returnPct}%)</p>
            </div>
          </div>
        </div>

        {/* Portfolio Pie Chart */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Portfolio Allocation</h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-48 h-48">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={portfolio} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                    {portfolio.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2 w-full">
              {portfolio.map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <div className="min-w-0">
                    <p className="text-xs text-surface-600 dark:text-surface-400 truncate">{name}</p>
                    <p className="text-sm font-bold text-surface-900 dark:text-white">{value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Paycheck Split + Goals Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Paycheck Split */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Paycheck Split</h3>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-violet-500" />
            </div>
          </div>
          <p className="text-xs text-surface-400 mb-4">Monthly Income: <span className="font-bold text-surface-900 dark:text-white">{formatCurrency(paycheckSplit.monthlyIncome)}</span></p>

          <div className="space-y-4">
            {Object.entries(splits).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-surface-700 dark:text-surface-300 capitalize">{key}</span>
                  <span className="font-bold" style={{ color: splitColors[key] }}>{value}% (${Math.round(paycheckSplit.monthlyIncome * value / 100)})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => updateSplit(key, parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: splitColors[key] }}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20">
            <Brain className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-primary-700 dark:text-primary-300">AI suggests 20% investments & 20% savings for your goals.</p>
          </div>
        </div>

        {/* Goal Tracking */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Goal Tracking</h3>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="space-y-4">
            {goalsData.slice(0, 4).map(({ id, name, target, current, icon, successProbability }) => {
              const pct = Math.round((current / target) * 100);
              return (
                <div key={id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{icon} {name}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      successProbability >= 85 ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : successProbability >= 70 ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                      {successProbability}% likely
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-primary transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-surface-500 w-10 text-right">{pct}%</span>
                  </div>
                  <p className="text-xs text-surface-400 mt-0.5">{formatCurrency(current)} / {formatCurrency(target)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ESG + Market Sentiment Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ESG Score */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">ESG Score</h3>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-200 dark:text-surface-700" />
                <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" strokeDasharray={`${esgData.overall * 3.39} 339.3`} strokeLinecap="round"
                  className={esgData.overall >= 70 ? 'text-emerald-500' : esgData.overall >= 50 ? 'text-amber-500' : 'text-red-500'} stroke="currentColor"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-surface-900 dark:text-white">{esgData.overall}</span>
                <span className="text-xs text-surface-400">/ 100</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'E', score: esgData.environmental, color: 'emerald' },
              { label: 'S', score: esgData.social, color: 'blue' },
              { label: 'G', score: esgData.governance, color: 'violet' },
            ].map(({ label, score, color }) => (
              <div key={label} className="text-center p-2 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                <p className="text-lg font-black text-surface-900 dark:text-white">{score}</p>
                <p className="text-xs text-surface-400">{label === 'E' ? 'Environ.' : label === 'S' ? 'Social' : 'Govn.'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Market Sentiment</h3>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sentimentData.map(({ asset, sentiment, score, emoji, color }) => (
              <div key={asset} className="p-3 rounded-xl border border-surface-200 dark:border-surface-700/50 hover:border-surface-300 dark:hover:border-surface-600 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{emoji}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full`}
                    style={{ backgroundColor: `${color}20`, color }}>
                    {sentiment}
                  </span>
                </div>
                <p className="text-sm font-bold text-surface-900 dark:text-white">{asset}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color }}>{score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backtesting Results */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Backtesting Results</h3>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
        </div>
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
          If you had followed our AI recommendation 3 years ago, here's what would have happened:
        </p>
        <div className="h-72">
          <ResponsiveContainer>
            <AreaChart data={backtestData}>
              <defs>
                <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} interval={5} />
              <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="ai" name="AI Portfolio" stroke="#3b82f6" fill="url(#aiGrad)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="benchmark" name="Benchmark" stroke="#94a3b8" fill="url(#benchGrad)" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Portfolio Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Portfolio Comparison – Metrics</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={comparisonMetrics} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="ai" name="AI Portfolio" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sp500" name="S&P 500" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="kse100" name="KSE-100" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="equalWeight" name="Equal Weight" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">3-Year Performance Comparison</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} interval={5} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="ai" name="AI Portfolio" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="sp500" name="S&P 500" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="kse100" name="KSE-100" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="equalWeight" name="Equal Weight" stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
