import React, { useContext, useState, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const { login, token } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { fetchUserProfile, profileExists } = useContext(UserContext);
  const navigation = useNavigation();

  // Animated label state
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const emailAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;

  const handleEmailFocus = () => {
    setIsEmailFocused(true);
    animateLabel(emailAnim, 1);
  };
  const handleEmailBlur = () => {
    setIsEmailFocused(false);
    if (!email) animateLabel(emailAnim, 0);
  };
  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
    animateLabel(passwordAnim, 1);
  };
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    if (!password) animateLabel(passwordAnim, 0);
  };
  const animateLabel = (anim, toValue) => {
    Animated.timing(anim, {
      toValue,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const emailLabelStyle = {
    position: 'absolute',
    left: 18,
    top: emailAnim.interpolate({ inputRange: [0, 1], outputRange: [14, -10] }),
    fontSize: emailAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 13] }),
    color: emailAnim.interpolate({ inputRange: [0, 1], outputRange: ['#888', '#061437'] }),
    fontFamily: 'Sansation-Regular',
    backgroundColor: 'white',
    paddingHorizontal: 4,
    zIndex: 1,
  };
  const passwordLabelStyle = {
    position: 'absolute',
    left: 18,
    top: passwordAnim.interpolate({ inputRange: [0, 1], outputRange: [14, -10] }),
    fontSize: passwordAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 13] }),
    color: passwordAnim.interpolate({ inputRange: [0, 1], outputRange: ['#888', '#061437'] }),
    fontFamily: 'Sansation-Regular',
    backgroundColor: 'white',
    paddingHorizontal: 4,
    zIndex: 1,
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);

    try {
      await login(email.trim(), password);
      // navigation.replace('AppTabs');

      const result = await fetchUserProfile();

      if(result && result.complete){
        navigation.replace('AppTabs');
      } else{
        navigation.replace('Register');
      }



    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };




  const handleGoogleLogin = () => {
    // TODO: wire up Google sign-in here
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.papi}>Papi</Text>
      <Text style={styles.heading}>WELCOME BACK</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      {/* Email input with animated label */}
      <View style={styles.inputContainer}>
        <Animated.Text style={emailLabelStyle}>Email</Animated.Text>
        <TextInput
          style={styles.input}
          placeholder=""
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          onFocus={handleEmailFocus}
          onBlur={handleEmailBlur}
          placeholderTextColor="#888"
        />
      </View>
      {/* Password input with animated label */}
      <View style={styles.inputContainer}>
        <Animated.Text style={passwordLabelStyle}>Password</Animated.Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.input}
            placeholder=""
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Log in</Text>
        )}
      </TouchableOpacity>
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or continue with</Text>
        <View style={styles.line} />
      </View>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image source={require('../assets/google.png')} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>Google</Text>
      </TouchableOpacity>
      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.registerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logo: {
    width: 240,
    height: 180,
    resizeMode: 'contain',
    marginTop: 16,
  },
  papi: {
    fontFamily: 'Sansation-Regular',
    fontSize: 22,
    color: '#061437',
    marginBottom: 2,
    textAlign: 'center',
  },
  heading: {
    fontFamily: 'Sansation-Bold',
    fontSize: 35,
    color: '#061437',
    marginBottom: 2,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'Sansation-Regular',
    fontSize: 14,
    color: '#888',
    marginBottom: 18,
    textAlign: 'center',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 12,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#E5E5E5',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingTop: 14, // Make space for label
    fontFamily: 'Sansation-Regular',
    fontSize: 15,
    color: '#061437',
    backgroundColor: '#FAFAFA',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 14,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  forgotPasswordText: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'Sansation-Bold',
  },
  loginButton: {
    backgroundColor: '#FDC856',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#061437',
    fontSize: 16,
    fontFamily: 'Sansation-Bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  orText: {
    marginHorizontal: 8,
    color: '#888',
    fontFamily: 'Sansation-Bold',
    fontSize: 13,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 18,
    justifyContent: 'center',
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#061437',
    fontFamily: 'Sansation-Bold',
    fontSize: 15,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  bottomText: {
    color: '#888',
    fontSize: 13,
    fontFamily: 'Sansation-Bold',
  },
  registerLink: {
    color: '#FDC856',
    fontFamily: 'Sansation-Bold',
    fontSize: 13,
    marginLeft: 2,
  },
});