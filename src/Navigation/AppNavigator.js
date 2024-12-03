import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../Screens/LoginScreen'; // Adjust path
import CreateAccountScreen from '../Screens/CreateAccountScreen'; // Adjust path
import FolderScreen from '../Screens/FolderScreen'; // Create and add this screen

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="Folders" component={FolderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
