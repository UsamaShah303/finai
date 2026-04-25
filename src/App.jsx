import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, PublicRoute } from './components/layout/RouteGuards';
import DashboardLayout from './components/layout/DashboardLayout';

// Public pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Dashboard pages
import DashboardPage from './pages/dashboard/DashboardPage';
import PortfolioPage from './pages/dashboard/PortfolioPage';
import PaycheckPage from './pages/dashboard/PaycheckPage';
import GoalsPage from './pages/dashboard/GoalsPage';
import RiskQuizPage from './pages/dashboard/RiskQuizPage';
import PreviewPage from './pages/dashboard/PreviewPage';
import ForecastPage from './pages/dashboard/ForecastPage';
import ESGPage from './pages/dashboard/ESGPage';
import NewsPage from './pages/dashboard/NewsPage';
import SettingsPage from './pages/dashboard/SettingsPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import HealthMonitor from './pages/admin/HealthMonitor';
import ErrorLogs from './pages/admin/ErrorLogs';
import UsageAnalytics from './pages/admin/UsageAnalytics';
import AIPerformance from './pages/admin/AIPerformance';
import AIParameters from './pages/admin/AIParameters';
import ExternalAPIs from './pages/admin/ExternalAPIs';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Protected user routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/paycheck" element={<PaycheckPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/risk-quiz" element={<RiskQuizPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/esg" element={<ESGPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute><DashboardLayout /></AdminRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/health" element={<HealthMonitor />} />
            <Route path="/admin/errors" element={<ErrorLogs />} />
            <Route path="/admin/analytics" element={<UsageAnalytics />} />
            <Route path="/admin/ai-performance" element={<AIPerformance />} />
            <Route path="/admin/ai-parameters" element={<AIParameters />} />
            <Route path="/admin/apis" element={<ExternalAPIs />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
