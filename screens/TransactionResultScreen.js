import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function TransactionResultScreen({ route, navigation }) {
  const { transaction } = route.params;

  if (transaction?.error) {
    return (
      <View style={styles.container}>
        <View style={[styles.checkCircle, { borderColor: "red" }]}>
          <Text style={[styles.check, { color: "red" }]}>✖</Text>
        </View>
        <Text style={[styles.title, { color: "red" }]}>Transaction Failed</Text>
        <Text style={styles.subtitle}>{transaction.error}</Text>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeText}>Scan Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Prefer transaction_type if available
  const isRedeem = transaction?.transaction_type === "redemption";
  const isEarn = transaction?.transaction_type === "earning";

  return (
    <View style={styles.container}>
      <View style={[styles.checkCircle, { borderColor: "green" }]}>
        <Text style={[styles.check, { color: "green" }]}>✔</Text>
      </View>

      <Text style={styles.title}>
        {isEarn
          ? "Points Earned!"
          : isRedeem
          ? "Points Redeemed!"
          : "Transaction Processed"}
      </Text>

      <Text style={styles.subtitle}>
        Your transaction has been processed successfully.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Customer:</Text>
        <Text style={styles.value}>{transaction.customer || "N/A"}</Text>

        <Text style={styles.label}>Company:</Text>
        <Text style={styles.value}>{transaction.company || "N/A"}</Text>

        <Text style={styles.label}>Points:</Text>
        <Text
          style={[
            styles.value,
            { color: isEarn ? "green" : "red" },
          ]}
        >
          {isEarn ? "+" : isRedeem ? "-" : ""}
          {transaction.points}
        </Text>

        {/* <Text style={styles.label}>Balance:</Text>
        <Text style={styles.value}> 
        {transaction.balance !== undefined && transaction.balance !== null
          ? transaction.balance
          : "N/A"}
      </Text> */}

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{transaction.status || "N/A"}</Text>

        <Text style={styles.label}>Transaction ID:</Text>
        <Text style={styles.value}>
          {transaction.transaction_id || "N/A"}
        </Text>

        {transaction?.date && (
          <>
            <Text style={styles.label}>Processed on:</Text>
            <Text style={styles.value}>
              {new Date(transaction.date).toLocaleString()}
            </Text>
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.navigate("AppTabs")}
      >
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  check: {
    fontSize: 40,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    color: "#061437",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1.2,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    padding: 18,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#061437",
    marginTop: 10,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "#061437",
    marginTop: 4,
  },
  closeButton: {
    backgroundColor: "#FDC856",
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: "center",
    width: "100%",
    marginTop: 5,
  },
  closeText: {
    color: "#061437",
    fontSize: 16,
    fontWeight: "bold",
  },
});

