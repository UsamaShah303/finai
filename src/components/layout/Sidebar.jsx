import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, PieChart, Wallet, Target, TrendingUp,
  Leaf, Newspaper, Settings, Shield, ChevronLeft, ChevronRight,
  LogOut, Moon, Sun, ClipboardList, Menu, X, Bot,
  Activity, AlertTriangle, BarChart3, Cpu, Server, Sliders
} from 'lucide-react';

const userNavItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/portfolio', icon: PieChart, label: 'Portfolio' },
  { path: '/paycheck', icon: Wallet, label: 'Paycheck Splitter' },
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/risk-quiz', icon: ClipboardList, label: 'Risk Assessment' },
  { path: '/forecast', icon: TrendingUp, label: 'Forecast' },
  { path: '/esg', icon: Leaf, label: 'ESG & Sustainability' },
  { path: '/news', icon: Newspaper, label: 'News Sentiment' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const adminNavItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'System Dashboard' },
  { path: '/admin/health', icon: Activity, label: 'Health Monitor' },
  { path: '/admin/errors', icon: AlertTriangle, label: 'Error Logs' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Usage Analytics' },
  { path: '/admin/ai-performance', icon: Cpu, label: 'AI Performance' },
  { path: '/admin/ai-parameters', icon: Sliders, label: 'AI Parameters' },
  { path: '/admin/apis', icon: Server, label: 'External APIs' },
];

export default function Sidebar() {
  const { user, darkMode, setDarkMode, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const navItems = isAdminRoute ? adminNavItems : userNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarContent = (
    <div className={`flex flex-col h-full bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700/50 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-200 dark:border-surface-700/50">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold text-surface-900 dark:text-white whitespace-nowrap">FinAI Nexus</h1>
            {isAdminRoute && <p className="text-[10px] text-primary-400 font-semibold tracking-wider uppercase -mt-1">ADMIN PANEL</p>}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {isAdmin && !isAdminRoute && (
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-2 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
          >
            <Shield className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>Admin Panel</span>}
          </Link>
        )}
        {isAdminRoute && (
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-2 bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-500/20 transition-colors"
          >
            <LayoutDashboard className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>Back to App</span>}
          </Link>
        )}
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
                }`}
              title={collapsed ? label : undefined}
            >
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-primary-500' : ''}`} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-surface-200 dark:border-surface-700/50 p-2 space-y-1">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          {darkMode ? <Sun className="w-[18px] h-[18px] flex-shrink-0" /> : <Moon className="w-[18px] h-[18px] flex-shrink-0" />}
          {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-[18px] h-[18px]" /> : <ChevronLeft className="w-[18px] h-[18px]" />}
          {!collapsed && <span>Collapse</span>}
        </button>

        {/* User info */}
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/50 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-surface-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-xl bg-white dark:bg-surface-800 shadow-lg border border-surface-200 dark:border-surface-700"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block h-screen sticky top-0">
        {sidebarContent}
      </div>
    </>
  );
}
