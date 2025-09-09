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
    if (!token){ console.log('No token available!'); return null};

    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.USER_PROFILE, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });


      console.log('Status:', res.status);

      if (!res.ok) throw new Error('Failed to fetch profile');

      const data = await res.json();
      console.log('User profile response: ', data);
      

      const mergedUser = {
        ...data.user,
        ...(data.profile || data.user?.profile || {}),
      }

      // setUser(data.user);
      setUser(mergedUser);

      const complete =
        !!mergedUser.name?.trim() &&
        !!mergedUser.phone?.trim() &&
        !!mergedUser.address?.trim() &&
        !!mergedUser.place?.trim() &&
        !!mergedUser.dob &&
        !!mergedUser.gender?.trim();
      setProfileExists(mergedUser, complete);
      // return data.user;
    } catch (err) {
      setProfileExists(false);
      return null;
    }
    setLoading(false);
  };




  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
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




  // Update user profile via backend API
 const updateUser = async (updates) => {
  if (!token) throw new Error('No authenticated user to update');
  console.log('updateUser called with:', updates);

  const formData = new FormData();
  formData.append('name', updates.name?.trim() || '');
  formData.append('phone', updates.phone?.trim() || '');
  formData.append('address', updates.address?.trim() || '');
  formData.append('place', updates.place?.trim() || '');

  let dob = updates.dob;
  if (dob instanceof Date) dob = dob.toISOString().split('T')[0];
  formData.append('dob', dob || '');

  formData.append('gender', updates.gender?.trim() || '');


   if (updates.image && updates.image.uri) {
    console.log("Adding image to FormData:", updates.image);

    formData.append("image", {
      uri: updates.image.uri, 
      name:
        updates.image.fileName || updates.image.name || `profile_${Date.now()}.jpg`,
      type: updates.image.type || "image/jpeg",
    });
  }


  console.log('📡 Sending profile update request...');
  const res = await fetch(API_ENDPOINTS.USER_PROFILE, {
    method: 'POST', 
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: formData,
  });

  console.log('LOG Backend response status:', res.status);

  let data;
  try {
    data = await res.json();
  } catch (err) {
    const text = await res.text();
    console.log('Backend non-JSON response:', text);
    throw new Error('Invalid server response');
  }

  console.log('LOG Backend response data:', data);

  if (!res.ok) {
    throw new Error(data.message || 'Failed to update profile');
  }

  // setUser({
  //   ...data.user,
  //   ...data.profile,
  // });

  // setProfileExists(true);

  // return data.user;

  const mergedUser = {
    ...user,       
    ...(data.user || {}),
    ...(data.profile || {}),
  };

  setUser(mergedUser);
  setProfileExists(true);

  return mergedUser; 
};



  return (
    <UserContext.Provider value={{ user, profileExists, loading, updateUser, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};
