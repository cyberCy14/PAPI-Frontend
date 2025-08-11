import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../context/UserContext';
import { LoyaltyContext } from '../context/LoyaltyContext';

const LOYALTY_BG = require('../assets/Rectangle 73.png');
const LOYALTY_BJ = require('../assets/Rectangle 77.png');

const INVITE_CARDS = [
  {
    title: 'Give and get points',
    desc: 'Get 500 points when your friend shares your code',
    btn: 'Share invite code',
  },
  {
    title: 'Bonus for inviting friends',
    desc: 'Invite 3 friends and get a bonus reward!',
    btn: 'Invite more friends',
  },
];

const REWARDS_CARDS = [
  {
    title: 'Starbucks Rewards',
    desc: 'Free coffee, pastries, and exclusive offers',
    btn: 'View Rewards',
    icon: '☕',
  },
  {
    title: "McDonald's Rewards",
    desc: 'Free meals, fries, and special deals',
    btn: 'View Rewards',
    icon: '🍔',
  },
  {
    title: 'Target Rewards',
    desc: 'Gift cards, discounts, and free shipping',
    btn: 'View Rewards',
    icon: '🎯',
  },
  {
    title: 'Shell Rewards',
    desc: 'Free car wash, gas credits, and convenience items',
    btn: 'View Rewards',
    icon: '⛽',
  },
];

