// context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Login with Laravel API
  const login = async (email, password) => {
    try {
      console.log('Sending login request...');
      const res = await fetch('http://192.168.1.2:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, password_confirmation: password }),
      });
      const data = await res.text();
      if (!res.ok) throw new Error(
        data.errors ? Object.values(data.errors).join('\n') : (data.message || 'Login failed')
      );
      setUser(null); // No user returned, just token
      setToken(data || null);
      return data;
    } catch (err) {
      console.log('Login error:', err);
      throw err;
    }
  };

  // Register with Laravel API
  const register = async (name, email, password, passwordConfirmation) => {
    try {
      console.log('Sending register request...');
      const res = await fetch('http://192.168.1.2:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });
      console.log('Register response status:', res.status);
      const data = await res.text();
      console.log('Register response data:', data);
      if (!res.ok) throw new Error(
        data.errors ? Object.values(data.errors).join('\n') : 'Registration failed'
      );
      setUser(null);
      setToken(data || null);
      return data;
    } catch (err) {
      console.log('Register error:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
