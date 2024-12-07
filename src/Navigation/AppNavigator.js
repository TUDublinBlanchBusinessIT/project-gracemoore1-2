import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../Screens/LoginScreen'; // Adjust path
import CreateAccountScreen from '../Screens/CreateAccountScreen'; // Adjust path
import FolderScreen from '../Screens/FolderScreen'; // Create and add this screen
import BudgetSetupScreen from '../Screens/BudgetSetupScreen'; // Import BudgetSetupScreen
import HomepageScreen from '../Screens/HomepageScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="Folders" component={FolderScreen} />
        <Stack.Screen name="BudgetSetup" component={BudgetSetupScreen} />
        <Stack.Screen name="Homepage" component={HomepageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
