import { useAuth } from '../../context/AuthContext';
import MarketToggle from '../../components/shared/MarketToggle';
import { portfolioData, assetBreakdown } from '../../data/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

const formatCurrency = (v) => `$${v.toLocaleString()}`;

export default function PortfolioPage() {
  const { marketPreference } = useAuth();
  const portfolio = portfolioData[marketPreference] || portfolioData.both;
  const driftAlerts = assetBreakdown.filter(a => Math.abs(a.drift) > 5);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-surface-800 p-3 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 text-sm">
        <p className="font-semibold text-surface-900 dark:text-white">{payload[0].name}</p>
        <p className="text-primary-500 font-bold">{payload[0].value}%</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white">Portfolio</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Detailed asset breakdown and rebalancing alerts.</p>
        </div>
        <MarketToggle />
      </div>

      {/* Rebalancing Alert */}
      {driftAlerts.length > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 border border-amber-400/50 shadow-xl shadow-amber-500/20 relative overflow-hidden group">
          {/* Background graphic */}
          <svg className="absolute -top-10 -right-10 w-40 h-40 opacity-20 text-white transform group-hover:rotate-12 transition-transform duration-700 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
            <path d="M43.7,-70.7C55.4,-64.1,62.8,-48.9,71.2,-34.5C79.6,-20.1,89,-6.4,87.6,6.3C86.1,18.9,73.8,30.5,62.9,41.9C52.1,53.2,42.7,64.3,30.2,71.1C17.7,77.9,2,80.3,-12.3,77.8C-26.6,75.3,-39.5,67.8,-51.8,58.8C-64.1,49.8,-75.8,39.3,-80.7,26.1C-85.6,12.9,-83.8,-3.1,-78.3,-17.8C-72.8,-32.5,-63.6,-45.9,-51.1,-52.1C-38.6,-58.3,-22.8,-57.4,-7.8,-45.2C7.2,-33,22.4,-15,32.1,-77.4L43.7,-70.7Z" transform="translate(50 50) scale(1.1)" />
          </svg>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <AlertTriangle className="w-5.5 h-5.5 text-white" />
                <h3 className="text-base font-extrabold text-white tracking-tight">Rebalancing Alert</h3>
              </div>
              <p className="text-sm font-medium text-amber-50 leading-relaxed max-w-xl">
                {driftAlerts.length} asset(s) have drifted more than 5% from their target allocation. Align your portfolio back to optimal AI targets.
              </p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-amber-600 text-sm font-extrabold hover:bg-amber-50 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-sm">
              <RefreshCw className="w-4 h-4" />
              Auto-Rebalance
            </button>
          </div>
        </div>
      )}

      {/* Pie + Table */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="neo-card p-6 relative overflow-hidden group">
          {/* Abstract background SVG */}
          <svg className="absolute -bottom-10 -left-10 w-48 h-48 opacity-[0.03] text-sky-900 pointer-events-none group-hover:scale-110 transition-transform duration-1000" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" strokeWidth="2" stroke="currentColor" fill="none"/>
            <circle cx="50" cy="50" r="30" strokeWidth="2" stroke="currentColor" fill="none" strokeDasharray="5 5"/>
          </svg>
          <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10">Allocation</h3>
          <div className="w-56 h-56 mx-auto relative z-10 filter drop-shadow-xl">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={portfolio} cx="50%" cy="50%" innerRadius={64} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                  {portfolio.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {portfolio.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm text-surface-600 dark:text-surface-400">{name}</span>
                </div>
                <span className="text-sm font-bold text-surface-900 dark:text-white">{value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Table */}
        <div className="neo-card p-6 lg:col-span-2 overflow-x-auto relative z-10">
          <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-4">Asset Breakdown</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                <th className="text-left py-3 px-2 text-xs font-semibold text-surface-400 uppercase">Asset</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-surface-400 uppercase">Ticker</th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-surface-400 uppercase">Alloc.</th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-surface-400 uppercase">Value</th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-surface-400 uppercase">24h</th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-surface-400 uppercase">Drift</th>
              </tr>
            </thead>
            <tbody>
              {assetBreakdown.map((asset) => (
                <tr key={asset.ticker} className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <td className="py-3.5 px-2 font-bold text-slate-800 dark:text-white">{asset.name}</td>
                  <td className="py-3.5 px-2 text-slate-400 font-mono text-xs font-semibold bg-slate-50 dark:bg-slate-800/50 rounded-lg inline-block mt-2 mb-2 ml-2">{asset.ticker}</td>
                  <td className="py-3.5 px-2 text-right font-extrabold text-sky-600 dark:text-sky-400">{asset.allocation}%</td>
                  <td className="py-3.5 px-2 text-right font-medium text-slate-600 dark:text-slate-300">{formatCurrency(asset.value)}</td>
                  <td className="py-3.5 px-2 text-right">
                    <span className={`flex items-center justify-end gap-0.5 font-bold ${asset.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {asset.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {asset.change > 0 ? '+' : ''}{asset.change}%
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-extrabold shadow-sm border ${
                      Math.abs(asset.drift) > 5
                        ? 'bg-red-50 text-red-600 border-red-200/50'
                        : Math.abs(asset.drift) > 2
                        ? 'bg-amber-50 text-amber-600 border-amber-200/50'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200/50'
                    }`}>
                      {asset.drift > 0 ? '+' : ''}{asset.drift}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
