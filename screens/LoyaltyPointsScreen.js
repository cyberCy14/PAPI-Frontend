import React, { useEffect, useState } from 'react';
import { 
  SafeAreaView,
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import * as Font from 'expo-font';
import LoyaltyCard from '../components/LoyaltyCard';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import LoyaltyScreen from './LoyaltyScreen';

const fetchFonts = () => Font.loadAsync({
  'Sansation-Bold': require('../assets/fonts/Sansation-Bold.ttf'),
  'Sansation-Regular': require('../assets/fonts/Sansation-Regular.ttf'),
});

export default function LoyaltyHistoryScreen() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [shops, setShops] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadFonts = async () => { await fetchFonts(); setFontLoaded(true); };
    loadFonts();

    // Simulated backend data
    const data = [
      { id: 1, name: 'Robinsons', category: 'Mall', points: 360, logo: require('../assets/robinsons.jpg') },
      { id: 2, name: 'Lee Plaza', category: 'Mall', points: 300, logo: require('../assets/leeplaza.png') },
      { id: 3, name: 'Jollibee', category: 'Fastfood', points: 240, logo: require('../assets/jollibee.png') },
      { id: 4, name: 'Shopee', category: 'Online Shop', points: 420, logo: require('../assets/shopee.png') },
      { id: 5, name: 'Lazada', category: 'Online Shop', points: 120, logo: require('../assets/lazada.png') },
      { id: 6, name: 'GetApp', category: 'App Service', points: 280, logo: require('../assets/getapp.png') }
    ];

    setShops(data);
  }, []);

  if (!fontLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
        
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack(LoyaltyScreen)}>
          <Ionicons name="arrow-back" size={24} color="#0D1B2A" />
        </TouchableOpacity>
        <Text style={styles.header}>Loyalty</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <FlatList
        data={shops}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <LoyaltyCard shop={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAF7FB', 
    padding: 20 
},

headerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 40,
    marginTop: 30,
},

header: { 
    fontFamily: 'Sansation-Bold', 
    fontSize: 28, 
    // fontWeight: '700', 
    textAlign: 'center', 
    color: '#0D1B2A' 
}

});
