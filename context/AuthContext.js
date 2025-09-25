import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, API_ENDPOINTS } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     
  const [token, setToken] = useState(null);   
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.log("Error loading auth state:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAuthState();
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();

    if (!response.ok || !json.token || !json.user) {
      throw new Error(json.message || "Login failed");
    }

    await AsyncStorage.setItem("authToken", json.token);
    await AsyncStorage.setItem("user", JSON.stringify(json.user));

    setToken(json.token);
    setUser(json.user);

    return json; 
  };

  const register = async (name, email, password, passwordConfirmation) => {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.token || !data.user) {
      throw new Error(data.message || "Registration failed");
    }

    await AsyncStorage.setItem("authToken", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      if (token) {
        await fetch(API_ENDPOINTS.LOGOUT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }
    } catch (err) {
      console.log("Logout error (ignored):", err);
    } finally {
      // ✅ Always clear local state
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};