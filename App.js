import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';

// Contexts
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { UserProvider, UserContext } from './context/UserContext';
import { LoyaltyProvider } from './context/LoyaltyContext';


// Screens
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import BudgetScreen from './screens/BudgetScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoyaltyScreen from './screens/LoyaltyScreen';
import LoyaltyPointsScreen from './screens/LoyaltyPointsScreen';
import RewardsScreen from './screens/RewardsScreen';
import CompanyTransactScreen from './screens/CompanyTransactScreen';
import InsightsScreen from './screens/InsightsScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import AddTransactionScreen from './screens/AddTransactionScreen';
import ScanScreen from './screens/ScanScreen';
import TransactionResultScreen from './screens/TransactionResultScreen';
import CustomTabBar from './navigation/CustomTabBar';
import PersonalInfoScreen from './screens/PersonalInfoScreen';
import AboutScreen from './screens/AboutScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Report" component={BudgetScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Loyalty" component={LoyaltyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Redirection logic screen
function RootRedirect() {
  const navigation = useNavigation();
  const { token } = useContext(AuthContext);
  const { profileExists, loading } = useContext(UserContext);

  useEffect(() => {
    if (loading) return;

    if (!token) {
      navigation.replace('Login');
    } else if (!profileExists) {
      navigation.replace('Register');
    } else {
      navigation.replace('AppTabs');
    }
  }, [token, profileExists, loading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Redirecting...</Text>
    </View>
  );
}

// Authentication wrapper component
function AuthWrapper() {
  const { token } = useContext(AuthContext);
  const { profileExists, loading } = useContext(UserContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!token) {
    return <LoginScreen />;
  }

  if (!profileExists) {
    return <RegisterScreen />;
  }

  return <MainTabs />;
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
    <PaperProvider>
    <AuthProvider>
      <ExpenseProvider>
        <UserProvider>
          <LoyaltyProvider>
         
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Welcome" component={WelcomeScreen} />


              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="AppTabs" component={AuthWrapper} />

              <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
              <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
              <Stack.Screen name="BudgetScreen" component={BudgetScreen} />
              <Stack.Screen name="InsightsScreen" component={InsightsScreen} />
              <Stack.Screen name="LoyaltyPoints" component={LoyaltyPointsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Rewards" component={RewardsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="CompanyTransact" component={CompanyTransactScreen} options={{ headerShown: false }} />
              <Stack.Screen name="LoyaltyScreen" component={LoyaltyScreen} />
              <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
              <Stack.Screen name="About" component={AboutScreen} />
              <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
              <Stack.Screen name="ScanScreen" component={ScanScreen} />
              <Stack.Screen name="TransactionResultScreen" component={TransactionResultScreen} />

            </Stack.Navigator>
          </NavigationContainer>
         
          </LoyaltyProvider>
        </UserProvider>
      </ExpenseProvider>
    </AuthProvider>
    </PaperProvider>
  );
}