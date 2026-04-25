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
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400">Rebalancing Alert</h3>
          </div>
          <p className="text-sm text-amber-600 dark:text-amber-300">
            {driftAlerts.length} asset(s) have drifted more than 5% from target allocation. Consider rebalancing your portfolio.
          </p>
          <button className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Auto-Rebalance
          </button>
        </div>
      )}

      {/* Pie + Table */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-6">Allocation</h3>
          <div className="w-56 h-56 mx-auto">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={portfolio} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
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
        <div className="glass-card p-6 lg:col-span-2 overflow-x-auto">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Asset Breakdown</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
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
                  <td className="py-3 px-2 font-medium text-surface-900 dark:text-white">{asset.name}</td>
                  <td className="py-3 px-2 text-surface-500 font-mono text-xs">{asset.ticker}</td>
                  <td className="py-3 px-2 text-right font-semibold text-surface-900 dark:text-white">{asset.allocation}%</td>
                  <td className="py-3 px-2 text-right text-surface-600 dark:text-surface-300">{formatCurrency(asset.value)}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={`flex items-center justify-end gap-1 ${asset.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {asset.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {asset.change > 0 ? '+' : ''}{asset.change}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                      Math.abs(asset.drift) > 5
                        ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                        : Math.abs(asset.drift) > 2
                        ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
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
