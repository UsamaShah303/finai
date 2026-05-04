import { errorLogs } from '../../data/mockData';
import { useState } from 'react';
import { AlertTriangle, Search, Filter, AlertCircle, Info, XCircle } from 'lucide-react';

const getLevelStyle = (l) => {
  if (l === 'ERROR') return 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400';
  if (l === 'WARN') return 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400';
  return 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400';
};

const getLevelIcon = (l) => {
  if (l === 'ERROR') return <XCircle className="w-4 h-4 text-red-500" />;
  if (l === 'WARN') return <AlertCircle className="w-4 h-4 text-amber-500" />;
  return <Info className="w-4 h-4 text-blue-500" />;
};

export default function ErrorLogs() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const filtered = errorLogs.filter(log => {
    const matchSearch = !search || log.message.toLowerCase().includes(search.toLowerCase()) || log.service.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchSearch && matchLevel;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white">Error Logs</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Filterable, time-stamped system logs with sensitive data redacted.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
        </div>
        <div className="flex gap-2">
          {['all', 'ERROR', 'WARN', 'INFO'].map(level => (
            <button key={level} onClick={() => setLevelFilter(level)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                levelFilter === level ? 'gradient-primary text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-500 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}>
              {level === 'all' ? 'All' : level}
            </button>
          ))}
        </div>
      </div>

      {/* Logs */}
      <div className="space-y-3">
        {filtered.map((log) => (
          <div key={log.id} className="neo-card p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center gap-3 md:w-48 flex-shrink-0">
                {getLevelIcon(log.level)}
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${getLevelStyle(log.level)}`}>{log.level}</span>
                <span className="text-xs text-surface-400 font-mono">{log.timestamp.split(' ')[1]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-primary-500 px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-500/10">{log.service}</span>
                  <span className="text-xs text-surface-400">{log.timestamp.split(' ')[0]}</span>
                </div>
                <p className="text-sm text-surface-700 dark:text-surface-300 font-mono truncate">{log.message}</p>
              </div>
              <span className="text-xs text-surface-400 font-mono flex-shrink-0">{log.user}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
