import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView,
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function CompanyTransactScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { company } = route.params || {};
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Use company name in header if available
  const companyName = company?.name || 'Company';

  // Mock transaction data - replace with real API data
  const [transactions] = useState([
    {
      id: 1,
      title: company?.name === 'Jollibee' ? 'Chicken Joy Meal' : 'Purchased Item A',
      date: '07/28/2025',
      points: 50,
      type: 'earn'
    },
    {
      id: 2,
      title: company?.name === 'Jollibee' ? 'Spaghetti Meal' : 'Purchased Item B',
      date: '07/28/2025',
      points: 10,
      type: 'earn'
    },
    {
      id: 3,
      title: 'Redeemed Points',
      date: '07/28/2025',
      points: 25,
      type: 'redeem'
    },
    {
      id: 4,
      title: company?.name === 'Shopee' ? 'Electronics Purchase' : 'Purchased Item C',
      date: '07/27/2025',
      points: 20,
      type: 'earn'
    },
    {
      id: 5,
      title: company?.name === 'Robinsons' ? 'Clothing Purchase' : 'Purchased Item D',
      date: '07/27/2025',
      points: 15,
      type: 'earn'
    },
    {
      id: 6,
      title: 'Redeemed Points',
      date: '07/27/2025',
      points: 20,
      type: 'redeem'
    }
  ]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(transaction =>
        transaction.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  }, [searchQuery, transactions]);

  // Group transactions by date
  const groupTransactionsByDate = (transactions) => {
    const grouped = {};
    transactions.forEach(transaction => {
      const date = transaction.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });
    return grouped;
  };

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[
          styles.transactionPoints,
          item.type === 'earn' ? styles.earnedPoints : styles.redeemedPoints
        ]}>
          {item.type === 'earn' ? `+${item.points}` : `-${item.points}`}
        </Text>
      </View>
    </View>
  );

  const renderDateSection = ({ item: date }) => {
    const sectionTitle = date === new Date().toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    }) ? 'Recent Transactions' : 'Yesterday Transactions';
    
    return (
      <View style={styles.dateSection}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        <View style={styles.divider} />
        {groupedTransactions[date].map((transaction) => (
          <View key={transaction.id}>
            {renderTransactionItem({ item: transaction })}
            <View style={styles.itemDivider} />
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0D1B2A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{companyName}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Section Title */}
      <Text style={styles.sectionHeader}>Transactions</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6C757D" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#6C757D"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Transactions List */}
      <ScrollView style={styles.transactionsList}>
        {sortedDates.map((date, index) => (
          <View key={date}>
            {renderDateSection({ item: date })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
    marginTop: 20,
  },
  headerTitle: {
    fontFamily: 'Sansation-Bold',
    fontSize: 28,
    color: '#0D1B2A',
    textAlign: 'center',
  },
  sectionHeader: {
    fontFamily: 'Sansation-Bold',
    fontSize: 20,
    color: '#0D1B2A',
    marginLeft: 20,
    
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Sansation-Regular',
    color: '#0D1B2A',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Sansation-Bold',
    fontSize: 18,
    color: '#0D1B2A',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#FFD166',
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionTitle: {
    fontFamily: 'Sansation-Bold',
    fontSize: 16,
    color: '#0D1B2A',
    marginBottom: 4,
  },
  transactionDate: {
    fontFamily: 'Sansation-Regular',
    fontSize: 14,
    color: '#6C757D',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionPoints: {
    fontFamily: 'Sansation-Bold',
    fontSize: 16,
  },
  earnedPoints: {
    color: '#28A745',
  },
  redeemedPoints: {
    color: '#DC3545',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#FFD166',
    marginTop: 12,
  },
}); 