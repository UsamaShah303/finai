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
  TrendingUp, DollarSign, Target, Leaf,
  BarChart3, Brain, Wallet, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { useState } from 'react';

const formatCurrency = (v) => `$${v.toLocaleString()}`;
const formatPct = (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`;

const SectionLabel = ({ children }) => (
  <p className="text-[11px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-[0.12em]">
    {children}
  </p>
);

export default function DashboardPage() {
  const { marketPreference, user } = useAuth();
  const portfolio = portfolioData[marketPreference] || portfolioData.both;

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

  const splitColors = { needs: '#4A90E2', wants: '#9B59B6', savings: '#00C853', investments: '#FFB347' };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-[#0F1C14] p-3 rounded-2xl shadow-xl border border-surface-100 dark:border-[#00C853]/15 text-sm">
        <p className="font-semibold text-surface-800 dark:text-white mb-1.5 text-xs uppercase tracking-wide">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="text-xs font-medium">
            {entry.name}: {typeof entry.value === 'number' && entry.value > 100 ? formatCurrency(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl lg:text-[28px] font-bold text-surface-900 dark:text-white leading-tight">
            Welcome back, <span className="text-[#00C853]">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-surface-400 dark:text-surface-500 mt-1 text-sm">Here's your financial overview for today.</p>
        </div>
        <MarketToggle />
      </div>

      {/* ── Wealth + Portfolio ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Wealth Card */}
        <div className="glass-card p-7">
          <div className="flex items-start justify-between mb-3">
            <SectionLabel>Total Wealth</SectionLabel>
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>

          <p className="text-5xl font-display font-light text-surface-900 dark:text-white tracking-tight">
            {formatCurrency(wealthSummary.totalWealth)}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
              wealthSummary.change24h >= 0
                ? 'bg-[#00C853]/10 text-[#00C853]'
                : 'bg-red-500/10 text-red-500'
            }`}>
              {wealthSummary.change24h >= 0
                ? <ArrowUpRight className="w-3 h-3" />
                : <ArrowDownRight className="w-3 h-3" />}
              {formatPct(wealthSummary.change24h)} today
            </span>
            <span className="text-xs text-surface-400 dark:text-surface-500">{formatCurrency(wealthSummary.changeAmount)}</span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-surface-50 dark:bg-white/5 border border-surface-100 dark:border-white/5">
              <p className="text-[11px] font-semibold text-surface-400 dark:text-surface-500 mb-1.5 uppercase tracking-wide">Invested</p>
              <p className="text-base font-bold text-surface-900 dark:text-white">{formatCurrency(wealthSummary.invested)}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#00C853]/6 dark:bg-[#00C853]/8 border border-[#00C853]/15">
              <p className="text-[11px] font-semibold text-surface-400 dark:text-surface-500 mb-1.5 uppercase tracking-wide">Returns</p>
              <p className="text-base font-bold text-[#00C853]">+{formatCurrency(wealthSummary.returns)}</p>
              <p className="text-[11px] font-bold text-[#00C853]/70 mt-0.5">{wealthSummary.returnPct}%</p>
            </div>
          </div>
        </div>

        {/* Portfolio Allocation */}
        <div className="glass-card p-7 lg:col-span-2">
          <div className="mb-4">
            <SectionLabel>Portfolio Allocation</SectionLabel>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-48 h-48 flex-shrink-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={portfolio} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value" stroke="none">
                    {portfolio.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-1 w-full">
              {portfolio.map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-white/5 transition-colors cursor-default">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                    <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{name}</p>
                    <p className="text-xs font-bold text-surface-800 dark:text-white flex-shrink-0">{value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Paycheck + Goals ── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Paycheck Split */}
        <div className="glass-card p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <SectionLabel>Paycheck Split</SectionLabel>
              <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
                Monthly: <span className="font-semibold text-surface-700 dark:text-surface-300">{formatCurrency(paycheckSplit.monthlyIncome)}</span>
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#00C853]/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#00C853]" />
            </div>
          </div>

          <div className="space-y-5">
            {Object.entries(splits).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-semibold text-surface-700 dark:text-surface-200 capitalize">{key}</span>
                  <span className="text-sm font-bold" style={{ color: splitColors[key] }}>
                    {value}% <span className="text-xs font-medium text-surface-400 dark:text-surface-500">· ${Math.round(paycheckSplit.monthlyIncome * value / 100).toLocaleString()}</span>
                  </span>
                </div>
                <div className="relative h-1.5 bg-surface-100 dark:bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${value}%`, backgroundColor: splitColors[key] }}
                  />
                </div>
                <input
                  type="range" min="0" max="100" value={value}
                  onChange={(e) => updateSplit(key, parseInt(e.target.value))}
                  className="w-full mt-1 opacity-0 absolute"
                  style={{ accentColor: splitColors[key] }}
                />
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#00C853]/6 dark:bg-[#00C853]/8 border border-[#00C853]/15">
            <Brain className="w-4 h-4 text-[#00C853] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-surface-600 dark:text-surface-300 leading-relaxed">
              AI suggests <strong className="text-[#00C853]">20% investments</strong> & <strong className="text-[#00C853]">20% savings</strong> to hit your goals on time.
            </p>
          </div>
        </div>

        {/* Goal Tracking */}
        <div className="glass-card p-7">
          <div className="flex items-center justify-between mb-5">
            <SectionLabel>Goal Tracking</SectionLabel>
            <div className="w-9 h-9 rounded-xl bg-[#00C853]/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-[#00C853]" />
            </div>
          </div>
          <div className="space-y-5">
            {goalsData.slice(0, 4).map(({ id, name, target, current, icon, successProbability }) => {
              const pct = Math.round((current / target) * 100);
              const isHigh = successProbability >= 85;
              const isMid = successProbability >= 70;
              return (
                <div key={id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-surface-700 dark:text-surface-200">{icon} {name}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      isHigh ? 'bg-[#00C853]/10 text-[#00C853]'
                      : isMid ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-red-500/10 text-red-500'
                    }`}>
                      {successProbability}% likely
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-surface-100 dark:bg-white/8 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: isHigh ? '#00C853' : isMid ? '#FFB347' : '#ef4444',
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-surface-400 w-9 text-right">{pct}%</span>
                  </div>
                  <p className="text-[11px] text-surface-400 dark:text-surface-500 mt-1">{formatCurrency(current)} / {formatCurrency(target)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ESG + Market Sentiment ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* ESG Score */}
        <div className="glass-card p-7">
          <div className="flex items-center justify-between mb-5">
            <SectionLabel>ESG Score</SectionLabel>
            <div className="w-9 h-9 rounded-xl bg-[#00C853]/10 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-[#00C853]" />
            </div>
          </div>
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="7" className="text-surface-100 dark:text-white/8" />
                <circle cx="60" cy="60" r="54" fill="none" strokeWidth="7"
                  strokeDasharray={`${esgData.overall * 3.39} 339.3`}
                  strokeLinecap="round"
                  stroke={esgData.overall >= 70 ? '#00C853' : esgData.overall >= 50 ? '#FFB347' : '#ef4444'}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-display font-light text-surface-900 dark:text-white">{esgData.overall}</span>
                <span className="text-[11px] text-surface-400 dark:text-surface-500 font-medium">/ 100</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'E', full: 'Environ.', score: esgData.environmental },
              { label: 'S', full: 'Social', score: esgData.social },
              { label: 'G', full: 'Govn.', score: esgData.governance },
            ].map(({ label, full, score }) => (
              <div key={label} className="text-center p-3 rounded-2xl bg-surface-50 dark:bg-white/5 border border-surface-100 dark:border-white/5">
                <p className="text-xl font-display font-light text-surface-900 dark:text-white">{score}</p>
                <p className="text-[11px] text-surface-400 dark:text-surface-500 mt-0.5">{full}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="glass-card p-7 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <SectionLabel>Market Sentiment</SectionLabel>
            <div className="w-9 h-9 rounded-xl bg-[#00C853]/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#00C853]" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sentimentData.map(({ asset, sentiment, score, emoji, color }) => (
              <div key={asset} className="p-3.5 rounded-2xl border border-surface-100 dark:border-white/6 bg-surface-50/60 dark:bg-white/3 hover:border-[#00C853]/20 transition-all duration-200">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xl">{emoji}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${color}15`, color }}>
                    {sentiment}
                  </span>
                </div>
                <p className="text-sm font-semibold text-surface-800 dark:text-white mb-2">{asset}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-surface-200 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
                  </div>
                  <span className="text-[11px] font-bold flex-shrink-0" style={{ color }}>{score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Backtesting ── */}
      <div className="glass-card p-7">
        <div className="flex items-start justify-between mb-1">
          <div>
            <SectionLabel>Backtesting Results</SectionLabel>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 max-w-xl">
              If you had followed our AI recommendation 3 years ago — here's what would have happened.
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 ml-4">
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
        </div>
        <div className="h-72 mt-6">
          <ResponsiveContainer>
            <AreaChart data={backtestData}>
              <defs>
                <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C853" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00C853" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-surface-100 dark:text-white/5" opacity={1} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} interval={5} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Area type="monotone" dataKey="ai" name="AI Portfolio" stroke="#00C853" fill="url(#aiGrad)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="benchmark" name="Benchmark" stroke="#94a3b8" fill="url(#benchGrad)" strokeWidth={1.5} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Portfolio Comparison ── */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass-card p-7">
          <div className="mb-5">
            <SectionLabel>Portfolio Comparison – Metrics</SectionLabel>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={comparisonMetrics} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-surface-100 dark:text-white/5" opacity={1} />
                <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                <Bar dataKey="ai" name="AI Portfolio" fill="#00C853" radius={[6, 6, 0, 0]} />
                <Bar dataKey="sp500" name="S&P 500" fill="#FFB347" radius={[6, 6, 0, 0]} />
                <Bar dataKey="kse100" name="KSE-100" fill="#9B59B6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="equalWeight" name="Equal Weight" fill="#4A90E2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-7">
          <div className="mb-5">
            <SectionLabel>3-Year Performance Comparison</SectionLabel>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-surface-100 dark:text-white/5" opacity={1} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} interval={5} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                <Line type="monotone" dataKey="ai" name="AI Portfolio" stroke="#00C853" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="sp500" name="S&P 500" stroke="#FFB347" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="kse100" name="KSE-100" stroke="#9B59B6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="equalWeight" name="Equal Weight" stroke="#4A90E2" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
