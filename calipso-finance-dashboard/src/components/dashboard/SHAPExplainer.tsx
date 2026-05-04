import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  AlertCircle, 
  ChevronDown, 
  ArrowRight,
  Globe,
  Zap,
  Info
} from 'lucide-react';

interface Factor {
  key: string;
  title: string;
  desc: string;
  ur: string;
  value: number;
  direction: 'positive' | 'concern' | 'negative';
  icon: string;
}

interface WhatIf {
  scenario: string;
  impact: string;
}

interface ShapData {
  symbol: string;
  confidence: number;
  factors: Factor[];
  summary: string;
  summary_ur: string;
  what_if: WhatIf[];
}

const ASSETS = ['VTI', 'BND', 'OGDC', 'ENGRO', 'LUCK'];

// ─── Single Factor Card ──────────────────────────────────────────────────────
interface FactorCardProps {
  factor: Factor;
  showUrdu: boolean;
}

const FactorCard: React.FC<FactorCardProps> = ({ factor, showUrdu }) => {
  const isPositive = factor.direction === "positive";
  const isConcern = factor.direction === "concern";

  const statusColors = {
    positive: {
      bg: "bg-gradient-to-br from-emerald-50/80 via-emerald-50/40 to-white",
      border: "border-emerald-100/60",
      icon: "bg-emerald-100 text-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.15)]",
      bar: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
      dot: "bg-emerald-500",
      text: "text-emerald-900"
    },
    concern: {
      bg: "bg-gradient-to-br from-amber-50/80 via-amber-50/40 to-white",
      border: "border-amber-100/60",
      icon: "bg-amber-100 text-amber-700 shadow-[0_0_20px_rgba(245,158,11,0.15)]",
      bar: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]",
      dot: "bg-amber-500",
      text: "text-amber-900"
    },
    negative: {
      bg: "bg-gradient-to-br from-rose-50/80 via-rose-50/40 to-white",
      border: "border-rose-100/60",
      icon: "bg-rose-100 text-rose-700 shadow-[0_0_20px_rgba(244,63,94,0.15)]",
      bar: "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]",
      dot: "bg-rose-500",
      text: "text-rose-900"
    }
  }[factor.direction];

  const statusIcon = isPositive ? "✅" : isConcern ? "⚠️" : "❌";
  const barWidth = Math.min(Math.abs(factor.value) * 200, 100);

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className={`relative group border rounded-[32px] p-6 mb-4 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1 ${statusColors.bg} ${statusColors.border}`}
    >
      <div className="flex items-start gap-5">
        {/* Icon with Ring and Glow */}
        <div className="relative shrink-0">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-500 group-hover:scale-110 ${statusColors.icon}`}>
            {factor.icon}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs shadow-lg ${statusColors.dot} text-white`}>
            {statusIcon}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-base font-black tracking-tight ${statusColors.text}`}>
              {factor.title}
            </h4>
            <span className={`text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${statusColors.icon} bg-opacity-50`}>
              {factor.direction === 'positive' ? 'Benefit' : 'Consideration'}
            </span>
          </div>

          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4 max-w-[90%]">
            {factor.desc}
          </p>

          <AnimatePresence>
            {showUrdu && factor.ur && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-gray-600 leading-relaxed mb-4 text-right font-medium bg-white/40 p-4 rounded-2xl border border-white/50" dir="rtl">
                  {factor.ur}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Impact Visualizer */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Weighting Impact</span>
              <span className="text-xs font-black text-gray-600 uppercase tracking-widest">
                {barWidth > 66 ? "Critical Factor" : barWidth > 40 ? "Major Factor" : "Contribution"}
              </span>
            </div>
            <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className={`h-full rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] ${statusColors.bar} transition-all group-hover:brightness-110`}
              />
              {/* Scale marks */}
              <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-20">
                {[...Array(5)].map((_, i) => <div key={i} className="w-[1px] h-full bg-black/20" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const SHAPExplainer = () => {
  const [selectedAsset, setSelectedAsset] = useState('VTI');
  const [data, setData] = useState<ShapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUrdu, setShowUrdu] = useState(false);
  const [expandedWhatIf, setExpandedWhatIf] = useState<number | null>(null);

  useEffect(() => {
    const fetchShapData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/shap/${selectedAsset}`);
        if (!response.ok) throw new Error('Failed to fetch AI explanation');
        const jsonData = await response.json();
        await new Promise(r => setTimeout(r, 1500));
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchShapData();
  }, [selectedAsset]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white/40 rounded-[64px] border border-white min-h-[600px] backdrop-blur-xl">
         <div className="relative mb-10">
           <div className="w-20 h-20 border-[6px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center">
             <BrainCircuit className="w-8 h-8 text-indigo-600 animate-pulse" />
           </div>
         </div>
         <div className="text-center space-y-3">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.3em]">Synthesizing Insights</h3>
            <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-xs max-w-[200px] leading-relaxed mx-auto">AI is breaking down trillions of data points to explain your recommendation...</p>
         </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-rose-50/50 rounded-[64px] border border-rose-100/50 text-center backdrop-blur-lg">
        <div className="w-20 h-20 rounded-3xl bg-rose-100 flex items-center justify-center text-rose-500 mb-8 shadow-xl shadow-rose-200">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-rose-900 mb-2">Analysis Interrupted</h3>
        <p className="text-rose-700/60 font-medium mb-10 max-w-sm mx-auto">{error}</p>
        <button onClick={() => setSelectedAsset(selectedAsset)} className="px-10 py-5 bg-rose-500 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all">Retry Computation</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="flex flex-col gap-12 w-full max-w-6xl mx-auto py-4"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="max-w-2xl">
          <motion.div 
            variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-14 h-14 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)]">
               <BrainCircuit className="w-8 h-8" />
            </div>
            <div>
               <span className="text-xs font-black text-indigo-500 uppercase tracking-[0.4em] mb-1 block">Decision Intelligence</span>
               <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">Why {selectedAsset}?</h2>
            </div>
          </motion.div>
          <motion.p 
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="text-gray-500 font-medium text-lg lg:text-xl leading-relaxed"
          >
            Our AI analyzed 247 portfolio vectors to explain its confidence in this asset preference.
          </motion.p>
        </div>
        
        <motion.button
          variants={{ hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
          onClick={() => setShowUrdu(!showUrdu)}
          className={`flex items-center gap-3 px-8 py-4 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95 border group ${
            showUrdu ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white text-indigo-600 border-gray-100 hover:bg-indigo-50'
          }`}
        >
          <Globe className={`w-4 h-4 transition-transform duration-700 ${showUrdu ? 'rotate-180' : 'group-hover:rotate-45'}`} />
          {showUrdu ? "View in English" : "اردو میں دیکھیں"}
        </motion.button>
      </div>

      {/* Asset Selector - Premium Pill Slider Style */}
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="relative bg-white/50 backdrop-blur-xl p-2 rounded-[32px] border border-white flex gap-2 overflow-x-auto scrollbar-hide shadow-inner shadow-gray-100/50"
      >
        {ASSETS.map(asset => (
          <button
            key={asset}
            onClick={() => setSelectedAsset(asset)}
            className={`relative px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shrink-0 ${
              selectedAsset === asset 
                ? 'bg-gray-900 text-white shadow-2xl shadow-black/20' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-white/80'
            }`}
          >
            {asset}
            {selectedAsset === asset && (
              <motion.div 
                layoutId="activeAsset"
                className="absolute inset-0 rounded-[24px] bg-indigo-600 -z-10 opacity-10"
              />
            )}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Factors Column */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <div className="bg-white/40 backdrop-blur-sm rounded-[56px] p-10 lg:p-14 border border-white/60 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-12 relative z-10">
               <div className="space-y-1">
                 <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Attribution Matrix</h3>
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Calculated weighting of individual factors</p>
               </div>
               <div className="flex flex-col items-end">
                  <div className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-1">AI Confidence</div>
                  <div className={`text-xl font-black tracking-tight ${data.confidence >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {data.confidence}%
                  </div>
               </div>
            </div>

            <div className="relative z-10">
              <div className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-emerald-500/20 via-emerald-500/5 to-transparent" />
                Supporting Recommendations
              </div>
              
              {data.factors.filter(f => f.direction === 'positive').map((f, i) => (
                <FactorCard key={i} factor={f} showUrdu={showUrdu} />
              ))}

              <div className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mt-16 mb-6 flex items-center gap-3">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-amber-500/20 via-amber-500/5 to-transparent" />
                Considerations
              </div>
              
              {data.factors.filter(f => f.direction !== 'positive').map((f, i) => (
                <FactorCard key={i} factor={f} showUrdu={showUrdu} />
              ))}
            </div>

            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* AI Summary Sidebar */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-10">
          {/* Summary Card with Glassmorphism */}
          <motion.div 
            variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
            className="bg-gray-900 rounded-[56px] p-12 lg:p-14 text-white shadow-[0_50px_100px_rgba(0,0,0,0.2)] relative overflow-hidden group border border-white/5"
          >
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/10 flex items-center justify-center">
                    <Zap className="w-7 h-7 text-lime-400 fill-lime-400/20" />
                  </div>
                  <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.3em] text-indigo-400">
                    Executive Summary
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-2xl lg:text-3xl font-bold leading-[1.2] tracking-tighter hover:text-lime-50 transition-colors cursor-default">
                    "{data.summary}"
                  </p>
                  
                  <AnimatePresence>
                    {showUrdu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="relative"
                      >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <p className="text-xl lg:text-2xl leading-relaxed text-indigo-100/80 text-right font-medium pt-8" dir="rtl">
                          {data.summary_ur}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
             </div>
             {/* Dynamic Mesh Gradient Decoration */}
             <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none group-hover:scale-125 transition-transform duration-1000 ease-out" />
             <div className="absolute top-20 left-20 w-32 h-32 bg-lime-400/10 rounded-full blur-[60px] pointer-events-none" />
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
          </motion.div>

          {/* What If Scenarios - Modern Cards */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-6">
              <h5 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em]">Forward Scenarios</h5>
              <div className="h-px flex-1 bg-gray-100 mx-6" />
            </div>

            {data.what_if.map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                className="bg-white/70 backdrop-blur-xl rounded-[40px] border border-white overflow-hidden group hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500"
              >
                <button 
                  onClick={() => setExpandedWhatIf(expandedWhatIf === idx ? null : idx)}
                  className="w-full p-10 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-base font-black text-gray-800 tracking-tight leading-tight">{item.scenario}</span>
                  </div>
                  <ChevronDown className={`shrink-0 w-6 h-6 text-gray-300 transition-transform duration-700 ease-in-out ${expandedWhatIf === idx ? 'rotate-180 text-indigo-600' : 'group-hover:text-gray-600'}`} />
                </button>
                <AnimatePresence>
                  {expandedWhatIf === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-indigo-50/20"
                    >
                      <div className="px-10 pb-10 pt-2">
                        <motion.div 
                           initial={{ x: -10, opacity: 0 }}
                           animate={{ x: 0, opacity: 1 }}
                           className="p-8 bg-white rounded-[32px] border border-indigo-100/50 shadow-sm flex gap-5"
                        >
                           <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                              <ArrowRight className="w-4 h-4 text-emerald-600" />
                           </div>
                           <p className="text-sm font-semibold text-gray-600 leading-relaxed italic pr-4">
                             {item.impact}
                           </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Footer Card */}
          <div className="p-10 bg-white rounded-[40px] border border-gray-100 text-center shadow-sm">
            <Info className="w-6 h-6 text-indigo-100 mx-auto mb-4" />
            <p className="text-xs font-black text-gray-400 leading-relaxed uppercase tracking-[0.2em] px-4">
              Intelligence generated via FinAI Core. For informational transparency. Not investment guidance.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

