
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  Activity, 
  AlertCircle, 
  BarChart3, 
  BrainCircuit, 
  Settings2, 
  Globe, 
  PanelLeftClose, 
  PanelLeftOpen,
  ArrowLeft,
  Search,
  Bell,
  Moon,
  Sun,
  User,
  ChevronDown
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { HealthMonitor } from './HealthMonitor';
import { ErrorLogs } from './ErrorLogs';
import { UsageAnalytics } from './UsageAnalytics';
import { AIPerformance } from './AIPerformance';
import { AIParameters } from './AIParameters';
import { ExternalAPIs } from './ExternalAPIs';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeAdminTab, setActiveAdminTab] = useState('System Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const adminNavItems = [
    { label: 'System Dashboard', icon: LayoutGrid },
    { label: 'Health Monitor', icon: Activity },
    { label: 'Error Logs', icon: AlertCircle },
    { label: 'Usage Analytics', icon: BarChart3 },
    { label: 'AI Performance', icon: BrainCircuit },
    { label: 'AI Parameters', icon: Settings2 },
    { label: 'External APIs', icon: Globe },
  ];

  const renderAdminContent = () => {
    switch (activeAdminTab) {
      case 'System Dashboard': return <AdminDashboard />;
      case 'Health Monitor': return <HealthMonitor />;
      case 'Error Logs': return <ErrorLogs />;
      case 'Usage Analytics': return <UsageAnalytics />;
      case 'AI Performance': return <AIPerformance />;
      case 'AI Parameters': return <AIParameters />;
      case 'External APIs': return <ExternalAPIs />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className={`fixed inset-0 z-[500] flex animate-in fade-in duration-700 ${isDarkMode ? 'dark bg-black' : 'bg-gray-50'}`}>
      {/* Admin Sidebar */}
      <motion.aside 
        animate={{ width: isCollapsed ? 100 : 320 }}
        className={`flex flex-col border-r transition-all duration-700 z-50 relative ${
          isDarkMode ? 'bg-gray-900/40 backdrop-blur-3xl border-white/5' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'
        }`}
      >
        <div className="p-10 flex items-center gap-5 relative">
          <div className="w-14 h-14 bg-indigo-600 rounded-[22px] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 shrink-0 relative group overflow-hidden">
             <Settings2 className="w-8 h-8 relative z-10 transition-transform group-hover:rotate-90 duration-500" />
             <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
               <span className={`text-2xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`}>FinAI <span className="text-indigo-500">Nexus</span></span>
               <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] leading-none mt-1">Core Admin</span>
            </motion.div>
          )}

          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border shadow-xl flex items-center justify-center transition-all z-[60] hover:scale-110 active:scale-95 ${
              isDarkMode ? 'bg-gray-800 border-white/10 text-gray-500 dark:text-gray-300' : 'bg-white border-gray-200 text-gray-500'
            }`}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 px-5 mt-10 space-y-3 overflow-y-auto scrollbar-hide">
          <div className="px-4 mb-4">
             <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.4em]">Main Modules</span>
          </div>
          {adminNavItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveAdminTab(item.label)}
              className={`w-full flex items-center gap-4 p-4 rounded-[24px] transition-all relative group ${
                activeAdminTab === item.label 
                  ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 ring-4 ring-indigo-600/10' 
                  : `text-gray-500 dark:text-gray-400 hover:text-indigo-500 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <item.icon className={`w-5 h-5 shrink-0 transition-transform ${activeAdminTab === item.label ? 'scale-110' : 'group-hover:scale-110'}`} />
              {!isCollapsed && (
                <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
              )}
              {isCollapsed && (
                  <span className="absolute left-full ml-4 px-4 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl opacity-0 translate-x-[-15px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-2xl z-[100] whitespace-nowrap">
                    {item.label}
                  </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-gray-100 dark:border-white/5">
           <button 
             onClick={onBack}
             className={`w-full flex items-center justify-center gap-3 p-5 rounded-[28px] border transition-all hover:shadow-lg ${
               isDarkMode ? 'border-white/5 text-gray-500 dark:text-gray-400 hover:bg-white/5' : 'border-gray-100 text-gray-500 hover:bg-gray-50'
             }`}
           >
              <ArrowLeft className="w-4 h-4" />
              {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.3em]">Return to App</span>}
           </button>
        </div>
      </motion.aside>

      {/* Admin Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Admin Header */}
        <header className={`h-28 px-12 flex items-center justify-between border-b transition-all duration-700 z-40 ${
          isDarkMode ? 'bg-gray-900/60 backdrop-blur-xl border-white/5' : 'bg-white/80 backdrop-blur-xl border-gray-100'
        }`}>
          <div className="flex items-center gap-10 flex-1">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Nodes</span>
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 bg-emerald-500 flex items-center justify-center shadow-sm">
                         <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </div>
                   ))}
                </div>
             </div>
             <div className={`relative max-w-xl w-full group ${isDarkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'}`}>
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-indigo-500" />
                <input 
                  type="text" 
                  placeholder="System query: logs, users, clusters..." 
                  className={`w-full pl-14 pr-6 py-4 border-none rounded-[24px] text-xs font-bold transition-all outline-none ring-2 ring-transparent focus:ring-indigo-500/20 ${
                    isDarkMode ? 'bg-white/5 focus:bg-white/10 text-white' : 'bg-gray-50 focus:bg-gray-100 text-gray-900 dark:text-white'
                  }`}
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1 border border-white/10 px-2 py-1 rounded-lg bg-white/5">
                   <span className="text-[8px] font-bold opacity-50">CMD</span>
                   <span className="text-[8px] font-bold opacity-50">K</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-12 h-12 rounded-[18px] flex items-center justify-center border transition-all hover:scale-105 active:scale-95 ${
                    isDarkMode ? 'border-white/10 text-amber-400 hover:bg-white/10 bg-white/5' : 'border-gray-100 text-indigo-600 hover:bg-gray-50 bg-white shadow-sm'
                  }`}
                >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                <button className={`w-12 h-12 rounded-[18px] flex items-center justify-center border transition-all relative hover:scale-105 active:scale-95 ${
                    isDarkMode ? 'border-white/10 text-gray-500 dark:text-gray-300 hover:bg-white/10 bg-white/5' : 'border-gray-100 text-gray-500 hover:bg-gray-50 bg-white shadow-sm'
                  }`}>
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-gray-900" />
                </button>
             </div>

             <div className="h-10 w-[1px] bg-gray-100 dark:bg-white/5" />

             <button className={`flex items-center gap-4 p-2 rounded-[22px] transition-all group border ${
                isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50 bg-white shadow-sm'
             }`}>
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-indigo-600/20 relative group-hover:scale-105 transition-transform overflow-hidden">
                   AD
                   <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col items-start leading-none pr-4">
                    <span className={`text-sm font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Admin User</span>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">L7 Superuser</span>
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform group-hover:translate-y-0.5" />
             </button>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className={`flex-1 p-14 overflow-y-auto scrollbar-hide flex flex-col gap-12 transition-all duration-700 ${
           isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900 dark:text-white'
        }`}>
           <AnimatePresence mode="wait">
             <motion.div
               key={activeAdminTab}
               initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
               animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
               exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
               transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
             >
               {renderAdminContent()}
             </motion.div>
           </AnimatePresence>
        </div>

        {isDarkMode && (
           <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        )}
      </main>
    </div>
  );
};
