import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { API_ENDPOINTS } from '../config';
import { API_BASE_URL } from '../config';
import AsyncStorage from "@react-native-async-storage/async-storage";


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
  const [companies, setCompanies] = useState([]);
  


  const fetchCompanies = useCallback(async () => {
  if (!token) return;

  try {
    const userRaw = await AsyncStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    if (!user) return;

    const url = `${API_BASE_URL}/api/loyalty/customer-company-balances?customer_id=${user.id}`;
    // const url = `${API_BASE_URL}/api/loyalty/customer-points/${user.id}`
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data ?? [];

      const mapped = list.map(item => {
        const companyObj = item.company ?? {};
        return {
          id: companyObj.id ?? item.company_id,
          name: companyObj.company_name ?? `Company ${item.company_id}`,
          logo: companyObj.company_logo ? { uri: companyObj.company_logo } : null,
          points: item.total_balance ?? 0,
          transactions: item.transactions ?? [] 
        };
      });

      setCompanies(mapped);

      const total = mapped.reduce((sum, c) => sum + (c.points || 0), 0);
      setLoyaltyData(prev => ({ ...prev, points: total }));
    }
  } catch (err) {
    console.error("Error fetching company balances:", err);
  }
}, [token]);



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

  const fetchTransactions = useCallback(async () => {
  if (!token) return;
  try {
    const userRaw = await AsyncStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    if (!user) return;

    const url = `${API_BASE_URL}/api/loyalty/customer-points/${user.id}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (res.ok) {
      const json = await res.json();
      const txns = json.transactions || [];

      const sorted = txns.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ).slice(0, 5);

      setTransactions(sorted);
    } else {
      console.error("Fetch Customer Points failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Error fetching customer points:", err);
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
      return; 
    }
    
    console.log('LoyaltyContext: Starting refresh at', new Date().toISOString());
    setIsRefreshing(true);
    setLoading(true);
    try {
      await Promise.all([
        // fetchLoyaltySummary(),
        fetchCompanies(), 
        fetchTransactions(),
        fetchRewards(),
      ]);
      console.log('LoyaltyContext: Refresh completed successfully');
    } catch (error) {
      console.error('Error refreshing loyalty data:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      console.log('LoyaltyContext: Refresh finished at', new Date().toISOString());
    }
  }, [fetchCompanies(), , fetchTransactions, fetchRewards, isRefreshing]);

  const debouncedRefresh = useCallback(() => {
    const timeoutId = setTimeout(() => {
      refreshLoyaltyData();
    }, 1000); // Wait 1 second before allowing another refresh
    
    return () => clearTimeout(timeoutId);
  }, [refreshLoyaltyData]);

  useEffect(() => {
    if (token) {
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
  }, [token]); 

  return (
    <LoyaltyContext.Provider value={{
      loyaltyData,
      companies,
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
