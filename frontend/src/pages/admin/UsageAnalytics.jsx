import { usageAnalytics } from '../../data/mockData';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { BarChart3, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function UsageAnalytics() {
  const [range, setRange] = useState('30d');

  const data = range === '7d' ? usageAnalytics.slice(-7) : range === '14d' ? usageAnalytics.slice(-14) : usageAnalytics;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-surface-800 p-3 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 text-sm">
        <p className="font-semibold text-surface-900 dark:text-white mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white">Usage Analytics</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Page views, feature usage, and user trends.</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-surface-400" />
          {['7d', '14d', '30d'].map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                range === r ? 'gradient-primary text-white' : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Daily Views', value: Math.round(data.reduce((s, d) => s + d.pageViews, 0) / data.length).toLocaleString(), color: '#3b82f6' },
          { label: 'Avg Daily Users', value: Math.round(data.reduce((s, d) => s + d.uniqueUsers, 0) / data.length).toLocaleString(), color: '#22c55e' },
          { label: 'Total Portfolio Views', value: data.reduce((s, d) => s + d.portfolioViews, 0).toLocaleString(), color: '#8b5cf6' },
          { label: 'Risk Quizzes', value: data.reduce((s, d) => s + d.riskQuiz, 0).toLocaleString(), color: '#f59e0b' },
        ].map(({ label, value, color }) => (
          <div key={label} className="neo-card p-4">
            <p className="text-xs text-surface-400 mb-1">{label}</p>
            <p className="text-2xl font-black" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Page Views Chart */}
      <div className="neo-card p-6">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Page Views & Unique Users</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="pageViews" name="Page Views" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="uniqueUsers" name="Unique Users" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Usage */}
      <div className="neo-card p-6">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Feature Usage</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="portfolioViews" name="Portfolio Views" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="riskQuiz" name="Risk Quiz" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              <Bar dataKey="forecasts" name="Forecasts" fill="#06b6d4" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
