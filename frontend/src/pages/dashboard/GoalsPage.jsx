import { useState } from 'react';
import { goalsData } from '../../data/mockData';
import { Target, Home, Car, GraduationCap, Plane, Gem, Umbrella, Baby, Briefcase, Shield, Plus, Edit2, Trash2, X, Check, TrendingUp } from 'lucide-react';

const EMOJI_TO_ICON = {
  '🎯': Target, '🏠': Home, '🚗': Car, '🎓': GraduationCap, '✈️': Plane,
  '💍': Gem, '🏖️': Umbrella, '👶': Baby, '💼': Briefcase, '🛡️': Shield
};

const formatCurrency = (v) => `$${v.toLocaleString()}`;

export default function GoalsPage() {
  const [goals, setGoals] = useState(goalsData);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', target: '', current: '', deadline: '', icon: '🎯', priority: 'medium' });



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
          className="flex items-center gap-2 px-5 py-2.5 bg-[#ccff00] text-slate-900 font-extrabold rounded-2xl shadow-md shadow-[#ccff00]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all">
          <Plus className="w-4 h-4" strokeWidth={3} />
          Add Goal
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="neo-card p-6 w-full max-w-md animate-slide-up" onClick={(e) => e.stopPropagation()}>
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
                  {Object.keys(EMOJI_TO_ICON).map(emoji => {
                    const IconComp = EMOJI_TO_ICON[emoji];
                    return (
                      <button key={emoji} onClick={() => setForm({ ...form, icon: emoji })}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${form.icon === emoji ? 'bg-[#ccff00]/20 ring-2 ring-[#ccff00] text-slate-900 dark:text-[#ccff00]' : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-500'}`}>
                        <IconComp className="w-5 h-5" />
                      </button>
                    );
                  })}
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
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-[#ccff00] text-slate-900 font-bold hover:shadow-lg hover:shadow-[#ccff00]/25 transition-all flex items-center justify-center gap-2">
                <Check className="w-4 h-4" strokeWidth={3} />
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
            <div key={goal.id} className="neo-card p-6 group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              
              {/* Priority Accent Line */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  goal.priority === 'high' ? 'bg-red-500' 
                : goal.priority === 'medium' ? 'bg-amber-500' 
                : 'bg-sky-500'
              }`} />

              <div className="flex justify-between items-start mb-6 pl-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105">
                    {(() => {
                      const GoalIcon = EMOJI_TO_ICON[goal.icon] || Target;
                      return <GoalIcon className="w-6 h-6 text-slate-700 dark:text-slate-300" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{goal.name}</h3>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize">{goal.priority} Priority</span>
                  </div>
                </div>
                {/* Hover Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(goal)} className="p-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(goal.id)} className="p-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pl-2">
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {formatCurrency(goal.current)}
                </div>
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Goal: {formatCurrency(goal.target)}
                </div>

                {/* Segmented Progress */}
                <div className="mt-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Progress</span>
                    <span className="text-[11px] font-extrabold text-[#ccff00] drop-shadow-sm bg-slate-900 px-2.5 py-1 rounded-md tracking-wider">
                      {pct}%
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const filledSegments = Math.round((pct / 100) * 20);
                      const isFilled = i < filledSegments;
                      return (
                        <div key={i} className={`h-2 flex-1 rounded-sm transition-all duration-500 ${
                          isFilled ? 'bg-[#ccff00] shadow-[0_0_8px_rgba(204,255,0,0.4)]' : 'bg-slate-100 dark:bg-slate-800'
                        }`} />
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center pl-2">
                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  {daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline passed') : 'No deadline'}
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md flex items-center gap-1 border ${
                  goal.successProbability >= 80 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                  : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {goal.successProbability}% AI Prob.
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
