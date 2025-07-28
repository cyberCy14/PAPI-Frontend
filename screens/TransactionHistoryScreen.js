import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../assets/styles/create.styles';
import { COLORS } from '../constants/colors';
import { SafeScreenWithHeader } from '../components/SafeScreen';

const CATEGORIES = ['All', 'Income', 'Expense', 'Asset', 'Liability'];

export default function TransactionHistoryScreen() {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const sampleTransactions = [
      {
        id: '1',
        fields: {
          description: 'Salary',
          amount: 5000,
          category: 'Income',
          date: today.toISOString().split('T')[0],
        },
      },
      {
        id: '2',
        fields: {
          description: 'Groceries',
          amount: 1200,
          category: 'Expense',
          date: yesterday.toISOString().split('T')[0],
        },
      },
      {
        id: '3',
        fields: {
          description: 'Investment',
          amount: 2000,
          category: 'Asset',
          date: twoDaysAgo.toISOString().split('T')[0],
        },
      },
      {
        id: '4',
        fields: {
          description: 'Loan Payment',
          amount: 3000,
          category: 'Liability',
          date: '2025-07-15',
        },
      },
      {
        id: '5',
        fields: {
          description: 'Salary',
          amount: 5000,
          category: 'Income',
          date: today.toISOString().split('T')[0],
        },
      },
      {
        id: '6',
        fields: {
          description: 'Groceries',
          amount: 1200,
          category: 'Expense',
          date: yesterday.toISOString().split('T')[0],
        },
      },
      {
        id: '7',
        fields: {
          description: 'Investment',
          amount: 2000,
          category: 'Asset',
          date: twoDaysAgo.toISOString().split('T')[0],
        },
      },
      {
        id: '8',
        fields: {
          description: 'Loan Payment',
          amount: 3000,
          category: 'Liability',
          date: '2025-07-15',
        },
      },
    ];

    const sorted = sampleTransactions.sort(
      (a, b) => new Date(b.fields.date) - new Date(a.fields.date)
    );

    setTransactions(sorted);
    setFiltered(sorted);
  }, []);

  useEffect(() => {
    let data = [...transactions];

    if (selectedCategory !== 'All') {
      data = data.filter((t) => t.fields.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      data = data.filter((t) => {
        const { description, category, date, amount } = t.fields;
        return (
          description?.toLowerCase().includes(q) ||
          category?.toLowerCase().includes(q) ||
          date?.toLowerCase().includes(q) ||
          amount?.toString().includes(q)
        );
      });
    }

    setFiltered(data);
  }, [searchQuery, selectedCategory, transactions]);

  const groupByDate = (data) => {
    const groups = {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    data.forEach((item) => {
      const date = new Date(item.fields.date);
      const dateStr = date.toDateString();

      let label = dateStr;
      if (dateStr === today) label = 'Today';
      else if (dateStr === yesterday) label = 'Yesterday';
      else label = date.toLocaleDateString(undefined, { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });

      if (!groups[label]) groups[label] = [];
      groups[label].push(item);
    });

    return Object.entries(groups);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Income': return 'trending-up';
      case 'Expense': return 'trending-down';
      case 'Asset': return 'wallet';
      case 'Liability': return 'alert-circle';
      default: return 'help-circle';
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = transactions.filter(t => t.id !== id);
            setTransactions(updated);
            setFiltered(updated.filter(t => 
              (selectedCategory === 'All' || t.fields.category === selectedCategory) &&
              (searchQuery.trim() === '' || 
                t.fields.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.fields.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.fields.date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.fields.amount?.toString().includes(searchQuery)
            )));
            setIsModalVisible(false);
          },
        },
      ]
    );
  };

  const handleEdit = (transaction) => {
    setIsModalVisible(false);
    navigation.navigate('AddTransaction', { transactionToEdit: transaction });
  };

  const renderTransaction = ({ item }) => {
    const { description, amount, date, category } = item.fields;

    let amountStyle;
    switch (category) {
      case 'Income': amountStyle = styles.transactionAmountIncome; break;
      case 'Expense': amountStyle = styles.transactionAmountExpense; break;
      case 'Asset': amountStyle = styles.transactionAmountAsset; break;
      case 'Liability': amountStyle = styles.transactionAmountLiability; break;
      default: amountStyle = styles.transactionAmountIncome;
    }

    return (
      <TouchableOpacity 
        style={styles.transactionCard}
        onPress={() => {
          setSelectedTransaction(item);
          setIsModalVisible(true);
        }}
      >
        <View style={styles.transactionContent}>
          <View style={styles.categoryIconContainer}>
            <Ionicons
              name={getCategoryIcon(category)}
              size={20}
              color={COLORS.textLight}
            />
          </View>
          <View style={styles.transactionLeft}>
            <Text style={styles.transactionTitle}>{description}</Text>
            <Text style={styles.transactionCategory}>{category}</Text>
          </View>
          <View style={styles.transactionRight}>
            <Text style={amountStyle}>₱{parseFloat(amount).toLocaleString()}</Text>
            <Text style={styles.transactionDate}>
              {new Date(date).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const grouped = groupByDate(filtered);

  return (
    <View style={styles.container}>
      <SafeScreenWithHeader>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction History</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.stickyHeader}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by description, category, amount..."
              placeholderTextColor={COLORS.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.filterRowContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.filterBtn,
                    selectedCategory === cat && styles.filterBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedCategory === cat && styles.filterTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <FlatList
          data={grouped}
          keyExtractor={([label]) => label}
          renderItem={({ item: [label, items] }) => (
            <View style={styles.transactionGroup}>
              <Text style={styles.sectionTitle}>{label}</Text>
              <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={renderTransaction}
                scrollEnabled={false}
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={[styles.emptyState, { marginTop: 20 }]}>
              <Ionicons name="file-tray-outline" size={40} color="#ccc" />
              <Text style={styles.emptyStateTitle}>No Transactions Found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filter criteria
              </Text>
            </View>
          }
          contentContainerStyle={styles.transactionsListContainer}
        />

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.centeredView}>
          
            <View style={styles.modalView}>
              {selectedTransaction && (
                <>
                  <TouchableOpacity
                      style={[styles.closeButton]}
                      onPress={() => setIsModalVisible(false)}
                    >
                      <Ionicons name="close" size={20} color={COLORS.white} />
                    </TouchableOpacity>
                  <Text style={styles.modalTitle}>Transaction Details</Text>
                  
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Description:</Text>
                    <Text style={styles.detailValue}>{selectedTransaction.fields.description}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount:</Text>
                    <Text style={styles.detailValue}>₱{parseFloat(selectedTransaction.fields.amount).toLocaleString()}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category:</Text>
                    <Text style={styles.detailValue}>{selectedTransaction.fields.category}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedTransaction.fields.date).toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.editButton]}
                      onPress={() => handleEdit(selectedTransaction)}
                    >
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.button, styles.deleteButton]}
                      onPress={() => handleDelete(selectedTransaction.id)}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                    
                    
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeScreenWithHeader>
    </View>
  );
}

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalView: {
//     width: '80%',
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//     paddingVertical: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   detailLabel: {
//     fontWeight: 'bold',
//     color: '#555',
//   },
//   detailValue: {
//     color: '#333',
//   },
//   buttonContainer: {
//     marginTop: 20,
//   },
//   button: {
//     borderRadius: 10,
//     padding: 10,
//     marginVertical: 5,
//     alignItems: 'center',
//   },
//   editButton: {
//     backgroundColor: COLORS.primary,
//   },
//   deleteButton: {
//     backgroundColor: '#ff4444',
//   },
//   closeButton: {
//     backgroundColor: '#999',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });