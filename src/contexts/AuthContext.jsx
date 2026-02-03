import { createContext, useContext, useState } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

function loadUserFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    localStorage.removeItem(STORAGE_KEYS.USER);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUserFromStorage);

  const login = (email, password) => {
    const userData = { email, name: email.split('@')[0] };
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    return true;
  };

  const signup = (email, password, name) => {
    const userData = { email, name: name || email.split('@')[0] };
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
