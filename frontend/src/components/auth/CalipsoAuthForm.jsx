import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Globe, Loader2, Lock, Mail, Sparkles, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CalipsoAuthForm({ mode }) {
  const isRegister = mode === 'register';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: 'Pakistan',
  });
  const { login, register, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.email || !formData.password || (isRegister && !formData.name)) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 550));

    let nextPath = '/dashboard';

    if (isRegister) {
      const registeredUser = register(formData.name, formData.email, formData.password);
      updateUser({ ...registeredUser, country: formData.country, onboardingComplete: true });
    } else {
      const loggedInUser = login(formData.email, formData.password);
      if (loggedInUser?.role === 'admin') {
        nextPath = '/admin';
      }
    }

    setLoading(false);
    navigate(nextPath, { replace: true });
  };

  return (
    <div className="calipso-scope min-h-screen w-full bg-mesh flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-full overflow-hidden pointer-events-none opacity-50">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute top-0 scale-150 rotate-12 opacity-40">
          <path d="M0,1000 C300,800 400,900 600,600 C800,300 900,400 1000,0 L1000,1000 Z" fill="#65A30D" fillOpacity="0.2" />
        </svg>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute top-0 scale-125 -translate-x-1/2 opacity-30">
          <path d="M0,500 C200,600 400,400 600,800 C800,950 1000,600 1000,200 L1000,1000 L0,1000 Z" fill="#3B82F6" fillOpacity="0.1" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[48px] p-8 sm:p-10 border border-white shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
            {isRegister ? 'Join Calipso' : 'Welcome Back'}
          </h1>
          <p className="text-gray-500 font-medium">
            {isRegister ? 'Start your intelligent investment journey today.' : 'Sign in to access your financial intelligence.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                required
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent focus:border-primary/30 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-500"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              required
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent focus:border-primary/30 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              required
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent focus:border-primary/30 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {isRegister && (
            <div className="relative">
              <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select
                value={formData.country}
                onChange={(event) => setFormData({ ...formData, country: event.target.value })}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent focus:border-primary/30 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-900 appearance-none cursor-pointer"
              >
                <option value="Pakistan">Pakistan</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Germany">Germany</option>
              </select>
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50 mt-4 group"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {isRegister ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-500 font-bold text-sm">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link to={isRegister ? '/login' : '/register'} className="text-primary hover:underline underline-offset-4">
              {isRegister ? 'Sign In' : 'Create Account'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
