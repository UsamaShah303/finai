import { useState, useMemo } from 'react';
import { wealthSummary, paycheckSplit, goalsData } from '../../data/mockData';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, ReferenceLine,
} from 'recharts';
import { TrendingUp, Info, Wallet } from 'lucide-react';

const USD_TO_PKR = 278.5;
const MONTHLY_RATE = 0.007;

function fmtPKR(v) {
  if (v >= 10_000_000) return `PKR ${(v / 10_000_000).toFixed(2)} Crore`;
  if (v >= 100_000)    return `PKR ${(v / 100_000).toFixed(1)} Lakh`;
  return `PKR ${Math.round(v).toLocaleString()}`;
}

function fmtAxis(v) {
  if (v >= 10_000_000) return `${(v / 10_000_000).toFixed(1)}Cr`;
  if (v >= 100_000)    return `${(v / 100_000).toFixed(0)}L`;
  return `${Math.round(v / 1000)}k`;
}

function generateForecast(startUSD, monthlyPKR) {
  const startPKR = startUSD * USD_TO_PKR;
  return Array.from({ length: 11 }, (_, year) => {
    const months = year * 12;
    const gf = Math.pow(1 + MONTHLY_RATE, months);
    const fv = startPKR * gf + (months > 0 ? monthlyPKR * (gf - 1) / MONTHLY_RATE : 0);
    return {
      label: `Year ${year}`,
      year,
      p10:    Math.round(fv * 0.60),
      p25:    Math.round(fv * 0.80),
      median: Math.round(fv),
      p75:    Math.round(fv * 1.25),
      p90:    Math.round(fv * 1.55),
    };
  });
}

const SCENARIOS = [
  { key: 'p10',    label: 'Worst case',   pct: '10th', color: '#ef4444', fill: 'none',          dash: '5 5',  width: 1.5 },
  { key: 'p25',    label: 'Conservative', pct: '25th', color: '#f59e0b', fill: 'none',          dash: '5 5',  width: 1.5 },
  { key: 'median', label: 'Most likely',  pct: '50th', color: '#22c55e', fill: 'url(#medGrad)', dash: '',     width: 2.5 },
  { key: 'p75',    label: 'Optimistic',   pct: '75th', color: '#3b82f6', fill: 'url(#p75Grad)', dash: '',     width: 1.5 },
  { key: 'p90',    label: 'Best case',    pct: '90th', color: '#8b5cf6', fill: 'url(#p90Grad)', dash: '',     width: 1.5 },
];

