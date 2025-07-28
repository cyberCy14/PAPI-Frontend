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
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker'; // Import image picker
import { UserContext } from '../context/UserContext';

export default function RegisterScreen({ navigation }) {
  const { user, updateUser, loading } = useContext(UserContext);

  const [form, setForm] = useState({
    name: user.name || '',
    place: user.place || '',
    dob: user.dob || null,
    gender: user.gender || '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [profileImage, setProfileImage] = useState(user.image || null); // Save selected image

  // Function to launch image picker
  const pickImage = async () => {
    console.log('Image picker triggered');
    // Ask for permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('Permission result:', permissionResult);
    if (permissionResult.granted === false) {
      alert('Permission to access media library is required!');
      return;
    }

    try {
      console.log('Launching image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use old API
        quality: 0.7,
        allowsEditing: true, // Add this to see if it helps
      });
      console.log('Image picker result:', result);
      console.log('Result canceled:', result.canceled);
      console.log('Result assets:', result.assets);
      console.log('Result URI:', result.uri);

      // Handle both old API (result.uri) and new API (result.assets)
      let selectedImage = null;
      if (!result.canceled) {
        if (result.uri) {
          // Old API format
          selectedImage = {
            uri: result.uri,
            name: 'profile.jpg',
            type: 'image/jpeg',
          };
          console.log('Selected image URI (old API):', result.uri);
        } else if (result.assets && result.assets.length > 0) {
          // New API format
          const asset = result.assets[0];
          selectedImage = {
            uri: asset.uri,
            name: asset.fileName || 'profile.jpg',
            type: asset.mimeType || 'image/jpeg',
          };
          console.log('Selected image asset (new API):', asset);
        }
      }

      if (selectedImage) {
        setProfileImage(selectedImage);
        console.log('Profile image set successfully');
      } else {
        console.log('No image selected or picker was canceled');
      }
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };

  // Helper to resolve image source
  const getImageSource = (img) => {
    if (!img) return null;
    if (img.uri) return { uri: img.uri };
    if (typeof img === 'string' && img.startsWith('profile_images/')) {
      return { uri: `http://192.168.1.10:8000/storage/${img}` };
    }
    return null;
  };

  const handleChange = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleRegister = async () => {
    const { name, place, dob, gender } = form;
    if (!name.trim() || !place.trim() || !dob || !gender) {
      return alert('Please fill in all fields.');
    }

    // Ensure dob is a Date object
    let dobValue = dob;
    if (!(dob instanceof Date) && typeof dob === 'string') {
      dobValue = new Date(dob);
    }

    // Ensure image is in correct format for FormData
    let imageValue = null;
    if (profileImage && profileImage.uri) {
      imageValue = {
        uri: profileImage.uri,
        name: profileImage.name || 'profile.jpg',
        type: profileImage.type || 'image/jpeg',
      };
    }

    try {
      await updateUser({
        ...form,
        dob: dobValue,
        image: imageValue,
      });
      navigation.replace('AppTabs');
    } catch (err) {
      alert(`Error saving profile: ${err.message}`);
    }
  };

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile…</Text>
      </SafeAreaView>
    );
  }

  if (!user.id) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Missing account info. Please sign up again.</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
          <Text style={styles.title}>Create Your Profile</Text>

            {/* Profile Image Avatar */}
            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
              {profileImage || user.image ? (
                <Image source={getImageSource(profileImage || user.image)} style={styles.avatar} />
              ) : (
                <View style={styles.placeholderAvatar}>
                  <Ionicons name="person-outline" size={80} color="#777" />
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.instruction}>Tap avatar to select profile picture</Text>

            {/* Name Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={24} color="#555" style={styles.icon} />
              <TextInput
                style={styles.textInput}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={form.name}
                onChangeText={(text) => handleChange('name', text)}
              />
            </View>

            {/* Place of Birth */}
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={24} color="#555" style={styles.icon} />
              <TextInput
                style={styles.textInput}
                placeholder="Place of Birth"
                placeholderTextColor="#999"
                value={form.place}
                onChangeText={(text) => handleChange('place', text)}
              />
            </View>

            {/* Date of Birth picker */}
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={24} color="#555" style={styles.icon} />
              <Text style={[styles.touchableText, { color: form.dob ? '#000' : '#999' }]}> 
                {form.dob ? ((() => { 
                  const d = new Date(form.dob); 
                  return d.toString() !== 'Invalid Date' ? d.toDateString() : 'Select Date of Birth';
                })()) : 'Select Date of Birth'}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={showDatePicker}
              mode="date"
              date={(() => {
                if (form.dob instanceof Date) return form.dob;
                if (typeof form.dob === 'string') return new Date(form.dob);
                return new Date();
              })()}
              onConfirm={(date) => {
                handleChange('dob', date);
                setShowDatePicker(false);
              }}
              onCancel={() => setShowDatePicker(false)}
              textColor="#000"
            />

            {/* Gender picker */}
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowGenderPicker((v) => !v)}
            >
              <Ionicons name="male-female-outline" size={24} color="#555" style={styles.icon} />
              <Text style={[styles.touchableText, { color: form.gender ? '#000' : '#999' }]}>
                {form.gender || 'Select Gender'}
              </Text>
            </TouchableOpacity>
            {showGenderPicker && (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.gender}
                  onValueChange={(val) => {
                    handleChange('gender', val);
                    setShowGenderPicker(false);
                  }}
                >
                  <Picker.Item label="Select Gender..." value="" color="#999" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            )}

            {/* Register Button */}
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  keyboard: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
    fontFamily:'Sansation-Regular'
  },
  avatarContainer: {
    marginBottom: 8,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 60,
  },
  placeholderAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    fontSize: 12,
    color: '#555',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    fontFamily: 'Sansation-Regular',
  },
  touchableText: {
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  registerButton: {
    backgroundColor: '#FDC856',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 60,
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  registerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Sansation-Bold',
  },
  loadingContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
  },
});