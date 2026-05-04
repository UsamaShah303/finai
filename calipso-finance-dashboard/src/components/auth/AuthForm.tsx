import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Globe, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { authApi } from '../../services/api';
import { useAuthStore } from '../../lib/authStore';
import toast from 'react-hot-toast';

interface AuthFormProps {
  mode: 'login' | 'register';
  onToggle: () => void;
  onSuccess: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggle, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: 'United States'
  });

  const setAuth = useAuthStore(state => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'register') {
        const data = await authApi.register(formData);
        setAuth(data.token, data.user);
        toast.success('Account created successfully!');
      } else {
        const data = await authApi.login({ 
          email: formData.email, 
          password: formData.password 
        });
        setAuth(data.token, data.user);
        toast.success('Welcome back!');
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-2xl rounded-[48px] p-10 border border-white shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
            {mode === 'register' ? 'Join Calipso' : 'Welcome Back'}
          </h1>
          <p className="text-gray-500 font-medium">
            {mode === 'register' 
              ? 'Start your intelligent investment journey today.' 
              : 'Sign in to access your financial intelligence.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                required
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent focus:border-primary/30 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              required
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent focus:border-primary/30 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              required
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent focus:border-primary/30 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {mode === 'register' && (
            <div className="relative">
              <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent focus:border-primary/30 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-900 appearance-none cursor-pointer"
              >
                <option value="United States">United States</option>
                <option value="Pakistan">Pakistan</option>
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
                {mode === 'register' ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-500 font-bold text-sm">
            {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={onToggle}
              className="text-primary hover:underline underline-offset-4"
            >
              {mode === 'register' ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
