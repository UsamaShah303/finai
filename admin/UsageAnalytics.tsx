
import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Calendar, 
  ChevronDown,
  Users,
  Activity,
  ArrowUpRight,
  Search
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  USER_GROWTH_DATA, 
  USER_DISTRIBUTION 
} from './mockData';

const AnalyticsCard: React.FC<{ title: string; subtitle: string; children: React.ReactNode; className?: string }> = ({ title, subtitle, children, className = "" }) => (
  <div className={`bg-white dark:bg-white/5 rounded-[48px] p-10 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/20 dark:shadow-none flex flex-col gap-10 ${className}`}>
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-2">{title}</h2>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{subtitle}</p>
      </div>
      <button className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-indigo-600 transition-colors">
        <TrendingUp className="w-4 h-4" />
      </button>
    </div>
    <div className="flex-1 w-full min-h-[300px]">
      {children}
    </div>
  </div>
);

export const UsageAnalytics = () => {
  return (
    <div className="flex-1 flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div>
          <h1 className="text-5xl font-[900] text-gray-900 dark:text-white tracking-tighter leading-none mb-4">Deep Analytics</h1>
          <p className="text-gray-500 font-medium tracking-tight text-lg max-w-2xl leading-relaxed">
            Multidimensional analysis of user behavior, resource consumption, and platform growth.
          </p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">May 2026</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* User Growth - Area Chart */}
        <AnalyticsCard title="Ingress velocity" subtitle="Active user sessions • 30D Window">
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
        </AnalyticsCard>

        {/* User Mix - Pie Chart */}
        <AnalyticsCard title="Segment Mix" subtitle="Subscription tier distribution">
          <div className="flex flex-col md:flex-row h-full items-center gap-10">
            <div className="flex-1 h-full w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={USER_DISTRIBUTION}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {USER_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full md:w-48 shrink-0">
               {USER_DISTRIBUTION.map((item, i) => (
                  <div key={i} className="flex flex-col gap-1 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                     <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.name}</span>
                     </div>
                     <span className="text-xl font-black text-gray-900 dark:text-white leading-none mt-1">{item.value}%</span>
                  </div>
               ))}
            </div>
          </div>
        </AnalyticsCard>

        {/* Feature Usage - Bar Chart */}
        <AnalyticsCard title="Substrate Usage" subtitle="Compute allocation across services" className="xl:col-span-2">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                 { name: 'Core Engine', value: 85, fill: '#4f46e5' },
                 { name: 'Auth Node', value: 45, fill: '#6366f1' },
                 { name: 'DB Cluster', value: 65, fill: '#818cf8' },
                 { name: 'AI Vectors', value: 92, fill: '#4f46e5' },
                 { name: 'File Storage', value: 30, fill: '#a5b4fc' },
                 { name: 'Messaging', value: 55, fill: '#818cf8' }
              ]}>
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
                   cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                   contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '16px' }}
                />
                 <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={80}>
                    {
                       [0,1,2,3,4,5].map((_, i) => (
                          <Cell key={i} fill={i % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                       ))
                    }
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </AnalyticsCard>
      </div>
    </div>
  );
};
