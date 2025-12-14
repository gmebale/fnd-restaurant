import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../lib/api';
import { getUser, setUser, removeTokens } from '../config/api.config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    // Try to get user from localStorage
    const storedUser = getUser();
    return storedUser;
  });
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('fnd_access_token');
        if (token) {
          // Verify token by fetching current user
          const currentUser = await api.getCurrentUser();
          setUserState(currentUser);
          setUser(currentUser);
        }
      } catch (error) {
        // Token invalid or expired, clear storage
        removeTokens();
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      setUserState(data.user);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.register(userData);
      setUserState(data.user);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUserState(null);
      removeTokens();
    }
  };

  const loginAsAdmin = async (email, password) => {
    try {
      const data = await login(email, password);
      if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
        return data;
      } else {
        await logout();
        throw new Error('Access denied: Admin privileges required');
      }
    } catch (error) {
      throw error;
    }
  };

  const updateUser = (updatedUser) => {
    setUserState(updatedUser);
    setUser(updatedUser);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await api.getCurrentUser();
      setUserState(currentUser);
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginAsAdmin,
        updateUser,
        refreshUser,
        setUser: updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
