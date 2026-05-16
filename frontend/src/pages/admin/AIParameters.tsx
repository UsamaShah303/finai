
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings2, 
  Save, 
  RotateCcw, 
  History, 
  User, 
  Clock, 
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import { AI_PARAMS } from './mockData';
import { toast } from 'react-hot-toast';

const ParameterRow: React.FC<{ param: any }> = ({ param }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(param.value);

  const handleSave = () => {
    setIsEditing(false);
    toast.success(`Parameter ${param.name} updated successfully!`);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center py-6 px-8 hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0 group">
      <div className="flex-1 mb-4 md:mb-0">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{param.name}</h4>
          <span className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md tracking-widest">{param.unit}</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 dark:text-gray-400">
           <div className="flex items-center gap-1.5">
              <User className="w-3 h-3" />
              <span>{param.user}</span>
           </div>
           <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>{param.lastModified}</span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="relative">
          {isEditing ? (
             <div className="flex items-center gap-2">
               <input 
                 type="text" 
                 value={value} 
                 onChange={(e) => setValue(e.target.value)}
                 className="w-32 px-4 py-2 bg-white border-2 border-indigo-500 rounded-xl text-sm font-black text-gray-900 dark:text-white focus:outline-none shadow-lg shadow-indigo-100"
               />
               <button 
                 onClick={handleSave}
                 className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
               >
                 <Save className="w-4 h-4" />
               </button>
               <button 
                 onClick={() => { setIsEditing(false); setValue(param.value); }}
                 className="p-2 bg-gray-100 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-200 transition-colors"
               >
                 <X className="w-4 h-4" />
               </button>
             </div>
          ) : (
             <div className="flex items-center gap-4">
                <span className="text-xl font-black text-gray-900 dark:text-white">{value}</span>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                   Edit
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const AIParameters = () => {
  return (
    <div className="flex-1 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">AI Parameters</h1>
          <p className="text-gray-500 font-medium tracking-tight">Manual control over model thresholds and rules</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            Reset Defaults
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Parameters List */}
        <div className="xl:col-span-8 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
           <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Settings2 className="w-5 h-5 text-indigo-600" />
                 <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Runtime Constants</h2>
              </div>
              <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">v2.4.1 Configuration</span>
           </div>
           <div className="flex flex-col">
              {AI_PARAMS.map((param) => (
                 <ParameterRow key={param.id} param={param} />
              ))}
           </div>
           <div className="px-8 py-6 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600">
                 <CheckCircle2 className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Configuration Synced</span>
              </div>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 italic">Syncing to ML Inference Cluster...</p>
           </div>
        </div>

        {/* Audit Trail */}
        <div className="xl:col-span-4 flex flex-col gap-8">
           <div className="bg-gray-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-900/10">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <History className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-xl font-black tracking-tight">Audit Trail</h2>
                 </div>
                 <div className="space-y-8">
                    {[
                       { t: 'Threshold Updated', u: 'Admin', d: '2m ago', p: 'Rebalancing' },
                       { t: 'Reset to Default', u: 'Lead ML', d: '1h ago', p: 'Sentiment' },
                       { t: 'Coefficient Patch', u: 'System', d: '4h ago', p: 'Alpha' }
                    ].map((audit, i) => (
                       <div key={i} className="flex gap-4 relative">
                          {i !== 2 && <div className="absolute left-1.5 top-8 bottom-[-20px] w-[2px] bg-white/10" />}
                          <div className="w-3 h-3 rounded-full bg-indigo-500 mt-2 shrink-0 border-2 border-gray-900 z-10" />
                          <div className="flex flex-col">
                             <span className="text-xs font-black text-white">{audit.t}</span>
                             <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">by {audit.u} • {audit.d}</span>
                             <span className="text-[10px] font-black text-indigo-400 mt-2">Param: {audit.p}</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
           </div>

           <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <Info className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-indigo-900 tracking-tight">Simulation Warning</h3>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">Parameter Boundaries</p>
                 </div>
              </div>
              <p className="text-xs text-indigo-700/70 font-medium leading-relaxed italic">
                 "Adjusting rebalancing thresholds below 2% may cause excessive transaction costs and platform-wide rebalancing loops."
              </p>
              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                 Run Multi-agent Sim
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
