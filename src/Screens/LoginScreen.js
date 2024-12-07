import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { auth } from '../firebaseConfig'; // Adjust path as necessary
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Sign in the user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check if the budget is already set
        if (userData.budgetSet) {
          // Navigate to Homepage if budget is set and pass budget data
          Alert.alert('Login Successful', `Welcome back, ${user.email}`);
          navigation.navigate('Homepage', {
            budgetAmount: userData.budgetAmount || 0,
            budgetPeriod: userData.budgetPeriod || { startDate: '', endDate: '' },
          });
        } else {
          // Navigate to BudgetSetupScreen if no budget is set
          Alert.alert('Login Successful', `Welcome back, ${user.email}`);
          navigation.navigate('BudgetSetup');
        }
      } else {
        Alert.alert('Error', 'User data not found.');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to PennyPlanner!</Text>
      <Text style={styles.subtitle}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.link}>Don't have an account? Create one now!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E0F7FA',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 80,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '40%',
    backgroundColor: '#00509E',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 25,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 35,
    color: '#000000',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
