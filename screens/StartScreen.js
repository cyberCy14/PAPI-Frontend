import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

function StartScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/business-analytics.png')} style={styles.illustration} />
      <Text style={styles.title}>Welcome to Papi</Text>
      <Text style={styles.subtitle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Text>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.replace('Login')}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.replace('Signup')}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  illustration: {
    width: 400,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  title: {
    fontSize: 45,
    color: '#061437',
    fontFamily: 'Sansation-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Sansation-Bold',
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: '#FDC856',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 80,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#061437',
    fontSize: 16,
    fontFamily: 'Sansation-Bold',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FDC856',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 80,
    width: '100%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#061437',
    fontSize: 16,
    fontFamily: 'Sansation-Bold',
  },
});
