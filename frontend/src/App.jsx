import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import DepositPage from './pages/dashboard/DepositPage';
import ForecastPage from './pages/dashboard/ForecastPage';
import ESGPage from './pages/dashboard/ESGPage';
import NewsPage from './pages/dashboard/NewsPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import SHAPExplainerPage from './pages/dashboard/SHAPExplainerPage';
import TaxLossPage from './pages/dashboard/TaxLossPage';

// Admin pages
import { AdminPanel } from './pages/admin/AdminPanel';

function AdminPanelWrapper() {
  const navigate = useNavigate();
  return <AdminPanel onBack={() => navigate('/dashboard')} />;
}

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
            <Route path="/deposit" element={<DepositPage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/esg" element={<ESGPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/why-ai-chose-this" element={<SHAPExplainerPage />} />
            <Route path="/tax-loss-harvesting" element={<TaxLossPage />} />
          </Route>

          {/* Admin routes */}
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminPanelWrapper />
              </AdminRoute>
            } 
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
