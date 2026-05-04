import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('finai_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('finai_darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  const [marketPreference, setMarketPreference] = useState(() => {
    const saved = localStorage.getItem('finai_market');
    return saved || 'both';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('finai_darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('finai_market', marketPreference);
  }, [marketPreference]);

  const login = (email, password) => {
    const isAdmin = email === 'admin@finai.com';
    const userData = {
      id: '1',
      name: isAdmin ? 'Admin User' : 'Usama Ahmed',
      email,
      role: isAdmin ? 'admin' : 'user',
      avatar: null,
      riskProfile: 'Moderate',
      joinDate: '2024-01-15',
    };
    setUser(userData);
    localStorage.setItem('finai_user', JSON.stringify(userData));
    return userData;
  };

  const register = (name, email, password) => {
    const userData = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user',
      avatar: null,
      riskProfile: null,
      joinDate: new Date().toISOString().split('T')[0],
    };
    setUser(userData);
    localStorage.setItem('finai_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finai_user');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('finai_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      user,
      darkMode,
      setDarkMode,
      marketPreference,
      setMarketPreference,
      login,
      register,
      logout,
      updateUser,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
