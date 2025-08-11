import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Privacy Policy</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.lastUpdated}>Last updated: January 2024</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.description}>
            We collect information you provide directly to us, such as when you create an account, 
            make transactions, or contact us for support. This may include your name, email address, 
            financial information, and profile data.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.description}>
            We use the information we collect to provide, maintain, and improve our services, 
            process transactions, send you notifications, and ensure the security of our platform.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information Sharing</Text>
          <Text style={styles.description}>
            We do not sell, trade, or otherwise transfer your personal information to third parties 
            without your consent, except as described in this policy or as required by law.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.description}>
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. Your data is encrypted 
            during transmission and storage.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <Text style={styles.description}>
            You have the right to access, update, or delete your personal information. You can 
            also opt out of certain communications and request data portability.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.description}>
            If you have any questions about this Privacy Policy, please contact us at 
            privacy@pinansyalapp.com
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  content: {
    padding: 20,
  },

  lastUpdated: {
    fontSize: 14,
    fontFamily: 'Sansation-Regular',
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
  },

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Sansation-Bold',
    color: '#111',
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    fontFamily: 'Sansation-Regular',
    color: '#555',
    lineHeight: 24,
  },
});
