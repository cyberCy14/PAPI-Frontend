import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Animated, Easing} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

export default function LoginScreen({ navigation }) {

  // const [fontsLoaded] = useFonts({
  //   'Sansation-Regular': require('./assets/fonts/Sansation-Regular.ttf'),
  // });

  // if (!fontsLoaded) {
  //   return <View><Text>Loading...</Text></View>; // or splash screen
  // }

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    if (!email) {
      animateLabel(emailAnim, 0);
    }
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
    animateLabel(passwordAnim, 1);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    if (!password) {
      animateLabel(passwordAnim, 0);
    }
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
    left: 15,
    top: emailAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -10],
    }),
    fontSize: emailAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 14],
    }),
    color: emailAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#6B7280', '#0A0E2A'],
    }),
    backgroundColor: emailAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', '#fdf9fd'],
    }),
    paddingHorizontal: 5,
    zIndex: 1,
  };

  const passwordLabelStyle = {
    position: 'absolute',
    left: 15,
    top: passwordAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -10],
    }),
    fontSize: passwordAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 14],
    }),
    color: passwordAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#6B7280', '#0A0E2A'],
    }),
    backgroundColor: passwordAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', '#fdf9fd'],
    }),
    paddingHorizontal: 5,
    zIndex: 1,
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <Text style={styles.appName}>Papi</Text>
      <Text style={styles.welcome}>WELCOME BACK</Text>
      <Text style={styles.signInText}>Sign in to continue</Text>

      <View style={styles.inputContainer}>
        <Animated.Text style={emailLabelStyle}>
          Email
        </Animated.Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          onFocus={handleEmailFocus}
          onBlur={handleEmailBlur}
          keyboardType="email-address"
          underlineColorAndroid="transparent"
        />
      </View>

      <View style={styles.inputContainer}>
        <Animated.Text style={passwordLabelStyle}>
          Password
        </Animated.Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            secureTextEntry={!passwordVisible}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.forgotPasswordWrapper}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Log in</Text>
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

      <Text style={styles.register}>
        Don't have an account?{' '}
        <Text style={styles.registerLink} onPress={() => navigation.navigate('Signup')}>
          Register
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf9fd',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 30,
    color: '#0A0E2A',
    fontWeight: '400',
    marginBottom: 10,
  },
  welcome: {
    fontSize: 45,
    fontWeight: '800',
    color: '#0A0E2A',
  },
  signInText: {
    fontSize: 16,
    color: '#0A0E2A',
    marginBottom: 40,
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
    top: 15,
  },
  forgotPasswordWrapper: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPassword: {
    color: '#6B7280',
    fontSize: 14,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#FDC856',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 5,
  },
  loginText: {
    color: '#0A0E2A',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
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
    marginTop: 5,
    marginBottom: 30,
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
  register: {
    color: '#6B7280',
    fontSize: 14,
  },
  registerLink: {
    fontWeight: 'bold',
    color: '#0A0E2A',
  },
});