import React, { createContext, useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const RecentActivityContext = createContext();

export const RecentActivityProvider = ({ children }) => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateActivity = (newActivity) => {
    setActivity(prev => [newActivity, ...prev]);
  };

  const fetchRecentActivity = async () => {
    setLoading(true);
    try {

    const token = await AsyncStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/recent-activities`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const json = await response.json();
        console.log('Recently activity response: ', json);

        if (Array.isArray(json.data)) {
          setActivity(json.data);
          console.log('Set activity: ', json.data);
        } else {
          console.warn('Unexpected activity format:', json);
        }
      } else {
        const text = await response.text();
        console.error('Expected JSON but got:', text);
      }
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  return (
    <RecentActivityContext.Provider
      value={{
        activity,
        loading,
        refreshActivity: fetchRecentActivity,
        updateActivity,
      }}
    >
      {children}
    </RecentActivityContext.Provider>
  );
};