export default function LoyaltyScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const { loyaltyData, transactions, rewards, loading, refreshLoyaltyData, debouncedRefresh } = useContext(LoyaltyContext);
  const [inviteCode, setInviteCode] = useState('PAPI1234'); // Default invite code
  const inviteSliderRef = useRef(null);
  const rewardsSliderRef = useRef(null);
  const [inviteIndex, setInviteIndex] = useState(0);
  const [rewardsIndex, setRewardsIndex] = useState(0);
  const [error, setError] = useState(null);
  const lastRefreshTimeRef = useRef(0);

  // Don't render if no user - AuthWrapper will handle navigation
  if (!user || !user.name) {
    return null;
  }

  // Refresh data when screen comes into focus (with cooldown)
  useFocusEffect(
    useCallback(() => {
      // Disable auto-refresh to prevent infinite loops
      // Only refresh manually through the refresh button
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setInviteIndex(prev => {
        const next = (prev + 1) % INVITE_CARDS.length;
        inviteSliderRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRewardsIndex(prev => {
        const next = (prev + 1) % REWARDS_CARDS.length;
        rewardsSliderRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const username = user?.name || 'User';

  // Handle refresh with error handling
  const handleRefresh = async () => {
    try {
      setError(null);
      lastRefreshTimeRef.current = Date.now();
      await refreshLoyaltyData();
    } catch (err) {
      setError('Failed to refresh loyalty data');
      Alert.alert('Error', 'Failed to refresh loyalty data. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Loyalty</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#061437" />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loyalty Balance Card */}
        <ImageBackground source={LOYALTY_BG} style={styles.balanceCard} imageStyle={styles.balanceCardBg}>
          <Text style={styles.balanceLabelAbove}>Loyalty Balance</Text>
          <View style={styles.balanceRow}>
            <View style={styles.trophyWrap}>
              <MaterialCommunityIcons name="trophy-outline" size={36} color="#FFD700" />
            </View>
            <View style={styles.pointsWrap}>
              <TouchableOpacity onPress={() => navigation.navigate('LoyaltyPoints')}>
                <Text style={styles.balancePoints} numberOfLines={1} adjustsFontSizeToFit>
                  {!loading ? (
                    <>
                      {loyaltyData?.points || 0} <Text style={styles.ptsLabel}>pts</Text>
                    </>
                  ) : (
                    <ActivityIndicator color="#fff" />
                  )}
                </Text>
              </TouchableOpacity>
              <Text style={styles.balanceSub} numberOfLines={1} adjustsFontSizeToFit>
                {loyaltyData?.next_reward > 0 ? `${loyaltyData.next_reward} points till your next reward` : ''}
              </Text>
            </View>
          </View>
          {/* Dashed line divider */}
          <View style={styles.dashedLine} />
          <Text style={styles.balanceUserAligned}>{username}</Text>
        </ImageBackground>

        {/* Rewards Slider */}
        <FlatList
          data={rewards || []}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rewardsSlider}
          renderItem={({ item }) => (
            <View style={styles.rewardCard}>
              <View style={styles.rewardIconWrap}>
                <MaterialCommunityIcons 
                  name={item.type === 'discount' ? 'percent' : 'gift'} 
                  size={32} 
                  color="#FFD700" 
                />
              </View>
              <Text style={styles.rewardCardName}>{item.name || 'Reward'}</Text>
              <Text style={styles.rewardCardPoints}>{item.points_required || 0} pts</Text>
            </View>
          )}
        />

        {/* Referral/Invite Section */}
        <FlatList
          ref={inviteSliderRef}
          data={INVITE_CARDS}
          keyExtractor={(_, idx) => idx.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.inviteSlider}
          renderItem={({ item }) => (
            <ImageBackground
              source={LOYALTY_BJ}
              style={styles.inviteCard}
              imageStyle={styles.inviteCardBg}
            >
              <View style={styles.inviteContent}>
                <Text style={styles.inviteTitle}>{item.title}</Text>
                <Text style={styles.inviteDesc}>{item.desc}</Text>
              </View>
              <TouchableOpacity style={styles.inviteBtn}>
                  <Text style={styles.inviteBtnText}>{item.btn}</Text>
                </TouchableOpacity>
              {/* Pagination Dots */}
              <View style={styles.pagination}>
                {INVITE_CARDS.map((_, index) => (
                  <View
                    key={index}
                    style={[styles.dot, inviteIndex === index ? styles.activeDot : styles.inactiveDot]}
                  />
                ))}
              </View>
            </ImageBackground>
          )}
        />

        {/* Rewards Slider */}
        <FlatList
          ref={rewardsSliderRef}
          data={REWARDS_CARDS}
          keyExtractor={(_, idx) => `rewards-${idx}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rewardsInviteSlider}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Rewards')}
            >
              <ImageBackground
                source={LOYALTY_BJ}
                style={styles.inviteCard}
                imageStyle={styles.inviteCardBg}
              >
                <View style={styles.inviteContent}>
                  <View style={styles.rewardsHeader}>
                    <Text style={styles.rewardsIcon}>{item.icon}</Text>
                    <Text style={styles.inviteTitle}>{item.title}</Text>
                  </View>
                  <Text style={styles.inviteDesc}>{item.desc}</Text>
                </View>
                <TouchableOpacity style={styles.inviteBtn}>
                  <Text style={styles.inviteBtnText}>{item.btn}</Text>
                </TouchableOpacity>
                {/* Pagination Dots */}
                <View style={styles.pagination}>
                  {REWARDS_CARDS.map((_, index) => (
                    <View
                      key={index}
                      style={[styles.dot, rewardsIndex === index ? styles.activeDot : styles.inactiveDot]}
                    />
                  ))}
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />

        {/* Recent Activity */}
        <Text style={styles.activityTitle}>Recent Activity</Text>

        <View style={{ marginTop: 8 }}>
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : !transactions || transactions.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#888' }}>No recent activity.</Text>
        ) : (
          transactions.map(item => (
            <View
              key={item.id}
              style={[
                styles.activityRow,
                item.type === 'earn' ? styles.activityEarn : styles.activityRedeem,
              ]}
            >
              <View style={styles.activityLeft}>
                <Text
                  style={[
                    styles.activityStatus,
                    item.type === 'earn' ? styles.earned : styles.redeemed,
                  ]}
                >
                  {item.type === 'earn'
                    ? `You earned ${item.points} points`
                    : `You redeemed ${item.points} points`}
                </Text>
                <Text style={styles.activityDesc}>{item.notes || item.source || 'Loyalty transaction'}</Text>
              </View>
              <View style={styles.activityRight}>
                <View
                  style={[
                    styles.pointsCircle,
                    item.type === 'earn' ? styles.earnedBg : styles.redeemedBg,
                  ]}
                >
                  <Text style={styles.pointsText}>
                    {item.type === 'earn' ? `+${item.points}` : `-${item.points}`}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  backButton: { marginRight: 12 },
  headerTitle: {
    fontSize: 22,
    color: '#061437',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Sansation-Bold',
  },
  refreshButton: {
    marginLeft: 10,
  },
  scrollContent: { padding: 16, paddingBottom: 40 },
  balanceCard: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    height: 225,
    backgroundColor: '#061437',
    position: 'relative',
  },
  coinButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  balanceCardBg: {
    borderRadius: 8,
    opacity: 0.95,
    resizeMode: 'cover',
  },
  balanceLabelAbove: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'Sansation-Bold',
    marginTop: 20,
    marginRight: 170,
    marginBottom: 10,
    textAlign: 'center',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 18,
    width: '100%',
  },
  trophyWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    marginLeft: 15,
  },
  pointsWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  balancePoints: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Sansation-Bold',
    marginBottom: 0,
    marginTop: 10,
    flexShrink: 1,
  },
  ptsLabel: {
    color: '#FFD700',
    fontSize: 24,
    fontFamily: 'Sansation-Regular',
  },
  balanceSub: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Sansation-Regular',
    marginTop: 2,
    marginBottom: 2,
    flexShrink: 1,
  },
  balanceUserAligned: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Sansation-Bold',
    marginTop: 40,
    marginRight: 210,
    textAlign: 'center',
  },
  inviteCard: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    height: 225,
    width: 315,
    padding: 18,
    marginLeft: 5,
    marginRight: 9,
    flexShrink: 0,
    justifyContent: 'space-between',
  },
  inviteCardBg: {
    borderRadius: 8,
    opacity: 0.95,
    resizeMode: 'cover',
  },
  inviteContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', // Changed to left align
    width: '100%', // Ensure full width for left alignment
  },
  inviteTitle: {
    fontSize: 16,
    fontFamily: 'Sansation-Bold',
    color: '##061437',
   marginBottom: 5,
    textAlign: 'left', // Left align text
    marginBottom: 10,
  },
  inviteDesc: {
    fontSize: 24,
    fontWeight: '400',
    fontFamily: 'Sansation-Regular',
    color: '#061437',
    textAlign: 'left', // Left align text
    marginBottom: 20,
  },
  inviteBtn: {
    backgroundColor: '#061437',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
   
    width: '90%',
    marginBottom: 10,
  },
  inviteBtnText: {
    color: '#fff',
    fontFamily: 'Sansation-Bold',
    fontSize: 15,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000',
  },
  inactiveDot: {
    backgroundColor: '#fff',
  },
  activityTitle: {
    fontSize: 17,
    fontFamily: 'Sansation-Bold',
    color: '#061437',
    marginBottom: 8,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  activityLeft: { flex: 1 },
  activityStatus: {
    fontSize: 15,
    fontFamily: 'Sansation-Bold',
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 13,
    fontFamily: 'Sansation-Regular',
    color: '#444',
  },
  activityRight: { marginLeft: 12 },
  pointsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 16,
    fontFamily: 'Sansation-Bold',
    color: '#fff',
  },
  earned: { color: '#1CBF4B' },
  redeemed: { color: '#FF3B30' },
  earnedBg: { backgroundColor: '#1CBF4B' },
  redeemedBg: { backgroundColor: '#FF3B30' },
  rewardsSlider: {
    paddingVertical: 8,
    marginBottom: 18,
  },
  rewardCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginRight: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  rewardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardCardName: {
    fontSize: 15,
    fontFamily: 'Sansation-Bold',
    color: '#061437',
    marginBottom: 2,
    textAlign: 'center',
  },
  rewardCardPoints: {
    fontSize: 13,
    fontFamily: 'Sansation-Regular',
    color: '#FFD700',
    textAlign: 'center',
  },
  inviteSlider: {
    paddingVertical: 2,
    marginBottom: 18,
  },
  rewardsInviteSlider: {
    paddingVertical: 2,
    marginBottom: 18,
  },
  dashedLine: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 56,
    borderBottomWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    borderStyle: 'dashed',
    zIndex: 2,
    marginBottom: 15,
  },
  inviteCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inviteCardTitle: {
    fontSize: 16,
    fontFamily: 'Sansation-Bold',
    color: '#061437',
    marginBottom: 2,
  },
  inviteCardDesc: {
    fontSize: 13,
    fontFamily: 'Sansation-Regular',
    color: '#444',
  },
  inviteCardButtonWrap: {
    backgroundColor: '#061437',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  inviteCardButton: {
    color: '#fff',
    fontFamily: 'Sansation-Bold',
    fontSize: 15,
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardsIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontFamily: 'Sansation-Regular',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#061437',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontFamily: 'Sansation-Bold',
    fontSize: 15,
  },
});