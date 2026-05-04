import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { 
  Wallet, 
  ArrowRight, 
  Sparkles, 
  LayoutGrid, 
  TrendingUp, 
  CreditCard, 
  Target, 
  BrainCircuit,
  Zap,
  Info,
  RefreshCw,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

interface Split {
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  description: string;
}

export const PaycheckSplitterPage = () => {
  const [income, setIncome] = useState(8500);
  const [bills, setBills] = useState(40); // 50%
  const [savings, setSavings] = useState(25); // 20%
  const [investments, setInvestments] = useState(25); // 10%
  const [wants, setWants] = useState(10); // 20%
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [pulseBonus, setPulseBonus] = useState(0);

  useEffect(() => {
    const controls = animate(0, 4, {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
      onUpdate: (latest) => setPulseBonus(latest)
    });
    return () => controls.stop();
  }, []);

  const totalPercent = bills + savings + investments + wants;
  
  const data: Split[] = [
    { name: 'Bills & Needs', value: bills, color: '#4285F4', icon: <CreditCard className="w-5 h-5" />, description: 'Rent, food, utilities, etc.' },
    { name: 'Savings', value: savings, color: '#A3E635', icon: <Wallet className="w-5 h-5" />, description: 'Emergency fund & cash' },
    { name: 'Investments', value: investments, color: '#6366f1', icon: <TrendingUp className="w-5 h-5" />, description: 'Stocks, mutual funds, 401k' },
    { name: 'Lifestyle/Wants', value: wants, color: '#f43f5e', icon: <PieChartIcon className="w-5 h-5" />, description: 'Entertainment, dining, travel' },
  ];

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      // "RL Optimized" recommendation (e.g., 50/20/30 split or adaptive based on current income)
      setBills(45);
      setSavings(20);
      setInvestments(25);
      setWants(10);
      setIsOptimizing(false);
      setShowRecommendation(true);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col gap-10 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-2 tracking-tight">Paycheck Splitter</h1>
          <p className="text-gray-500 font-medium text-lg">Adaptive Budgeting • RL-Powered Resource Allocation</p>
        </div>
        <button 
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-[24px] font-bold shadow-xl shadow-gray-900/20 active:scale-95 transition-all overflow-hidden relative group"
        >
          {isOptimizing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Analyzing Strategy...</span>
            </>
          ) : (
            <>
              <BrainCircuit className="w-5 h-5" />
              <span>Get AI Recommendation</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12">
            <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] p-10 border border-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="flex-1 max-w-xl">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Total Net Pay</h3>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-6xl font-black text-gray-900 tracking-tighter leading-none">${income.toLocaleString()}</span>
                    <button className="p-2 bg-gray-50 rounded-xl text-gray-300 hover:text-gray-600 transition-colors">
                       <LayoutGrid className="w-5 h-5" />
                    </button>
                  </div>
                  <input 
                    type="range" min="1000" max="50000" step="100" 
                    value={income} 
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full h-2.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-600 mb-2"
                  />
                  <div className="flex justify-between text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                    <span>$1k</span>
                    <span>$50k</span>
                  </div>
               </div>
               
               <div className="flex-1 flex gap-6 md:justify-end">
                  <div className="bg-emerald-50 px-8 py-6 rounded-[32px] border border-emerald-100">
                    <div className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-1">Savings Goal</div>
                    <div className="text-2xl font-black text-emerald-600">+${(income * (savings / 100)).toLocaleString()}</div>
                  </div>
                  <div className="bg-indigo-50 px-8 py-6 rounded-[32px] border border-indigo-100">
                    <div className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-1">Investment Feed</div>
                    <div className="text-2xl font-black text-indigo-600">+${(income * (investments / 100)).toLocaleString()}</div>
                  </div>
               </div>
            </div>
        </div>

        {/* Sliders Area */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[44px] p-10 border border-white shadow-sm flex flex-col gap-8 h-full">
            <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-2">
               <h3 className="text-xl font-black text-gray-900 tracking-tight">Manual Control</h3>
               <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${Math.abs(totalPercent - 100) < 0.1 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                 {totalPercent}% Total
               </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center group cursor-help">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Bills & Needs</span>
                   </div>
                   <span className="text-lg font-black text-blue-600">{bills}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={bills} 
                  onChange={(e) => setBills(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-lime-50 flex items-center justify-center text-lime-600">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Savings</span>
                   </div>
                   <span className="text-lg font-black text-lime-600">{savings}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={savings} 
                  onChange={(e) => setSavings(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-lime-400"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Investments</span>
                   </div>
                   <span className="text-lg font-black text-indigo-600">{investments}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={investments} 
                  onChange={(e) => setInvestments(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                        <PieChartIcon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Lifestyle</span>
                   </div>
                   <span className="text-lg font-black text-rose-500">{wants}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={wants} 
                  onChange={(e) => setWants(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>

            <div className="mt-auto px-6 py-4 bg-gray-50 rounded-2xl flex items-center gap-4">
                <Info className="w-4 h-4 text-gray-500" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-loose">
                   Your split is {(totalPercent < 100) ? 'underspecified' : (totalPercent > 100) ? 'over 100%' : 'perfectly balanced'}. 
                </p>
            </div>
          </div>
        </div>

        {/* Visual & Recommendation Area */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] p-10 border border-white shadow-sm flex flex-col items-center">
             <div className="w-full flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Allocation Visualization</h3>
                <Zap className="w-5 h-5 text-lime-400" />
             </div>
             
             <div className="relative w-full aspect-square max-w-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      innerRadius={110 - pulseBonus * 0.5}
                      outerRadius={160 + pulseBonus}
                      cx="50%"
                      cy="50%"
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      animationDuration={1000}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <div className="flex items-baseline gap-1">
                      <span className="text-xs font-black text-gray-500 tracking-widest uppercase">Net</span>
                      <span className="text-5xl font-black text-gray-900 tracking-tighter">${income.toLocaleString()}</span>
                   </div>
                   <div className="flex items-center gap-2 mt-3 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-lime-500" />
                      <span className="text-xs font-black text-gray-600 uppercase tracking-widest">Optimized Hub</span>
                   </div>
                </div>
             </div>

             <div className="w-full grid grid-cols-2 gap-4 mt-12">
               {data.map((item) => (
                 <div key={item.name} className="flex flex-col p-6 rounded-3xl border border-gray-50 bg-gray-50/30">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{item.name}</span>
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    </div>
                    <div className="text-2xl font-black text-gray-900">${(income * (item.value / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                 </div>
               ))}
             </div>
          </div>

          <AnimatePresence>
            {showRecommendation && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="bg-indigo-600 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/40"
              >
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                   <div className="w-24 h-24 bg-white/20 rounded-[40px] flex items-center justify-center backdrop-blur-md shrink-0 border border-white/20">
                      <BrainCircuit className="w-12 h-12 text-white" />
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                         <span className="text-xs font-black uppercase tracking-[0.4em] text-white/70">Tactical Recommendation</span>
                         <Sparkles className="w-4 h-4 text-lime-400" />
                      </div>
                      <h4 className="text-2xl font-black mb-4 tracking-tight leading-tight">The 50/30/20 Rule: Core Resilience Model</h4>
                      <p className="text-white/60 font-medium leading-relaxed mb-8">
                         Based on current inflation indices and your savings goals, I've adjusted your Bills to 45% (−5%) and redirected the excess towards <span className="text-lime-400 font-extrabold uppercase">High-Yield Growth</span>.
                      </p>
                      <div className="flex gap-4">
                         <button 
                          onClick={() => setShowRecommendation(false)}
                          className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all"
                         >
                            Confirm Split
                         </button>
                         <button className="bg-white/10 text-white px-8 py-3 rounded-2xl font-bold hover:bg-white/20 transition-all">
                            Simulate Impact
                         </button>
                      </div>
                   </div>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
