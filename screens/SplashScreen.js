import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome'); 
    }, 3000); 

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain"/>
      <Text style={styles.title}>PAPI</Text>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf8f8', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 50,
    color: '#0A0E2A',
    fontWeight: '400',
    marginBottom: 10,
  },
});
