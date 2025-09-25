import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  RefreshControl,
  Platform,
} from "react-native";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../config";

const fetchFonts = () =>
  Font.loadAsync({
    "Sansation-Bold": require("../assets/fonts/Sansation-Bold.ttf"),
    "Sansation-Regular": require("../assets/fonts/Sansation-Regular.ttf"),
  });

export default function LoyaltyPointScreen() {
  const navigation = useNavigation();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await fetchFonts();
      } catch (e) {
        console.warn("Font load issue:", e?.message || e);
      } finally {
        setFontLoaded(true);
        await loadBalances();
      }
    })();
  }, []);

  // async function loadBalances() {
  //   // setLoading(true);
  //   try {
  //     const token = await AsyncStorage.getItem("authToken");
  //     const userRaw = await AsyncStorage.getItem("user");
  //     if (!userRaw) {
  //       setCompanies([]);
  //       return;
  //     }
  //     const user = JSON.parse(userRaw);
  //     const customerId = user.id;

  //     // const url = `${API_BASE_URL}/api/loyalty/customer-company-balances?customer_id=${customerId}`;
  //     const url = `${API_BASE_URL}/api/loyalty/customer-company-balances`;
  //     const res = await fetch(url, {
  //       // headers: {
  //       //   Accept: "application/json",
  //       //   "Content-Type": "application/json",
  //       //   ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //       // },
  //        headers: {
  //         "Accept": "application/json",
  //         "Authorization": `Bearer ${token}`
  //       }
  //     });

  //     if (!res.ok) {
  //       const text = await res.text();
  //       console.error("Server error (Loyalty):", res.status, text);
  //       setCompanies([]);
  //       return;
  //     }

  //     const json = await res.json();
  //     const rawList = Array.isArray(json) ? json : json.data ?? [];

  //     const mapped = rawList.map((item) => {
  //       const companyObj = item.company ?? null;
  //       // const transactions = item.transactions ?? companyObj?.customer_points ?? [];
  //       return {
  //         raw: item,
  //         id: companyObj?.id ?? item.company_id ?? Math.random(),
  //         name: companyObj?.company_name ?? companyObj?.name ?? `Company ${item.company_id}`,
  //         displayName: companyObj?.display_name ?? "",
  //         logo: companyObj?.company_logo ? { uri: companyObj.company_logo } : null,
  //         points: item.total_balance ?? item.totalBalance ?? item.balance ?? 0,
          
  //        transactions: item.transactions ?? []

          
  //       };
  //     });

  //     setCompanies(mapped);
  //   } catch (err) {
  //     console.error("Error fetching balances:", err);
  //     setCompanies([]);
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // }

  async function loadBalances() {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const userRaw = await AsyncStorage.getItem("user");

    if (!userRaw) {
      setCompanies([]);
      return;
    }
    const user = JSON.parse(userRaw);
    const customerId = user.id;

    const url = `${API_BASE_URL}/api/loyalty/customer-company-balances?customer_id=${customerId}`;
    
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Server error (Loyalty):", res.status, text);
      setCompanies([]);
      return;
    }

    const json = await res.json();
    const rawList = Array.isArray(json) ? json : json.data ?? [];

    const mapped = rawList.map((item) => {
      const companyObj = item.company ?? null;
      return {
        raw: item,
        id: companyObj?.id ?? item.company_id ?? Math.random(),
        name: companyObj?.company_name ?? `Company ${item.company_id}`,
        displayName: companyObj?.display_name ?? "",
        logo: companyObj?.company_logo ? { uri: companyObj.company_logo } : null,
        points: item.total_balance ?? 0,

        transactions: item.transactions ?? [],
      };
    });

    setCompanies(mapped);
  } catch (err) {
    console.error("Error fetching balances:", err);
    setCompanies([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}

  async function onRefresh() {
    setRefreshing(true);
    await loadBalances();
  }

  if (!fontLoaded || loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FDC856" />
        <Text style={styles.loadingText}>Loading your transactions...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Loyalty Points</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Companies header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Companies</Text>
        <Text style={styles.sectionCount}>{companies.length}</Text>
      </View>

      {/* Company list */}
      <FlatList
        data={companies}
        keyExtractor={(it) => String(it.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 36 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("CompanyTransact", { company: item })}
            style={styles.companyCard}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {item.logo ? (
                <Image source={item.logo} style={styles.logo} />
              ) : (
                <View style={[styles.logo, { backgroundColor: "#eee", justifyContent: "center", alignItems: "center" }]}>
                  <Text style={{ color: "#aaa", fontSize: 12 }}>No Logo</Text>
                </View>
              )}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.companyName}>{item.name}</Text>
                {item.displayName ? <Text style={styles.companyDesc}>{item.displayName}</Text> : null}
                <Text style={styles.transCount}>{(item.transactions || []).length} transactions</Text>
              </View>
              <View style={styles.pointsPill}>
                {/* <Ionicons name="star" size={14} color="#fff" /> */}
                <Text style={styles.pointsText}>{item.points}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No companies yet</Text>
            <Text style={styles.emptySub}>
              If you expect balances, make sure you're logged in and the backend endpoint returns data.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },

  topBar: {
    marginTop: Platform.OS === "android" ? 18 : 32,
    marginHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
  },
  title: { fontFamily: "Sansation-Bold", fontSize: 22, color: "#333" },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    marginHorizontal: 18,
  },
  sectionTitle: { fontFamily: "Sansation-Bold", fontSize: 18, color: "#333" },
  sectionCount: { fontFamily: "Sansation-Regular", fontSize: 14, color: "#666" },

  companyCard: {
    backgroundColor: "#fff",
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: "#FDC856", 
  },
  logo: { width: 56, height: 56, borderRadius: 12, backgroundColor: "#fff" },
  companyName: { fontFamily: "Sansation-Bold", fontSize: 16, color: "#333" },
  companyDesc: { fontFamily: "Sansation-Regular", fontSize: 13, color: "#666", marginTop: 2 },
  transCount: { fontFamily: "Sansation-Regular", fontSize: 12, color: "#999", marginTop: 6 },

  pointsPill: {
    marginLeft: 8,
    backgroundColor: "#FDC856",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  pointsText: { fontFamily: "Sansation-Bold", fontSize: 14, marginLeft: 6, color: "#fff" },

  emptyWrap: { padding: 28, alignItems: "center" },
  emptyText: { fontFamily: "Sansation-Bold", fontSize: 16, color: "#666", marginBottom: 6 },
  emptySub: { fontFamily: "Sansation-Regular", fontSize: 13, color: "#999", textAlign: "center", maxWidth: 320 },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F0F4F8" },
  loadingText: { fontSize: 16, color: "#666", marginTop: 10, fontFamily: "Sansation-Regular" },
});
