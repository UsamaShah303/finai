
import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { 
  ADMIN_STATS, 
  ACTIVITY_LOGS, 
  USER_DISTRIBUTION,
  USER_GROWTH_DATA 
} from './mockData';

const KPICard: React.FC<{ stat: any }> = ({ stat }) => {
  const Icon = stat.label.includes('Users') ? Users : 
               stat.label.includes('AUM') ? TrendingUp : 
               stat.label.includes('Portfolio') ? PieChartIcon : Activity;
  
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white dark:bg-white/5 rounded-[32px] p-8 shadow-xl shadow-gray-200/20 dark:shadow-none border border-gray-100 dark:border-white/5 flex flex-col justify-between h-48 group transition-all"
    >
      <div className="flex justify-between items-start">
        <div className={`w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center transition-colors group-hover:bg-indigo-600 group-hover:text-white`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
          stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {stat.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {stat.change}
        </div>
      </div>
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
        <h3 className="text-3xl font-[900] text-gray-900 dark:text-white tracking-tighter">{stat.value}</h3>
      </div>
    </motion.div>
  );
};

export const AdminDashboard = () => {
  return (
    <div className="flex-1 flex flex-col gap-12">
      {/* Header with Stats Summary */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
        <div>
          <h1 className="text-5xl font-[900] text-gray-900 dark:text-white tracking-tighter leading-none mb-4">System Overview</h1>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
             <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed Active
             </span>
             <span className="w-1 h-1 rounded-full bg-gray-300" />
             <span>Refreshed 2s ago</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3.5 bg-white dark:bg-white/5 dark:text-white border border-gray-100 dark:border-white/10 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
            Export Intelligence
          </button>
          <button className="px-6 py-3.5 bg-indigo-600 text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">
            System Snapshot
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {ADMIN_STATS.slice(0, 4).map((stat, i) => (
          <KPICard key={i} stat={stat} />
        ))}
      </div>

      {/* Main Grid: Charts and Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* User Growth Chart */}
        <div className="xl:col-span-8 bg-white dark:bg-white/5 rounded-[48px] p-10 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/20 dark:shadow-none flex flex-col gap-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Active Capacity</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Global User Ingress • 30 Day Window</p>
            </div>
            <div className="flex bg-gray-50 dark:bg-white/5 p-1.5 rounded-2xl">
              {['24h', '7d', '30d', '1y'].map((range) => (
                <button
                  key={range}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    range === '30d' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={USER_GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#9ca3af' }}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: '#111827', 
                    border: 'none', 
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                  }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ display: 'none' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4f46e5" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health / Right Col */}
        <div className="xl:col-span-4 flex flex-col gap-8">
           <div className="bg-gray-900 rounded-[48px] p-10 text-white relative overflow-hidden flex-1 shadow-2xl shadow-indigo-900/40">
              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                       <Activity className="w-5 h-5 text-indigo-400" />
                       <h2 className="text-xl font-black tracking-tight">Active Logs</h2>
                    </div>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Real-time</span>
                 </div>
                 
                 <div className="space-y-8 flex-1">
                    {[
                       { t: 'User "0x42" connected', d: 'Just now', s: 'Sync' },
                       { t: 'Plaid Token Refreshed', d: '2m ago', s: 'Auth' },
                       { t: 'Rebalance complete', d: '5m ago', s: 'ML' },
                       { t: 'New Risk Profile: High', d: '12m ago', s: 'User' }
                    ].map((log, i) => (
                       <div key={i} className="flex gap-6 group cursor-default">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                          <div className="flex flex-col">
                             <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-white">{log.t}</span>
                                <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md">{log.s}</span>
                             </div>
                             <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] mt-1">{log.d}</span>
                          </div>
                       </div>
                    ))}
                 </div>

                 <button className="w-full py-4 mt-8 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    View Stream
                 </button>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]" />
           </div>

           <div className="bg-indigo-50 dark:bg-indigo-950/30 p-10 rounded-[48px] border border-indigo-100 dark:border-indigo-900/50 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <PieChartIcon className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-indigo-900 dark:text-indigo-100 tracking-tight">Portfolio Alpha</h3>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Aggregated yield</p>
                 </div>
              </div>
              <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black text-indigo-900 dark:text-indigo-50 tracking-tighter">+24.8%</span>
                 <span className="text-xs font-black text-emerald-500">Above Index</span>
              </div>
              <div className="w-full bg-indigo-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '82%' }}
                   className="h-full bg-indigo-600"
                 />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
