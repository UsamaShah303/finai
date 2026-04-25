import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Settings, User, Bell, Shield, Download, Moon, Sun, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUser, darkMode, setDarkMode } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    rebalancing: true,
    goalProgress: true,
    marketAlerts: true,
    weeklyReport: true,
    newsDigest: false,
  });

  const handleSave = () => {
    updateUser({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = `
FinAI Nexus - Financial Plan Report
Generated: ${new Date().toLocaleDateString()}
---------------------------------------

Client: ${user?.name}
Email: ${user?.email}
Risk Profile: ${user?.riskProfile || 'Not assessed'}
Member Since: ${user?.joinDate}

Portfolio Summary:
- Total Wealth: $2,847,500
- Total Returns: +$647,500 (29.4%)
- ESG Score: 76/100

This is a simulated report. In production, this would contain your complete financial plan.
    `;
    const blob = new Blob([doc], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FinAI_Nexus_Financial_Plan.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-surface-900 dark:text-white">Settings</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Manage your profile and preferences.</p>
      </div>

      {/* Profile */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">Profile Information</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-3xl font-bold text-white">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-lg font-bold text-surface-900 dark:text-white">{user?.name}</p>
              <p className="text-sm text-surface-500">{user?.email}</p>
              <p className="text-xs text-surface-400 mt-1">Member since {user?.joinDate}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <div>
              <p className="text-sm font-semibold text-surface-900 dark:text-white">Risk Profile</p>
              <p className="text-xs text-surface-400">{user?.riskProfile || 'Not assessed – take the quiz!'}</p>
            </div>
            {user?.riskProfile && (
              <span className="px-3 py-1 rounded-lg bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-bold">
                {user.riskProfile}
              </span>
            )}
          </div>

          <button onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
              saved
                ? 'bg-emerald-500 text-white'
                : 'gradient-primary text-white hover:shadow-lg hover:shadow-primary-500/25'
            }`}>
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Appearance */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          {darkMode ? <Moon className="w-5 h-5 text-primary-500" /> : <Sun className="w-5 h-5 text-primary-500" />}
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">Appearance</h2>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50">
          <div>
            <p className="text-sm font-semibold text-surface-900 dark:text-white">Dark Mode</p>
            <p className="text-xs text-surface-400">Use dark theme across the app</p>
          </div>
          <button onClick={() => setDarkMode(!darkMode)}
            className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${darkMode ? 'bg-primary-500' : 'bg-surface-300'}`}>
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${darkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">Notifications</h2>
        </div>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <button onClick={() => setNotifications({ ...notifications, [key]: !value })}
                className={`relative w-10 h-6 rounded-full transition-colors duration-300 ${value ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-600'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Download Plan */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Download className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">Financial Plan Export</h2>
        </div>
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">Download your complete financial plan including portfolio allocation, goals, and AI recommendations.</p>
        <button onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-primary text-white font-bold hover:shadow-lg hover:shadow-primary-500/25 transition-all">
          <Download className="w-4 h-4" />
          Download Full Financial Plan as PDF
        </button>
      </div>
    </div>
  );
}
