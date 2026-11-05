import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => Storage.getUser());
  const [token, setToken] = useState(() => Storage.getToken());

  useEffect(() => {
    // Keep in sync with local storage
    const storedUser = Storage.getUser();
    const storedToken = Storage.getToken();
    if (storedUser) setUser(storedUser);
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (authToken, authUser) => {
    Storage.setToken(authToken);
    Storage.setUser(authUser);
    setToken(authToken);
    setUser(authUser);
  };

  const logout = () => {
    Storage.clearToken();
    Storage.clearUser();
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated) => {
    const newUser = { ...user, ...updated };
    Storage.setUser(newUser);
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

