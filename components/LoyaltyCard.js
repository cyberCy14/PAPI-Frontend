import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoyaltyCard = ({ shop }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('CompanyTransact', { company: shop });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.left}>
        <Text style={styles.name}>{shop.name}</Text>
        <Text style={styles.category}>{shop.category}</Text>
        <Text style={styles.points}>{shop.points} pts</Text>
      </View>

      <Image source={shop.logo} style={styles.logo} resizeMode="contain" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD166',
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  left: {
    flexDirection: 'column',
    flex: 1,
    marginRight: 10
  },
  name: {
    fontFamily: 'Sansation-Bold',
    fontSize: 23,
    color: '#0D1B2A',
    marginBottom: 5
  },
  category: {
    fontFamily: 'Sansation-Regular',
    fontSize: 13,
    color: '#6C757D',
    marginBottom: 20
  },
  points: {
    fontFamily: 'Sansation-Bold',
    fontSize: 17,         
    color: '#0D1B2A'
  },
  logo: {
    width: 50,
    height: 50
  }
});

export default LoyaltyCard;
