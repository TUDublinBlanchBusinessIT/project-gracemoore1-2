import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../Screens/LoginScreen'; // Adjust path
import CreateAccountScreen from '../Screens/CreateAccountScreen'; // Adjust path
import FoldersScreen from '../Screens/FoldersScreen'; // Create and add this screen
import BudgetSetupScreen from '../Screens/BudgetSetupScreen'; // Import BudgetSetupScreen
import HomepageScreen from '../Screens/HomepageScreen';
import SpendingHistoryScreen from '../Screens/SpendingHistoryScreen';
import ProfileScreen from '../Screens/ProfileScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="BudgetSetup" component={BudgetSetupScreen} />
        <Stack.Screen name="Homepage" component={HomepageScreen} />
        <Stack.Screen name="Folders" component={FoldersScreen} />
        <Stack.Screen name="SpendingHistory" component={SpendingHistoryScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
