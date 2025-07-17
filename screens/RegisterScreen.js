// RegisterScreen.js
import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { UserContext } from '../context/UserContext';

export default function RegisterScreen({ navigation }) {
  const { user, updateUser, loading } = useContext(UserContext);

  const [form, setForm] = useState({
    name: '',
    place: '',
    dob: null,
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  const handleChange = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
  };

  const handleRegister = async () => {
    const { name, place, dob, gender, password, confirmPassword } = form;
    if (!name.trim() || !place.trim() || !dob || !gender || !password || !confirmPassword) {
      return alert('Please fill in all fields.');
    }
    if (password !== confirmPassword) {
      return alert('Passwords do not match.');
    }
    try {
      await updateUser({
        name: name.trim(),
        place: place.trim(),
        dob,
        gender,
        password,
      });
      navigation.replace('AppTabs');
    } catch (err) {
      alert(`Error saving profile: ${err.message}`);
    }
  };

  if (loading || !user) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading profile…</Text>
      </SafeAreaView>
    );
  }

  if (!user.uid) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Missing account info. Please sign up again.</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.heading}>HELLO</Text>
            <Text style={styles.subtitle}>Create  your account</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor="#888"
                value={form.name}
                onChangeText={text => handleChange('name', text)}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={form.password}
                onChangeText={text => handleChange('password', text)}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Confirm Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={text => handleChange('confirmPassword', text)}
              />
            </View>
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>Or continue with</Text>
              <View style={styles.line} />
            </View>
            <TouchableOpacity style={styles.googleButton}>
              <Image source={require('../assets/google.png')} style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Google</Text>
            </TouchableOpacity>
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 24, alignItems: 'center' },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 8,
    marginTop: 16,
  },
  heading: {
    fontFamily: 'Sansation-Bold',
    fontSize: 22,
    color: '#061437',
    marginBottom: 2,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'Sansation-Bold',
    fontSize: 14,
    color: '#888',
    marginBottom: 18,
    textAlign: 'center',
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    borderColor: '#E5E5E5',
    borderWidth: 1.5,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#061437',
    fontFamily: 'Sansation-Bold',
  },
  registerButton: {
    backgroundColor: '#FDC856',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
  },
  registerText: {
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
  loginLink: {
    color: '#FDC856',
    fontFamily: 'Sansation-Bold',
    fontSize: 13,
    marginLeft: 2,
  },
});
 