// CompanyTransactScreen.js
import React, { useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";

const fetchFonts = () =>
  Font.loadAsync({
    "Sansation-Bold": require("../assets/fonts/Sansation-Bold.ttf"),
    "Sansation-Regular": require("../assets/fonts/Sansation-Regular.ttf"),
  });

export default function CompanyTransactScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const company = route.params?.company ?? null;

  const [searchQuery, setSearchQuery] = useState("");
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await fetchFonts();
      } catch (e) {
        console.warn("Font issue:", e?.message || e);
      } finally {
        setFontLoaded(true);
      }
    })();
  }, []);

  // Source transactions only from the passed company object
  const transactions = company?.transactions ?? [];

  // Normalize and sort newest-first
  const normalized = useMemo(() => {
    return transactions
      .map((t) => {
        const dateStr = t.transaction_date ?? t.created_at ?? null;
        const dateObj = dateStr ? new Date(dateStr.replace(" ", "T")) : null; // try safe parsing
        const dayKey = dateObj ? dateObj.toISOString().slice(0, 10) : "unknown";
        return { ...t, _dateObj: dateObj, _dayKey: dayKey };
      })
      .sort((a, b) => (b._dateObj?.getTime() ?? 0) - (a._dateObj?.getTime() ?? 0));
  }, [transactions]);

  // Filter by search (type / rule name / amount)
  const filtered = useMemo(() => {
    if (!searchQuery) return normalized;
    const q = searchQuery.toLowerCase();
    return normalized.filter((t) => {
      const type = (t.transaction_type ?? "").toLowerCase();
      const rules = (t.rule_breakdown ?? []).map((r) => r.rule_name).join(" ").toLowerCase();
      const amount = String(t.purchase_amount ?? "");
      return type.includes(q) || rules.includes(q) || amount.includes(q);
    });
  }, [normalized, searchQuery]);

  // Group by dayKey
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((t) => {
      const key = t._dayKey;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return Object.keys(map)
      .sort((a, b) => (a < b ? 1 : -1)) // newest day first
      .map((day) => ({ day, txns: map[day] }));
  }, [filtered]);

  function formatGroupLabel(dayKey) {
    const todayKey = new Date().toISOString().slice(0, 10);
    const yesterdayKey = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (dayKey === todayKey) return "Today";
    if (dayKey === yesterdayKey) return "Yesterday";
    const d = new Date(dayKey);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function renderTxnCard(txn) {
    const isEarn = txn.transaction_type === "earning";
    return (
      <View style={styles.txnCard}>
        <View style={styles.txnLeft}>
          <View style={styles.iconCircle(isEarn)}>
            <Ionicons name={isEarn ? "add" : "remove"} size={16} color="#fff" />
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.txnTitle}>
              {isEarn ? "Earned" : "Redeemed"} {txn.points_earned ?? 0} pts
            </Text>
            <Text style={styles.txnMeta}>
              {txn._dateObj ? txn._dateObj.toLocaleString() : txn.transaction_date ?? txn.created_at}
            </Text>
            {txn.purchase_amount ? <Text style={styles.txnMeta}>Purchase: ₱{txn.purchase_amount}</Text> : null}
          </View>
        </View>
        <View style={styles.txnRight}>
          <Text style={[styles.txnPoints, isEarn ? styles.earned : styles.redeemed]}>
            {isEarn ? `+${txn.points_earned ?? 0}` : `${txn.points_earned ?? 0}`}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 8 }}>
          <Ionicons name="arrow-back" size={22} color="#0D1B2A" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          {company?.logo ? (
            <Image source={company.logo} style={styles.companyLogo} />
          ) : (
            <View style={[styles.companyLogo, { backgroundColor: "#F0F2F5", justifyContent: "center", alignItems: "center" }]}>
              <Text style={{ color: "#8893A7", fontSize: 12 }}>No Logo</Text>
            </View>
          )}
          <Text style={styles.headerTitle}>{company?.name ?? "Company"}</Text>
          <Text style={styles.headerPoints}>{company?.points ?? 0} pts</Text>
        </View>

        <View style={{ width: 28 }} />
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#6C757D" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Filter by type, rule name, or amount"
          placeholderTextColor="#8A97A6"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Transactions grouped */}
      <FlatList
        data={grouped}
        keyExtractor={(g) => g.day}
        contentContainerStyle={{ paddingBottom: 36 }}
        ListEmptyComponent={
          <View style={{ padding: 28 }}>
            <Text style={styles.emptyText}>No transactions yet.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.groupWrap}>
            <Text style={styles.groupLabel}>{formatGroupLabel(item.day)}</Text>
            <View style={styles.groupDivider} />
            {item.txns.map((txn) => (
              <View key={txn.id ?? txn.transaction_id} style={{ paddingHorizontal: 18 }}>
                {renderTxnCard(txn)}
              </View>
            ))}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F8FB" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 12 : 22,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomColor: "#EDEFF3",
    borderBottomWidth: 1,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  companyLogo: { width: 48, height: 48, borderRadius: 12, marginBottom: 6 },
  headerTitle: { fontFamily: "Sansation-Bold", fontSize: 16, color: "#0D1B2A" },
  headerPoints: { fontFamily: "Sansation-Regular", fontSize: 12, color: "#6E7A89", marginTop: 2 },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#0D1B2A" },

  groupWrap: { marginTop: 6, marginBottom: 6 },
  groupLabel: { marginLeft: 18, fontSize: 14, fontFamily: "Sansation-Bold", color: "#0D1B2A", marginTop: 12 },
  groupDivider: { height: 1, backgroundColor: "#FFD166", marginVertical: 10, marginHorizontal: 18 },

  txnCard: {
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  txnLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconCircle: (isEarn) => ({
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: isEarn ? "#2E8B57" : "#C0392B",
    justifyContent: "center",
    alignItems: "center",
  }),
  txnTitle: { fontFamily: "Sansation-Bold", fontSize: 15, color: "#0D1B2A" },
  txnMeta: { fontFamily: "Sansation-Regular", fontSize: 12, color: "#6E7A89", marginTop: 4 },
  txnRight: { justifyContent: "center", alignItems: "flex-end", marginLeft: 8 },
  txnPoints: { fontFamily: "Sansation-Bold", fontSize: 16 },
  earned: { color: "#2E8B57" },
  redeemed: { color: "#C0392B" },

  emptyText: { textAlign: "center", color: "#9AA6B5", fontFamily: "Sansation-Regular", fontSize: 14 },
});
