// components/AnalyticsPreview.js
import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { styles } from '../assets/styles/insights.styles';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';


const screenWidth = Dimensions.get('window').width;

const AnalyticsPreview = ({
  incomeTotal = 1,
  expenseTotal = 1,
  recentTransactions,
  navigation: propNavigation
}) => {
  const navigation = propNavigation || useNavigation();
  const pieData = [
    {
      name: 'Income',
      population: 35000,
      color: COLORS.income,
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Expenses',
      population: 5300,
      color: COLORS.alert,
      legendFontColor: '#333',
      legendFontSize: 12,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Smart Insights</Text>
      <View style={styles.pieChartContainer}>
      <PieChart
        data={pieData}
        width={screenWidth - 40}
        height={160}
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
      
      <TouchableOpacity onPress={() => navigation.navigate('InsightsScreen')}>
        <Text style={styles.viewMore}>View Full Insights →</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default AnalyticsPreview;
