import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { authService } from "../services/authService";
import { registerUnauthorizedHandler } from "../services/api";
import { TOKEN_KEY, USER_KEY } from "../utils/constants";
import { getErrorMessage } from "../utils/formatters";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((nextToken, nextUser) => {
    if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken);
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      clearSession();
    });
  }, [clearSession]);

  useEffect(() => {
    async function hydrate() {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authService.getProfile();
        const freshUser = data?.user || data;
        setUser(freshUser);
        localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    }
    hydrate();
  }, [clearSession]);

  const login = useCallback(
    async (credentials) => {
      try {
        const { data } = await authService.login(credentials);
        // Backend may return flat { _id, name, role, token } or nested { user: {...}, token }
        const user = data.user || {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        };
        persistSession(data.token, user);
        return { success: true, user };
      } catch (error) {
        return { success: false, message: getErrorMessage(error) };
      }
    },
    [persistSession]
  );

  const register = useCallback(
    async (payload) => {
      try {
        const { data } = await authService.register(payload);
        const user = data.user || {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        };
        if (data.token) {
          persistSession(data.token, user);
        }
        return { success: true, user };
      } catch (error) {
        return { success: false, message: getErrorMessage(error) };
      }
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    authService.logout().catch(() => {});
    clearSession();
  }, [clearSession]);

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  }, []);

  const value = {
    user,
    token,
    role: user?.role,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}