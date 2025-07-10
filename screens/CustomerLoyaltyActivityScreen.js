import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockActivities = [
  { id: '1', name: 'Dela Cruz, Juan', points: 10, purchase: 100, date: '2025-07-03', time: '1:30 PM' },
  { id: '2', name: 'Doe, Juanito', points: 15, purchase: 150, date: '2025-07-03', time: '1:30 PM' },
  { id: '3', name: 'Lenohan, Cheny', points: 20, purchase: 200, date: '2025-07-03', time: '1:30 PM' },
  { id: '4', name: 'Bernal, Tamara', points: 30, purchase: 300, date: '2025-07-03', time: '1:30 PM' },
  { id: '5', name: 'Dela Cruz, Juan', points: 10, purchase: 100, date: '2025-07-02', time: '1:30 PM' },
  { id: '6', name: 'Doe, Juanito', points: 15, purchase: 150, date: '2025-07-02', time: '1:30 PM' },
];

function groupByDate(activities) {
  return activities.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});
}

export default function CustomerLoyaltyActivityScreen({ navigation }) {
  const grouped = groupByDate(mockActivities);
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('AppTabs', { screen: 'Loyalty' })} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loyalty System</Text>
      </View>
      {/* Background pattern (replace with your own asset if available) */}
      <ImageBackground
        source={require('../assets/loyalty-bg.png')}
        style={styles.bgPattern}
        imageStyle={{ resizeMode: 'repeat', opacity: 0.18 }}
      >
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Customer Loyalty Activity</Text>
          <FlatList
            data={sortedDates}
            keyExtractor={date => date}
            renderItem={({ item: date }) => (
              <View style={styles.dateGroup}>
                <Text style={styles.dateLabel}>{date === todayStr ? 'Today' : new Date(date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
                {grouped[date].map(activity => (
                  <View key={activity.id} style={styles.activityRow}>
                    <View style={styles.activityInfoRow}>
                      <Text style={styles.name}>{activity.name}</Text>
                      <Text style={styles.detail}>Earned {activity.points} points   |</Text>
                      
                      <Text style={styles.detail}>Purchase of ₱{activity.purchase}</Text>
                    </View>
                    <Text style={styles.time}>{activity.time}</Text>
                  </View>
                ))}
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDC856',
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 2,
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 20,  color: '#061437', flex: 1, textAlign: 'center', fontFamily: 'Sansation-Bold',marginRight:30 },
  bgPattern: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: { flex: 1, paddingHorizontal: 8, paddingTop: 120 },
  sectionTitle: { fontSize: 20,  alignSelf:'center', marginBottom: 10, color: '#061437', fontFamily: 'Sansation-Bold' },
  dateGroup: { marginBottom: 8 },
  dateLabel: { fontSize: 15,  color: '#061437', marginBottom: 4, fontFamily: 'Sansation-Bold', marginLeft: 4 },
  activityRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FDC856',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  activityInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 2,
  },
  name: {  fontSize: 15, color: '#061437', fontFamily: 'Sansation-Bold', flex: 1 },
  detail: { color: '#444', fontSize: 14, marginLeft: 8, fontFamily: 'Sansation-Regular' },
  time: { color: '#888', fontSize: 12, marginTop: 2, fontFamily: 'Sansation-Regular', alignSelf: 'flex-end' },
}); 