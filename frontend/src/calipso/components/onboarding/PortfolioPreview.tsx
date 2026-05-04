import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  TrendingUp, 
  Leaf, 
  Wallet, 
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { RiskProfile } from './RiskQuiz';

interface PortfolioPreviewProps {
  riskProfile: RiskProfile;
  onConfirm: () => void;
  onRetake: () => void;
}

interface Allocation {
  symbol: string;
  name: string;
  weight: number;
  category: string;
  amount: number;
}

interface PortfolioData {
  holdings: Allocation[];
  expectedReturn: string;
  esgScore: number;
  totalAmount: number;
}

export const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ riskProfile, onConfirm, onRetake }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      const equityWeight = riskProfile.score >= 75 ? 0.62 : riskProfile.score >= 55 ? 0.48 : 0.32;
      const bondWeight = riskProfile.score >= 75 ? 0.16 : riskProfile.score >= 55 ? 0.26 : 0.42;
      const goldWeight = 0.12;
      const cashWeight = 1 - equityWeight - bondWeight - goldWeight;

      await new Promise(resolve => setTimeout(resolve, 900));
      setData({
        holdings: [
          { symbol: 'VTI', name: 'US Total Market ETF', weight: equityWeight * 0.56, category: 'ETF', amount: 1000 * equityWeight * 0.56 },
          { symbol: 'KSE', name: 'Pakistan Equity Basket', weight: equityWeight * 0.44, category: 'ETF', amount: 1000 * equityWeight * 0.44 },
          { symbol: 'BND', name: 'Global Bond Index', weight: bondWeight, category: 'Bond', amount: 1000 * bondWeight },
          { symbol: 'GLD', name: 'Gold Stability Sleeve', weight: goldWeight, category: 'Commodity', amount: 1000 * goldWeight },
          { symbol: 'CASH', name: 'Cash Reserve Buffer', weight: cashWeight, category: 'Cash', amount: 1000 * cashWeight },
        ],
        expectedReturn: riskProfile.score >= 75 ? '11.8%' : riskProfile.score >= 55 ? '8.6%' : '6.2%',
        esgScore: riskProfile.score >= 55 ? 84 : 78,
        totalAmount: 1000,
      });
      setLoading(false);
    };
    fetchPreview();
  }, [riskProfile.score]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-mesh z-[400] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Generating Your Custom Blueprint</h2>
        <p className="text-gray-500 font-bold mt-2">Aligning assets with your financial DNA...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-mesh z-[400] flex flex-col items-center justify-center overflow-y-auto py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white/40 backdrop-blur-3xl rounded-[64px] border border-white/60 p-8 md:p-16 shadow-2xl relative"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-3">Investment Blueprint</h2>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-4">
              Your Recommended <span className="text-primary">Portfolio</span>
            </h1>
            <p className="text-gray-500 font-bold text-lg max-w-lg">
              Based on your <span className="text-gray-900">{riskProfile.category}</span> profile, we've optimized this mix for $1,000.
            </p>
          </div>
          <button 
            onClick={onRetake}
            className="flex items-center gap-3 px-6 py-4 bg-white/60 hover:bg-white rounded-3xl border border-white/80 transition-all text-xs font-bold text-gray-600 hover:text-primary group w-fit"
          >
            <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
            Retake Risk Quiz
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-white/60 p-8 rounded-[40px] border border-white/80">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 mb-6 font-black translate-y-[-2px]">
                 <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Proj. Annual Return</h3>
              <p className="text-3xl font-black text-gray-900">{data.expectedReturn}</p>
           </div>
           
           <div className="bg-white/60 p-8 rounded-[40px] border border-white/80">
              <div className="w-10 h-10 bg-lime-500/10 rounded-xl flex items-center justify-center text-lime-600 mb-6 font-black translate-y-[-2px]">
                 <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">ESG Impact Score</h3>
              <p className="text-3xl font-black text-gray-900">{data.esgScore}%</p>
           </div>

           <div className="bg-white/60 p-8 rounded-[40px] border border-white/80">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 mb-6 font-black translate-y-[-2px]">
                 <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Investor Class</h3>
              <p className="text-2xl font-black text-gray-900">{riskProfile.category}</p>
           </div>
        </div>

        {/* Allocation List */}
        <div className="space-y-4 mb-16">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest ml-4 mb-6">Asset Breakdown</h3>
          {data.holdings.map((asset, idx) => (
            <motion.div 
              key={asset.symbol}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/60 hover:bg-white rounded-[32px] border border-white/80 hover:border-primary/20 transition-all gap-4"
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${asset.category === 'ETF' ? 'bg-indigo-500 text-white' : 'bg-amber-500 text-white'}`}>
                  {asset.symbol[0]}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl font-black text-gray-900">{asset.symbol}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 bg-gray-100 rounded-lg text-gray-500 uppercase tracking-tighter">{asset.category}</span>
                  </div>
                  <span className="text-gray-500 font-bold text-sm">{asset.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-8 md:text-right">
                <div>
                  <span className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Weight</span>
                  <span className="text-lg font-black text-gray-900">{(asset.weight * 100).toFixed(0)}%</span>
                </div>
                <div className="w-32">
                   <span className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Value</span>
                   <span className="text-lg font-black text-primary">${asset.amount.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-900 rounded-[48px] p-10 flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-white">
                 <Wallet className="w-7 h-7" />
              </div>
              <div>
                 <h4 className="text-white font-black text-xl mb-1">Ready to activate?</h4>
                 <p className="text-white/50 font-bold text-sm">Add funds safely via our secure bridge.</p>
              </div>
           </div>
           <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className="bg-primary text-white px-12 py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs flex items-center gap-4 shadow-2xl shadow-primary/30 w-full md:w-auto justify-center"
           >
              Confirm & Deposit
              <ChevronRight className="w-4 h-4" />
           </motion.button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
           <AlertCircle className="w-4 h-4 text-gray-500" />
           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              This is a proposed simulation. Investment involves risk.
           </p>
        </div>
      </motion.div>
    </div>
  );
};
