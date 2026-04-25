import { aiParameters } from '../../data/mockData';
import { useState } from 'react';
import { Sliders, Save, Clock, User, Edit2, Check, X, History } from 'lucide-react';

export default function AIParameters() {
  const [params, setParams] = useState(aiParameters);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (param) => {
    setEditId(param.id);
    setEditValue(param.value);
  };

  const handleSave = (id) => {
    setParams(params.map(p => p.id === id ? {
      ...p,
      value: editValue,
      lastModified: new Date().toISOString().split('T')[0],
    } : p));
    setEditId(null);
  };

  const categories = [...new Set(params.map(p => p.category))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white">AI Parameters</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Manage thresholds, rebalancing rules, and simulation settings.</p>
      </div>

      {categories.map(cat => (
        <div key={cat} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            {cat}
          </h3>
          <div className="space-y-3">
            {params.filter(p => p.category === cat).map(param => (
              <div key={param.id} className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 group">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-surface-900 dark:text-white">{param.name}</h4>
                  <p className="text-xs text-surface-400 mt-0.5">{param.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  {editId === param.id ? (
                    <div className="flex items-center gap-2">
                      <input value={editValue} onChange={(e) => setEditValue(e.target.value)}
                        className="w-32 px-3 py-1.5 rounded-lg bg-white dark:bg-surface-900 border border-primary-300 dark:border-primary-500 text-surface-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-primary-500 outline-none" />
                      <button onClick={() => handleSave(param.id)} className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg bg-surface-300 dark:bg-surface-600 text-white hover:bg-surface-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm font-bold font-mono text-surface-900 dark:text-white min-w-[80px] text-center">
                        {param.value}
                      </span>
                      <button onClick={() => handleEdit(param)} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 hover:text-surface-600 dark:hover:text-surface-300 opacity-0 group-hover:opacity-100 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-surface-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{param.lastModified}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{param.modifiedBy.split('@')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Audit Trail */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <History className="w-4 h-4" />
          Audit Trail
        </h3>
        <div className="space-y-2">
          {[
            { action: 'Updated Rebalancing Threshold from 3% to 5%', by: 'admin@finai.com', time: '2026-04-10 14:30' },
            { action: 'Updated Monte Carlo Simulations from 5000 to 10000', by: 'admin@finai.com', time: '2026-04-05 09:15' },
            { action: 'Updated Sentiment Score Threshold from 0.5 to 0.6', by: 'admin@finai.com', time: '2026-04-01 11:00' },
          ].map((entry, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0"></div>
              <span className="flex-1 text-surface-600 dark:text-surface-400">{entry.action}</span>
              <span className="text-xs text-surface-400">{entry.by} • {entry.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
