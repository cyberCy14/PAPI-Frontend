import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/illustration.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.brand}>Papi</Text>
      <Text style={styles.subtitle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua.
      </Text>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('SignupScreen')}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f3f6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  image: {
    width: '100%',
    height: 350,
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    color: '#0a1734',
  },
  brand: {
    fontSize: 40,
    fontWeight: '700',
    color: '#0a1734',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#0a1734',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: '#fdc856',
    paddingVertical: 15,
    width: '100%',
    borderRadius: 10,
    marginBottom: 15,
  },
  loginText: {
    color: '#0a1734',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  registerButton: {
    borderColor: '#fdc856',
    borderWidth: 2,
    paddingVertical: 15,
    width: '100%',
    borderRadius: 10,
  },
  registerText: {
    color: '#0a1734',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
});