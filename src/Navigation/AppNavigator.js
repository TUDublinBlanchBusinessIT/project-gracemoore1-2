import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from '../Screens/LoginScreen';
import CreateAccountScreen from '../Screens/CreateAccountScreen';
import FoldersScreen from '../Screens/FoldersScreen';
import BudgetSetupScreen from '../Screens/BudgetSetupScreen';
import HomepageScreen from '../Screens/HomepageScreen';
import SpendingHistoryScreen from '../Screens/SpendingHistoryScreen';
import ProfileScreen from '../Screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Homepage"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Homepage') {
            iconName = 'home';
          } else if (route.name === 'Folders') {
            iconName = 'folder'; // Folder icon
          } else if (route.name === 'SpendingHistory') {
            iconName = 'document-text';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00509E',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Homepage" component={HomepageScreen} />
      <Tab.Screen name="Folders" component={FoldersScreen} />
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
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
