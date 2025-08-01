import React, { useContext, useEffect, useState, useRef, useFocusEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';


import API_BASE_URL  from '../config';

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
  const [points, setPoints] = useState(null);
  const [nextReward, setNextReward] = useState(null);
  const [activity, setActivity] = useState([]);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);
  const inviteSliderRef = useRef(null);
  const rewardsSliderRef = useRef(null);
  const [inviteIndex, setInviteIndex] = useState(0);
  const [rewardsIndex, setRewardsIndex] = useState(0);
  // const { activity, loading:activityLoading, refreshActivity, updateActivity} = useContext(RecentActivityContext);
  


  // Fetch loyalty data from API
  useEffect(() => {
    async function fetchLoyalty() {
      setLoading(true);
      try {
        // TODO: Replace with your real API endpoints
        // Example: const res = await axios.get('/api/loyalty/balance');
        setPoints(1440); // mock
        setNextReward(560); // mock
        setInviteCode('PAPI1234'); // mock
        setActivity([
          { id: '1', type: 'earn', points: 50, desc: 'Purchased coffee at Starbucks' },
          { id: '2', type: 'earn', points: 25, desc: 'Bought lunch at McDonald\'s' },
          { id: '3', type: 'redeem', points: 100, desc: 'Redeemed for free dessert' },
          { id: '4', type: 'earn', points: 75, desc: 'Shopping at Target' },
          { id: '5', type: 'earn', points: 30, desc: 'Gas station purchase' },
        ]);
      } catch (e) {
        // handle error
      }
      setLoading(false);
    }
    fetchLoyalty();
  }, []);

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Loyalty</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Loyalty Balance Card */}
        <ImageBackground source={LOYALTY_BG} style={styles.balanceCard} imageStyle={styles.balanceCardBg}>
          {/* Removed Coin Button */}
          {/* <TouchableOpacity 
            style={styles.coinButton}
            onPress={() => navigation.navigate('Rewards')}
          >
            <MaterialCommunityIcons name="currency-usd" size={24} color="#FFD700" />
          </TouchableOpacity> */}
          
          <Text style={styles.balanceLabelAbove}>Loyalty Balance</Text>
          <View style={styles.balanceRow}>
            <View style={styles.trophyWrap}>
              <MaterialCommunityIcons name="trophy-outline" size={36} color="#FFD700" />
            </View>
            <View style={styles.pointsWrap}>
              <TouchableOpacity onPress={() => navigation.navigate('LoyaltyPoints')}>
                <Text style={styles.balancePoints} numberOfLines={1} adjustsFontSizeToFit>
                  {points !== null ? (
                    <>
                      {points} <Text style={styles.ptsLabel}>pts</Text>
                    </>
                  ) : (
                    <ActivityIndicator color="#fff" />
                  )}
                </Text>
              </TouchableOpacity>
              <Text style={styles.balanceSub} numberOfLines={1} adjustsFontSizeToFit>
                {nextReward !== null ? `${nextReward} points till your next reward` : ''}
              </Text>
            </View>
          </View>
          {/* Dashed line divider */}
          <View style={styles.dashedLine} />
          <Text style={styles.balanceUserAligned}>{username}</Text>
        </ImageBackground>


        {/* Rewards Slider */}
        <FlatList
          data={rewards}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rewardsSlider}
          renderItem={({ item }) => (
            <View style={styles.rewardCard}>
              <View style={styles.rewardIconWrap}>
                <MaterialCommunityIcons name={item.icon} size={32} color="#FFD700" />
              </View>
              <Text style={styles.rewardCardName}>{item.name}</Text>
              <Text style={styles.rewardCardPoints}>{item.points} pts</Text>
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
        ) : !activity || activity.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#888' }}>No recent activity.</Text>
        ) : (
          activity.map(item => (
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
                <Text style={styles.activityDesc}>{item.desc}</Text>
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
});