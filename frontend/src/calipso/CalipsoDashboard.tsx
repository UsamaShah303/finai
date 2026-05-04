/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus, 
  Search, 
  Bell, 
  MoreHorizontal, 
  Home,
  LayoutGrid,
  CreditCard,
  Target,
  User,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Mic,
  Wallet,
  CheckCircle2,
  PieChart as PieChartIcon,
  CloudLightning,
  TrendingUp,
  BrainCircuit,
  X,
  Bookmark,
  Lightbulb,
  Sparkles,
  ShieldCheck,
  Leaf,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
  Flag,
  Info,
  AlertTriangle,
  Command,
  BookOpen,
  Zap,
  ChevronDown,
  Palette,
  Car,
  Plane,
  GraduationCap,
  HeartPulse,
  Building2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { SHAPExplainer } from './components/dashboard/SHAPExplainer';
import { TaxLossAlert } from './components/dashboard/TaxLossAlert';
import { PortfolioComparison } from './components/dashboard/PortfolioComparison';
import { ForecastPage } from './components/dashboard/ForecastPage';
import { PaycheckSplitterPage } from './components/dashboard/PaycheckSplitterPage';
import { ESGPage } from './components/dashboard/ESGPage';
import { SettingsPage } from './components/dashboard/SettingsPage';
import { RiskQuiz, RiskProfile } from './components/onboarding/RiskQuiz';
import { PortfolioPreview } from './components/onboarding/PortfolioPreview';
import { DepositModal } from './components/dashboard/DepositModal';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

// --- Types ---

interface StatData {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
}

interface GoalData {
  id: string;
  label: string;
  progress: number;
  amount: string;
  icon: React.ReactNode;
  iconBg: string;
  color: string;
}

// --- Mock Data ---

const EXPENSE_DATA = [
  { name: 'Jan', value: 3000 },
  { name: 'Feb', value: 7000 },
  { name: 'Mar', value: 4500 },
  { name: 'Apr', value: 7560 },
  { name: 'May', value: 5000 },
  { name: 'Jun', value: 4800 },
];

const INVESTMENT_DATA = [
  { name: 'Mutual Fund', value: 1200, color: '#3B82F6', change: '+3.2%' },
  { name: 'Stocks', value: 7250, color: '#A3E635', change: '+12.5%' },
  { name: 'Property Investment', value: 1550, color: '#60A5FA', change: '-1.8%' },
];

const AI_TIPS = [
  {
    id: 1,
    title: "Increase Mutual Fund allocation by 5% to reduce portfolio risk.",
    explanation: "Our analysis shows that your current equity concentration is slightly higher than your stated 'Moderate' risk profile. By shifting 5% from individual high-volatility stocks into a broad-market mutual fund, you can achieve a more efficient frontier. This adjustment reduces expected maximum drawdown by 12% while keeping your target returns within 0.5% of current projections.",
    impact: "+$450/y",
    icon: <PieChartIcon className="w-4 h-4 text-lime-400" />
  },
  {
    id: 2,
    title: "Potential for Tax-Loss Harvesting in your 'ENGRO' holding.",
    explanation: "The 'ENGRO' position has declined by 8.5%. By selling now, you can lock in a capital loss to offset gains elsewhere in your portfolio, potentially saving you significantly on taxes. Our algorithm suggests reinvesting the proceeds into the 'M-Fund' to maintain exposure to the sector while capturing the tax benefit.",
    impact: "+$1,200 Tax Save",
    icon: <Leaf className="w-4 h-4 text-lime-400" />
  },
  {
    id: 3,
    title: "Optimize Car Goal: Increase monthly contribution by $50.",
    explanation: "You are currently 68% of the way to your car goal. Increasing your monthly contribution by just $50 will move your expected completion date up by 3 months. This coincides with historically favorable end-of-year dealership promotions, potentially saving you an additional 5-10% on the vehicle purchase price.",
    impact: "3 Months Early",
    icon: <Target className="w-4 h-4 text-lime-400" />
  }
];

const GOALS: GoalData[] = [
  { id: '1', label: 'Car', progress: 68, amount: '$1,000', icon: <Car className="w-4 h-4" />, iconBg: 'bg-blue-50', color: '#3B82F6' },
  { id: '2', label: 'House', progress: 22, amount: '$45,000', icon: <Building2 className="w-4 h-4" />, iconBg: 'bg-lime-50', color: '#A3E635' },
  { id: '3', label: 'Vacation', progress: 92, amount: '$1,000', icon: <Plane className="w-4 h-4" />, iconBg: 'bg-emerald-50', color: '#10B981' },
  { id: '4', label: 'Education', progress: 35, amount: '$21,000', icon: <GraduationCap className="w-4 h-4" />, iconBg: 'bg-orange-50', color: '#F97316' },
  { id: '5', label: 'Health', progress: 24, amount: '$15,000', icon: <HeartPulse className="w-4 h-4" />, iconBg: 'bg-rose-50', color: '#F43F5E' },
];

// --- Components ---

