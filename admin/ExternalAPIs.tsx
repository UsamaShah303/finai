
import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3, 
  Zap,
  Info,
  RefreshCw,
  Search
} from 'lucide-react';
import { EXTERNAL_APIS } from './mockData';

const APICard: React.FC<{ api: any }> = ({ api }) => {
  const isHealthy = api.status === 'Healthy';

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col justify-between group h-fit"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center ${
            isHealthy ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            <Globe className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">{api.name}</h3>
            <div className="flex items-center gap-2 mt-1">
               <div className={`w-2 h-2 rounded-full animate-pulse ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'}`} />
               <span className={`text-[10px] font-black uppercase tracking-widest ${isHealthy ? 'text-emerald-600' : 'text-rose-600'}`}>
                 {api.status}
               </span>
            </div>
          </div>
        </div>
        <button className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
         <div className="p-4 bg-gray-50/50 rounded-2xl flex flex-col gap-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Latency</span>
            <span className="text-lg font-black text-gray-900 leading-tight">{api.latency}</span>
         </div>
         <div className="p-4 bg-gray-50/50 rounded-2xl flex flex-col gap-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Uptime</span>
            <span className="text-lg font-black text-gray-900 leading-tight">{api.uptime}</span>
         </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
         <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold tracking-tight">Last Check: {api.lastCheck}</span>
         </div>
         <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Latency History</button>
      </div>
    </motion.div>
  );
};

export const ExternalAPIs = () => {
  return (
    <div className="flex-1 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">External Connectivity</h1>
          <p className="text-gray-500 font-medium tracking-tight">Monitoring third-party data providers and latencies</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            View Active Outages
          </button>
        </div>
      </div>

      {/* Global Alert Banner */}
      <div className="bg-rose-50 border-2 border-rose-100 rounded-[40px] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-600 rounded-[28px] flex items-center justify-center text-white shadow-xl shadow-rose-200">
               <Zap className="w-8 h-8" />
            </div>
            <div>
               <h2 className="text-xl font-black text-rose-900 tracking-tight leading-none mb-2">Degraded API Detected</h2>
               <p className="text-rose-700/70 font-medium text-sm">Plaid API is experiencing high latency (1.2s) in the US region. Transaction sync might be delayed.</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="px-6 py-3 bg-white text-rose-700 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-sm hover:shadow-md transition-all">Retry Handshake</button>
            <button className="px-6 py-3 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-rose-200">Incident Details</button>
         </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Data Provider Grid</h2>
           </div>
           <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-[20px] border border-gray-100 flex items-center gap-2 group">
                 <Search className="w-4 h-4 text-gray-400" />
                 <input type="text" placeholder="Filter providers..." className="bg-transparent border-none focus:outline-none text-xs font-bold text-gray-600 w-48" />
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {EXTERNAL_APIS.map((api, i) => (
            <APICard key={i} api={api} />
          ))}
          
          {/* Add Provider Card */}
          <button className="h-[340px] border-4 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center gap-4 group hover:border-indigo-200 hover:bg-indigo-50/20 transition-all">
             <div className="w-16 h-16 rounded-[28px] bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
                <Globe className="w-8 h-8" />
             </div>
             <div className="flex flex-col items-center">
                <span className="text-sm font-black text-gray-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Add New Provider</span>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mt-1">Market Data or OAuth</span>
             </div>
          </button>
        </div>
      </div>

      {/* API Usage Metrics */}
      <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm flex flex-col gap-10">
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-xl font-black text-gray-900 tracking-tight">Call Volume (24h)</h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Aggregated platform-wide API requests</p>
            </div>
            <div className="flex gap-6">
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Requests</span>
                  <span className="text-2xl font-black text-indigo-600 uppercase tracking-tight">1.24M</span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Success Rate</span>
                  <span className="text-2xl font-black text-emerald-600 uppercase tracking-tight">99.8%</span>
               </div>
            </div>
         </div>
         <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-24 gap-3 items-end h-32">
            {Array.from({ length: 24 }).map((_, i) => {
               const val = Math.floor(20 + Math.random() * 80);
               return (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ delay: i * 0.05, duration: 1 }}
                    className={`w-full bg-indigo-600 rounded-t-lg relative group`}
                  >
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        {val * 10}k reqs
                     </div>
                  </motion.div>
               );
            })}
         </div>
         <div className="flex items-center gap-10 mt-4 overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex items-center gap-3 shrink-0">
               <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Activity className="w-6 h-6" />
               </div>
               <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Cost Efficiency</span>
                  <span className="text-sm font-black text-gray-900">$0.002 / 1k Calls</span>
               </div>
            </div>
            <div className="w-[1px] h-10 bg-gray-100 shrink-0" />
            <div className="flex items-center gap-3 shrink-0">
               <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Zap className="w-6 h-6" />
               </div>
               <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Cache Hit Rate</span>
                  <span className="text-sm font-black text-gray-900">84.2%</span>
               </div>
            </div>
            <div className="w-[1px] h-10 bg-gray-100 shrink-0" />
            <div className="flex items-center gap-3 shrink-0">
               <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <Info className="w-6 h-6" />
               </div>
               <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Rate Limit Buffer</span>
                  <span className="text-sm font-black text-gray-900">12,400 Reqs</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
