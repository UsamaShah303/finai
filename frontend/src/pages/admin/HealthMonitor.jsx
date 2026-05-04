import { healthData } from '../../data/mockData';
import { Activity, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

const getStatusIcon = (s) => {
  if (s === 'Operational') return <CheckCircle className="w-5 h-5 text-emerald-500" />;
  if (s === 'Warning') return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  return <XCircle className="w-5 h-5 text-red-500" />;
};

const getStatusBg = (s) => {
  if (s === 'Operational') return 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  if (s === 'Warning') return 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400';
  return 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400';
};

const getLatencyColor = (l) => l < 100 ? 'text-emerald-500' : l < 500 ? 'text-amber-500' : 'text-red-500';

export default function HealthMonitor() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white">Health Monitor</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Real-time status of all backend services.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm font-medium">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Overall status */}
      <div className="neo-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">All Systems Operational</h2>
            <p className="text-sm text-surface-400">1 service with warning – News Aggregator experiencing high latency</p>
          </div>
        </div>
      </div>

      {/* Services grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {healthData.map((service) => (
          <div key={service.service} className="neo-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(service.status)}
                <h3 className="text-base font-bold text-surface-900 dark:text-white">{service.service}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusBg(service.status)}`}>
                {service.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                <p className="text-xs text-surface-400 mb-0.5">Uptime</p>
                <p className="text-lg font-bold text-surface-900 dark:text-white">{service.uptime}%</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                <p className="text-xs text-surface-400 mb-0.5">Latency</p>
                <p className={`text-lg font-bold ${getLatencyColor(service.latency)}`}>{service.latency}ms</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
