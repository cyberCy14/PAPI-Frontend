import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ImageBackground, Modal, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockActivities = [
  { id: '1', name: 'Dela Cruz, Juan', points: 10, purchase: 100, date: '2025-07-03', time: '1:30 PM', redeemed: 5 },
  { id: '2', name: 'Doe, Juanito', points: 15, purchase: 150, date: '2025-07-03', time: '1:30 PM', redeemed: 0 },
  { id: '3', name: 'Lenohan, Cheny', points: 20, purchase: 200, date: '2025-07-03', time: '1:30 PM', redeemed: 10 },
  { id: '4', name: 'Bernal, Tamara', points: 30, purchase: 300, date: '2025-07-03', time: '1:30 PM', redeemed: 0 },
  { id: '5', name: 'Dela Cruz, Juan', points: 10, purchase: 100, date: '2025-07-02', time: '1:30 PM', redeemed: 0 },
  { id: '6', name: 'Doe, Juanito', points: 15, purchase: 150, date: '2025-07-02', time: '1:30 PM', redeemed: 0 },
];

function groupByDate(activities) {
  return activities.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});
}

export default function CustomerLoyaltyActivityScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [expandedActivityId, setExpandedActivityId] = useState(null); // For accordion

  // Enable LayoutAnimation on Android
  React.useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const grouped = groupByDate(mockActivities);
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
  const todayStr = new Date().toISOString().slice(0, 10);

  // Get all activities for a customer
  const getCustomerHistory = (name) =>
    mockActivities.filter((a) => a.name === name);

  // Calculate totals for a customer
  const getCustomerTotals = (name) => {
    const history = getCustomerHistory(name);
    let totalEarned = 0, totalRedeemed = 0, totalPurchase = 0;
    history.forEach((a) => {
      totalEarned += a.points;
      totalRedeemed += a.redeemed || 0;
      totalPurchase += a.purchase;
    });
    return { totalEarned, totalRedeemed, totalPurchase };
  };

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
                  <TouchableOpacity
                    key={activity.id}
                    style={styles.activityRow}
                    onPress={() => {
                      setSelectedCustomer(activity.name);
                      setModalVisible(true);
                    }}
                  >
                    <View style={styles.activityInfoRow}>
                      <Text style={styles.name}>{activity.name}</Text>
                      <Text style={styles.detail}>Earned {activity.points} points   |</Text>
                      <Text style={styles.detail}>Purchase of ₱{activity.purchase}</Text>
                    </View>
                    <Text style={styles.time}>{activity.time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </View>
        {/* Customer History Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Customer History</Text>
              {selectedCustomer && (
                <>
                  <Text style={styles.modalCustomerName}>{selectedCustomer}</Text>
                  {(() => {
                    const totals = getCustomerTotals(selectedCustomer);
                    return (
                      <View style={styles.modalTotals}>
                        <Text style={styles.modalTotalText}>Total Points Earned: <Text style={{fontWeight:'bold'}}>{totals.totalEarned}</Text></Text>
                        <Text style={styles.modalTotalText}>Total Points Redeemed: <Text style={{fontWeight:'bold'}}>{totals.totalRedeemed}</Text></Text>
                        <Text style={styles.modalTotalText}>Total Purchases: <Text style={{fontWeight:'bold'}}>₱{totals.totalPurchase}</Text></Text>
                      </View>
                    );
                  })()}
                  <Text style={[styles.modalSectionTitle, {marginTop:10}]}>Activity History</Text>
                  <ScrollView style={{maxHeight:200}}>
                    {getCustomerHistory(selectedCustomer).map((a, idx) => {
                      const expanded = expandedActivityId === a.id;
                      return (
                        <TouchableOpacity
                          key={a.id+idx}
                          style={styles.modalActivityRow}
                          activeOpacity={0.8}
                          onPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setExpandedActivityId(expanded ? null : a.id);
                          }}
                        >
                          <Text style={styles.modalActivityText}>{a.date} {a.time}</Text>
                          <Text style={styles.modalActivityText}>Purchase: ₱{a.purchase}</Text>
                          <Text style={styles.modalActivityText}>Points Earned: {a.points}</Text>
                          <Text style={styles.modalActivityText}>Points Redeemed: {a.redeemed || 0}</Text>
                          {expanded && (
                            <View style={styles.expandedDetails}>
                              {/* Mock extra details, replace with real data as needed */}
                              <Text style={styles.expandedDetailText}>Reward Used: {a.redeemed ? 'Yes' : 'No'}</Text>
                              <Text style={styles.expandedDetailText}>Transaction ID: TXN-{a.id}</Text>
                              <Text style={styles.expandedDetailText}>Location: Main Branch</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    paddingTop: 45,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Sansation-Bold',
    marginBottom: 8,
    color: '#061437',
  },
  modalCustomerName: {
    fontSize: 17,
    fontFamily: 'Sansation-Bold',
    marginBottom: 6,
    color: '#007AFF',
  },
  modalTotals: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  modalTotalText: {
    fontSize: 15,
    color: '#222',
    fontFamily: 'Sansation-Regular',
  },
  modalSectionTitle: {
    fontSize: 15,
    fontFamily: 'Sansation-Bold',
    color: '#061437',
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  modalActivityRow: {
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignSelf: 'stretch',
  },
  modalActivityText: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'Sansation-Regular',
  },
  expandedDetails: {
    marginTop: 8,
    backgroundColor: '#fffbe6',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  expandedDetailText: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'Sansation-Regular',
    marginBottom: 2,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
}); 