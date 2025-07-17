import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Animated, Easing, SafeAreaView, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const emailAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (anim) => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = (anim, value) => {
    if (!value) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  };

  const getLabelStyle = (anim) => ({
    position: 'absolute',
    left: 15,
    top: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -10],
    }),
    fontSize: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 14],
    }),
    color: anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#6B7280', '#0A0E2A'],
    }),
    backgroundColor: anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent','#fdf9fd'],
    }), 
    paddingHorizontal: 5,
    zIndex: 1,
  });

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <Text style={styles.hello}>HELLO</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      <View style={styles.inputContainer}>
        <Animated.Text style={getLabelStyle(emailAnim)}>Email</Animated.Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          onFocus={() => handleFocus(emailAnim)}
          onBlur={() => handleBlur(emailAnim, email)}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Animated.Text style={getLabelStyle(passwordAnim)}>Password</Animated.Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            onFocus={() => handleFocus(passwordAnim)}
            onBlur={() => handleBlur(passwordAnim, password)}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? 'eye' : 'eye-off'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>
      </View>
    
      <View style={styles.inputContainer}>
        <Animated.Text style={getLabelStyle(confirmPasswordAnim)}>
          Confirm Password
        </Animated.Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onFocus={() => handleFocus(confirmPasswordAnim)}
            onBlur={() => handleBlur(confirmPasswordAnim, confirmPassword)}
            secureTextEntry={!confirmPasswordVisible}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            <Ionicons
              name={confirmPasswordVisible ? 'eye' : 'eye-off'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or continue with</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.googleButton}>
        <Image source={require('../assets/google.png')} style={styles.googleIcon} />
        <Text style={styles.googleText}>Google</Text>
      </TouchableOpacity>
      <Text style={styles.loginPrompt}>
        Already have an account?
        <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          {' '}Login
        </Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf9fd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  hello: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#0A0E2A',
  },
  subtitle: {
    fontSize: 16,
    color: '#0A0E2A',
    marginBottom: 50,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
    position: 'relative',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#0A0E2A',
    padding: 14,
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#000',
  },

  passwordWrapper: {
    width: '100%',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 18,
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#FDC856',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    marginTop: 50,
    marginBottom: 15,
  },
  registerText: {
    color: '#0A0E2A',
    fontSize: 20,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#0A0E2A',
  },
  orText: {
    marginHorizontal: 10,
    color: '#0A0E2A',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDC856',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 15,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  googleText: {
    fontSize: 16,
    color: '#0A0E2A',
  },
  loginPrompt: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 30,
  },
  loginLink: {
    fontWeight: 'bold',
    color: '#0A0E2A',
  },
});
