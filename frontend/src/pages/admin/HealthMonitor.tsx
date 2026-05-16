
import React from 'react';
import { motion } from 'motion/react';
import { 
  Server, 
  Cpu, 
  Database, 
  Globe, 
  ShieldCheck, 
  AlertTriangle, 
  Zap,
  RefreshCw,
  Search,
  Activity,
  MoreVertical,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { SERVICE_HEALTH } from './mockData';

const ServiceCard: React.FC<{ service: any }> = ({ service }) => {
  const isHealthy = service.status === 'Operational';
  const isWarning = service.status === 'Warning';
  const isDegraded = service.status === 'Degraded';

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white dark:bg-white/5 rounded-[32px] p-8 shadow-xl shadow-gray-200/20 dark:shadow-none border border-gray-100 dark:border-white/5 flex flex-col justify-between group transition-all h-[440px]"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative transition-all group-hover:scale-110 shadow-sm ${
            isHealthy ? 'bg-emerald-50 text-emerald-600' : 
            isWarning ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {service.name.includes('DB') ? <Database className="w-7 h-7" /> : 
             service.name.includes('ML') ? <Cpu className="w-7 h-7" /> : 
             service.name.includes('Gateway') ? <Globe className="w-7 h-7" /> : <Server className="w-7 h-7" />}
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-4 border-white dark:border-gray-950 ${
              isHealthy ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-rose-500'
            }`} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1.5">{service.name}</h3>
            <div className="flex items-center gap-2">
               <span className={`text-[10px] font-[900] uppercase tracking-[0.2em] ${
                 isHealthy ? 'text-emerald-600' : isWarning ? 'text-amber-600' : 'text-rose-600'
               }`}>
                 {service.status}
               </span>
            </div>
          </div>
        </div>
        <button className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-100">
           <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
           <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none">Uptime</span>
           </div>
           <span className="text-xl font-black text-gray-900 dark:text-white font-mono leading-none tracking-tight">{service.uptime}%</span>
        </div>
        <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
           <div className="flex items-center gap-2 mb-2">
              <Activity className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none">Latency</span>
           </div>
           <span className="text-xl font-black text-gray-900 dark:text-white font-mono leading-none tracking-tight">{service.latency}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4">
         <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Resource Load</span>
            <span className="text-[10px] font-black text-gray-900 dark:text-white font-mono">{service.load}</span>
         </div>
         <div className="h-2.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden p-0.5">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: service.load }}
               className={`h-full rounded-full transition-all duration-1000 ${
                  parseInt(service.load) > 80 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 
                  parseInt(service.load) > 60 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-emerald-500'
               }`}
            />
         </div>
         <div className="flex justify-between gap-1 h-10 mt-2 items-end">
            {Array.from({ length: 30 }).map((_, i) => (
               <div 
                 key={i} 
                 className={`w-full rounded-full transition-all duration-700 ${
                    Math.random() > 0.1 ? 'bg-indigo-500/10 dark:bg-indigo-400/10' : 'bg-rose-500/40 animate-pulse'
                 }`} 
                 style={{ height: `${20 + Math.random() * 80}%` }} 
               />
            ))}
         </div>
      </div>
    </motion.div>
  );
};

export const HealthMonitor = () => {
  return (
    <div className="flex-1 flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div>
          <h1 className="text-5xl font-[900] text-gray-900 dark:text-white tracking-tighter leading-none mb-4">Cluster Health</h1>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
             <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Architecture Sync
             </span>
             <span className="w-1 h-1 rounded-full bg-gray-300" />
             <span>32 Nodes Active</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 flex items-center gap-3">
             <CheckCircle2 className="w-4 h-4" />
             Nodes Stable
          </button>
        </div>
      </div>

      {/* Global Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
         {[
            { l: 'Throughput', v: '14.2 GB/s', t: 'up' },
            { l: 'Error Rate', v: '0.002%', t: 'down' },
            { l: 'Instances', v: '1,240', t: 'up' },
            { l: 'Latency', v: '12.4ms', t: 'down' }
         ].map((m, i) => (
            <div key={i} className="flex flex-col gap-1 bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
               <span className="text-[9px] font-[900] text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] leading-tight mb-2">{m.l}</span>
               <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-gray-900 dark:text-white font-mono tracking-tight">{m.v}</span>
                  <div className={`w-2.5 h-2.5 rounded-full ${m.t === 'up' ? 'bg-emerald-500' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
               </div>
            </div>
         ))}
      </div>

      {/* Service Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Service Mesh Nodes</h2>
           </div>
           <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Filter Cluster</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {SERVICE_HEALTH.map((service, i) => (
            <ServiceCard key={i} service={service} />
          ))}
          
          {/* Provision New Node Card */}
          <button className="h-[440px] rounded-[32px] border-4 border-dashed border-gray-100 dark:border-white/10 flex flex-col items-center justify-center gap-6 group hover:border-indigo-500/50 hover:bg-indigo-50/20 transition-all cursor-pointer">
             <div className="w-20 h-20 rounded-[32px] bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all group-hover:scale-110 shadow-sm relative overflow-hidden">
                <Activity className="w-10 h-10 relative z-10" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
             <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.4em] group-hover:text-indigo-600 transition-colors">Provision Cluster</span>
                <span className="text-[8px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-widest">Manual Node Injection</span>
             </div>
          </button>
        </div>
      </div>
    </div>
  );
};
