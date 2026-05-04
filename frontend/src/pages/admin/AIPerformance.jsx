import { aiPerformance } from '../../data/mockData';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Cpu, Clock, Target, AlertTriangle } from 'lucide-react';

export default function AIPerformance() {
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white dark:bg-surface-800 p-3 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 text-sm">
        <p className="font-semibold text-surface-900 dark:text-white mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white">AI Performance</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Inference time, model drift, and output distribution metrics.</p>
      </div>

      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Inference Time', value: `${aiPerformance.avgInferenceTime}ms`, icon: Clock, color: '#3b82f6' },
          { label: 'P95 Latency', value: `${aiPerformance.p95InferenceTime}ms`, icon: Cpu, color: '#f59e0b' },
          { label: 'Model Accuracy', value: `${aiPerformance.modelAccuracy}%`, icon: Target, color: '#22c55e' },
          { label: 'Drift Score', value: `${aiPerformance.driftScore}%`, icon: AlertTriangle, color: aiPerformance.driftScore > 5 ? '#ef4444' : '#22c55e' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="neo-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-surface-400 uppercase tracking-wider">{label}</span>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <p className="text-2xl font-black" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Inference Time Chart */}
      <div className="neo-card p-6">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Inference Latency (24h)</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={aiPerformance.inferenceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="latency" name="Latency (ms)" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="requests" name="Requests" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Output Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="neo-card p-6">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Output Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={aiPerformance.outputDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="count" nameKey="label" stroke="none">
                  {aiPerformance.outputDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="neo-card p-6">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Request Volume (24h)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={aiPerformance.inferenceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="requests" name="Requests" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
