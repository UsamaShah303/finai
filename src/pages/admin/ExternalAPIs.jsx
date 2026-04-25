import { externalAPIs } from '../../data/mockData';
import { Server, CheckCircle, AlertTriangle, XCircle, RefreshCw, ExternalLink, Clock } from 'lucide-react';

const getStatusIcon = (s) => {
  if (s === 'Operational') return <CheckCircle className="w-5 h-5 text-emerald-500" />;
  if (s === 'Degraded') return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  return <XCircle className="w-5 h-5 text-red-500" />;
};

const getStatusStyle = (s) => {
  if (s === 'Operational') return 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  if (s === 'Degraded') return 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400';
  return 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400';
};

const getLatencyColor = (l) => l < 200 ? 'text-emerald-500' : l < 500 ? 'text-amber-500' : 'text-red-500';

export default function ExternalAPIsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white">External APIs Monitor</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Status, latency, and alerts for all external data sources.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm font-medium">
          <RefreshCw className="w-4 h-4" />
          Refresh All
        </button>
      </div>

      {/* Alert for degraded */}
      {externalAPIs.some(a => a.status !== 'Operational') && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400">Service Alert</h3>
              <p className="text-sm text-amber-600 dark:text-amber-300">
                {externalAPIs.filter(a => a.status !== 'Operational').map(a => a.name).join(', ')} experiencing issues.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* API Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {externalAPIs.map((api) => (
          <div key={api.name} className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(api.status)}
                <h3 className="text-base font-bold text-surface-900 dark:text-white">{api.name}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusStyle(api.status)}`}>
                {api.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                <p className="text-xs text-surface-400 mb-0.5">Latency</p>
                <p className={`text-lg font-bold ${getLatencyColor(api.latency)}`}>{api.latency}ms</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                <p className="text-xs text-surface-400 mb-0.5">Uptime</p>
                <p className="text-lg font-bold text-surface-900 dark:text-white">{api.uptime}%</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-surface-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {api.lastCheck}
              </span>
              <span>{api.calls24h.toLocaleString()} calls/24h</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
