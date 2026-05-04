import { adminKPIs } from '../../data/mockData';
import { Users, Activity, DollarSign, Clock, TrendingUp, Server, BarChart3, ArrowUpRight } from 'lucide-react';

const formatNum = (n) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

const kpiCards = [
  { label: 'Total Users', value: adminKPIs.totalUsers.toLocaleString(), change: `+${adminKPIs.userGrowth}%`, icon: Users, color: '#3b82f6' },
  { label: 'Active Sessions', value: adminKPIs.activeSessions.toString(), change: 'Live', icon: Activity, color: '#22c55e' },
  { label: 'Total AUM', value: `$${(adminKPIs.totalAUM / 1000000).toFixed(1)}M`, change: `+${adminKPIs.revenueGrowth}%`, icon: DollarSign, color: '#f59e0b' },
  { label: 'Avg Portfolio', value: `$${adminKPIs.avgPortfolioSize.toLocaleString()}`, change: '+5.3%', icon: BarChart3, color: '#8b5cf6' },
  { label: 'Active Users', value: adminKPIs.activeUsers.toLocaleString(), change: '+8.7%', icon: TrendingUp, color: '#06b6d4' },
  { label: 'Platform Status', value: adminKPIs.platformStatus, change: '99.97%', icon: Server, color: '#22c55e' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white">System Dashboard</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">High-level platform KPIs and system overview.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-surface-400">
          <Clock className="w-4 h-4" />
          Last updated: {adminKPIs.lastUpdated}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpiCards.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="neo-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">{label}</span>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-surface-900 dark:text-white">{value}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-500">{change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="neo-card p-6">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Platform Activity (24h)</h3>
          <div className="space-y-3">
            {[
              { label: 'New Registrations', value: '47', trend: '+12%' },
              { label: 'Risk Quizzes Completed', value: '128', trend: '+8%' },
              { label: 'Portfolio Rebalances', value: '23', trend: '+3%' },
              { label: 'Reports Downloaded', value: '56', trend: '+15%' },
              { label: 'API Calls', value: '124.5k', trend: '+6%' },
            ].map(({ label, value, trend }) => (
              <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                <span className="text-sm text-surface-600 dark:text-surface-400">{label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-surface-900 dark:text-white">{value}</span>
                  <span className="text-xs font-semibold text-emerald-500">{trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="neo-card p-6">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">User Distribution</h3>
          <div className="space-y-3">
            {[
              { plan: 'Free Tier', users: 8234, pct: 64, color: '#94a3b8' },
              { plan: 'Premium', users: 3456, pct: 27, color: '#3b82f6' },
              { plan: 'Enterprise', users: 892, pct: 7, color: '#8b5cf6' },
              { plan: 'Admin', users: 265, pct: 2, color: '#f59e0b' },
            ].map(({ plan, users, pct, color }) => (
              <div key={plan}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-surface-600 dark:text-surface-400">{plan}</span>
                  <span className="font-bold text-surface-900 dark:text-white">{users.toLocaleString()} ({pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
