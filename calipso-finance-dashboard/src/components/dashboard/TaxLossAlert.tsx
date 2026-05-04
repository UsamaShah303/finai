import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, TrendingDown, ArrowRight, X, Info, Zap, ChevronDown, Globe } from 'lucide-react';

interface Holding {
  symbol: string;
  avg_buy_price: number;
  current_price: number;
  shares: number;
  market: string;
  pkr_loss?: number;
  pkr_tax_saved?: number;
}

interface HarvestResult {
  sold: string;
  bought: string;
  loss_harvested: number;
  pkr_loss: number;
  tax_saved: number;
  pkr_tax_saved: number;
  new_holding: string;
}

interface TaxLossAlertProps {
  holding: Holding;
  onHarvest: () => void;
  onDismiss: () => void;
}

const REPLACEMENTS: Record<string, string> = {
  "VTI": "SCHB",
  "VOO": "IVV",
  "VEA": "IEFA",
  "BND": "AGG",
  "GLD": "IAU",
  "OGDC": "PPL",
  "ENGRO": "FATIMA",
  "LUCK": "DGKC",
  "HBL": "MCB",
};

export const TaxLossAlert: React.FC<TaxLossAlertProps> = ({ holding, onHarvest, onDismiss }) => {
  const [loading, setLoading] = useState(false);
  const [harvested, setHarvested] = useState(false);
  const [result, setResult] = useState<HarvestResult | null>(null);
  const [explanationLevel, setExplanationLevel] = useState(0); // 0: summary, 1: how, 2: tell me more
  const [lang, setLang] = useState<'en' | 'ur'>('en');

  const lossPct = ((holding.current_price - holding.avg_buy_price) / holding.avg_buy_price) * 100;
  
  const explanations = {
    en: "Selling now and buying a similar stock lets you use this loss to reduce your tax bill this year.",
    ur: "ابھی بیچنے اور اسی جیسا اسٹاک خریدنے سے آپ اس نقصان کو اس سال اپنا ٹیکس کم کرنے کے لیے استعمال کر سکتے ہیں۔"
  };

  const handleHarvest = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/tax-loss-harvest', { symbol: holding.symbol });
      setResult(res.data);
      setHarvested(true);
      setTimeout(() => {
        onHarvest();
      }, 5000);
    } catch (err) {
      console.error('Harvest failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (harvested && result) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-50/90 backdrop-blur-xl border border-emerald-100 rounded-[40px] p-8 shadow-2xl shadow-emerald-500/10"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-200">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-emerald-900 tracking-tight leading-none mb-1">Smart Strategy Applied</h3>
            <p className="text-emerald-800 text-xs font-black uppercase tracking-[0.2em]">Optimization Complete</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 bg-white/60 rounded-3xl border border-white/50 text-center">
            <p className="text-xs font-black text-emerald-900 uppercase tracking-widest mb-3">Before</p>
            <p className="text-lg font-black text-emerald-900 leading-none">{result.sold}</p>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Original Holding</p>
          </div>
          <div className="p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 text-center">
            <p className="text-xs font-black text-emerald-900 uppercase tracking-widest mb-3">After</p>
            <p className="text-lg font-black text-emerald-900 leading-none">{result.bought}</p>
            <p className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-widest">New Active Position</p>
          </div>
        </div>

        <div className="space-y-4 p-8 bg-white/40 rounded-[32px] border border-white/60 mb-8">
           <div className="flex justify-between items-end border-b border-emerald-100 pb-4">
              <div>
                <p className="text-xs font-black text-emerald-900 uppercase tracking-[0.3em] mb-1">Loss Booked</p>
                <p className="text-xl font-black text-rose-600">PKR {result.pkr_loss?.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-emerald-900 uppercase tracking-[0.3em] mb-1">Tax Saved</p>
                <p className="text-2xl font-black text-emerald-600">PKR {result.pkr_tax_saved?.toLocaleString()}</p>
              </div>
           </div>
           <p className="text-xs font-semibold text-emerald-800/80 leading-relaxed">
             You are still invested with similar market exposure. In a real portfolio, this PKR {result.pkr_tax_saved?.toLocaleString()} would stay in your pocket instead of going to FBR.
           </p>
        </div>

        <div className="flex items-center justify-center p-4">
           <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.4em]">FinAI Simulation Engine</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] border border-gray-100 p-12 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 relative group overflow-hidden"
    >
      <div className="absolute top-8 right-8">
        <button onClick={onDismiss} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-200 hover:text-gray-400 hover:bg-gray-50 transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-12 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl font-black text-gray-900 tracking-tight">{holding.symbol}</span>
            <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-black rounded-lg uppercase tracking-tight">
              {lossPct.toFixed(1)}% Down
            </span>
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Potential Optimization Found</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 mb-12">
        <div className="p-10 bg-white group-hover:bg-gray-50/50 transition-colors">
           <p className="text-xs font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Bookable Loss</p>
           <p className="text-3xl font-black text-gray-900 tabular-nums">PKR {holding.pkr_loss?.toLocaleString()}</p>
        </div>
        <div className="p-10 bg-white group-hover:bg-indigo-50/10 transition-colors">
           <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-3">Net Tax Saving</p>
           <p className="text-3xl font-black text-emerald-600 tabular-nums">PKR {holding.pkr_tax_saved?.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
           <div className="flex gap-4">
              <button 
                onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
                className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2"
              >
                <Globe className="w-3 h-3" />
                {lang === 'en' ? 'اردو' : 'English'}
              </button>
           </div>
           
           <button 
             onClick={() => setExplanationLevel(explanationLevel === 1 ? 0 : 1)}
             className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center gap-2"
           >
             <Info className="w-3 h-3" />
             {explanationLevel === 1 ? "Simple View" : "Detailed Play"}
           </button>
        </div>

        <div className={`p-8 bg-gray-50/50 rounded-3xl border border-gray-100/50 ${lang === 'ur' ? 'text-right' : ''}`} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
           <p className="text-sm font-medium text-gray-700 leading-relaxed italic">
             "{explanations[lang]}"
           </p>

           <AnimatePresence>
             {explanationLevel === 1 && (
               <motion.div 
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: "auto", opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden"
               >
                 <div className="pt-8 mt-8 border-t border-gray-100 space-y-4">
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Action Required</p>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed">
                      Liquidate <span className="text-gray-900 font-black">{holding.symbol}</span> and immediately deploy capital into <span className="text-gray-900 font-black">{REPLACEMENTS[holding.symbol] || 'a similar sector tracker'}</span>. This locks in the loss for FBR reporting while maintaining your market position.
                    </p>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      <button
        onClick={handleHarvest}
        disabled={loading}
        className="w-full py-6 bg-gray-900 hover:bg-black disabled:bg-gray-100 text-white rounded-3xl font-black uppercase tracking-[0.4em] text-xs transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-gray-900/10 active:scale-[0.98]"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Zap className="w-4 h-4 text-emerald-400 fill-current" />
            <span>Execute Strategy Plan</span>
          </>
        )}
      </button>
      
      <p className="mt-6 text-xs font-black text-gray-400 text-center uppercase tracking-[0.3em]">
        Verified Simulation • FBR Listed Securities Rule 37A
      </p>
    </motion.div>
  );
};
