// import React, { createContext, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_ENDPOINTS } from '../config';
// import { API_BASE_URL } from '../config';


// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);


//   //save the token in asyncstorage
//   const saveToken = async (newToken) => {
//     try {
//       await AsyncStorage.setItem('token', newToken); 
//       setToken(newToken);
//     } catch (err) {
//       console.log('Error saving token:', err);
//     }
//   };


  

//   //login
//   const login = async (email, password) => {
//     try {
//       const res = await fetch(API_ENDPOINTS.LOGIN, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       // const authToken = data.token?.plainTextToken || null;
//       const authToken = data.token || data.access_token || null;

//       if (authToken) {
//         await saveToken(authToken);
//       }

//       setUser(data.user || null);
//       return data;
//     } catch (err) {
//       console.log('Login error:', err);
//       throw err;
//     }
//   };






// //register
//   const register = async (name, email, password, passwordConfirmation) => {
//     try {
//       const res = await fetch(API_ENDPOINTS.REGISTER, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//           password_confirmation: passwordConfirmation,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message || 'Registration failed');
//       }

//       // const authToken = data.token?.plainTextToken || null;
//       const authToken = data.token || data.access_token || null;

//       if (authToken) {
//         await saveToken(authToken);
//       }

//       setUser(data.user || null);
//       return data;
//     } catch (err) {
//       console.log('Register error:', err);
//       throw err;
//     }
//   };

//   const logout = async () => {
//     try {
//       if (token) {
//         await fetch(API_ENDPOINTS.LOGOUT, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json',
//           },
//         });
//       }
//     } catch (err) {
//       console.log('Logout error (ignored):', err);
//     } finally {
//       await AsyncStorage.removeItem('token');
//       await AsyncStorage.removeItem('user');
//       setUser(null);
//       setToken(null);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };





import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, API_ENDPOINTS } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // Current user object
  const [token, setToken] = useState(null);   // JWT or API token
  const [loading, setLoading] = useState(true);

  // 🔄 Load saved auth state on app start
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

  // 🔑 Login
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

    // ✅ Save to AsyncStorage
    await AsyncStorage.setItem("authToken", json.token);
    await AsyncStorage.setItem("user", JSON.stringify(json.user));

    // ✅ Update state
    setToken(json.token);
    setUser(json.user);

    return json; // return for screens if needed
  };

  // 📝 Register
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

    // ✅ Save to AsyncStorage
    await AsyncStorage.setItem("authToken", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));

    // ✅ Update state
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
        isAuthenticated: !!token, // convenience boolean
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};