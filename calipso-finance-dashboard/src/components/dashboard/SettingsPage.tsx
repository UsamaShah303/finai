import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  User as UserIcon, 
  Bell, 
  Shield, 
  Download, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Eye, 
  CreditCard,
  Target,
  Sparkles,
  Zap,
  RefreshCw,
  LogOut,
  Mail,
  Camera
} from 'lucide-react';
import { useAuthStore } from '../../lib/authStore';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

export const SettingsPage = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    authApi.getTransactions().then(setTransactions).catch(() => {});
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate generation
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    }, 2000);
  };

  const handleSignOut = () => {
    logout();
    toast.success('Signed out successfully');
  };

  return (
    <div className="flex-1 flex flex-col gap-10 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-2 tracking-tight">Settings Hub</h1>
          <p className="text-gray-500 font-medium text-lg">Account Configuration • Financial Export</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleSignOut}
             className="flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-[24px] font-bold border border-gray-100 hover:bg-gray-50 transition-all"
           >
              <LogOut className="w-5 h-5 text-rose-500" />
              Sign Out
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Profile Card */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] p-10 border border-white shadow-sm flex flex-col items-center">
              <div className="relative group mb-8">
                 <div className="w-32 h-32 rounded-[40px] border-4 border-white shadow-xl overflow-hidden bg-primary/10 flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-primary/40" />
                 </div>
                 <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5" />
                 </button>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-1">{user?.name}</h3>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-10 text-center">Platinum Wealth Member • {user?.country}</p>
              
              <div className="w-full space-y-4">
                 <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[28px] border border-gray-100">
                    <div className="flex items-center gap-3">
                       <Mail className="w-4 h-4 text-gray-400" />
                       <span className="text-xs font-bold text-gray-900 truncate max-w-[150px]">{user?.email}</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 </div>
                 <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[28px] border border-gray-100">
                    <div className="flex items-center gap-3">
                       <CreditCard className="w-4 h-4 text-gray-400" />
                       <span className="text-xs font-bold text-gray-900">Visa ending in 4242</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                 </div>
              </div>

              <button className="mt-10 w-full py-5 bg-indigo-600 text-white rounded-[28px] font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-600/20">
                Edit Public Profile
              </button>
           </div>

           {/* Wallet Management */}
           <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] p-10 border border-white shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <CreditCard className="w-6 h-6 text-indigo-600" />
                   <h3 className="text-xl font-black text-gray-900">Wallet History</h3>
                </div>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">Real-time</button>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                 {transactions.length === 0 ? (
                   <p className="text-center py-10 text-gray-400 font-bold italic text-sm">No transactions yet.</p>
                 ) : (
                   transactions.map((t: any) => (
                     <div key={t.id} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'DEPOSIT' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {t.type === 'DEPOSIT' ? <ArrowRight className="w-5 h-5 -rotate-45" /> : <ArrowRight className="w-5 h-5 rotate-135" />}
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-900">{t.type}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(t.timestamp).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className={`text-sm font-black ${t.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {t.type === 'DEPOSIT' ? '+' : '-'}{t.currency === 'USD' ? '$' : '₨'}{t.amount.toLocaleString()}
                           </p>
                           <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{t.status}</p>
                        </div>
                     </div>
                   ))
                 )}
              </div>

              <button className="mt-8 py-4 w-full bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:bg-gray-100 transition-all">
                 <Download className="w-3 h-3" /> Download Statement
              </button>
            </div>

           <div className="bg-gray-900 rounded-[48px] p-10 text-white relative overflow-hidden group">
              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex items-center gap-3 mb-8">
                    <Shield className="w-6 h-6 text-indigo-400" />
                    <span className="text-xs font-black text-white/60 uppercase tracking-widest">Security Core</span>
                 </div>
                 <h4 className="text-2xl font-black mb-6">2-Factor Auth is Active</h4>
                 <p className="text-white/60 font-medium text-sm leading-relaxed mb-10">Your account is protected by hardware security keys. Last login from San Jose, CA.</p>
                 <button className="mt-auto flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">
                    Manage Keys <ArrowRight className="w-3.5 h-3.5" />
                 </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
           </div>
        </div>

        {/* Settings Area */}
        <div className="lg:col-span-8 flex flex-col gap-10">
           {/* Financial Export Block */}
           <div className="bg-white/80 backdrop-blur-2xl rounded-[56px] p-12 border border-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-8 h-8 text-indigo-600" />
                    <span className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Full Financial Plan</span>
                 </div>
                 <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter leading-tight">Export 2024 Strategy</h3>
                 <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-md">Generate a comprehensive 15-page PDF document including Monte Carlo forecasts, tax-loss logs, and ESG analysis.</p>
              </div>
              <div className="shrink-0">
                 <button 
                  onClick={handleExport}
                  disabled={isExporting}
                  className={`w-64 h-64 rounded-[60px] flex flex-col items-center justify-center gap-4 transition-all relative overflow-hidden group ${exportComplete ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-white hover:scale-105 active:scale-95 shadow-2xl shadow-gray-900/10'}`}
                 >
                    <AnimatePresence mode="wait">
                       {isExporting ? (
                         <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                            <RefreshCw className="w-12 h-12 animate-spin mb-4" />
                            <span className="text-xs font-black uppercase tracking-widest">Building PDF...</span>
                         </motion.div>
                       ) : exportComplete ? (
                          <motion.div key="complete" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                             <CheckCircle2 className="w-12 h-12 mb-4" />
                             <span className="text-xs font-black uppercase tracking-widest">Plan Ready</span>
                          </motion.div>
                       ) : (
                          <motion.div key="idle" className="flex flex-col items-center">
                             <Download className="w-12 h-12 mb-4 group-hover:translate-y-1 transition-transform" />
                             <span className="text-xs font-black uppercase tracking-widest">Download Plan</span>
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </button>
              </div>
           </div>

           {/* Settings Categories */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Notifications', icon: <Bell />, active: true, items: ['Market Volatility Alerts', 'Goal Milestone Pings', 'Weekly AI Summaries'] },
                { title: 'Data & Privacy', icon: <Eye />, active: false, items: ['Connect Plaid Accounts', 'GDPR Data Deletion', 'External API Access'] },
                { title: 'Integrations', icon: <Zap />, active: true, items: ['Google Sheet Sync', 'Slack Portfolio Bot', 'TaxCloud API'] },
                { title: 'Preferences', icon: <Sparkles />, active: false, items: ['Dark Mode Appearance', 'Currency (USD/PKR)', 'Language (English/Urdu)'] },
              ].map((cat) => (
                <div key={cat.title} className="bg-white/60 p-10 rounded-[48px] border border-white shadow-sm flex flex-col group hover:bg-white transition-all">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors">
                            {cat.icon}
                         </div>
                         <h4 className="text-xl font-black text-gray-900">{cat.title}</h4>
                      </div>
                      {cat.active && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
                   </div>
                   <div className="space-y-4">
                      {cat.items.map(item => (
                         <div key={item} className="flex items-center justify-between group/line cursor-pointer">
                            <span className="text-sm font-bold text-gray-500 group-hover/line:text-gray-900 transition-colors">{item}</span>
                            <div className="w-8 h-4 bg-gray-200 rounded-full relative p-1 flex items-center">
                               <div className="w-2.5 h-2.5 bg-white rounded-full translate-x-0 group-hover/line:translate-x-full transition-transform" />
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
