import React, { useContext, useState } from 'react';
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
import { UserContext } from '../context/UserContext';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { API_BASE_URL } from '../config';

export default function PersonalInfoScreen({ navigation }) {
  const { user, updateUser } = useContext(UserContext);
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    place: user.place || '',
    dob: user.dob || '',
    gender: user.gender || '',
    image: user.image || null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (!user || !user.name) {
    return null;
  }

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return Alert.alert('Permission needed', 'Allow access to your photos.');
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets?.length > 0) {
      handleChange('image', { uri: result.assets[0].uri, name: 'profile.jpg', type: 'image/jpeg' });
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) handleChange('dob', selectedDate.toISOString());
  };

  const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-GB') : '');

  const saveChanges = async () => {
    try {
      await updateUser(form);
      Alert.alert('Saved', 'Your personal info has been updated.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Could not save changes');
    }
  };

  const getImageSource = (img) => {
    if (!img) return null;
    if (img.uri) return { uri: img.uri};
    return {uri: img};
  }



  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Info</Text>
        <TouchableOpacity onPress={saveChanges}>
          <Feather name="check" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.profile}>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.imageWrapper}>
            {form.image ? (
             <Image 
  source={getImageSource(form.image) || require('../assets/avatar.png')} 
  style={styles.avatar}
/>
            ) : (
              <Ionicons name="person" size={80} color="#ccc" />
            )}
            <View style={styles.editIcon}>
              <Feather name="edit" size={18} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        {[
          { label: 'Full name', value: form.name, icon: 'person', key: 'name' },
          { label: 'Email', value: form.email, icon: 'email', key: 'email' },
          { label: 'Phone Number', value: form.phone, icon: 'call', key: 'phone' },
          { label: 'Place', value: form.place, icon: 'location-city', key: 'place' },
          { label: 'Date of birth', value: formatDate(form.dob), icon: 'calendar-today', key: 'dob', isDate: true },
          { label: 'Gender', value: form.gender, icon: 'wc', key: 'gender' },
          { label: 'Address', value: form.address, icon: 'location-on', key: 'address' },
        ].map((item, idx) => (
          <View key={idx} style={styles.fieldWrapper}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.row}>
              <MaterialIcons name={item.icon} size={18} color="#000" style={styles.icon} />
              {item.isDate ? (
                <TouchableOpacity style={styles.underlineInput} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.inputText}>{item.value || 'Select date'}</Text>
                </TouchableOpacity>
              ) : (
                <TextInput
                  style={styles.underlineInput}
                  value={item.value}
                  onChangeText={text => handleChange(item.key, text)}
                  placeholder={`Enter ${item.label.toLowerCase()}`}
                />
              )}
            </View>
          </View>
        ))}
        {showDatePicker && (
          <DateTimePicker
            value={form.dob ? new Date(form.dob) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
          />
        )}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 40,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' },
  profile: { alignItems: 'center', marginVertical: 20 },
  imageWrapper: {
    position: 'relative',
    borderWidth: 3,
    borderColor: '#FDBA12',
    borderRadius: 100,
    padding: 3,
  },
  avatar: { width: 130, height: 130, borderRadius: 65 },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FDBA12',
    borderRadius: 15,
    padding: 5,
  },
  infoContainer: { paddingHorizontal: 20 },
  fieldWrapper: { marginBottom: 20 },
  label: { fontSize: 13, color: '#888', marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 10 },
  underlineInput: {
    borderBottomWidth: 1.5,
    borderColor: '#FDBA12',
    flex: 1,
    paddingVertical: 4,
  },
  inputText: { fontSize: 16, color: '#000' },
});

