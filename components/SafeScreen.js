// components/SafeScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SafeScreen = ({ children, style }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.container,
      {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      },
      style,
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// Optional: Create preset variants
export const SafeScreenWithHeader = ({ children, style }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.container,
      {
        paddingTop: insets.top, // Extra space for header
        paddingBottom: insets.bottom,
      },
      style,
    ]}>
      {children}
    </View>
  );
};