// context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();
import API_BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Login with Laravel API
  const login = async (email, password) => {
    try {
      console.log('Sending login request...');
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, password_confirmation: password }),
      });

      const text = await res.text();
      console.log('Raw login response:', text);

      let token;
      let data;
      try {
        data = JSON.parse(text);
        token = data.token;
      } catch (e) {
        token = text;
      }

      if (!res.ok) {
        // If data exists and has errors/message, use them; otherwise, use generic message
        if (data && data.errors) {
          throw new Error(Object.values(data.errors).join('\n'));
        } else if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Login failed');
        }
      }
      if (!token) throw new Error('No token returned from API');

      setUser(null);
      setToken(token);
      await AsyncStorage.setItem('token', token);
      console.log('Token used for fetch:', token);
      return token;
    } catch (err) {
      console.log('Login error:', err);
      throw err;
    }
  };

  // Register with Laravel API
  const register = async (email, password, passwordConfirmation) => {
    try {
      console.log('Sending register request...');
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
        },
        body: JSON.stringify({ 
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),

             
      });
      console.log('Register response status:', res.status);

       console.log("Sending this data to backend:", {
                // name,
                email,
                password,
                password_confirmation: passwordConfirmation
              });
              
      const data = await res.json();

      console.log('Register response data:', data);
      if (!res.ok) throw new Error(
        data.errors ? Object.values(data.errors).join('\n') : 'Registration failed'
      );

      setUser(null);
      setToken(data || null);
      await AsyncStorage.setItem('token',  data.token);
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
