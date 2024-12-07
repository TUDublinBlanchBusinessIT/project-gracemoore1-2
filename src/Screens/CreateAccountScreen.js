import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const CreateAccountScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Helper function to handle alerts with fallback for web
  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      console.log("Missing fields - showing alert");
      showAlert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      console.log("Creating user...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Saving user to Firestore...");
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
      });
      console.log("User saved successfully.");

      showAlert('Registration Successful', `Welcome, ${name}`);
      
      // Delay navigation to ensure the alert is displayed
      setTimeout(() => {
        navigation.navigate('Login');
      }, 500);
    } catch (error) {
      console.error("Error during registration:", error.message);
      showAlert('Registration Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Register Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Make Account</Text>
      </TouchableOpacity>

      {/* Redirect to Login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login here!</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 80,
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
    width: '40%', // Half the screen width
    backgroundColor: '#00509E',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 25,
    alignSelf: 'center', // Center the button horizontally
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

export default CreateAccountScreen;
