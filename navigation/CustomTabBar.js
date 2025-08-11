import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function CustomTabBar({ state, descriptors, navigation }) {
  const middleButtonSize = 70;

  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'transparent' }}>
      <View style={{ width: '100%' }}>
        {/* Curved yellow background */}
        <View style={{ position: 'absolute', bottom: 0 }}>
          <Svg width={width} height={80} viewBox="0 0 400 70">
            <Path
              d="M0 0 H125 C170 5, 130 75, 205 80 C275 60, 215 0, 280 0 H410 V80 H0 Z"
              fill="#FDC856"
            />
            <Path
              d="M0 0 H125 C170 5, 130 75, 205 80 C275 60, 215 0, 280 0 H00 V80 H0 Z"
              fill="#ffffffff"
            />
          </Svg>
        </View>

        {/* Floating Scan Button */}
        <TouchableOpacity
          style={[
            styles.scanButton,
            {
              width: middleButtonSize,
              height: middleButtonSize,
              borderRadius: middleButtonSize / 2,
              backgroundColor: '#001B47',
            },
          ]}
          onPress={() => navigation.navigate('Scan')}
        >
          <Ionicons name="qr-code" size={30} color="white" />
        </TouchableOpacity>

        {/* Tab Icons */}
        <View style={styles.tabContainer}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            let iconName = '';
            let label = '';

            switch (route.name) {
              case 'Home':
                iconName = 'home-outline';
                label = 'Home';
                break;
              case 'Report':
                iconName = 'wallet-outline';
                label = 'Report';
                break;
              case 'Budget':
                iconName = 'wallet-outline';
                label = 'Budget';
                break;
              case 'Loyalty':
                iconName = 'trophy-outline';
                label = 'Loyalty';
                break;
              case 'Profile':
                iconName = 'person-outline';
                label = 'Profile';
                break;
              case 'Scan':
                // Skip rendering Scan tab here (it's the floating middle button)
                return <View key={route.key} style={styles.emptySlot} />;
              default:
                iconName = 'ellipse-outline';
                label = route.name;
                break;
            }

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                style={styles.tabItem}
              >
                <View style={styles.tabIconWrapper}>
                  <Ionicons name={iconName} size={25} color={isFocused ? '#000' : '#333'} />
                  {isFocused && <Text style={styles.label}>{label}</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: Platform.OS === 'ios' ? 5 : 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    zIndex: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlot: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#000',
    marginTop: 2,
    fontWeight: 'bold',
  },
});