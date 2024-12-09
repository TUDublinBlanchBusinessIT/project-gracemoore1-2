import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';

import LoginScreen from '../Screens/LoginScreen'; // Adjust path
import CreateAccountScreen from '../Screens/CreateAccountScreen'; // Adjust path
import FoldersScreen from '../Screens/FoldersScreen'; // Create and add this screen
import BudgetSetupScreen from '../Screens/BudgetSetupScreen'; // Import BudgetSetupScreen
import HomepageScreen from '../Screens/HomepageScreen';
import SpendingHistoryScreen from '../Screens/SpendingHistoryScreen';
import ProfileScreen from '../Screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Homepage"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Homepage') {
            iconName = 'home'; // Home icon
          } else if (route.name === 'SpendingHistory') {
            iconName = 'document-text'; // Document icon
          } else if (route.name === 'Profile') {
            iconName = 'person'; // Person icon
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00509E',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Hide header for tabs
      })}
    >
      <Tab.Screen name="Homepage" component={HomepageScreen} />
      <Tab.Screen name="SpendingHistory" component={SpendingHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Authentication Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="BudgetSetup" component={BudgetSetupScreen} />

        {/* Main App Screens with Tab Navigator */}
        <Stack.Screen 
          name="Main" 
          component={TabNavigator} 
          options={{ headerShown: false }} // Hide header for Tab Navigator
        />
        <Stack.Screen name="Folders" component={FoldersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
