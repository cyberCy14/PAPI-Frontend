import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { API_ENDPOINTS } from '../config';

export const LoyaltyContext = createContext();

export const LoyaltyProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [loyaltyData, setLoyaltyData] = useState({
    points: 0,
    nextReward: 0,
    totalEarned: 0,
    totalRedeemed: 0,
    nextRewardInfo: null,
  });
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch loyalty summary (points, next reward, etc.)
  const fetchLoyaltySummary = useCallback(async () => {
    if (!token) return;
    
    console.log('LoyaltyContext: Fetching loyalty summary');
    try {
      const response = await fetch(API_ENDPOINTS.USER_LOYALTY_SUMMARY, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setLoyaltyData(data);
        console.log('LoyaltyContext: Summary fetched successfully');
      }
    } catch (error) {
      console.error('Error fetching loyalty summary:', error);
    }
  }, [token]);

  // Fetch user's loyalty transactions
  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    
    console.log('LoyaltyContext: Fetching transactions');
    try {
      const response = await fetch(API_ENDPOINTS.USER_LOYALTY_TRANSACTIONS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
        console.log('LoyaltyContext: Transactions fetched successfully');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [token]);

  // Fetch available rewards
  const fetchRewards = useCallback(async () => {
    if (!token) return;
    
    console.log('LoyaltyContext: Fetching rewards');
    try {
      const response = await fetch(API_ENDPOINTS.USER_LOYALTY_REWARDS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setRewards(data.rewards);
        console.log('LoyaltyContext: Rewards fetched successfully');
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  }, [token]);

  // Redeem a reward
  const redeemReward = async (rewardId) => {
    if (!token) throw new Error('No authentication token');
    
    try {
      const response = await fetch(API_ENDPOINTS.USER_LOYALTY_REDEEM, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reward_id: rewardId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Refresh loyalty data after redemption
        await fetchLoyaltySummary();
        await fetchTransactions();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to redeem reward');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      throw error;
    }
  };

  // Refresh all loyalty data
  const refreshLoyaltyData = useCallback(async () => {
    if (isRefreshing) {
      console.log('LoyaltyContext: Skipping refresh - already refreshing');
      return; // Prevent multiple simultaneous calls
    }
    
    console.log('LoyaltyContext: Starting refresh at', new Date().toISOString());
    setIsRefreshing(true);
    setLoading(true);
    try {
      await Promise.all([
        fetchLoyaltySummary(),
        fetchTransactions(),
        fetchRewards(),
      ]);
      console.log('LoyaltyContext: Refresh completed successfully');
    } catch (error) {
      console.error('Error refreshing loyalty data:', error);
      // Don't set loading to false on error to show retry option
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      console.log('LoyaltyContext: Refresh finished at', new Date().toISOString());
    }
  }, [fetchLoyaltySummary, fetchTransactions, fetchRewards, isRefreshing]);

  // Debounced refresh function to prevent rapid successive calls
  const debouncedRefresh = useCallback(() => {
    const timeoutId = setTimeout(() => {
      refreshLoyaltyData();
    }, 1000); // Wait 1 second before allowing another refresh
    
    return () => clearTimeout(timeoutId);
  }, [refreshLoyaltyData]);

  // Auto-refresh when token changes
  useEffect(() => {
    if (token) {
      // Only refresh once when token changes, not continuously
      const initialRefresh = async () => {
        console.log('LoyaltyContext: Initial refresh triggered by token change');
        setLoading(true);
        try {
          await Promise.all([
            fetchLoyaltySummary(),
            fetchTransactions(),
            fetchRewards(),
          ]);
          console.log('LoyaltyContext: Initial refresh completed');
        } catch (error) {
          console.error('Error in initial loyalty data fetch:', error);
        } finally {
          setLoading(false);
        }
      };
      
      initialRefresh();
    } else {
      console.log('LoyaltyContext: Clearing data - no token');
      // Clear data when logged out
      setLoyaltyData({
        points: 0,
        nextReward: 0,
        totalEarned: 0,
        totalRedeemed: 0,
        nextRewardInfo: null,
      });
      setTransactions([]);
      setRewards([]);
    }
  }, [token]); // Remove refreshLoyaltyData dependency

  return (
    <LoyaltyContext.Provider value={{
      loyaltyData,
      transactions,
      rewards,
      loading,
      refreshLoyaltyData,
      debouncedRefresh,
      redeemReward,
    }}>
      {children}
    </LoyaltyContext.Provider>
  );
};
