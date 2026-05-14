
import React from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { 
  BrainCircuit, 
  Zap, 
  Target, 
  Activity, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { AI_PERFORMANCE, FEATURE_USAGE } from './mockData';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export const AIPerformance = () => {
  return (
    <div className="flex-1 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">AI & ML Performance</h1>
          <p className="text-gray-500 font-medium tracking-tight">Monitoring model inference, drift, and accuracy</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Model: Beta-V2.4</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { l: 'Avg Inference Time', v: '142ms', c: '-12ms', i: Clock, clr: 'indigo' },
          { l: 'P95 Latency', v: '410ms', c: '+25ms', i: Zap, clr: 'rose' },
          { l: 'Model Accuracy', v: '94.2%', c: '+0.5%', i: Target, clr: 'emerald' },
          { l: 'Drift Score', v: '0.012', c: 'Stable', i: Activity, clr: 'blue' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
               <div className={`p-3 rounded-2xl bg-${kpi.clr}-50 text-${kpi.clr}-600`}>
                  <kpi.i className="w-6 h-6" />
               </div>
               <span className={`text-xs font-black px-2 py-0.5 rounded-md ${kpi.c.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : kpi.c.startsWith('-') ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-400'}`}>
                  {kpi.c}
               </span>
            </div>
            <div>
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{kpi.l}</p>
               <h3 className="text-2xl font-black text-gray-900">{kpi.v}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Inference Latency */}
        <div className="xl:col-span-8 bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
           <div className="flex items-center justify-between mb-10">
              <div>
                 <h2 className="text-xl font-black text-gray-900 tracking-tight">Inference Latency</h2>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">24-hour response time distribution</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-tight font-sans">p50</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-tight font-sans">p95</span>
                 </div>
              </div>
           </div>
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={AI_PERFORMANCE.latency}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                       dy={15}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                       dx={-15}
                       unit="ms"
                    />
                    <Tooltip 
                       contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} 
                       labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}
                    />
                    <Line 
                       type="monotone" 
                       dataKey="p50" 
                       stroke="#4f46e5" 
                       strokeWidth={4} 
                       dot={false}
                       activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                    <Line 
                       type="monotone" 
                       dataKey="p95" 
                       stroke="#f43f5e" 
                       strokeWidth={2} 
                       strokeDasharray="5 5"
                       dot={false}
                       activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Output Distribution */}
        <div className="xl:col-span-4 bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col">
           <div className="mb-8">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Output Distribution</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Recommended Risk Profiles</p>
           </div>
           <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={AI_PERFORMANCE.distribution}
                       innerRadius={60}
                       outerRadius={90}
                       paddingAngle={5}
                       dataKey="value"
                       stroke="none"
                    >
                       {AI_PERFORMANCE.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-1 gap-3 mt-6">
              {AI_PERFORMANCE.distribution.map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50">
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                       <span className="text-xs font-bold text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-indigo-600">{item.value} reqs</span>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* Model Health Checklist */}
      <div className="bg-gray-900 rounded-[48px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-[28px] flex items-center justify-center text-lime-400">
               <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-xl font-black tracking-tight mb-1">Model Governance & Safety</h3>
               <p className="text-white/50 text-xs font-medium max-w-md">Our models are screened for bias and ethical alignment every 4 hours. No deviations detected in last check.</p>
            </div>
         </div>
         <div className="flex gap-6 overflow-x-auto w-full md:w-auto pb-4 md:pb-0">
            {[
               { l: 'Bias Offset', v: '0.002' },
               { l: 'Ethical Guard', v: 'Active' },
               { l: 'Training Loop', v: '24h' }
            ].map((stat, i) => (
               <div key={i} className="flex flex-col items-center px-6 py-3 bg-white/5 rounded-2xl border border-white/5 min-w-[120px]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{stat.l}</span>
                  <span className="text-lg font-black text-white leading-none">{stat.v}</span>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};
