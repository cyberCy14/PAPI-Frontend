// screens/ProfileScreen.js
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const { user, updateUser } = useContext(UserContext);
  const { logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    place: '',
    dob: '',
    gender: '',
    image: null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Update form when user data changes
  useEffect(() => {
    setForm({
      name: user.name || '',
      place: user.place || '',
      dob: user.dob || '',
      gender: user.gender || '',
      image: user.image || null,
    });
  }, [user.name, user.place, user.dob, user.gender, user.image]);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const toggleEdit = () => {
    if (isEditing) {
      // Ensure dob is a Date object
      let dobValue = form.dob;
      if (!(dobValue instanceof Date) && typeof dobValue === 'string') {
        dobValue = new Date(dobValue);
      }
      // Ensure image is in correct format for FormData
      let imageValue = null;
      if (form.image && form.image.uri) {
        imageValue = {
          uri: form.image.uri,
          name: form.image.name || 'profile.jpg',
          type: form.image.type || 'image/jpeg',
        };
      }
      updateUser({
        ...form,
        dob: dobValue,
        image: imageValue,
      });
      Alert.alert('Profile Saved', 'Your information has been updated.');
    }
    setIsEditing(prev => !prev);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            // Navigate to login screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    if (!isEditing) return;
    console.log('ProfileScreen: Image picker triggered');
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('ProfileScreen: Permission result:', granted);
    if (!granted) return Alert.alert('Permission needed', 'Allow access to your photos.');
    
    try {
      console.log('ProfileScreen: Launching image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use old API
        allowsEditing: true,
        quality: 1,
      });
      console.log('ProfileScreen: Image picker result:', result);
      console.log('ProfileScreen: Result canceled:', result.canceled);
      console.log('ProfileScreen: Result URI:', result.uri);
      console.log('ProfileScreen: Result assets:', result.assets);
      
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
          console.log('ProfileScreen: Selected image URI (old API):', result.uri);
        } else if (result.assets && result.assets.length > 0) {
          // New API format
          const asset = result.assets[0];
          selectedImage = {
            uri: asset.uri,
            name: asset.fileName || 'profile.jpg',
            type: asset.mimeType || 'image/jpeg',
          };
          console.log('ProfileScreen: Selected image asset (new API):', asset);
        }
      }

      if (selectedImage) {
        handleChange('image', selectedImage);
        console.log('ProfileScreen: Profile image set successfully');
      } else {
        console.log('ProfileScreen: No image selected or picker was canceled');
      }
    } catch (error) {
      console.log('ProfileScreen: Image picker error:', error);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) handleChange('dob', selectedDate.toISOString());
  };

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      : '';

  // Helper to resolve image source
  const getImageSource = (img) => {
    if (!img) return null;
    if (img.uri) return { uri: img.uri };
    if (typeof img === 'string' && img.startsWith('profile_images/')) {
      return { uri: `http://192.168.1.10:8000/storage/${img}` };
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={toggleEdit}>
          <Feather name={isEditing ? 'check' : 'edit'} size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.profile}>
        <TouchableOpacity onPress={pickImage} activeOpacity={isEditing ? 0.6 : 1}>
          {form.image || user.image ? (
            <Image source={getImageSource(form.image || user.image)} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>  
              <Ionicons name="person" size={60} color="#aaa" />
            </View>
          )}
          {isEditing && <Text style={styles.changePhoto}>Change Photo</Text>}
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.infoContainer}>
        {/* Full Name */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.readOnly]}
            value={form.name}
            onChangeText={text => handleChange('name', text)}
            editable={isEditing}
            placeholder={isEditing ? 'Enter full name' : ''}
          />
        </View>

        {/* Place of Birth */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Place of Birth</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.readOnly]}
            value={form.place}
            onChangeText={text => handleChange('place', text)}
            editable={isEditing}
            placeholder={isEditing ? 'Enter place of birth' : ''}
          />
        </View>

        {/* Date of Birth */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            style={[styles.input, !isEditing && styles.readOnly]}
            onPress={() => isEditing && setShowDatePicker(true)}
            activeOpacity={isEditing ? 0.6 : 1}
          >
            <Text style={styles.inputText}>
              {formatDate(form.dob) || (isEditing ? 'Select date' : '')}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={form.dob ? new Date(form.dob) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              style={styles.datePicker}
            />
          )}
        </View>

        {/* Gender */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Gender</Text>
          <View style={[styles.input, !isEditing && styles.readOnly]}>  
            {isEditing ? (
              <Picker
                selectedValue={form.gender}
                onValueChange={value => handleChange('gender', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            ) : (
              <Text style={styles.inputText}>{form.gender}</Text>
            )}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#F7B801', 
    paddingVertical: 12, 
    paddingHorizontal: 20,
    marginTop: 40,
    elevation:4,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },

  profile: { 
    alignItems: 'center', 
    marginVertical: 20 
  },
  avatar: { 
    width: 140, 
    height: 140, 
    borderRadius: 70, 
    marginBottom: 6 },
    avatarPlaceholder: { 
    backgroundColor: '#eee', 
    justifyContent: 'center', 
    alignItems: 'center' },
    changePhoto: { 
    fontSize: 12, 
    color: '#555', 
    textAlign: 'center' },

  infoContainer: { paddingHorizontal: 20 },
  fieldWrapper: { marginBottom: 20 },
  bel: { color: '#555', 
    marginBottom: 4, 
    fontSize: 13 },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  readOnly: { backgroundColor: '#f5f5f5' },
  inputText: { fontSize: 15, color: '#333' },
  datePicker: { width: '100%' },
  picker: { width: '100%' },
  
  logoutContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ff4757',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 2,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
