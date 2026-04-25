import { forecastData } from '../../data/mockData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, Info } from 'lucide-react';

const formatCurrency = (v) => `$${(v / 1000).toFixed(0)}k`;

export default function ForecastPage() {
  const filteredData = forecastData.filter((_, i) => i % 2 === 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-surface-800 p-4 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 text-sm">
        <p className="font-semibold text-surface-900 dark:text-white mb-2">{label || `Month ${payload[0]?.payload?.month}`}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="text-xs">
            {entry.name}: ${(entry.value / 1000).toFixed(1)}k
          </p>
        ))}
      </div>
    );
  };

  const lastPoint = forecastData[forecastData.length - 1];

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
        {[
          { label: '10th Percentile', value: lastPoint.p10, desc: 'Worst case', color: 'text-red-500' },
          { label: '25th Percentile', value: lastPoint.p25, desc: 'Conservative', color: 'text-amber-500' },
          { label: 'Median (50th)', value: lastPoint.median, desc: 'Most likely', color: 'text-emerald-500' },
          { label: '75th Percentile', value: lastPoint.p75, desc: 'Optimistic', color: 'text-blue-500' },
          { label: '90th Percentile', value: lastPoint.p90, desc: 'Best case', color: 'text-violet-500' },
        ].map(({ label, value, desc, color }) => (
          <div key={label} className="glass-card p-4">
            <p className="text-xs text-surface-400 mb-1">{label}</p>
            <p className={`text-xl font-black ${color}`}>${(value / 1000).toFixed(0)}k</p>
            <p className="text-xs text-surface-500 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
            10-Year Monte Carlo Projection
          </h3>
          <div className="flex items-center gap-2 text-xs text-surface-400">
            <Info className="w-4 h-4" />
            Based on 10,000 simulations
          </div>
        </div>
        <div className="h-96">
          <ResponsiveContainer>
            <AreaChart data={filteredData}>
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
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} interval={3} />
              <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="p90" name="90th Percentile" stroke="#8b5cf6" fill="url(#p90Grad)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="p75" name="75th Percentile" stroke="#3b82f6" fill="url(#p75Grad)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="median" name="Median" stroke="#22c55e" fill="url(#medGrad)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="p25" name="25th Percentile" stroke="#f59e0b" fill="none" strokeWidth={1.5} strokeDasharray="5 5" />
              <Area type="monotone" dataKey="p10" name="10th Percentile" stroke="#ef4444" fill="none" strokeWidth={1.5} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Methodology */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">Methodology</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: 'Monte Carlo Simulation', desc: '10,000 random scenarios based on historical returns, volatility, and correlations across your portfolio assets.' },
            { title: 'Assumptions', desc: 'Monthly contributions of $1,700, inflation-adjusted returns, annual rebalancing, and current asset allocation maintained.' },
            { title: 'Confidence Bands', desc: 'The shaded area represents the range of likely outcomes. The median line shows the most probable path for your wealth.' },
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
