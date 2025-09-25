import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PESO_SIGN } from "../constants/currency";
import { SafeScreenWithHeader } from '../components/SafeScreen';
import { styles } from '../assets/styles/addTransaction.styles';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = ['income', 'expense', 'asset', 'liability'];

export default function AddTransactionScreen({ route }) {
  const navigation = useNavigation();
  const { transactionToEdit } = route.params || {};

  const [transactionTitle, setTransactionTitle] = useState(transactionToEdit?.transaction_title || '');
  const [amount, setAmount] = useState(transactionToEdit?.amount?.toString() || '');
  const [selectedCategory, setSelectedCategory] = useState(transactionToEdit?.type || null);
  const [date, setDate] = useState(transactionToEdit ? new Date(transactionToEdit.transaction_date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const API_URL = `${API_BASE_URL}/api`;

  const handleSave = async () => {
    if (!transactionTitle || !amount || !selectedCategory || !date) {
      alert('Please complete all fields.');
      return;
    }

    const formatDateTime = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    const transactionData = {
      transaction_title: transactionTitle,
      type: selectedCategory,
      amount: parseFloat(amount),
      // transaction_date: date.toISOString().split('T')[0],
      transaction_date: formatDateTime(date),
    };

    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${API_URL}/financial-reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          // ...(token ? { "Authorization": `Bearer ${token}` } : {}), 
          Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {

        const savedTx = await response.json();

        navigation.navigate('BudgetScreen', { newTransaction: savedTx.transaction});
        alert('Transaction saved!');

      } else {
        const errorData = await response.json().catch(() => null);
        console.error("Error response:", errorData);
        alert('Something went wrong: ' + (errorData?.message || 'API error'));
      }
    } catch (err) {
      console.error(err);
      alert('Network error, transaction not saved.');
    }
  };

  return (
    <View style={styles.container}>
      <SafeScreenWithHeader>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-outline" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Amount Input */}
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>{PESO_SIGN}</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="#999"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            {/* Title Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="create-outline" size={22} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Transaction Title"
                placeholderTextColor="#999"
                value={transactionTitle}
                onChangeText={setTransactionTitle}
              />
            </View>

            {/* Category Selection */}
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat && styles.categoryButtonActive,
                  ]}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === cat && styles.categoryButtonTextActive,
                  ]}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Date Picker */}
            <Text style={styles.sectionTitle}>Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.inputContainer}
            >
              <Ionicons name="calendar-outline" size={22} color="#999" style={styles.inputIcon} />
              <Text style={styles.input}>
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selected) => {
                  setShowDatePicker(false);
                  if (selected) setDate(selected);
                }}
              />
            )}

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {transactionToEdit ? 'Update Transaction' : 'Save Transaction'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeScreenWithHeader>
    </View>
  );
}