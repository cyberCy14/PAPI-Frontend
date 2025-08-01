import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const LOYALTY_BG = require('../assets/Rectangle 73.png');
const LOYALTY_BJ = require('../assets/Rectangle 77.png');

// Mock data for rewards from different companies
const MOCK_REWARDS = [
  {
    id: '1',
    company: 'Starbucks',
    companyLogo: '☕',
    rewards: [
      { id: '1', name: 'Free Coffee', points: 150, description: 'Any size coffee of your choice', available: true },
      { id: '2', name: 'Free Pastry', points: 200, description: 'Any pastry with purchase', available: true },
      { id: '3', name: '50% Off Drink', points: 100, description: 'Half price on any drink', available: false },
    ]
  },
  {
    id: '2',
    company: "McDonald's",
    companyLogo: '🍔',
    rewards: [
      { id: '4', name: 'Free Big Mac', points: 300, description: 'Classic Big Mac meal', available: true },
      { id: '5', name: 'Free Fries', points: 120, description: 'Large fries with any purchase', available: true },
      { id: '6', name: 'Free Sundae', points: 80, description: 'Ice cream sundae of choice', available: true },
    ]
  },
  {
    id: '3',
    company: 'Target',
    companyLogo: '🎯',
    rewards: [
      { id: '7', name: '$5 Gift Card', points: 500, description: 'Target gift card', available: true },
      { id: '8', name: 'Free Shipping', points: 200, description: 'Free shipping on next order', available: false },
      { id: '9', name: '20% Off Electronics', points: 400, description: 'Discount on electronics', available: true },
    ]
  },
  {
    id: '4',
    company: 'Shell',
    companyLogo: '⛽',
    rewards: [
      { id: '10', name: 'Free Car Wash', points: 250, description: 'Premium car wash service', available: true },
      { id: '11', name: '$10 Gas Credit', points: 1000, description: 'Credit towards fuel purchase', available: true },
      { id: '12', name: 'Free Coffee', points: 50, description: 'Coffee from Shell convenience store', available: true },
    ]
  }
];

export default function RewardsScreen({ navigation }) {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(1440); // Mock user points

  useEffect(() => {
    setTimeout(() => {
      setRewards(MOCK_REWARDS);
      setLoading(false);
    }, 500);
  }, []);

  const handleRedeem = (reward) => {
    if (userPoints >= reward.points) {
      alert(`Redeeming ${reward.name} for ${reward.points} points!`);
    } else {
      alert('Not enough points to redeem this reward.');
    }
  };

  const renderCompanyCard = ({ item }) => (
    <ImageBackground
      source={LOYALTY_BJ}
      style={styles.inviteCard}
      imageStyle={styles.inviteCardBg}
    >
      <View style={styles.inviteContent}>
        <View style={styles.companyHeader}>
          <Text style={styles.companyLogo}>{item.companyLogo}</Text>
          <Text style={styles.inviteTitle}>{item.company}</Text>
        </View>
        <FlatList
          data={item.rewards}
          keyExtractor={r => r.id}
          renderItem={({ item: reward }) => (
            <View style={styles.rewardRow}>
              <Ionicons name="gift-outline" size={24} color="#6C63FF" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rewardName}>{reward.name}</Text>
                <Text style={styles.rewardDesc}>{reward.description}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.rewardPoints}>{reward.points} pts</Text>
                <TouchableOpacity
                  style={[
                    styles.inviteBtn,
                    (!reward.available || userPoints < reward.points) && styles.inviteBtnDisabled
                  ]}
                  onPress={() => handleRedeem(reward)}
                  disabled={!reward.available || userPoints < reward.points}
                >
                  <Text style={styles.inviteBtnText}>
                    {reward.available ? 'Redeem' : 'Unavailable'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          style={{ width: '100%' }}
          scrollEnabled={false}
        />
      </View>
    </ImageBackground>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#061437" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Available Rewards</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Points Balance Card - Copied from LoyaltyScreen */}
      <ImageBackground source={LOYALTY_BG} style={styles.balanceCard} imageStyle={styles.balanceCardBg}>
        <Text style={styles.balanceLabelAbove}>Loyalty Balance</Text>
        <View style={styles.balanceRow}>
          <View style={styles.trophyWrap}>
            <MaterialCommunityIcons name="trophy-outline" size={36} color="#FFD700" />
          </View>
          <View style={styles.pointsWrap}>
            <TouchableOpacity onPress={() => navigation.navigate('LoyaltyPoints')}>
              <Text style={styles.balancePoints} numberOfLines={1} adjustsFontSizeToFit>
                {userPoints} <Text style={styles.ptsLabel}>pts</Text>
              </Text>
            </TouchableOpacity>
            <Text style={styles.balanceSub} numberOfLines={1} adjustsFontSizeToFit>
              
            </Text>
          </View>
        </View>
        {/* Dashed line divider */}
        <View style={styles.dashedLine} />
      </ImageBackground>

      {/* Rewards List */}
      <ScrollView style={styles.rewardsContainer} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#061437" style={styles.loading} />
        ) : (
          <FlatList
            data={rewards}
            keyExtractor={(item) => item.id}
            renderItem={renderCompanyCard}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  headerRight: { width: 36 },
  // Balance Card styles copied from LoyaltyScreen
  balanceCard: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    height: 225,
    backgroundColor: '#061437',
    position: 'relative',
    margin: 16,
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
    fontSize: 24,
    fontFamily: 'Sansation-Bold',
  },
  balanceSub: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Sansation-Regular',
    marginTop: 2,
    marginBottom: 2,
    flexShrink: 1,
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
  rewardsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loading: {
    marginTop: 50,
  },
  inviteCard: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    height: 350,
    width: 325,
    padding: 18,
    marginBottom: 16,
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
    alignItems: 'flex-start',
    width: '100%',
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyLogo: {
    fontSize: 32,
    marginBottom: 5,
  },
  inviteTitle: {
    fontSize: 18,
    fontFamily: 'Sansation-Bold',
    color: '#061437',
    marginBottom: 10,
    textAlign: 'left',
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    padding: 12,
  },
  rewardName: {
    fontSize: 14,
    fontFamily: 'Sansation-Bold',
    color: '#061437',
    marginBottom: 2,
  },
  rewardDesc: {
    fontSize: 12,
    fontFamily: 'Sansation-Regular',
    color: '#666',
  },
  rewardPoints: {
    fontSize: 13,
    fontFamily: 'Sansation-Bold',
    color: '#6C63FF',
    marginBottom: 4,
  },
  inviteBtn: {
    backgroundColor: '#061437',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    marginTop: 2,
  },
  inviteBtnDisabled: {
    backgroundColor: '#aaa',
  },
  inviteBtnText: {
    color: '#fff',
    fontFamily: 'Sansation-Bold',
    fontSize: 12,
  },
});