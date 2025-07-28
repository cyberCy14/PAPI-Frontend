// screens/InsightsScreen.js
import React from 'react';
import { ScrollView, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../assets/styles/insights.styles';
import { SafeScreenWithHeader } from '../components/SafeScreen';
import { COLORS } from '../constants/colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';


const screenWidth = Dimensions.get('window').width;

const InsightsScreen = () => {
  const navigation = useNavigation();
  // Mock data for pie chart and line chart
  const pieData = [
    {
      name: 'Food',
      population: 2500,
      color: '#f39c12',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Bills',
      population: 1500,
      color: '#e74c3c',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Transport',
      population: 1000,
      color: '#3498db',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
  ];

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [1200, 1500, 1700, 1300],
        strokeWidth: 2,
        color: () => '#8e44ad',
      },
    ],
  };

  return (
    <View style={styles.container}>
     <SafeScreenWithHeader>
     <ScrollView>
     <View style={styles.header}>
               <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                 <Ionicons name="arrow-back" size={24} color="#333" />
               </TouchableOpacity>
               <Text style={styles.headerTitle}>Analytics</Text>
               <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}> 
      <Text style={styles.sectionTitle}>📊 Your Financial Insights</Text>

      <Text style={styles.chartTitle}>Spending Breakdown</Text>
      <PieChart
        data={pieData} // Replace with live data when backend is connected
        width={screenWidth - 30}
        height={200}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: () => '#333',
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        hasLegend={true}
      />

      <Text style={styles.chartTitle}>Weekly Spending Trend</Text>
      <LineChart
        data={lineData} // Replace with live trend data from backend
        width={screenWidth - 50}
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: () => '#27ae60',
          labelColor: () => '#333',
        }}
        bezier
        style={{ borderRadius: 12 }}
      />

      <View style={styles.tipCard}>
        <Text style={styles.tipText}>💡 Tip: Limit food expenses to ₱2,000/month to save more!</Text>
      </View>
      </View>
      </ScrollView>
      </SafeScreenWithHeader>
    </View>
  );
};

export default InsightsScreen;
