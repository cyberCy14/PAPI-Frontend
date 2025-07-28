import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../assets/styles/home.styles';
import { baseStyles } from '../assets/styles/create.styles';
import { fetchAllTransactions, fetchCategoryDetails } from '../context/fetchAirtable';
import { StatusBar } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { COLORS } from '../constants/colors';
import AnalyticsPreview from '../components/AnalyticsPreview';


export default function BudgetScreen() {
  const navigation = useNavigation();
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [liabilityTotal, setLiabilityTotal] = useState(0);
  const [assetTotal, setAssetTotal] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const inc = await fetchCategoryDetails('Income');
      const exp = await fetchCategoryDetails('Expense');
      const lia = await fetchCategoryDetails('Liability');
      const ast = await fetchCategoryDetails('Asset');
      const all = await fetchAllTransactions();

      const sum = (rows) =>
        rows.reduce((acc, item) => {
          const key = Object.keys(item.fields).find((k) =>
            k.toLowerCase().includes('amount')
          );
          return acc + (parseFloat(item.fields[key]) || 0);
        }, 0);

      setIncomeTotal(sum(inc));
      setExpenseTotal(sum(exp));
      setLiabilityTotal(sum(lia));
      setAssetTotal(sum(ast));
      setNetProfit(sum(inc) - sum(exp) - sum(lia));

      const sortedTx = all
        .filter((tx) => tx.fields?.amount)
        .sort((a, b) => new Date(b.fields.date) - new Date(a.fields.date));
      setRecentTransactions(sortedTx.slice(0, 5));
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const mockTransactions = [
        {
          id: '1',
          fields: {
            description: 'Burger Purchase',
            amount: 150,
            date: new Date().toISOString(),
            category: 'Expense',
          },
        },
        {
          id: '2',
          fields: {
            description: 'Freelance Work',
            amount: 5000,
            date: new Date().toISOString(),
            category: 'Income',
          },
        },
        {
          id: '3',
          fields: {
            description: 'New Laptop',
            amount: 30000,
            date: new Date().toISOString(),
            category: 'Asset',
          },
        },
        {
          id: '4',
          fields: {
            description: 'Burger Purchase',
            amount: 150,
            date: new Date().toISOString(),
            category: 'Expense',
          },
        },
        {
          id: '5',
          fields: {
            description: 'Freelance Work',
            amount: 5000,
            date: new Date().toISOString(),
            category: 'Liability',
          },
        },
      ];

      setRecentTransactions(mockTransactions);
    };

    loadData();
  }, []);

  const renderTransaction = ({ item }) => {
    const { description, amount, date, category } = item.fields;
    return (
      <TouchableOpacity 
        style={styles.transactionCard}
        onPress={() => {
          setSelectedTransaction(item);
          setIsModalVisible(true);
        }}
      >
        <View style={styles.transactionContent}>
          <View style={styles.transactionLeft}>
            <Text style={styles.transactionTitle}>{description}</Text>
            <Text style={styles.transactionCategory}>{category}</Text>
          </View>
          <View style={styles.transactionRight}>
            <Text style={styles.transactionAmount}>
              ₱{parseFloat(amount).toLocaleString()}
            </Text>
            <Text style={styles.transactionDate}>
              {new Date(date).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const image = require('../assets/mastercard.png');

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { alignItems: 'center' }]}>
        <Text style={styles.headerTitle}>Business Financial Report</Text>
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: 20 }]}>
        <View style={styles.balanceCard}>
          <ImageBackground
            source={image}
            style={styles.backgroundImage}
            imageStyle={{ borderRadius: 20 }}
            resizeMode="cover"
          />
          <View style={styles.balanceTitle}>
            <Text style={styles.balanceTitle}>Net Profit</Text>
          </View>

          <Text style={styles.balanceAmount}>
            ₱50,000.00
          </Text>
          
          <View style={styles.balanceStats}>
            <View style={styles.balanceStatItem}>
              <Text style={styles.balanceStatLabel}>Income</Text>
              <Text style={styles.balanceStatAmount}>
                ₱25,122.00
              </Text>
            </View>
            <View style={[styles.balanceStatItem]}>
              <Text style={styles.balanceStatLabel}>Expense</Text>
              <Text style={styles.balanceStatAmount}>
                ₱15,067.00
              </Text>
            </View>
          </View>

          <View style={[styles.balanceStats, { marginTop: 12 }]}>
            <View style={styles.balanceStatItem}>
              <Text style={styles.balanceStatLabel}>Asset</Text>
              <Text style={styles.balanceStatAmount}>
                ₱24,878.00
              </Text>
            </View>
            <View style={styles.balanceStatItem}>
              <Text style={styles.balanceStatLabel}>Liability</Text>
              <Text style={styles.balanceStatAmount}> ₱9,500.00
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginHorizontal: -25 }}>
          <View style={styles.bottomContainer}>
            <View style={styles.transactionsContainer}>
              <View
                style={[
                  styles.transactionsHeaderContainer,
                  { justifyContent: 'space-between' },
                ]}
              >
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('TransactionHistory')}
                >
                  <Text style={{ textAlign: "center", fontFamily: 'Sansation-Regular'}}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              {recentTransactions.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="file-tray-outline"
                    size={40}
                    color="#ccc"
                    style={styles.emptyStateIcon}
                  />
                  <Text style={styles.emptyStateTitle}>No Transactions</Text>
                  <Text style={styles.emptyStateText}>
                    Your most recent transactions will appear here.
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={recentTransactions}
                  renderItem={renderTransaction}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  contentContainerStyle={styles.transactionsListContent}
                />
              )}
            </View>
            <AnalyticsPreview 
              incomeTotal={incomeTotal}
              expenseTotal={expenseTotal}
              recentTransactions={recentTransactions}
            />
          </View>
        </View>
        
      </ScrollView>

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
              </>
            )}
          </View>
        </View>
      </Modal>

    
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Ionicons name="add" size={25} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}
