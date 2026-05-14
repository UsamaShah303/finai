
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, 
  Search, 
  Filter, 
  Terminal, 
  Clock, 
  User, 
  ChevronRight,
  MoreHorizontal,
  XCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Activity
} from 'lucide-react';
import { ERROR_LOGS } from './mockData';

const LogItem: React.FC<{ log: any }> = ({ log }) => {
  const isError = log.level === 'ERROR';
  const isWarn = log.level === 'WARN';
  const isInfo = log.level === 'INFO';

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="grid grid-cols-12 items-center gap-6 py-6 px-10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all border-b border-gray-100 dark:border-white/5 last:border-0 group cursor-default"
    >
      <div className="col-span-2 flex items-center gap-4">
        <div className={`w-2.5 h-2.5 rounded-full ${
          isError ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 
          isWarn ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
        }`} />
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] font-mono ${
          isError ? 'text-rose-600' : isWarn ? 'text-amber-600' : 'text-emerald-600'
        }`}>
          {log.level}
        </span>
      </div>

      <div className="col-span-2">
         <span className="text-[10px] font-black text-gray-400 font-mono uppercase tracking-widest">{log.timestamp}</span>
      </div>

      <div className="col-span-2">
         <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md uppercase tracking-widest leading-none">
               {log.service}
            </span>
         </div>
      </div>

      <div className="col-span-4">
         <p className="text-sm font-bold text-gray-900 dark:text-gray-200 tracking-tight group-hover:text-indigo-600 transition-colors truncate">
            {log.message}
         </p>
      </div>

      <div className="col-span-2 flex justify-end">
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
               <User className="w-3 h-3 text-gray-400" />
               <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none">
                  ID:{log.user}
               </span>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export const ErrorLogs = () => {
  const [filter, setFilter] = useState('ALL');

  return (
    <div className="flex-1 flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div>
          <h1 className="text-5xl font-[900] text-gray-900 dark:text-white tracking-tighter leading-none mb-4">Error Intelligence</h1>
          <p className="text-gray-500 font-medium tracking-tight text-lg max-w-2xl leading-relaxed">
            Predictive log analysis and real-time failure tracking for global ingress clusters.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-4 bg-gray-900 dark:bg-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3">
             <Filter className="w-4 h-4" />
             Guard Config
          </button>
          <button className="px-6 py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-600/20 flex items-center gap-3">
             <AlertCircle className="w-4 h-4" />
             Purge Overload
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 px-2">
         <div className="flex gap-2">
            {['ALL', 'ERROR', 'WARN', 'INFO'].map(lvl => (
               <button 
                 key={lvl} 
                 onClick={() => setFilter(lvl)}
                 className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === lvl ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-white dark:bg-white/5 text-gray-400 border border-gray-100 dark:border-white/10 hover:bg-gray-50'
                 }`}
               >
                  {lvl}
               </button>
            ))}
         </div>
         <div className="h-6 w-[1px] bg-gray-200 dark:bg-white/10 mx-2" />
         <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Grep pattern matching..." 
              className="w-full pl-11 pr-6 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-xs font-bold outline-none ring-2 ring-transparent focus:ring-indigo-500/10 transition-all font-mono"
            />
         </div>
      </div>

      {/* Table View */}
      <div className="bg-white dark:bg-white/5 rounded-[48px] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden flex flex-col">
         <div className="grid grid-cols-12 px-10 py-6 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
            <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Severity</div>
            <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Temporal</div>
            <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Module</div>
            <div className="col-span-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Message Payload</div>
            <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Origin</div>
         </div>
         <div className="flex flex-col">
            {ERROR_LOGS.filter(log => filter === 'ALL' || log.level === filter).map((log) => (
               <LogItem key={log.id} log={log} />
            ))}
         </div>
         
         {/* Footer */}
         <div className="px-10 py-6 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-[900] text-gray-400 uppercase tracking-widest">End of stream</span>
               </div>
               <div className="w-[1px] h-4 bg-gray-200 dark:bg-white/10" />
               <span className="text-[10px] font-[900] text-gray-400 uppercase tracking-widest">Showing 420 traces</span>
            </div>
            <div className="flex gap-4">
               <button className="p-2.5 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 text-gray-400 hover:text-indigo-600 transition-colors">
                  <RefreshCw className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
