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
import { createTransaction } from '../context/fetchAirtable';
import { PESO_SIGN } from "../constants/currency";
import { SafeScreenWithHeader } from '../components/SafeScreen';
import { styles } from '../assets/styles/addTransaction.styles'; // Updated import

const categories = ['Income', 'Expense', 'Asset', 'Liability'];

export default function AddTransactionScreen({ route }) {
  const navigation = useNavigation();
  const { transactionToEdit } = route.params || {};

  const [description, setDescription] = useState(transactionToEdit?.fields.description || '');
  const [amount, setAmount] = useState(transactionToEdit?.fields.amount.toString() || '');
  const [selectedCategory, setSelectedCategory] = useState(transactionToEdit?.fields.category || null);
  const [date, setDate] = useState(transactionToEdit ? new Date(transactionToEdit.fields.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (!description || !amount || !selectedCategory || !date) {
      alert('Please complete all fields.');
      return;
    }

    const transactionData = {
      description,
      amount: parseFloat(amount),
      category: selectedCategory,
      date: date.toISOString().split('T')[0],
    };

    if (transactionToEdit) {
      transactionData.id = transactionToEdit.id;
    }

    const success = await createTransaction(transactionData);

    if (success) {
      alert(transactionToEdit ? 'Transaction updated!' : 'Transaction saved!');
      navigation.goBack();
    } else {
      alert('Something went wrong.');
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

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="create-outline"
              size={22}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Transaction Title"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
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
                  {cat}
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
            <Ionicons
              name="calendar-outline"
              size={22}
              color="#999"
              style={styles.inputIcon}
            />
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