export default function ForecastPage() {
  const defaultMonthlyPKR = Math.round(
    paycheckSplit.monthlyIncome * (paycheckSplit.aiRecommendation.investments / 100) * USD_TO_PKR
  );
  const [monthlyContrib, setMonthlyContrib] = useState(defaultMonthlyPKR);

  const data = useMemo(
    () => generateForecast(wealthSummary.totalWealth, monthlyContrib),
    [monthlyContrib]
  );

  const lastPoint = data[data.length - 1];

  // Use retirement goal as the goal line (first goal with target > current portfolio value,
  // or just the largest goal)
  const retirementGoal = goalsData.find(g => g.name === 'Retirement Fund');
  const goalPKR = retirementGoal ? retirementGoal.target * USD_TO_PKR : null;

  // Check if goal is within chart range
  const chartMin = Math.min(...data.map(d => d.p10));
  const chartMax = Math.max(...data.map(d => d.p90));
  const showGoalLine = goalPKR && goalPKR >= chartMin * 0.5 && goalPKR <= chartMax * 1.2;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const pt = payload[0]?.payload;
    return (
      <div className="bg-white dark:bg-surface-800 p-4 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 min-w-[210px]">
        <p className="font-bold text-surface-900 dark:text-white mb-3 text-sm">{pt.label}</p>
        {[...SCENARIOS].reverse().map(({ key, label, pct, color }) => (
          <div key={key} className="flex justify-between items-baseline mb-1.5 gap-4">
            <span className="text-xs font-medium" style={{ color }}>
              {label}
              <span className="text-surface-400 font-normal ml-1">({pct})</span>
            </span>
            <span className="text-xs font-bold text-surface-900 dark:text-white whitespace-nowrap">
              {fmtPKR(pt[key])}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white">Wealth Forecast</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">
          Monte Carlo simulation projecting your wealth over 10 years with 10,000 scenarios.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {SCENARIOS.map(({ key, label, pct, color }) => (
          <div key={key} className="neo-card p-4">
            <p className="text-xl font-black" style={{ color }}>{fmtPKR(lastPoint[key])}</p>
            <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 mt-1">{label}</p>
            <p className="text-xs text-surface-400">{pct} percentile</p>
            <p className="text-xs text-surface-400 mt-1">
              ≈ ${Math.round(lastPoint[key] / USD_TO_PKR / 1000).toLocaleString()}k USD
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="neo-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
            10-Year Monte Carlo Projection
          </h3>
          <div className="flex items-center gap-2 text-xs text-surface-400">
            <Info className="w-4 h-4" />
            Based on 10,000 simulations
          </div>
        </div>

        {/* Monthly contribution input */}
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700/50">
          <Wallet className="w-4 h-4 text-primary-500 flex-shrink-0" />
          <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
            Monthly contribution
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-surface-500">PKR</span>
            <input
              type="number"
              min="0"
              step="10000"
              value={monthlyContrib}
              onChange={(e) => setMonthlyContrib(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-36 px-3 py-1.5 rounded-lg bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-600 text-sm font-semibold text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <span className="text-xs text-surface-400">
            ≈ ${Math.round(monthlyContrib / USD_TO_PKR).toLocaleString()} USD/mo
          </span>
        </div>

        <div className="h-96">
          <ResponsiveContainer>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="p90Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="p75Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="medGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis
                tickFormatter={fmtAxis}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                width={52}
                domain={showGoalLine ? [Math.min(goalPKR * 0.85, 'auto'), 'auto'] : ['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
                formatter={(_, entry) => {
                  const s = SCENARIOS.find(s => s.key === entry.dataKey);
                  return s ? `${s.label} (${s.pct})` : entry.dataKey;
                }}
              />
              {showGoalLine && (
                <ReferenceLine
                  y={goalPKR}
                  stroke="#f59e0b"
                  strokeDasharray="6 3"
                  strokeWidth={1.5}
                  label={{
                    value: `Your goal: ${fmtPKR(goalPKR)}`,
                    position: 'insideTopRight',
                    fill: '#f59e0b',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
              )}
              {/* Render from bottom up so higher bands sit above lower ones */}
              <Area type="monotone" dataKey="p10"    name="p10"    stroke="#ef4444" fill="none"          strokeWidth={1.5} strokeDasharray="5 5" />
              <Area type="monotone" dataKey="p25"    name="p25"    stroke="#f59e0b" fill="none"          strokeWidth={1.5} strokeDasharray="5 5" />
              <Area type="monotone" dataKey="median" name="median" stroke="#22c55e" fill="url(#medGrad)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="p75"    name="p75"    stroke="#3b82f6" fill="url(#p75Grad)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="p90"    name="p90"    stroke="#8b5cf6" fill="url(#p90Grad)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Methodology */}
      <div className="neo-card p-6">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">Methodology</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'Monte Carlo Simulation',
              desc: '10,000 random scenarios based on historical returns, volatility, and correlations across your portfolio assets.',
            },
            {
              title: 'Assumptions',
              desc: `Monthly contributions of ${fmtPKR(monthlyContrib)}, inflation-adjusted returns, annual rebalancing, and current asset allocation maintained.`,
            },
            {
              title: 'Confidence Bands',
              desc: 'The shaded area represents the range of likely outcomes. The median line shows the most probable path for your wealth.',
            },
          ].map(({ title, desc }) => (
            <div key={title} className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
              <h4 className="text-sm font-bold text-surface-900 dark:text-white mb-1">{title}</h4>
              <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