const StatCard = ({ label, value, change, trend, active = false }: StatData & { active?: boolean }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="bg-white rounded-[32px] p-6 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-shadow flex flex-col justify-between h-44 cursor-pointer"
  >
    <div>
      <p className="text-gray-500 text-xs font-semibold mb-2">{label}</p>
      <h3 className="text-3xl font-bold text-gray-900 leading-tight">{value}</h3>
    </div>
    <div className="flex items-center justify-between">
      <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-[#A3E635]' : 'text-red-500'}`}>
        {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        {change}
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-primary text-white' : 'bg-gray-50 text-primary'}`}>
        <ArrowUpRight className="w-5 h-5" />
      </div>
    </div>
  </motion.div>
);

function GoalItem({ goal }: { goal: GoalData, key?: string | number }) {
  return (
    <div className="flex items-center gap-4 py-2.5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary shrink-0 ${goal.iconBg}`}>
        {goal.icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold text-gray-800">{goal.label}</span>
          <div className="flex flex-col items-end leading-none">
            <span className="text-sm font-bold text-gray-900">{goal.progress}%</span>
            <span className="text-xs text-gray-500 font-bold mt-0.5">{goal.amount}</span>
          </div>
        </div>
        <div className="h-1.5 w-full bg-gray-100/50 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${goal.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ backgroundColor: goal.color }}
            className="h-full rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

interface Theme {
  id: string;
  label: string;
  primary: string;
  primaryLight: string;
  mesh: {
    c1: string;
    c2: string;
    c3: string;
    bg: string;
  };
}

const THEMES: Theme[] = [
  {
    id: 'blue',
    label: 'Calipso Blue',
    primary: '#2563eb',
    primaryLight: '#3b82f6',
    mesh: {
      c1: '#d9f99d',
      c2: '#60a5fa',
      c3: '#3b82f6',
      bg: '#2563eb'
    }
  },
  {
    id: 'emerald',
    label: 'Emerald Forest',
    primary: '#059669',
    primaryLight: '#10b981',
    mesh: {
      c1: '#34d399',
      c2: '#065f46',
      c3: '#10b981',
      bg: '#064e4b'
    }
  },
  {
    id: 'purple',
    label: 'Royal Purple',
    primary: '#7c3aed',
    primaryLight: '#8b5cf6',
    mesh: {
      c1: '#c4b5fd',
      c2: '#4c1d95',
      c3: '#8b5cf6',
      bg: '#5b21b6'
    }
  },
  {
    id: 'rose',
    label: 'Velvet Rose',
    primary: '#e11d48',
    primaryLight: '#fb7185',
    mesh: {
      c1: '#fecdd3',
      c2: '#9f1239',
      c3: '#fb7185',
      bg: '#881337'
    }
  },
  {
    id: 'azure-emerald',
    label: 'Azure Emerald',
    primary: '#00c853',
    primaryLight: '#69f0ae',
    mesh: {
      c1: '#82baff',
      c2: '#00c853',
      c3: '#69f0ae',
      bg: '#1e88e5'
    }
  }
];

const MarketSentimentCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden bg-white/60 rounded-[40px] p-7 border border-white/40 shadow-sm flex items-center gap-8 group cursor-pointer hover:bg-white/80 transition-all"
    >
      {/* Dynamic Animated Background Gradient */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -right-20 w-64 h-64 bg-lime-400 rounded-full blur-[80px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.15, 0.05],
          rotate: [0, -45, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400 rounded-full blur-[80px] pointer-events-none"
      />

      <div className="relative w-24 h-24 shrink-0 z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-180 transition-transform duration-1000 group-hover:rotate-[-160deg]">
          <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="12" fill="transparent" strokeDasharray="125.6" strokeDashoffset="0" strokeLinecap="round" />
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            stroke="var(--primary-color)" 
            strokeWidth={12} 
            fill="transparent" 
            strokeDasharray="125.6" 
            strokeDashoffset={125.6 * 0.3} 
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-xl font-black text-gray-900 leading-none">72</span>
          <span className="text-xs font-black text-gray-500 uppercase tracking-tighter mt-0.5">Index</span>
        </div>
      </div>
      <div className="flex-1 z-10">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Market Sentiment</h4>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-gray-900 leading-none tracking-tight">Bullish Trend</span>
          <motion.div 
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="p-1 px-2.5 bg-lime-400/20 rounded-full shadow-lg shadow-lime-400/10"
          >
             <TrendingUp className="w-4 h-4 text-lime-600" />
          </motion.div>
        </div>
        <p className="text-xs text-gray-500 font-bold mt-2 leading-snug">
          Investors are showing strong optimism. BTC and Tech Sector are driving high greed scores.
        </p>
      </div>
    </motion.div>
  );
};

const AIRecommendationCard = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const tip = AI_TIPS[currentTipIndex];

  return (
    <>
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-primary rounded-[32px] p-6 shadow-lg shadow-primary/20 flex flex-col justify-between h-52 text-white relative overflow-hidden group"
      >
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-20">
           <button 
             onClick={() => setCurrentTipIndex((prev) => (prev + 1) % AI_TIPS.length)}
             className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
           >
              <TrendingUp className="w-4 h-4 rotate-90" />
           </button>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
             <CloudLightning className="w-4 h-4 text-lime-400 fill-lime-400/20" />
             <p className="text-white/60 text-xs font-black uppercase tracking-widest leading-none">AI Smart Tip • {currentTipIndex + 1}/{AI_TIPS.length}</p>
          </div>
          <h3 className="text-sm font-bold leading-tight line-clamp-2 min-h-[40px]">
             {tip.title}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-4 relative z-10">
          <button 
            onClick={() => setShowDetails(true)}
            className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition-colors group/btn"
          >
             <span className="text-xs font-black uppercase tracking-wider">Learn More</span>
             <Sparkles className="w-3.5 h-3.5 text-lime-400 group-hover/btn:scale-110 transition-transform" />
          </button>
          <div className="text-xs font-black text-white/50 leading-none">
             Impact: <span className="text-lime-400">{tip.impact}</span>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-10 -left-10 w-24 h-24 bg-lime-400/10 rounded-full blur-2xl pointer-events-none" />
      </motion.div>

      <AnimatePresence>
        {showDetails && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] p-10 shadow-2xl flex flex-col gap-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <CloudLightning className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">AI Expert Insight</h4>
                    <p className="text-xl font-black text-gray-900 tracking-tight">Smart Strategy Details</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                  <h5 className="text-xs font-black text-primary uppercase tracking-widest mb-3">Recommendation</h5>
                  <p className="text-lg font-bold text-gray-900 leading-tight">
                    {tip.title}
                  </p>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs font-black text-gray-500 uppercase tracking-widest">In-Depth Explanation</h5>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    {tip.explanation}
                  </p>
                </div>

                <div className="flex items-center justify-between p-6 bg-lime-50 rounded-3xl border border-lime-100">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-lime-600" />
                    <span className="text-xs font-black text-lime-700 uppercase tracking-widest">Estimated Impact</span>
                  </div>
                  <span className="text-xl font-black text-lime-700">{tip.impact}</span>
                </div>
              </div>

              <button 
                onClick={() => setShowDetails(false)}
                className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-black transition-colors"
              >
                Apply Strategy
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const GoalsPage = () => {
  return (
    <div className="flex-1 flex flex-col gap-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-2 font-display tracking-tight text-balance">Financial Goals</h1>
          <p className="text-gray-500 font-medium text-lg">Track and manage your long-term savings objectives</p>
        </div>
        <button className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-[24px] font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all">
          <Plus className="w-5 h-5 text-white" />
          Create New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/60 p-8 rounded-[40px] border border-white/40 shadow-sm">
          <p className="text-gray-500 text-sm font-black uppercase tracking-widest mb-2">Total Goal Volume</p>
          <h3 className="text-4xl font-black text-gray-900">$184,300</h3>
          <div className="mt-4 flex items-center gap-2 text-lime-600 font-bold text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+12% from last month</span>
          </div>
        </div>
        <div className="bg-white/60 p-8 rounded-[40px] border border-white/40 shadow-sm">
          <p className="text-gray-500 text-sm font-black uppercase tracking-widest mb-2">Completed Goals</p>
          <h3 className="text-4xl font-black text-gray-900">12</h3>
          <div className="mt-4 flex items-center gap-2 text-gray-500 font-bold text-sm">
            <span>2 goals pending completion</span>
          </div>
        </div>
        <div className="bg-white/60 p-8 rounded-[40px] border border-white/40 shadow-sm">
          <p className="text-gray-500 text-sm font-black uppercase tracking-widest mb-2">Average Progress</p>
          <h3 className="text-4xl font-black text-gray-900">48.2%</h3>
          <div className="mt-4 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
             <div className="h-full bg-primary" style={{ width: '48.2%' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 px-2">Active Savings Goals</h2>
          <div className="grid gap-6">
             {GOALS.map((goal) => (
                <motion.div 
                  key={goal.id} 
                  whileHover={{ scale: 1.01, x: 5 }}
                  className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex items-center gap-6 group cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-primary shrink-0 text-2xl ${goal.iconBg}`}>
                    {goal.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-3">
                       <h4 className="text-xl font-bold text-gray-900">{goal.label}</h4>
                       <span className="text-sm font-black text-gray-500">{goal.amount}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            className="h-full"
                            style={{ backgroundColor: goal.color }}
                          />
                       </div>
                       <span className="text-sm font-black text-gray-900 w-10 text-right">{goal.progress}%</span>
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                     <ArrowUpRight className="w-5 h-5" />
                  </button>
                </motion.div>
             ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
           <div className="bg-gray-900 rounded-[48px] p-10 text-white relative overflow-hidden h-fit">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-lime-400" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-white/60">Goal Forecast</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 leading-tight">You're on track to complete "Vacation" in 14 days!</h3>
                <p className="text-white/60 font-medium text-lg mb-8">Increase your monthly contribution by $50 to reach your car goal earlier.</p>
                <div className="flex gap-4">
                   <button className="bg-lime-400 text-gray-900 px-6 py-3 rounded-2xl font-bold transition-transform hover:scale-105">Adjust Savings</button>
                   <button className="bg-white/10 text-white px-6 py-3 rounded-2xl font-bold transition-transform hover:scale-105">View Timeline</button>
                </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
           </div>

           <div className="bg-white/60 p-10 rounded-[48px] border border-white/40 shadow-sm flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Goal Contributions Overview</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                        data={GOALS}
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="progress"
                        stroke="none"
                     >
                        {GOALS.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Pie>
                     <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                 {GOALS.map(goal => (
                    <div key={goal.id} className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: goal.color }} />
                       <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">{goal.label}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

interface Asset {
  symbol: string;
  name: string;
  usd?: string;
  pkr: string;
  daily: string;
  gain: string;
  color: string;
}

const AssetRow: React.FC<{ h: Asset, isInternational?: boolean, hasLossOpportunity?: boolean }> = ({ h, isInternational, hasLossOpportunity }) => (
  <motion.div 
    whileHover={{ scale: 1.01, x: 4 }}
    className="flex items-center gap-4 p-4 hover:bg-white/40 transition-all cursor-pointer border-b border-gray-100/30 last:border-0 relative"
  >
    <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-xs text-gray-500`}>
      {h.symbol.slice(0, 2)}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-900 truncate">{h.symbol}</span>
        {isInternational && <span className="text-xs font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-md uppercase tracking-tighter">US</span>}
        {hasLossOpportunity && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" 
            title="Tax Loss Opportunity Detected"
          />
        )}
      </div>
      <div className="text-xs text-gray-500 font-medium truncate">{h.name}</div>
    </div>
    <div className="text-right shrink-0">
      <div className="text-sm font-black text-gray-900">{isInternational ? h.usd : h.pkr}</div>
      <div className={`text-xs font-bold ${h.daily.startsWith('+') ? 'text-lime-600' : 'text-rose-500'}`}>{h.daily}</div>
    </div>
  </motion.div>
);

const PortfolioPage = () => {
  const [simulated, setSimulated] = useState(false);

  const INTERNATIONAL_HOLDINGS: Asset[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', usd: '$1,250', pkr: 'Rs 347,500', daily: '+1.2%', gain: '+$140', color: 'blue' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', usd: '$980', pkr: 'Rs 272,440', daily: '-0.8%', gain: '-$20', color: 'indigo' },
    { symbol: 'VOO', name: 'Vanguard S&P 500', usd: '$2,400', pkr: 'Rs 667,200', daily: '+0.5%', gain: '+$310', color: 'blue' }
  ];

  const PAKISTANI_HOLDINGS: Asset[] = [
    { symbol: 'ENGRO', name: 'Engro Corp', pkr: 'Rs 155,000', daily: '-2.5%', gain: '-Rs 12,000', color: 'emerald' },
    { symbol: 'LUCK', name: 'Lucky Cement', pkr: 'Rs 92,000', daily: '+3.1%', gain: '+Rs 8,500', color: 'lime' },
    { symbol: 'MCB', name: 'MCB Bank', pkr: 'Rs 45,000', daily: '+0.2%', gain: '+Rs 1,200', color: 'blue' },
    { symbol: 'M-Fund', name: 'Al Meezan', pkr: 'Rs 120,000', daily: '+0.4%', gain: '+Rs 15,000', color: 'teal' }
  ];

  return (
    <div className="flex-1 flex flex-col gap-10 pb-20 overflow-y-auto pr-2 scrollbar-hide">
      {/* Premium Hero Stats */}
      <section className="relative rounded-[56px] overflow-hidden bg-gray-900 p-8 md:p-12 min-h-[440px] flex flex-col justify-between group">
        {/* Animated Background Artifacts */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -top-1/2 -right-1/4 w-full h-full bg-blue-600 rounded-full blur-[160px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], x: [0, 50, 0] }}
            transition={{ duration: 12, repeat: Infinity, delay: 2 }}
            className="absolute top-1/4 -left-1/4 w-full h-full bg-lime-600 rounded-full blur-[140px]" 
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xl">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                   <TrendingUp className="w-5 h-5 text-lime-400" />
                </div>
                <div className="flex flex-col">
                   <span className="text-xs font-black uppercase text-gray-500 tracking-[0.2em]">Live Assets</span>
                   <span className="text-xs font-bold text-white/50">Market open • 15:55 PM</span>
                </div>
             </div>
             <h1 className="text-7xl md:text-[100px] font-black text-white font-display tracking-tight leading-[0.85] mb-10">
                Rs 1.42M
             </h1>
             <div className="flex flex-wrap gap-4">
                <div className="glass-pill px-6 py-4 rounded-3xl flex items-center gap-4 border-white/5 hover:border-white/10 transition-colors">
                   <div className="w-10 h-10 bg-lime-400 text-gray-900 rounded-xl flex items-center justify-center">
                      <ArrowUpRight className="w-6 h-6" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-xs text-gray-500 font-black uppercase tracking-widest">Growth</span>
                      <span className="text-white text-lg font-bold leading-tight">+14.2%</span>
                   </div>
                </div>
                <div className="glass-pill px-6 py-4 rounded-3xl flex items-center gap-4 border-white/5">
                   <div className="w-10 h-10 bg-blue-400/20 text-blue-400 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-xs text-gray-500 font-black uppercase tracking-widest">FX Edge</span>
                      <span className="text-white text-lg font-bold leading-tight">Rs 34k</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="w-full md:w-72 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px]">
             <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black uppercase text-gray-500 tracking-[0.1em]">Allocation Matrix</span>
                <Info className="w-4 h-4 text-white/20" />
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between text-xs text-white/80 font-bold mb-1">
                      <span>International</span>
                      <span className="font-black text-blue-400">42%</span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "42%" }}
                        className="h-full bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-xs text-white/80 font-bold mb-1">
                      <span>Pakistan</span>
                      <span className="font-black text-emerald-400">58%</span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "58%" }}
                        className="h-full bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]" 
                      />
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 mt-12 overflow-x-auto scrollbar-hide py-2">
           <button className="px-10 py-5 bg-white text-gray-900 rounded-[28px] font-black uppercase tracking-widest text-xs hover:bg-lime-400 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-2xl shadow-white/5">Add Asset</button>
           <button className="px-8 py-5 border border-white/10 glass-pill text-white font-bold rounded-[28px] hover:bg-white/5 transition-all shrink-0">Download Reports</button>
        </div>
      </section>

      {/* Bento Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Holdings Hub */}
        <div className="xl:col-span-8 flex flex-col gap-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white/60 rounded-[56px] p-10 border border-white shadow-xl shadow-gray-200/20 overflow-hidden flex flex-col">
                 <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                          <Globe className="w-6 h-6 text-blue-600" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Global</h3>
                          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">NYSE • NASDAQ</p>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-1">
                    {INTERNATIONAL_HOLDINGS.map(h => <AssetRow key={h.symbol} h={h} isInternational />)}
                 </div>
              </div>

              <div className="bg-white/60 rounded-[56px] p-10 border border-white shadow-xl shadow-gray-200/20 overflow-hidden flex flex-col">
                 <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                          <Flag className="w-6 h-6 text-emerald-600" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Pakistan</h3>
                          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">PSX • MUTUAL FUNDS</p>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-1">
                    {PAKISTANI_HOLDINGS.map(h => <AssetRow key={h.symbol} h={h} hasLossOpportunity={h.symbol === 'ENGRO'} />)}
                 </div>
              </div>
           </div>

           {/* Benchmarking Module */}
           <div className="bg-gray-900 rounded-[56px] p-10 border border-white/10 shadow-2xl flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                 <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Portfolio Alpha</h3>
                    <p className="text-sm text-gray-500 font-medium italic">Comparison against KSE-100 Benchmark</p>
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 bg-lime-400 rounded-lg" />
                       <span className="text-xs font-black text-gray-500 uppercase tracking-widest">You</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 bg-white/10 rounded-lg" />
                       <span className="text-xs font-black text-white/60 uppercase tracking-widest">Market</span>
                    </div>
                 </div>
              </div>
              <div className="flex-1 w-full min-h-[160px] flex items-end gap-2 md:gap-4 px-2">
                 {[40, 65, 45, 80, 55, 90, 75, 40, 60, 85, 100].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                       <div className="relative w-full flex flex-col items-center justify-end h-full">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.05, type: 'spring', stiffness: 100 }}
                            className={`w-full max-w-[12px] rounded-full transition-all group-hover:scale-x-125 ${i === 10 ? 'bg-lime-400 shadow-[0_-8px_30px_rgba(163,230,71,0.6)]' : 'bg-white/10'}`} 
                          />
                       </div>
                       <span className="text-xs font-black text-gray-600 uppercase">W{i+1}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Intelligence Pillar */}
        <div className="xl:col-span-4 flex flex-col gap-10">
           {/* Smart Loss Module */}
           <div className="bg-amber-100 rounded-[56px] p-10 border border-amber-200 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-300 opacity-20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 bg-white text-amber-600 rounded-[24px] flex items-center justify-center shadow-lg shadow-amber-200/50">
                       <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-amber-900 leading-[1.1]">Optimization Alert</h3>
                       <p className="text-xs font-black text-amber-700/60 uppercase tracking-widest mt-1">Smart Loss Strategy</p>
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="bg-amber-50/80 backdrop-blur-sm rounded-[32px] p-8 border border-amber-200/50">
                       <div className="flex justify-between items-center mb-6">
                          <span className="text-xs font-black text-amber-900/60 uppercase tracking-widest">Holding: ENGRO</span>
                          <span className="text-xs font-black bg-rose-500 text-white px-3 py-1 rounded-full">-8.5%</span>
                       </div>
                       <p className="text-sm font-bold text-amber-900/70 mb-8 leading-relaxed">
                          Close this position to offset capital gains against <span className="text-amber-900 underline underline-offset-4 decoration-amber-300 font-black">Rs 45,200</span> in estimated taxes.
                       </p>
                       <button 
                        onClick={() => setSimulated(!simulated)}
                        className={`w-full py-5 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all shadow-2xl hover:scale-[1.02] active:scale-[0.98] ${simulated ? 'bg-emerald-500 text-white shadow-emerald-400/20' : 'bg-gray-900 text-white shadow-gray-900/20'}`}
                       >
                          {simulated ? 'Result: Optimal' : 'Simulate Harvesting'}
                       </button>
                    </div>
                    {simulated && (
                       <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 p-8 rounded-[36px] border border-emerald-100 flex items-center gap-5"
                       >
                          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                             <Sparkles className="w-6 h-6" />
                          </div>
                          <div>
                             <div className="text-xs font-black text-gray-500 uppercase tracking-widest">Tax Efficiency</div>
                             <div className="text-2xl font-black text-emerald-600">Rs +Rs 45k</div>
                          </div>
                       </motion.div>
                    )}
                 </div>
              </div>
           </div>

           {/* Sustainable Score Widget */}
           <div className="bg-white rounded-[56px] p-10 border border-gray-100 shadow-xl shadow-gray-200/20 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-12">
                 <h3 className="text-2xl font-black text-gray-900">ESG Matrix</h3>
                 <div className="p-3 bg-gray-50 rounded-2xl">
                    <Leaf className="w-5 h-5 text-lime-500" />
                 </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                 <div className="relative w-48 h-48 mb-10 group cursor-help">
                    <svg className="w-full h-full -rotate-90 scale-x-[-1]" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="44" stroke="#f8fafc" strokeWidth="12" fill="transparent" />
                       <motion.circle 
                        cx="50" cy="50" r="44" 
                        stroke="#BEF264" strokeWidth="12" 
                        fill="transparent" 
                        strokeDasharray="276.46" 
                        initial={{ strokeDashoffset: 276.46 }}
                        animate={{ strokeDashoffset: 276.46 - (276.46 * 0.74) }}
                        strokeLinecap="round" 
                        className="drop-shadow-[0_0_8px_rgba(190,242,100,0.4)]"
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-6xl font-black text-gray-900 tracking-tighter">74</span>
                       <span className="text-xs font-black text-gray-500 uppercase tracking-widest">High</span>
                    </div>
                 </div>
                 <h4 className="text-xl font-bold text-gray-900 mb-2 font-display">Conscious Investor</h4>
                 <p className="text-sm text-gray-500 font-medium font-urdu leading-relaxed text-balance px-4 opacity-80">
                    آپ کا پورٹ فولیو ماحولیاتی اور سماجی لحاظ سے 85 فیصد عالمی معیارات پر پورا اترتا ہے۔
                 </p>
              </div>

              <div className="mt-12 flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest uppercase">Benchmarked</span>
                    <span className="text-xs font-bold text-gray-500">May 2026 Index</span>
                 </div>
                 <button className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                    <ArrowUpRight className="w-5 h-5 text-gray-500" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const NewsSentimentPage = () => {
  const [isAdjustmentExpanded, setIsAdjustmentExpanded] = useState(false);
  
  const ASSETS = [
    { symbol: 'BTC', sentiment: 0.85, label: 'Positive', color: '#BEF264' },
    { symbol: 'ETH', sentiment: 0.65, label: 'Positive', color: '#BEF264' },
    { symbol: 'ENGRO', sentiment: 0.25, label: 'Negative', color: '#F43F5E' },
    { symbol: 'AAPL', sentiment: 0.50, label: 'Neutral', color: '#94A3B8' },
    { symbol: 'TSLA', sentiment: 0.72, label: 'Positive', color: '#BEF264' }
  ];

  const NEWS = [
    { asset: 'BTC', headline: 'Bitcoin Institutional Adoption Reaches New Peak as ETF Inflows Surge', source: 'Reuters', date: '2h ago', sentiment: 'Positive' },
    { asset: 'BTC', headline: 'Network Difficulty Hits All-Time High, Strengthening Security', source: 'CoinDesk', date: '5h ago', sentiment: 'Positive' },
    { asset: 'ENGRO', headline: 'Fertilizer Subsidiary Reports Quarterly Loss Amid Supply Chain Disruptions', source: 'Dawn', date: '1d ago', sentiment: 'Negative' },
    { asset: 'AAPL', headline: 'New iPhone Production Targets Remain Steady Despite Market Uncertainty', source: 'Bloomberg', date: '3h ago', sentiment: 'Neutral' },
  ];

  return (
    <div className="flex-1 flex flex-col gap-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-lime-400 rounded-[48px] p-10 text-gray-900 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/40 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gray-900" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-gray-900/60">Overall Market Mood</span>
            </div>
            <h1 className="text-5xl font-black mb-4 tracking-tight">Extremely Positive</h1>
            <p className="text-xl font-medium text-gray-800 leading-relaxed">
              Markets are showing good signals phase. Your portfolio has been slightly adjusted toward stronger assets to capitalize on high-momentum trends.
            </p>
          </div>
          <div className="w-48 h-48 bg-white/20 rounded-full flex flex-col items-center justify-center backdrop-blur-sm border border-white/20">
             <span className="text-5xl font-black">82</span>
             <span className="text-xs font-black uppercase tracking-widest mt-2">Index Score</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="bg-white/60 rounded-[48px] p-10 border border-white/40 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">AI News Analysis</h3>
              <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest">
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
                Live Feed
              </div>
           </div>
           
           <div className="space-y-8">
              {ASSETS.map((asset) => (
                <div key={asset.symbol}>
                  <div className="flex justify-between items-center mb-3">
                     <span className="text-lg font-black text-gray-900">{asset.symbol}</span>
                     <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-full ${
                       asset.label === 'Positive' ? 'bg-lime-400/20 text-lime-700' :
                       asset.label === 'Negative' ? 'bg-rose-400/20 text-rose-700' :
                       'bg-gray-400/20 text-gray-700'
                     }`}>
                       {asset.label}
                     </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${asset.sentiment * 100}%` }}
                       className="h-full rounded-full"
                       style={{ backgroundColor: asset.color }}
                     />
                  </div>
                </div>
              ))}
           </div>

           <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Last Analyzed</span>
                <span className="text-sm font-bold text-gray-900">May 02, 2026 • 15:45 PM</span>
              </div>
              <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                <CloudLightning className="w-4 h-4" />
                Refresh
              </button>
           </div>
        </div>

        <div className="flex flex-col gap-10">
           <div className="bg-white/60 rounded-[48px] p-10 border border-white/40 shadow-sm flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Latest Insights</h3>
              <div className="space-y-6">
                 {NEWS.map((item, idx) => (
                    <motion.div key={idx} whileHover={{ x: 5 }} className="group cursor-pointer">
                       <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xs font-black uppercase px-2 py-0.5 rounded-md ${
                            item.sentiment === 'Positive' ? 'bg-lime-400 text-gray-900' :
                            item.sentiment === 'Negative' ? 'bg-rose-500 text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {item.sentiment}
                          </span>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">{item.source} • {item.date}</span>
                       </div>
                       <h4 className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {item.headline}
                       </h4>
                    </motion.div>
                 ))}
              </div>
           </div>

           <div className="bg-gray-900 rounded-[48px] p-10 text-white">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-lime-400" />
                    <h3 className="text-lg font-bold">Smart Weight Adjustments</h3>
                 </div>
                 <button 
                  onClick={() => setIsAdjustmentExpanded(!isAdjustmentExpanded)}
                  className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white"
                 >
                   {isAdjustmentExpanded ? 'Collapse' : 'Expand'}
                 </button>
              </div>
              <div className="space-y-4">
                 <p className="text-sm text-white/60 font-medium italic">
                    "ENGRO reduced from 15% to 13.5% due to negative news sentiment regarding supply chain."
                 </p>
                 {isAdjustmentExpanded && (
                   <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-4 mt-4 border-t border-white/10"
                   >
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-bold">BTC Contribution</span>
                         <div className="flex items-center gap-3">
                            <span className="text-xs text-white/40 line-through">40%</span>
                            <span className="text-sm font-black text-lime-400">45%</span>
                         </div>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-bold">ETH Contribution</span>
                         <div className="flex items-center gap-3">
                            <span className="text-xs text-white/40 line-through">20%</span>
                            <span className="text-sm font-black text-lime-400">22.5%</span>
                         </div>
                      </div>
                   </motion.div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};


const ASSET_ALLOCATION_DATA = [
  { name: 'US Stocks', value: 40, color: '#4285F4' },
  { name: 'International Stocks', value: 25, color: '#4DB6AC' },
  { name: 'Bonds', value: 20, color: '#66BB6A' },
  { name: 'Real Estate', value: 10, color: '#81C784' },
  { name: 'Cash', value: 5, color: '#D4E157' },
];

const AssetAllocationCard = () => {
  return (
    <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] p-10 border border-white shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
           <h3 className="text-2xl font-black text-gray-900 tracking-tight">Asset Allocation</h3>
           <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center cursor-help group/info hover:bg-gray-50 transition-colors">
             <Info className="w-4 h-4 text-gray-300 group-hover/info:text-gray-500" />
           </div>
        </div>
        <div className="flex items-center gap-6">
           <button className="text-xs font-black text-primary uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">More</button>
           <button className="text-gray-200 hover:text-gray-500 transition-colors">
              <MoreHorizontal className="w-6 h-6" />
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="relative w-72 h-72 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ASSET_ALLOCATION_DATA}
                innerRadius={80}
                outerRadius={110}
                cx="50%"
                cy="50%"
                paddingAngle={2}
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
                startAngle={90}
                endAngle={450}
              >
                {ASSET_ALLOCATION_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span id="asset-total-amount" className="text-3xl font-black text-gray-900 tracking-tighter leading-none">$112,650</span>
             <span id="asset-total-label" className="text-xs text-gray-500 font-black tracking-[0.2em] uppercase mt-2">Total</span>
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col gap-4 max-w-md">
           {ASSET_ALLOCATION_DATA.map((item) => (
             <div key={item.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                   <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                   <span className="text-lg font-bold text-gray-500 group-hover:text-gray-900 transition-colors">{item.name}</span>
                </div>
                <span className="text-lg font-black text-gray-900">{item.value}%</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const PERFORMANCE_DATA = [
  { name: 'Jan', value: 55000 },
  { name: 'Feb', value: 72000 },
  { name: 'Mar', value: 90000 },
  { name: 'Apr', value: 85000 },
  { name: 'May', value: 102000 },
  { name: 'Jun', value: 112650 },
];

const PortfolioPerformanceCard = () => {
  return (
    <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] p-10 border border-white shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Portfolio Performance</h3>
          <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center cursor-help group/info hover:bg-gray-50 transition-colors">
            <Info className="w-4 h-4 text-gray-300 group-hover/info:text-gray-500" />
          </div>
        </div>
        <div className="flex items-center bg-gray-50/50 p-1.5 rounded-2xl gap-1">
          {['1M', '6M', '1Y', 'All'].map((period) => (
            <button
              key={period}
              className={`px-5 py-2 text-xs font-black rounded-xl transition-all ${
                period === '6M' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-600'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl font-black text-gray-900 tracking-tighter">$112,650</span>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-xs font-black text-emerald-500">7.6% ($7,950)</span>
        </div>
      </div>

      <div className="h-[320px] w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={PERFORMANCE_DATA}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4285F4" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#4285F4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fontWeight: 700, fill: '#4b5563' }}
              dy={15}
            />
            <YAxis hide domain={['dataMin - 10000', 'dataMax + 10000']} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-black shadow-2xl">
                      ${payload[0].value.toLocaleString()}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#4285F4" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
const HeroSection = ({ onOpenDeposit }: { onOpenDeposit: () => void }) => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Investor';
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-8">
      {/* Welcome Left Column */}
      <div className="flex-1">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">FinAI Nexus</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tighter mb-4">
            Welcome back,<br />
            <span className="text-primary">{firstName}</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-sm leading-relaxed">
            Your AI-powered portfolio is currently <span className="text-emerald-500 font-bold select-none cursor-default">outperforming</span> the benchmark.
          </p>
        </motion.div>
      </div>

      {/* Action Strip */}
      <div className="flex items-center gap-4 bg-white/40 p-4 rounded-[40px] border border-white/60 shadow-sm backdrop-blur-xl">
          <button 
            onClick={onOpenDeposit}
            className="flex items-center gap-3 bg-primary text-white pl-4 pr-8 py-3 rounded-[28px] font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
               <Plus className="w-4 h-4" />
            </div>
            Deposit Funds
          </button>
          <button className="flex items-center gap-3 bg-gray-900 text-white pl-4 pr-8 py-3 rounded-[28px] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-900/10 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <CloudLightning className="w-4 h-4 text-lime-400" />
            </div>
            Smart Harvest
          </button>
      </div>
    </div>
  );
};

const DashboardContent = ({ currentTheme, onOpenDeposit }: { currentTheme: Theme, onOpenDeposit: () => void }) => {
  const { user } = useAuth();
  const walletUsd = user?.wallet?.balance_usd || 0;
  const walletPkr = user?.wallet?.balance_pkr || 0;
  const portfolioValue = walletUsd || walletPkr ? walletUsd + walletPkr / 280 : 112650;

  return (
    <div className="flex flex-col gap-10">
      <HeroSection onOpenDeposit={onOpenDeposit} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* KPI Row - Top 4 Columns each */}
        <div className="xl:col-span-4 bg-white/80 backdrop-blur-xl rounded-[40px] p-8 border border-white shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
          <div className="flex justify-between items-start mb-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Portfolio Value</span>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter">
                ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
               <Wallet className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active Growth</span>
          </div>
        </div>

        <div className="xl:col-span-4 bg-white/80 backdrop-blur-xl rounded-[40px] p-8 border border-white shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
          <div className="flex justify-between items-start mb-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Efficiency Score</span>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter">9.2/10</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-lime-400/10 flex items-center justify-center text-lime-600 group-hover:scale-110 transition-transform">
               <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest bg-primary/5 w-fit px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Optimized</span>
          </div>
        </div>

        <div className="xl:col-span-4 bg-gray-900 rounded-[40px] p-8 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1 block">Live Prediction</span>
            <h3 className="text-3xl font-black text-white tracking-tighter mb-4">$186,540</h3>
            <p className="text-xs text-white/40 font-bold max-w-[180px]">Estimated portfolio value by the year 2030 based on current trends.</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-20 blur-3xl rounded-full" />
          <div className="relative z-10 flex items-center gap-2 mt-6">
             <button className="text-[10px] font-black text-lime-400 uppercase tracking-widest hover:underline underline-offset-4 decoration-lime-400/30 transition-all">View Forecast</button>
             <ArrowUpRight className="w-3 h-3 text-lime-400" />
          </div>
        </div>

        {/* Main Chart Section - 8 Columns */}
        <div className="xl:col-span-8 space-y-8">
           <PortfolioPerformanceCard />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 border border-white flex flex-col h-[420px] shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight leading-none">Active Goals</h3>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1 block tracking-[0.1em]">Savings Progress</span>
                  </div>
                  <button className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:text-primary transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1 overflow-y-auto scrollbar-hide flex-1">
                  {GOALS.map((goal) => (
                    <GoalItem key={goal.id} goal={goal} />
                  ))}
                </div>
                <button className="mt-8 w-full py-4 bg-gray-50 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                  Manage Goals
                </button>
              </div>
              <MarketSentimentCard />
           </div>
        </div>

        {/* Intelligence Rail - 4 Columns */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          <div className="bg-primary rounded-[40px] p-1 shadow-lg shadow-primary/20 overflow-hidden group">
            <div className="bg-white/5 backdrop-blur-md rounded-[36px] p-8 h-full flex flex-col">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-lime-400" />
                 </div>
                 <span className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none">AI Assistant</span>
               </div>
               <p className="text-lg font-bold text-white mb-8 leading-tight">"Your portfolio risk is perfectly balanced for a moderate investor."</p>
               <div className="mt-auto flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=200&h=200&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">Calipso Voice</span>
                    <button className="text-[10px] font-black text-lime-400 uppercase tracking-widest">Connect Mic</button>
                  </div>
               </div>
            </div>
          </div>

          <AIRecommendationCard />
          <AssetAllocationCard />
        </div>

        {/* Full Width Comparison */}
        <div className="xl:col-span-12">
           <PortfolioComparison />
        </div>
      </div>
    </div>
  );
};

const SmartLossStrategyPage = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const demoOpportunities = [
    {
      symbol: 'ENGRO',
      avg_buy_price: 327,
      current_price: 294,
      shares: 120,
      market: 'PSX',
      pkr_loss: 3960,
      pkr_tax_saved: 594,
    },
    {
      symbol: 'LUCK',
      avg_buy_price: 842,
      current_price: 786,
      shares: 45,
      market: 'PSX',
      pkr_loss: 2520,
      pkr_tax_saved: 378,
    },
  ];

  const fetchOpportunities = async () => {
    setLoading(true);
    setTimeout(() => {
      setOpportunities(demoOpportunities);
      setLoading(false);
    }, 500);
  };

  React.useEffect(() => {
    fetchOpportunities();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[600px]">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-12 h-12 border-t-2 border-indigo-600 border-indigo-100 rounded-full mb-10"
        />
        <p className="text-xs font-black text-gray-500 uppercase tracking-[0.5em] animate-pulse">Proprietary Scan in Progress</p>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full py-8 px-4">
      <header className="mb-20 flex flex-col md:flex-row items-end justify-between gap-8 border-b border-gray-100 pb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
             <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping" />
             <span className="text-xs font-black text-indigo-600 uppercase tracking-widest leading-none">Intelligence Engine Active</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-[0.9]">
            Smart <span className="text-indigo-600 italic">Loss</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl">
            Optimizing your real returns by strategically booking losses to offset Capital Gains Tax.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
           <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Regulatory Framework</span>
           <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-black text-gray-900 uppercase tracking-tight">FBR 2024 Compliant</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-8 flex flex-col gap-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Strategy Signals</h2>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              Updated Real-time
            </div>
          </div>

          {opportunities.length === 0 ? (
            <div className="group relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="relative py-32 bg-white/40 backdrop-blur-sm rounded-[64px] border border-gray-100 text-center flex flex-col items-center shadow-sm">
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-200 mb-8 border border-gray-100 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-500"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter">Portfolio is Lean</h3>
                  <p className="text-gray-500 font-medium text-base max-w-sm mx-auto leading-relaxed">
                    No holdings currently meet the threshold for strategic loss booking. Your tax efficiency score is currently <span className="text-indigo-600 font-black">9.8/10</span>.
                  </p>
                  
                  <div className="mt-12 flex items-center gap-2">
                     <div className="w-1 h-1 rounded-full bg-indigo-200 animate-bounce" />
                     <div className="w-1 h-1 rounded-full bg-indigo-300 animate-bounce delay-75" />
                     <div className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce delay-150" />
                  </div>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10">
              {Array.isArray(opportunities) && opportunities.map((opp, idx) => (
                <motion.div
                  key={opp?.symbol || idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <TaxLossAlert 
                    holding={opp} 
                    onHarvest={() => fetchOpportunities()}
                    onDismiss={() => {
                      setOpportunities(opportunities.filter((o) => o?.symbol !== opp?.symbol));
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-12">
           <div className="bg-gray-900 rounded-[56px] p-12 text-white relative overflow-hidden group shadow-2xl shadow-indigo-900/10">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-12">
                   <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">Tactical Playbook</h3>
                   <Zap className="w-4 h-4 text-white/20" />
                </div>
                
                <div className="space-y-12">
                   {[
                     { t: "The Harvest", d: "Sell positions with significant unrealized losses to lock in the paper loss for tax purposes." },
                     { t: "Sector Swap", d: "Immediately reinvest into a similar sector asset to maintain your portfolio exposure." },
                     { t: "CGT Offset", d: "Use the booked loss to reduce your Capital Gains Tax on other profitable trades." }
                   ].map((item, i) => (
                     <div key={i} className="group/item cursor-default">
                        <div className="text-xs font-black text-white/50 uppercase tracking-widest mb-3 transition-colors group-hover/item:text-indigo-400">Phase 0{i + 1}</div>
                        <p className="text-xl font-black text-white mb-2 leading-tight">{item.t}</p>
                        <p className="text-xs text-white/40 leading-relaxed font-medium">{item.d}</p>
                     </div>
                   ))}
                </div>

                <div className="mt-16 pt-10 border-t border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs font-black text-white/50 uppercase tracking-[0.2em]">Verified Strategy</span>
                   </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-[100px] -ml-32 -mb-32" />
           </div>

           <div className="p-10 border border-gray-100 bg-white rounded-[48px] flex flex-col items-center text-center gap-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-500 transition-colors hover:text-indigo-600">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Investor Education</p>
                <h4 className="text-lg font-bold text-gray-900 leading-tight px-4 tracking-tight">
                  "Strategic tax management can increase your <span className="text-indigo-600">compounded wealth</span> by up to 1.2% annually."
                </h4>
              </div>
              <button className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] hover:text-indigo-600 transition-colors border-t border-gray-50 pt-6 w-full">
                Learn Finance Act 2024 →
              </button>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default function CalipsoDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Dashboard';
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };
  
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [alertCount, setAlertCount] = useState(2);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const { user, updateUser } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const handleQuizComplete = (profile: RiskProfile) => {
    setRiskProfile(profile);
    setShowPreview(true);
  };

  const handlePreviewConfirm = () => {
    updateUser({ onboardingComplete: true });
    setShowPreview(false);
    setIsDepositOpen(true); // Open deposit modal immediately after preview confirm
  };

  const handleRetakeQuiz = () => {
    setShowPreview(false);
    setRiskProfile(null);
  };

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', currentTheme.primary);
    root.style.setProperty('--primary-light', currentTheme.primaryLight);
    root.style.setProperty('--mesh-color-1', currentTheme.mesh.c1);
    root.style.setProperty('--mesh-color-2', currentTheme.mesh.c2);
    root.style.setProperty('--mesh-color-3', currentTheme.mesh.c3);
    root.style.setProperty('--mesh-bg', currentTheme.mesh.bg);
  }, [currentTheme]);

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard' },
    { icon: PieChartIcon, label: 'Portfolio' },
    { icon: Wallet, label: 'Paycheck Splitter' },
    { icon: Target, label: 'Goals' },
    { icon: Lightbulb, label: 'Smart Loss Strategy' },
    { icon: BrainCircuit, label: 'Why AI chose this' },
    { icon: ShieldCheck, label: 'Risk Assessment' },
    { icon: TrendingUp, label: 'Forecast' },
    { icon: Leaf, label: 'ESG & Sustainability' },
    { icon: Newspaper, label: 'News Sentiment' },
    { icon: Settings, label: 'Settings' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Smart Loss Strategy':
        return <SmartLossStrategyPage />;
      case 'Dashboard':
        return <DashboardContent currentTheme={currentTheme} onOpenDeposit={() => setIsDepositOpen(true)} />;
      case 'Goals':
        return <GoalsPage />;
      case 'Why AI chose this':
        return <SHAPExplainer />;
      case 'Portfolio':
        return <PortfolioPage />;
      case 'News Sentiment':
        return <NewsSentimentPage />;
      case 'Forecast':
        return <ForecastPage />;
      case 'Paycheck Splitter':
        return <PaycheckSplitterPage />;
      case 'ESG & Sustainability':
        return <ESGPage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center p-20">
             <div className="text-center p-20 bg-white/40 backdrop-blur-xl rounded-[60px] border border-white">
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">{activeTab}</h2>
                <p className="text-gray-500 font-medium text-lg">This section is being synchronized with our prediction engine.</p>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="calipso-scope min-h-screen w-full bg-mesh flex items-center justify-center p-6 lg:p-12 font-sans overflow-hidden relative">
      <DepositModal 
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)} 
        onSuccess={() => setActiveTab('Dashboard')}
        riskScore={riskProfile?.score || 50}
      />
      {/* Background SVG Layers */}
      <div className="absolute inset-x-0 top-0 h-full overflow-hidden pointer-events-none opacity-60">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute top-0 transform scale-150 rotate-12 opacity-40">
           <path d="M0,1000 C300,800 400,900 600,600 C800,300 900,400 1000,0 L1000,1000 Z" fill="#65A30D" fillOpacity="0.2" />
        </svg>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute top-0 transform scale-125 -translate-x-1/2 opacity-30">
           <path d="M0,500 C200,600 400,400 600,800 C800,950 1000,600 1000,200 L1000,1000 L0,1000 Z" fill="#3B82F6" fillOpacity="0.1" />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {showPreview && riskProfile ? (
          <PortfolioPreview 
            key="preview"
            riskProfile={riskProfile} 
            onConfirm={handlePreviewConfirm} 
            onRetake={handleRetakeQuiz} 
          />
        ) : activeTab === 'Risk Assessment' ? (
          <RiskQuiz 
            key="quiz"
            onComplete={handleQuizComplete} 
            onCancel={() => setActiveTab('Dashboard')}
          />
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full max-w-[1500px] h-full lg:h-[90vh] glass-container rounded-[50px] flex overflow-hidden relative z-10"
          >
        {/* Sidebar */}
        <motion.aside 
          animate={{ width: isCollapsed ? 100 : 288 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="hidden lg:flex flex-col py-10 border-r border-white/20 bg-white/10 backdrop-blur-md relative"
        >
          {/* Toggle Button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-4 top-12 w-8 h-8 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-primary transition-colors z-50 hover:scale-110"
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          <div className={`px-8 mb-12 flex items-center gap-3 ${isCollapsed ? 'justify-center px-0' : ''}`}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 shrink-0">
              <CloudLightning className="w-6 h-6" />
            </div>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-black text-primary tracking-tight font-display"
              >
                FinAI Nexus
              </motion.span>
            )}
          </div>

          <div className="flex-1 flex flex-col px-4 gap-2 overflow-y-auto scrollbar-hide py-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                aria-label={item.label}
                className={`w-full h-12 rounded-2xl flex items-center gap-4 transition-all relative group shadow-sm ${
                  isCollapsed ? 'justify-center px-0' : 'px-5'
                } ${
                  activeTab === item.label 
                    ? 'text-white' 
                    : 'text-gray-500 hover:bg-white/40 hover:text-gray-700'
                }`}
              >
                <item.icon 
                  className={`w-5 h-5 relative z-10 transition-all duration-300 ${
                    activeTab === item.label ? 'scale-110' : 'group-hover:scale-110'
                  }`} 
                />
                
                {!isCollapsed ? (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-bold relative z-10 whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {item.label}
                  </motion.span>
                ) : (
                  /* Tooltip for Collapsed State */
                  <span className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest rounded-lg opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-xl z-[100]">
                    {item.label}
                  </span>
                )}

                {activeTab === item.label && (
                  <motion.div 
                    layoutId="sidebar-nav"
                    className="absolute inset-0 bg-primary rounded-2xl shadow-lg shadow-primary/40"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className={`mt-8 pt-6 border-t border-white/10 ${isCollapsed ? 'px-0 flex justify-center' : 'px-8'}`}>
            <button className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full border-2 border-white bg-primary text-white shadow-md transition-transform group-hover:scale-110 shrink-0 flex items-center justify-center font-black">
                 {(user?.name || 'C').charAt(0)}
              </div>
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col items-start leading-tight"
                >
                   <span className="text-sm font-black text-gray-900">{user?.name || 'Calipso User'}</span>
                   <span className="text-xs font-bold text-gray-500">{user?.email || 'Pro Plan'}</span>
                </motion.div>
              )}
            </button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 p-8 md:p-12 flex flex-col gap-10 overflow-y-auto scrollbar-hide">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex lg:hidden items-center gap-3">
               <div className="flex items-center text-primary font-black text-2xl drop-shadow-sm font-display">
                  FinAI Nexus
               </div>
            </div>

            <div className="flex flex-col">
               <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">{activeTab === 'Dashboard' ? 'Dashboard Overview' : activeTab}</h2>
               <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-[#A3E635]">Online</span>
                 <div className="w-1.5 h-1.5 bg-[#A3E635] rounded-full animate-pulse" />
               </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setIsThemeOpen(!isThemeOpen)}
                  className="glass-pill px-5 py-2.5 rounded-full flex items-center gap-3 border border-white/40 shadow-sm hover:bg-white/40 transition-all group"
                >
                  <Palette className="w-4 h-4 text-primary" />
                  <span className="text-xs font-black text-gray-700 uppercase tracking-widest">{currentTheme.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 ${isThemeOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isThemeOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsThemeOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-2xl rounded-[32px] p-3 border border-white shadow-2xl z-50 flex flex-col gap-1"
                      >
                        {THEMES.map(theme => (
                          <button
                            key={theme.id}
                            onClick={() => {
                              setCurrentTheme(theme);
                              setIsThemeOpen(false);
                            }}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-gray-50 group ${currentTheme.id === theme.id ? 'bg-gray-50' : ''}`}
                          >
                            <div 
                              className={`w-10 h-10 rounded-xl relative overflow-hidden flex items-center justify-center text-white font-black text-xs shadow-lg transition-transform group-hover:scale-110`}
                              style={{ backgroundColor: theme.primary }}
                            >
                               {theme.label.charAt(0)}
                            </div>
                            <div className="flex flex-col items-start leading-tight">
                               <span className={`text-sm font-black ${currentTheme.id === theme.id ? 'text-primary' : 'text-gray-900 group-hover:text-primary transition-colors'}`}>{theme.label}</span>
                               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Interface Theme</span>
                            </div>
                            {currentTheme.id === theme.id && (
                              <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="glass-pill px-4 py-1.5 rounded-full flex items-center gap-3 border border-white/40 shadow-sm">
                <Search className="w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none text-xs font-bold text-gray-600 w-32" />
              </div>
              <button 
                onClick={() => setActiveTab('Smart Loss Strategy')}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/60 text-gray-700 shadow-sm hover:bg-white transition-all relative"
              >
                <Bell className="w-5 h-5" />
                {alertCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {alertCount}
                  </span>
                )}
                {alertCount === 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-lime-400 rounded-full border-2 border-white" />}
              </button>
            </div>
          </header>

          {renderContent()}
        </div>
      </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
