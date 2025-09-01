import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TransactionResultScreen({ route, navigation }) {
  const { transaction } = route.params;
  const isEarn = transaction.action === 'earn';

  return (
    <View style={styles.container}>
      <View style={styles.checkCircle}>
        <Text style={styles.check}>✔</Text>
      </View>

      <Text style={styles.title}>
        {isEarn ? 'Points Credited!' : 'Points Redeemed!'}
      </Text>
      <Text style={styles.subtitle}>
        Your transaction has been processed successfully.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Customer:</Text>
        <Text style={styles.value}>{transaction.customer}</Text>

        <Text style={styles.label}>Company:</Text>
        <Text style={styles.value}>{transaction.company}</Text>

        <Text style={styles.label}>Points:</Text>
        <Text style={[styles.value, { color: isEarn ? 'green' : 'red' }]}>
          {isEarn ? '+' : '-'}{transaction.points}
        </Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>Completed</Text>

        <Text style={styles.label}>New Balance:</Text>
        <Text style={styles.value}>{transaction.balance} points</Text>

        <Text style={styles.label}>Transaction ID:</Text>
        <Text style={styles.value}>{transaction.txId}</Text>

        <Text style={styles.label}>Processed on:</Text>
        <Text style={styles.value}>
          {transaction.date ? new Date(transaction.date).toLocaleString() : ''}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.navigate('AppTabs')}
      >
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eafdf6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  check: { fontSize: 40, color: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  subtitle: { fontSize: 14, color: '#666', marginVertical: 10 },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginVertical: 20,
    elevation: 2,
  },
  label: { fontSize: 14, color: '#555', marginTop: 10 },
  value: { fontSize: 16, fontWeight: '600' },
  closeButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  closeText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});