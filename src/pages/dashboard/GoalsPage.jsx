import { useState } from 'react';
import { goalsData } from '../../data/mockData';
import { Target, Plus, Edit2, Trash2, X, Check, TrendingUp } from 'lucide-react';

const formatCurrency = (v) => `$${v.toLocaleString()}`;

export default function GoalsPage() {
  const [goals, setGoals] = useState(goalsData);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', target: '', current: '', deadline: '', icon: '🎯', priority: 'medium' });

  const icons = ['🎯', '🏠', '🚗', '🎓', '✈️', '💍', '🏖️', '👶', '💼', '🛡️'];

  const handleSave = () => {
    if (!form.name || !form.target) return;
    if (editId) {
      setGoals(goals.map(g => g.id === editId ? {
        ...g, ...form, target: Number(form.target), current: Number(form.current || 0),
        successProbability: Math.round(50 + Math.random() * 40),
      } : g));
    } else {
      setGoals([...goals, {
        id: Date.now().toString(),
        ...form,
        target: Number(form.target),
        current: Number(form.current || 0),
        successProbability: Math.round(50 + Math.random() * 40),
      }]);
    }
    setShowForm(false);
    setEditId(null);
    setForm({ name: '', target: '', current: '', deadline: '', icon: '🎯', priority: 'medium' });
  };

  const handleEdit = (goal) => {
    setForm({ name: goal.name, target: goal.target, current: goal.current, deadline: goal.deadline, icon: goal.icon, priority: goal.priority });
    setEditId(goal.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white">Financial Goals</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Track and manage your financial milestones.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', target: '', current: '', deadline: '', icon: '🎯', priority: 'medium' }); }}
          className="flex items-center gap-2 px-5 py-2.5 gradient-primary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all">
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="glass-card p-6 w-full max-w-md animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-surface-900 dark:text-white">{editId ? 'Edit Goal' : 'New Goal'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-surface-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {icons.map(i => (
                    <button key={i} onClick={() => setForm({ ...form, icon: i })}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${form.icon === i ? 'bg-primary-100 dark:bg-primary-500/20 ring-2 ring-primary-500' : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'}`}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Goal Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Dream Home"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Target ($)</label>
                  <input type="number" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="100000"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Current ($)</label>
                  <input type="number" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Deadline</label>
                  <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 font-semibold hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl gradient-primary text-white font-bold hover:shadow-lg hover:shadow-primary-500/25 transition-all flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                {editId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goals grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((goal) => {
          const pct = Math.round((goal.current / goal.target) * 100);
          const daysLeft = goal.deadline ? Math.max(0, Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))) : null;

          return (
            <div key={goal.id} className="glass-card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{goal.icon}</span>
                  <div>
                    <h3 className="text-base font-bold text-surface-900 dark:text-white">{goal.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      goal.priority === 'high' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                      : goal.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }`}>
                      {goal.priority}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(goal)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(goal.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-surface-400 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-surface-500">{formatCurrency(goal.current)}</span>
                  <span className="font-bold text-surface-900 dark:text-white">{formatCurrency(goal.target)}</span>
                </div>
                <div className="h-2.5 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                  <div className="h-full rounded-full gradient-primary transition-all duration-700" style={{ width: `${Math.min(100, pct)}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{pct}% complete</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1 ${
                  goal.successProbability >= 85 ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : goal.successProbability >= 70 ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {goal.successProbability}% likely
                </span>
              </div>

              {daysLeft !== null && (
                <p className="text-xs text-surface-400 mt-2">{daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline passed'}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
