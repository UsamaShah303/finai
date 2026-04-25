import { useState } from 'react';
import { paycheckSplit } from '../../data/mockData';
import { Wallet, Brain, Info, DollarSign, TrendingUp, ShieldCheck, ShoppingBag } from 'lucide-react';

const formatCurrency = (v) => `$${v.toLocaleString()}`;

const categoryInfo = {
  needs: { icon: ShieldCheck, color: '#3b82f6', emoji: '🏠', desc: 'Rent, utilities, groceries, insurance, transportation – necessary expenses you can\'t skip.' },
  wants: { icon: ShoppingBag, color: '#8b5cf6', emoji: '🎮', desc: 'Entertainment, dining out, subscriptions, hobbies – things that make life enjoyable.' },
  savings: { icon: DollarSign, color: '#22c55e', emoji: '🏦', desc: 'Emergency fund, short-term goals, rainy day fund – your financial safety net.' },
  investments: { icon: TrendingUp, color: '#f59e0b', emoji: '📈', desc: 'Stocks, bonds, ETFs, retirement accounts – money growing for your future.' },
};

export default function PaycheckPage() {
  const [income, setIncome] = useState(paycheckSplit.monthlyIncome);
  const [splits, setSplits] = useState({
    needs: paycheckSplit.aiRecommendation.needs,
    wants: paycheckSplit.aiRecommendation.wants,
    savings: paycheckSplit.aiRecommendation.savings,
    investments: paycheckSplit.aiRecommendation.investments,
  });

  const updateSplit = (key, val) => {
    const remaining = 100 - val;
    const others = Object.keys(splits).filter(k => k !== key);
    const currentOthersTotal = others.reduce((s, k) => s + splits[k], 0);
    const newSplits = { ...splits, [key]: val };
    others.forEach(k => {
      newSplits[k] = currentOthersTotal > 0
        ? Math.round((splits[k] / currentOthersTotal) * remaining)
        : Math.round(remaining / others.length);
    });
    setSplits(newSplits);
  };

  const resetToAI = () => {
    setSplits({
      needs: paycheckSplit.aiRecommendation.needs,
      wants: paycheckSplit.aiRecommendation.wants,
      savings: paycheckSplit.aiRecommendation.savings,
      investments: paycheckSplit.aiRecommendation.investments,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white">Paycheck Splitter</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">AI-powered income allocation recommendations using Reinforcement Learning.</p>
      </div>

      {/* AI Recommendation Banner */}
      <div className="glass-card p-6 border-l-4 border-l-primary-500">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">AI Recommendation</h3>
            <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
              {paycheckSplit.aiRecommendation.reason}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Income input + Sliders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Income */}
          <div className="glass-card p-6">
            <label className="block text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
              Monthly Income
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-2xl font-bold text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          {/* Sliders */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Allocation Sliders</h3>
              <button onClick={resetToAI} className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">Reset to AI</button>
            </div>

            {Object.entries(splits).map(([key, value]) => {
              const info = categoryInfo[key];
              const amount = Math.round(income * value / 100);
              return (
                <div key={key} className="p-4 rounded-xl border border-surface-200 dark:border-surface-700/50 hover:border-surface-300 dark:hover:border-surface-600 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{info.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-surface-900 dark:text-white capitalize">{key}</h4>
                        <div className="text-right">
                          <span className="text-lg font-black" style={{ color: info.color }}>{value}%</span>
                          <span className="text-sm text-surface-400 ml-2">{formatCurrency(amount)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-surface-400 mt-0.5">{info.desc}</p>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => updateSplit(key, parseInt(e.target.value))}
                    className="w-full h-2.5 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: info.color }}
                  />
                  <div className="flex justify-between text-xs text-surface-400 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Monthly Summary</h3>
            <div className="space-y-3">
              {Object.entries(splits).map(([key, value]) => {
                const info = categoryInfo[key];
                const amount = Math.round(income * value / 100);
                return (
                  <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: info.color }} />
                      <span className="text-sm font-medium text-surface-700 dark:text-surface-300 capitalize">{key}</span>
                    </div>
                    <span className="text-sm font-bold text-surface-900 dark:text-white">{formatCurrency(amount)}</span>
                  </div>
                );
              })}
              <div className="border-t border-surface-200 dark:border-surface-700 pt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">Total</span>
                <span className="text-lg font-black text-surface-900 dark:text-white">{formatCurrency(income)}</span>
              </div>
            </div>
          </div>

          {/* Stacked bar visual */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Visual Split</h3>
            <div className="flex h-8 rounded-xl overflow-hidden">
              {Object.entries(splits).map(([key, value]) => (
                <div
                  key={key}
                  className="transition-all duration-500 flex items-center justify-center text-xs font-bold text-white"
                  style={{ width: `${value}%`, backgroundColor: categoryInfo[key].color, minWidth: value > 5 ? 'auto' : 0 }}
                >
                  {value > 8 && `${value}%`}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
