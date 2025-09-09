import React, { useEffect, useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import { STORAGE_PATHS } from '../config';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    // Update profile state when user context changes
    if (user && user.name) {
      setProfile({
        fullName: user.name,
        email: user.email || '',
        photo: user.image || null
      });
    } else {
      // Clear profile when no user or no name
      setProfile({
        fullName: '',
        email: '',
        photo: null
      });
    }
  }, [user]);

  // Don't render if no user - AuthWrapper will handle navigation
  if (!user || !user.name) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled by the auth context automatically
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // Helper to resolve image source for backend images
  // const getImageSource = (img) => {
  //   if (!img) return null;
  //   if (img.uri) return { uri: img.uri };
  //   if (typeof img === 'string' && img.startsWith('profile_images/')) {
  //     return { uri: `${STORAGE_PATHS.PROFILE_IMAGES}${img.replace('profile_images/', '')}` };
  //   }
  //   return null;
  // };


  const getImageSource = (img) => {
    if (!img) return null;
    if (img.uri) return { uri: img.uri};
    return {uri: img};
  }


  const RowItem = ({ icon, label, value, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.rowItem}>
      <View style={styles.rowLeft}>
        <Icon name={icon} size={20} color="#000" />
        <Text style={styles.rowText}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        <Icon name="chevron-right" size={20} color="#000" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Profile</Text>
      </View>

      <Image 
          source={profile.photo ? getImageSource(profile.photo) : require('../assets/avatar.png')} 
          style={styles.avatar} 
        />

      <Text style={styles.name}>{profile.fullName}</Text>
      <Text style={styles.email}>{profile.email}</Text>

      {/* General Section */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.sectionLine} />
      </View>

      <RowItem 
        icon="user" 
        label="Personal Info" 
        onPress={() => navigation.navigate('PersonalInfo')} 
      />
      <RowItem icon="shield" label="Security" onPress={() => {}} />
      <RowItem icon="globe" label="Language" value="English (US)" onPress={() => {}} />

      {/* About Section */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.sectionLine} />
      </View>

      <RowItem icon="help-circle" label="Help Center" onPress={() => {}} />
      <RowItem 
        icon="lock" 
        label="Privacy Policy" 
        onPress={() => navigation.navigate('PrivacyPolicy')} 
      />
      <RowItem 
        icon="info" 
        label="About Papi" 
        onPress={() => navigation.navigate('About')} 
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#0E134F" />
        <Text style={styles.logoutText}>Logout</Text> 
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#FAF7F7',
  },

  headerContainer: {
    position: 'relative',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20
  },

  backBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingLeft: 10,
  },

  headerText: {
    fontSize: 30,
    fontFamily: 'Sansation-Bold',
    color: '#111',
  },

  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#FDC856',
    alignSelf: 'center',
  },

  name: {
    fontSize: 25,
    fontFamily: 'Sansation-Bold',
    marginTop: 12,
    textAlign: 'center',
  },

  email: {
    fontSize: 16,
    fontFamily: 'Sansation-Regular',
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 30,
  },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Sansation-Regular',
    color: '#999',
    marginRight: 10,
  },

  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    opacity: 0.6,
  },

  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowText: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: 'Sansation-Regular',
    color: '#111',
  },

  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowValue: {
    color: '#888',
    marginRight: 5,
    fontSize: 14,
  }, 

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDC856',
    padding: 15,
    borderRadius: 12,
    marginTop: 70,
  },

  logoutText: {
    fontSize: 16,
    color: '#0E134F',
    fontFamily: 'Sansation-Bold',
    marginLeft: 10
  },
});
