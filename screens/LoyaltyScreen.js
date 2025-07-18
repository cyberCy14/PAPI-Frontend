import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';

const LOYALTY_BG = require('../assets/Rectangle 73.png');

export default function LoyaltyScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const [points, setPoints] = useState(null);
  const [nextReward, setNextReward] = useState(null);
  const [activity, setActivity] = useState([]);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);

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
          { id: '1', type: 'earn', points: 50, desc: 'Purchased item X' },
          { id: '2', type: 'earn', points: 10, desc: 'Purchased item X' },
          { id: '3', type: 'redeem', points: 25, desc: 'Used points to purchase item X' },
        ]);
      } catch (e) {
        // handle error
      }
      setLoading(false);
    }
    fetchLoyalty();
  }, []);

  const username = user?.name || 'User';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#061437" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loyalty</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Loyalty Balance Card */}
        <ImageBackground source={LOYALTY_BG} style={styles.balanceCard} imageStyle={styles.balanceCardBg}>
          <View style={styles.balanceLeft}>
            <View style={styles.trophyCircle}>
              <MaterialCommunityIcons name="trophy-outline" size={36} color="#FFD700" />
            </View>
          </View>
          <View style={styles.balanceRight}>
            <Text style={styles.balanceLabel}>Loyalty Balance</Text>
            <Text style={styles.balancePoints}>{points !== null ? `${points}Pts` : <ActivityIndicator color="#fff" />}</Text>
            <Text style={styles.balanceSub}>{nextReward !== null ? `${nextReward} points till your next reward` : ''}</Text>
            <Text style={styles.balanceUser}>{username}</Text>
          </View>
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.inviteSlider}
        >
          <View style={styles.inviteCard}>
            <Text style={styles.inviteTitle}>Give and get points</Text>
            <Text style={styles.inviteDesc}>Get 500 points when your friend shares your code</Text>
            <TouchableOpacity style={styles.inviteBtn} onPress={() => {/* TODO: share invite code */}}>
              <Text style={styles.inviteBtnText}>Share invite code</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inviteCard}>
            <Text style={styles.inviteTitle}>Bonus for inviting friends</Text>
            <Text style={styles.inviteDesc}>Invite 3 friends and get a bonus reward!</Text>
            <TouchableOpacity style={styles.inviteBtn} onPress={() => {/* TODO: share invite code */}}>
              <Text style={styles.inviteBtnText}>Invite more friends</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* Recent Activity */}
        <Text style={styles.activityTitle}>Recent Activity</Text>
        <View style={{ marginTop: 8 }}>
          {activity.map(item => (
            <View key={item.id} style={[styles.activityRow, item.type === 'earn' ? styles.activityEarn : styles.activityRedeem]}>
              <View style={styles.activityLeft}>
                <Text style={[styles.activityStatus, item.type === 'earn' ? styles.earned : styles.redeemed]}>
                  {item.type === 'earn' ? `You earned ${item.points} points` : `You redeemed ${item.points} points`}
                </Text>
                <Text style={styles.activityDesc}>{item.desc}</Text>
              </View>
              <View style={styles.activityRight}>
                <View style={[styles.pointsCircle, item.type === 'earn' ? styles.earnedBg : styles.redeemedBg]}>
                  <Text style={styles.pointsText}>{item.type === 'earn' ? `+${item.points}` : `-${item.points}`}</Text>
                </View>
              </View>
            </View>
          ))}
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
  headerTitle: { fontSize: 22, color: '#061437', flex: 1, textAlign: 'center', fontFamily: 'Sansation-Bold' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    height: 200,
    backgroundColor: '#061437',
  },
  balanceCardBg: {
    borderRadius: 8,
    opacity: 0.95,
    resizeMode: 'cover',
  },
  balanceLeft: {
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceRight: {
    flex: 1,
    paddingLeft: 8,
    justifyContent: 'center',
  },
  balanceLabel: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'Sansation-Bold',
    marginBottom: 2,
  },
  balancePoints: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Sansation-Bold',
    marginBottom: 2,
  },
  balanceSub: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Sansation-Regular',
    marginBottom: 2,
  },
  balanceUser: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Sansation-Regular',
    marginTop: 4,
  },
  inviteCard: {
    backgroundColor: '#FDC856',
    borderRadius: 8,
    padding: 18,
    marginRight: 10, // Added margin for horizontal scroll
    width: 325, // Fixed width for horizontal scroll
    overflow: 'hidden',
  },
  inviteTitle: {
    fontSize: 15,
    fontFamily: 'Sansation-Bold',
    color: '#061437',
    marginBottom: 4,
  },
  inviteDesc: {
    fontSize: 14,
    fontFamily: 'Sansation-Regular',
    color: '#061437',
    marginBottom: 12,
  },
  inviteBtn: {
    backgroundColor: '#061437',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  inviteBtnText: {
    color: '#fff',
    fontFamily: 'Sansation-Bold',
    fontSize: 15,
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
}); 