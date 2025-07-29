import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useFonts } from 'expo-font';

// Contexts
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { UserProvider, UserContext } from './context/UserContext';
import { RecentActivityProvider, RecentActivityContext } from './context/RecentActivityContext';

// Screens
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
// import HistoryScreen from './screens/HistoryScreen'; // Removed
import BudgetScreen from './screens/BudgetScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoyaltyScreen from './screens/LoyaltyScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tab navigator (History removed)
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home-outline',
            Report: 'wallet-outline',
            Loyalty: 'trophy-outline',
            Profile: 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Report" component={BudgetScreen} />
      <Tab.Screen name="Loyalty" component={LoyaltyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Redirection logic screen
function RootRedirect() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { profileExists, loading } = useContext(UserContext);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigation.replace('Login');
    } else if (!profileExists) {
      navigation.replace('Register');
    } else {
      navigation.replace('AppTabs');
    }
  }, [user, profileExists, loading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Redirecting...</Text>
    </View>
  );
}

// App component with all providers
export default function App() {
  const [fontsLoaded] = useFonts({
    'Sansation-Regular': require('./assets/fonts/Sansation-Regular.ttf'),
    'Sansation-Bold': require('./assets/fonts/Sansation-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Optionally, show a loading spinner here
  }

  return (
    <AuthProvider>
      <ExpenseProvider>
        <UserProvider>
          <RecentActivityProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="AppTabs" component={AppTabs} />
            </Stack.Navigator>
          </NavigationContainer>
          </RecentActivityProvider>
        </UserProvider>
      </ExpenseProvider>
    </AuthProvider>
  );
}