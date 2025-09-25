import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, ScrollView, SafeAreaView,
  ImageBackground, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native'; 
import { styles } from '../assets/styles/home.styles';
import { COLORS } from '../constants/colors';
import AnalyticsPreview from '../components/AnalyticsPreview';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BudgetScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();  

  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [liabilityTotal, setLiabilityTotal] = useState(0);
  const [assetTotal, setAssetTotal] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const API_URL = `${API_BASE_URL}/api`;

  const loadData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken'); 

      const summaryRes = await fetch(`${API_URL}/financial-reports-summary`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const summary = await summaryRes.json();

      setIncomeTotal(summary.income || 0);
      setExpenseTotal(summary.expense || 0);
      setLiabilityTotal(summary.liabilities || 0);
      setAssetTotal(summary.assets || 0);
      setNetProfit(summary.net_profit || 0);

      const txRes = await fetch(`${API_URL}/financial-reports`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const transactions = await txRes.json();

      const sortedTx = transactions.sort(
        (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
      );
      setRecentTransactions(sortedTx.slice(0, 5)); 
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    if (route.params?.newTransaction) {
      const tx = route.params.newTransaction;

      let dateString = tx.transaction_date;
      if(dateString.length === 10){
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
        dateString = `${dateString} ${time}`;
      }

      const txWithDateTime = {
        ...tx,
        transaction_date: dateString
      };
      
      // setRecentTransactions(prev => [tx, ...prev].slice(0, 5));

      setRecentTransactions(prev => {
        const updated = [txWithDateTime, ...prev];
        return updated
          .sort((a,b) => new Date(b.transaction_date) - new Date(a.transaction_date))
          .slice(0.5);
      });

      const amt = parseFloat(tx.amount);
      if (tx.type === 'income') {
        setIncomeTotal(prev => prev + amt);
        setNetProfit(prev => prev + amt);
      } else if (tx.type === 'expense') {
        setExpenseTotal(prev => prev + amt);
        setNetProfit(prev => prev - amt);
      } else if (tx.type === 'asset') {
        setAssetTotal(prev => prev + amt);
      } else if (tx.type === 'liability') {
        setLiabilityTotal(prev => prev + amt);
      }

      navigation.setParams({ newTransaction: null });
    }
  }, [route.params?.newTransaction]);

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const renderTransaction = ({ item }) => {
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
            <Text style={styles.transactionTitle}>{item.transaction_title}</Text>
            <Text style={styles.transactionCategory}>{item.type}</Text>
          </View>
          <View style={styles.transactionRight}>
            <Text style={styles.transactionAmount}>
              ₱{parseFloat(item.amount).toLocaleString()}
            </Text>
            <Text style={styles.transactionDate}>
              {new Date(item.transaction_date).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const image = require('../assets/mastercard.png');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { alignItems: 'center' }]}>
        <Text style={styles.headerTitle}>Business Financial Report</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingTop: 20 }]}>
        {/* Net Profit Card */}
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
            ₱{netProfit.toLocaleString()}
          </Text>

          <View style={styles.balanceStats}>
            <View style={styles.balanceStatItem}>
              <Text style={styles.balanceStatLabel}>Income</Text>
              <Text style={styles.balanceStatAmount}>₱{incomeTotal.toLocaleString()}</Text>
            </View>
            <View style={styles.balanceStatItem}>
              <Text style={styles.balanceStatLabel}>Expense</Text>
              <Text style={styles.balanceStatAmount}>₱{expenseTotal.toLocaleString()}</Text>
            </View>
          </View>

          <View style={[styles.balanceStats, { marginTop: 12 }]}>
            <View style={styles.balanceStatItem}>
              <Text style={styles.balanceStatLabel}>Asset</Text>
              <Text style={styles.balanceStatAmount}>₱{assetTotal.toLocaleString()}</Text>
            </View>
            <View style={styles.balanceStatItem}>
              <Text style={styles.balanceStatLabel}>Liability</Text>
              <Text style={styles.balanceStatAmount}>₱{liabilityTotal.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Transactions List */}
        <View style={{ marginHorizontal: -25 }}>
          <View style={styles.bottomContainer}>
            <View style={styles.transactionsContainer}>
              <View style={[styles.transactionsHeaderContainer, { justifyContent: 'space-between' }]}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
                  <Text style={{ textAlign: "center", fontFamily: 'Sansation-Regular' }}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              {recentTransactions.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="file-tray-outline" size={40} color="#ccc" style={styles.emptyStateIcon} />
                  <Text style={styles.emptyStateTitle}>No Transactions</Text>
                  <Text style={styles.emptyStateText}>Your most recent transactions will appear here.</Text>
                </View>
              ) : (
                <FlatList
                  data={recentTransactions}
                  renderItem={renderTransaction}
                  keyExtractor={(item) => item.id.toString()}
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

      {/* Transaction Modal */}
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
                <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                  <Ionicons name="close" size={20} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Transaction Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Description:</Text>
                  <Text style={styles.detailValue}>{selectedTransaction.transaction_title}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount:</Text>
                  <Text style={styles.detailValue}>₱{parseFloat(selectedTransaction.amount).toLocaleString()}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type:</Text>
                  <Text style={styles.detailValue}>{selectedTransaction.type}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedTransaction.transaction_date).toLocaleDateString()}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Floating Button */}
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Ionicons name="add" size={25} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}