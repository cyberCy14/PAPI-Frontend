// assets/styles/insights.styles.js
import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { PieChart } from 'react-native-chart-kit';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Sansation-Bold',
    fontWeight: "600",
    color: COLORS.text,
  },
  backButton: {
    padding: 5,
  },
  content: {
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  stickyHeader: {
    backgroundColor: COLORS.background,
    paddingTop: 5,
    zIndex: 1,
    elevation: .5,
  },
  previewContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    flexDirection: "row",
    fontFamily: 'Sansation-Bold',
    marginBottom: 15,
    paddingTop: 10,
  },
  viewMore: {
    marginTop: 12,
    padding: 10,
    fontFamily: 'Sansation-Regular',
    color: COLORS.primary,
    textAlign: 'left',
    fontWeight: '500',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Sansation-Bold',

    marginVertical: 8,
    color: '#444',
  },
  tipBox: {
    backgroundColor: '#fffbe6',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Sansation-Regular',
    color: '#333',
  },
  pieChartContainer:{
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
});
