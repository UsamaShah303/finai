import React from 'react';
import { motion } from 'motion/react';
import { 
  Leaf, 
  Globe, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Zap, 
  ArrowUpRight,
  Info,
  Sparkles,
  TreePine,
  Wind,
  Droplets
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const ESG_HISTORY = [
  { year: '2020', score: 62 },
  { year: '2021', score: 65 },
  { year: '2022', score: 68 },
  { year: '2023', score: 74 },
  { year: '2024', score: 82 },
];

const PILLAR_DATA = [
  { name: 'Environmental', value: 45, color: '#10B981', icon: <TreePine className="w-5 h-5" />, description: 'Carbon footprint, energy efficiency, and waste management.' },
  { name: 'Social', value: 30, color: '#3B82F6', icon: <Users className="w-5 h-5" />, description: 'Diversity & inclusion, labor standards, and community impact.' },
  { name: 'Governance', value: 25, color: '#7C3AED', icon: <ShieldCheck className="w-5 h-5" />, description: 'Board transparency, ethical leadership, and shareholder rights.' },
];

export const ESGPage = () => {
  return (
    <div className="flex-1 flex flex-col gap-10 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-2 tracking-tight">ESG & Sustainability</h1>
          <p className="text-gray-500 font-medium text-lg">Portfolio Ethical Index • Impact Analysis</p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 p-6 rounded-[32px] border border-white shadow-sm shrink-0">
           <div className="flex flex-col">
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Global Rank</span>
              <span className="text-2xl font-black text-gray-900">Top 12%</span>
           </div>
           <div className="w-[1px] h-10 bg-gray-100 mx-2" />
           <div className="flex flex-col">
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Impact Status</span>
              <span className="text-sm font-black text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full">Exceptional</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Score Area */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] p-10 border border-white shadow-sm flex flex-col">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                   <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Sustainable Health Index</h3>
                   <div className="flex items-baseline gap-3">
                     <span className="text-7xl font-black text-emerald-600 tracking-tighter">82.4</span>
                     <span className="text-xl font-bold text-emerald-500 flex items-center gap-1">
                        <ArrowUpRight className="w-5 h-5" />
                        +8% YoY
                     </span>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Carbon Offset</div>
                      <div className="text-lg font-black text-gray-900">12.4t CO2e</div>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Clean Energy</div>
                      <div className="text-lg font-black text-gray-900">42% Pos.</div>
                   </div>
                </div>
             </div>

             <div className="h-[350px] w-full -ml-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ESG_HISTORY}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fontWeight: 900, fill: '#4b5563' }}
                      dy={15}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fontWeight: 900, fill: '#4b5563' }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-gray-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-white/10">
                              <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">{payload[0].payload.year} Resilience</div>
                              <div className="text-2xl font-black text-emerald-400">{payload[0].value} pts</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#10B981"
                      strokeWidth={4}
                      fill="url(#colorScore)"
                      fillOpacity={1}
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {PILLAR_DATA.map((pillar) => (
                <div key={pillar.name} className="bg-white/60 p-8 rounded-[40px] border border-white/40 shadow-sm flex flex-col group hover:bg-white transition-all cursor-default">
                   <div className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${pillar.color}15`, color: pillar.color }}>
                      {pillar.icon}
                   </div>
                   <h4 className="text-lg font-black text-gray-900 mb-2">{pillar.name}</h4>
                   <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-black text-gray-900">{pillar.value}</span>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Weighting</span>
                   </div>
                   <p className="text-xs text-gray-500 font-medium leading-relaxed">{pillar.description}</p>
                </div>
             ))}
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 flex flex-col gap-10">
           <div className="bg-indigo-900 rounded-[48px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-900/10">
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-12">
                   <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">Ethical Optimization</h3>
                   <Sparkles className="w-5 h-5 text-white/20" />
                 </div>
                 
                 <div className="space-y-10">
                    <div className="group/item">
                       <div className="text-xs font-black text-white/50 uppercase tracking-widest mb-3 transition-colors group-hover/item:text-emerald-400">Environment</div>
                       <p className="text-xl font-black text-white mb-2 leading-tight">Divest Coal holdings</p>
                       <p className="text-xs text-white/60 leading-relaxed font-medium">Shifting $5k from traditional energy to solar tickers could raise your score by 4.2 points.</p>
                    </div>
                    <div className="group/item">
                       <div className="text-xs font-black text-white/50 uppercase tracking-widest mb-3 transition-colors group-hover/item:text-blue-400">Social Focus</div>
                       <p className="text-xl font-black text-white mb-2 leading-tight">Board Diversity Check</p>
                       <p className="text-xs text-white/60 leading-relaxed font-medium">Your portfolio holdings average 38% board diversity, exceeding the benchmark of 24%.</p>
                    </div>
                 </div>
                 
                 <button 
                   onClick={() => alert("Generating full 30-page PDF ethical report... (Demo)")}
                   className="mt-12 w-full py-5 bg-white text-gray-900 rounded-[28px] font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all"
                 >
                    Full Ethical Report
                 </button>
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           </div>

           <div className="bg-white/80 p-10 rounded-[48px] border border-white shadow-sm flex flex-col items-center">
              <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8">Pillar Contribution</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PILLAR_DATA}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {PILLAR_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                       itemStyle={{ fontWeight: 800, fontSize: '11px', textTransform: 'uppercase' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 gap-4 w-full mt-8">
                 {PILLAR_DATA.map(p => (
                    <div key={p.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                       <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                          <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{p.name}</span>
                       </div>
                       <span className="text-sm font-black text-gray-900">{p.value}%</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
