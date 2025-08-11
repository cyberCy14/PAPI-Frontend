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

export default function AboutScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>About Papi</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>PinansyalApp</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the App</Text>
          <Text style={styles.description}>
            PinansyalApp is a comprehensive financial management application designed to help users 
            track their expenses, manage budgets, and achieve their financial goals. Built with 
            modern technology and user experience in mind.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <Text style={styles.feature}>• Expense tracking and categorization</Text>
          <Text style={styles.feature}>• Budget management and planning</Text>
          <Text style={styles.feature}>• Financial insights and analytics</Text>
          <Text style={styles.feature}>• Loyalty rewards program</Text>
          <Text style={styles.feature}>• Secure user authentication</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.description}>
            For support or inquiries, please contact our team at support@pinansyalapp.com
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <Text style={styles.description}>
            Your financial data is encrypted and stored securely. We prioritize user privacy 
            and data protection in everything we do.
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

  title: {
    fontSize: 28,
    fontFamily: 'Sansation-Bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 8,
  },

  version: {
    fontSize: 16,
    fontFamily: 'Sansation-Regular',
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
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

  feature: {
    fontSize: 16,
    fontFamily: 'Sansation-Regular',
    color: '#555',
    marginBottom: 8,
    lineHeight: 22,
  },
});
