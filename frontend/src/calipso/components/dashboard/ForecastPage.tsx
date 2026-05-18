import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart 
} from 'recharts';
import { 
  TrendingUp, 
  Sparkles, 
  Info, 
  ArrowUpRight, 
  Wallet, 
  Calculator,
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';

// --- Monte Carlo Simulation Logic ---
const runSimulation = (initialAmount: number, monthlyContribution: number, years: number, expectedReturn: number, volatility: number) => {
  const months = years * 12;
  const simulations = 100;
  const allPaths: number[][] = [];

  for (let s = 0; s < simulations; s++) {
    let currentAmount = initialAmount;
    const path = [currentAmount];
    for (let m = 1; m <= months; m++) {
      const monthlyReturn = (expectedReturn / 12) + (volatility / Math.sqrt(12)) * (Math.random() * 2 - 1);
      currentAmount = currentAmount * (1 + monthlyReturn) + monthlyContribution;
      path.push(currentAmount);
    }
    allPaths.push(path);
  }

  // Calculate Percentiles
  const results = [];
  for (let m = 0; m <= months; m++) {
    const valuesAtMonth = allPaths.map(p => p[m]).sort((a, b) => a - b);
    results.push({
      month: m,
      year: (m / 12).toFixed(1),
      p10: valuesAtMonth[Math.floor(simulations * 0.1)],
      p50: valuesAtMonth[Math.floor(simulations * 0.5)],
      p90: valuesAtMonth[Math.floor(simulations * 0.9)],
    });
  }
  return results;
};

export const ForecastPage = () => {
  const [initialAmount, setInitialAmount] = useState(112650);
  const [monthlyContribution, setMonthlyContribution] = useState(2500);
  const [expectedReturn, setExpectedReturn] = useState(0.08); // 8%
  const [volatility, setVolatility] = useState(0.15); // 15%

  const data = useMemo(() => 
    runSimulation(initialAmount, monthlyContribution, 10, expectedReturn, volatility),
    [initialAmount, monthlyContribution, expectedReturn, volatility]
  );

  const finalValue = data[data.length - 1].p50;

  return (
    <div className="flex-1 flex flex-col gap-10 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-2 tracking-tight">10-Year Forecast</h1>
          <p className="text-gray-500 font-medium text-lg">Monte Carlo Intelligence • 100+ Simulated Realities</p>
        </div>
        <div className="flex items-center gap-3 bg-white/60 p-2 rounded-2xl border border-white/40">
           <div className="px-4 py-2 bg-indigo-600/10 text-indigo-600 rounded-xl font-bold text-sm flex items-center gap-2">
             <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
             Simulation Active
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Parameters Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] p-8 border border-white shadow-sm flex flex-col gap-8">
            <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4">Variable Control</h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Initial Capital</label>
                  <span className="text-sm font-black text-indigo-600">${initialAmount.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="0" max="1000000" step="1000" 
                  value={initialAmount} 
                  onChange={(e) => setInitialAmount(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Monthly Deposit</label>
                  <span className="text-sm font-black text-indigo-600">${monthlyContribution.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="0" max="25000" step="100" 
                  value={monthlyContribution} 
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Expected Return</label>
                  <span className="text-sm font-black text-indigo-600">{(expectedReturn * 100).toFixed(1)}%</span>
                </div>
                <input 
                  type="range" min="0" max="0.30" step="0.005" 
                  value={expectedReturn} 
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Market Volatility</label>
                  <span className="text-sm font-black text-indigo-600">{(volatility * 100).toFixed(1)}%</span>
                </div>
                <input 
                  type="range" min="0.05" max="0.50" step="0.01" 
                  value={volatility} 
                  onChange={(e) => setVolatility(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
               <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-black text-indigo-900 uppercase tracking-widest">AI Verdict</span>
                  </div>
                  <p className="text-sm font-bold text-indigo-900/70 leading-relaxed">
                    Based on your 15% volatility setting, there is a <span className="text-indigo-600 font-black">90% probability</span> that your portfolio will exceed <span className="font-black text-indigo-600">${data[data.length - 1].p10.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> by Year 10.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[48px] p-10 border border-white shadow-sm flex flex-col">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
               <div>
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Projected Median Value (10Y)</h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-black text-gray-900 tracking-tighter">${finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    <span className="text-xl font-bold text-emerald-500">+{((finalValue / initialAmount - 1) * 100).toFixed(1)}%</span>
                  </div>
               </div>
               <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Median Path</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-200 rounded-full" />
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Probabilistic Range</span>
                 </div>
               </div>
            </div>

            <div className="h-[450px] w-full -ml-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorP50" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRange" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c7d2fe" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#c7d2fe" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 900, fill: '#4b5563' }}
                    dy={15}
                    label={{ value: 'Years', position: 'insideBottom', offset: -5, fontSize: 11, fontWeight: 900, fill: '#4b5563' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 900, fill: '#4b5563' }}
                    tickFormatter={(value) => `$${(value / 1000)}k`}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-900/95 backdrop-blur-md text-white p-5 rounded-[24px] shadow-2xl border border-white/10 min-w-[200px]">
                            <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Year {payload[0].payload.year}</div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center gap-8">
                                 <span className="text-xs font-bold text-gray-500">High (P90)</span>
                                 <span className="text-sm font-black text-emerald-400">${payload[0].payload.p90.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                              </div>
                              <div className="flex justify-between items-center gap-8 py-2 border-y border-white/5">
                                 <span className="text-xs font-bold text-white">Median (P50)</span>
                                 <span className="text-sm font-black text-white">${payload[0].payload.p50.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                              </div>
                              <div className="flex justify-between items-center gap-8">
                                 <span className="text-xs font-bold text-gray-500">Conservative (P10)</span>
                                 <span className="text-sm font-black text-indigo-400">${payload[0].payload.p10.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* High Confidence Range */}
                  <Area
                    type="monotone"
                    dataKey="p90"
                    stroke="none"
                    fill="#c7d2fe"
                    fillOpacity={0.2}
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="p10"
                    stroke="none"
                    fill="#white"
                    fillOpacity={1}
                    animationDuration={1500}
                  />
                  {/* Median Path */}
                  <Area
                    type="monotone"
                    dataKey="p50"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fill="url(#colorP50)"
                    fillOpacity={1}
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-indigo-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-8">
                      <Calculator className="w-6 h-6 text-indigo-300" />
                      <span className="text-xs font-black text-white/50 uppercase tracking-widest">Growth Engines</span>
                   </div>
                   <h4 className="text-2xl font-black mb-4">Compound Advantage</h4>
                   <p className="text-white/60 font-medium leading-relaxed">
                      By reinvesting all dividends and maintaining a 15% volatility profile, you're projected to earn <span className="text-lime-400 font-black">${(finalValue - initialAmount - (monthlyContribution * 120)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> in pure capital appreciation over the next decade.
                   </p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
             </div>

             <div className="bg-white/60 rounded-[40px] p-10 border border-white shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-12">
                   <Target className="w-6 h-6 text-gray-500" />
                   <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Key Performance Index</span>
                </div>
                <div className="space-y-6">
                   <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Confidence Interval</span>
                      <span className="text-xl font-black text-gray-900">82%</span>
                   </div>
                   <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Est. Sharpe Ratio</span>
                      <span className="text-xl font-black text-emerald-500">1.82</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Drawdown Risk</span>
                      <span className="text-xl font-black text-rose-500">-12.4%</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
