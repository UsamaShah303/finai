import React, { useState } from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  Legend,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp, Info, Target, Globe, Landmark, LineChart as LucideLineChart } from 'lucide-react';

const comparisonData = [
  { name: 'AI Portfolio', return: 62.4, annualized: 17.5, sharpe: 1.42, drawdown: -12.4, color: '#4f46e5' },
  { name: 'S&P 500', return: 45.2, annualized: 13.2, sharpe: 1.15, drawdown: -18.2, color: '#94a3b8' },
  { name: 'KSE-100', return: 58.8, annualized: 16.2, sharpe: 0.98, drawdown: -24.5, color: '#10b981' },
  { name: 'Equal-Weight', return: 38.5, annualized: 11.4, sharpe: 0.85, drawdown: -15.8, color: '#e2e8f0' },
];

const performanceHistory = [
  { date: '2021', ai: 100, sp500: 100, kse100: 100 },
  { date: '2021 Q2', ai: 108, sp500: 105, kse100: 103 },
  { date: '2021 Q3', ai: 112, sp500: 107, kse100: 106 },
  { date: '2021 Q4', ai: 120, sp500: 114, kse100: 110 },
  { date: '2022 Q1', ai: 118, sp500: 108, kse100: 105 },
  { date: '2022 Q2', ai: 115, sp500: 95, kse100: 98 },
  { date: '2022 Q3', ai: 112, sp500: 92, kse100: 102 },
  { date: '2022 Q4', ai: 125, sp500: 101, kse100: 115 },
  { date: '2023 Q1', ai: 132, sp500: 108, kse100: 120 },
  { date: '2023 Q2', ai: 145, sp500: 118, kse100: 135 },
  { date: '2023 Q3', ai: 148, sp500: 115, kse100: 142 },
  { date: '2023 Q4', ai: 162, sp500: 128, kse100: 158 },
  { date: '2024 Q1', ai: 185, sp500: 142, kse100: 175 },
];

export const PortfolioComparison = () => {
  const [activeMetric, setActiveMetric] = useState<'return' | 'annualized' | 'sharpe' | 'drawdown'>('return');

  const metricConfig = {
    return: { label: 'Total Return (%)', prefix: '', suffix: '%' },
    annualized: { label: 'Annualized Return (%)', prefix: '', suffix: '%' },
    sharpe: { label: 'Sharpe Ratio', prefix: '', suffix: '' },
    drawdown: { label: 'Max Drawdown (%)', prefix: '', suffix: '%' },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && payload[0].value !== undefined) {
      return (
        <div className="bg-white/90 backdrop-blur-md border border-gray-100 p-4 rounded-2xl shadow-xl">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
          <p className="text-sm font-black text-gray-900">
            {payload[0].value}{metricConfig[activeMetric]?.suffix || ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-12 bg-white/40 backdrop-blur-sm rounded-[48px] border border-white p-12 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
             <Target className="w-3 h-3 text-indigo-600" />
             <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Benchmarking Engine</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Battle Tested</h2>
          <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-xl">
            Real performance comparison of AI strategy against global benchmarks and local market indices.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
          {(['return', 'annualized', 'sharpe', 'drawdown'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeMetric === m 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {m.replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Metric Bar Chart */}
        <div className="lg:col-span-5 space-y-8">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={comparisonData} layout="vertical" margin={{ left: 20, right: 40 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 900, fill: '#111827', textAnchor: 'start', dx: -60 }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar 
                  dataKey={activeMetric} 
                  radius={[0, 12, 12, 0]} 
                  barSize={32}
                >
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Outperformance</p>
                <div className="flex items-end gap-2">
                   <p className="text-2xl font-black text-gray-900">+17.2%</p>
                   <p className="text-xs font-bold text-indigo-600 pb-1">vs S&P 500</p>
                </div>
             </div>
             <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Sharpe Premium</p>
                <div className="flex items-end gap-2">
                   <p className="text-2xl font-black text-gray-900">1.4x</p>
                   <p className="text-xs font-bold text-emerald-600 pb-1">Efficiency Ratio</p>
                </div>
             </div>
          </div>
        </div>

        {/* 3-Year Line Chart */}
        <div className="lg:col-span-7 bg-white/60 rounded-[40px] border border-gray-50 p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-xl font-black text-gray-900 tracking-tight">Cumulative Performance</h3>
                 <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-1">Growth of $100 (3-Year History)</p>
              </div>
              <div className="flex flex-wrap gap-4">
                 {[
                   { label: 'AI Strategy', color: '#4f46e5' },
                   { label: 'S&P 500', color: '#94a3b8' },
                   { label: 'KSE-100', color: '#10b981' }
                 ].map((idx) => (
                   <div key={idx.label} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: idx.color }} />
                      <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{idx.label}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <RechartsLineChart data={performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '24px', 
                        border: 'none', 
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ai" 
                      stroke="#4f46e5" 
                      strokeWidth={4} 
                      dot={false}
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 3 }}
                    />
                    <Line type="monotone" dataKey="sp500" stroke="#94a3b8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="kse100" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="3 3" />
                 </RechartsLineChart>
              </ResponsiveContainer>
           </div>

           <div className="mt-8 flex items-center gap-4 py-4 px-6 bg-gray-50 rounded-2xl border border-gray-100">
              <Info className="w-4 h-4 text-gray-400" />
              <p className="text-xs font-medium text-gray-500 leading-relaxed uppercase tracking-widest">
                Benchmarked data includes dividends reinvested for S&P 500 and AI Portfolio. KSE-100 based on PSX Total Return Index.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
