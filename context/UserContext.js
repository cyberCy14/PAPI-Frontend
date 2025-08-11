import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { API_ENDPOINTS, STORAGE_PATHS } from '../config';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    place: '',
    dob: null,
    gender: '',
    image: null,
  });
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.USER_PROFILE, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setUser(data.user);
      const complete =
        data.user.name?.trim() &&
        data.user.phone?.trim() &&
        data.user.address?.trim() &&
        data.user.place?.trim() &&
        data.user.dob &&
        data.user.gender?.trim();
      setProfileExists(Boolean(complete));
    } catch (err) {
      setProfileExists(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      // Reset user data when token is null (logout)
      setUser({
        name: '',
        email: '',
        phone: '',
        address: '',
        place: '',
        dob: null,
        gender: '',
        image: null,
      });
      setProfileExists(false);
      setLoading(false);
    }
  }, [token]);

  // Update user profile via backend API (supports image upload)
  const updateUser = async (updates) => {
    if (!token) throw new Error('No authenticated user to update');
    console.log('updateUser called with:', updates);
    const formData = new FormData();
    formData.append('name', updates.name?.trim() || '');
    formData.append('email', updates.email?.trim() || '');
    formData.append('phone', updates.phone?.trim() || '');
    formData.append('address', updates.address?.trim() || '');
    formData.append('place', updates.place?.trim() || '');
    // Format dob as YYYY-MM-DD if it's a Date object
    let dob = updates.dob;
    if (dob instanceof Date) {
      dob = dob.toISOString().split('T')[0];
    }
    formData.append('dob', dob || '');
    formData.append('gender', updates.gender?.trim() || '');
    if (updates.image && updates.image.uri) {
      console.log('Adding image to FormData:', updates.image);
      formData.append('image', {
        uri: updates.image.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
    } else {
      console.log('No image to upload');
    }

    console.log('Sending request to backend...');
    const res = await fetch(API_ENDPOINTS.USER_PROFILE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        // 'Content-Type' should NOT be set when using FormData in React Native
      },
      body: formData,
    });
    console.log('Backend response status:', res.status);
    if (!res.ok) {
      const errorText = await res.text();
      console.log('Backend error:', errorText);
      throw new Error('Failed to update profile');
    }
    const data = await res.json();
    console.log('Backend response data:', data);
    setUser(data.user);
    const complete =
      data.user.name?.trim() &&
      data.user.phone?.trim() &&
      data.user.address?.trim() &&
      data.user.place?.trim() &&
      data.user.dob &&
      data.user.gender?.trim();
    setProfileExists(Boolean(complete));
  };



  return (
    <UserContext.Provider value={{ user, profileExists, loading, updateUser, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};
