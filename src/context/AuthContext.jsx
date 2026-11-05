import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { setUnauthorizedHandler } from '../api/client';

const TOKEN_KEY = 'agendaflow_token';
const USER_KEY = 'agendaflow_user';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch {
      return null;
    }
  });
  const [sessionExpired, setSessionExpired] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Recibe { token, user } tal como lo retorna POST /api/auth/login
  const loginWithToken = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setSessionExpired(false);
    setToken(data.token);
    setUser(data.user || null);
  }, []);

  // Si una petición devuelve 401, cerramos sesión y marcamos
  // que fue por expiración (para mostrar un aviso distinto en el login).
  useEffect(() => {
    setUnauthorizedHandler(() => {
      const hadToken = !!localStorage.getItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
      if (hadToken) setSessionExpired(true);
    });
  }, []);

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    loginWithToken,
    logout,
    sessionExpired,
    clearSessionExpired: () => setSessionExpired(false),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
