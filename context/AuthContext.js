
// import React, { createContext, useState } from 'react';
// import { API_ENDPOINTS } from '../config';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useEffect } from 'react';


// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null); // e test sa nako 

//   // Login with Laravel API
//   const login = async (email, password) => {
//     try {
//       console.log('Sending login request...');
//       const res = await fetch(API_ENDPOINTS.LOGIN, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, password_confirmation: password }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(
//         data.errors ? Object.values(data.errors).join('\n') : (data.message || 'Login failed')
//       );
//       setUser(data.user || null); 
//       // setToken(data.token || null);
//       const authToken = data.token || data.access_token || (data.token && data.token.plainTextToken);
//       setToken(authToken);
//       return data;
//     } catch (err) {
//       console.log('Login error:', err);
//       throw err;
//     }
//   };

//   // Register with Laravel API
//   const register = async (name, email, password, passwordConfirmation) => {
//     try {
//       console.log('Sending register request...');
//       const res = await fetch(API_ENDPOINTS.REGISTER, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           email,
//           password,
//           password_confirmation: passwordConfirmation,
//         }),
//       });
//       console.log('Register response status:', res.status);
//       const data = await res.json();
//       console.log('Register response data:', data);

//       if (!res.ok) throw new Error(
//         data.errors ? Object.values(data.errors).join('\n') : 'Registration failed'
//       );
//       console.log("Login response:", data);
//       console.log("Saved token:", data.token);


//       setUser(data.user || null); 
//       setToken(data.token || null);
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





// context/AuthContext.js
import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Save token to storage
  const saveToken = async (newToken) => {
    try {
      await AsyncStorage.setItem('token', newToken); // must be string
      setToken(newToken);
    } catch (err) {
      console.log('Error saving token:', err);
    }
  };

  // Login with Laravel API
  const login = async (email, password) => {
    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // ✅ Extract plain text token
      const authToken = data.token?.plainTextToken || null;

      if (authToken) {
        await saveToken(authToken);
      }

      setUser(data.user || null);
      return data;
    } catch (err) {
      console.log('Login error:', err);
      throw err;
    }
  };

  // Register with Laravel API
  const register = async (name, email, password, passwordConfirmation) => {
    try {
      const res = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // ✅ Extract plain text token
      const authToken = data.token?.plainTextToken || null;

      if (authToken) {
        await saveToken(authToken);
      }

      setUser(data.user || null);
      return data;
    } catch (err) {
      console.log('Register error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(API_ENDPOINTS.LOGOUT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      }
    } catch (err) {
      console.log('Logout error (ignored):', err);
    } finally {
      await AsyncStorage.removeItem('token');
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
