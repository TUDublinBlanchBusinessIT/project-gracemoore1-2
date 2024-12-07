import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Firebase configuration
import { doc, updateDoc } from 'firebase/firestore'; // Firestore methods
import DatePicker from 'react-datepicker'; // A React Native compatible DatePicker
import 'react-datepicker/dist/react-datepicker.css';

const BudgetSetupScreen = ({ navigation }) => {
  const [budgetAmount, setBudgetAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSubmit = async () => {
    if (!budgetAmount || !startDate || !endDate) {
      Alert.alert('Error', 'Please fill in all fields and pick valid dates.');
      return;
    }

    try {
      const user = auth.currentUser; // Get the currently logged-in user

      // Reference to the user's Firestore document
      const userDocRef = doc(db, 'users', user.uid);

      // Update the user's budget data in Firestore
      await updateDoc(userDocRef, {
        budgetSet: true, // Mark the budget as set
        budgetAmount: parseFloat(budgetAmount), // Convert amount to a number
        budgetPeriod: {
          startDate: startDate.toISOString(), // Save dates as ISO strings
          endDate: endDate.toISOString(),
        },
      });

      Alert.alert('Success', 'Budget setup is complete!');

      // Navigate to HomepageScreen and pass the updated budget data
      navigation.navigate('Homepage', {
        budgetAmount: parseFloat(budgetAmount),
        budgetPeriod: {
          startDate: startDate.toDateString(),
          endDate: endDate.toDateString(),
        },
      });
    } catch (error) {
      console.error('Error setting budget:', error.message);
      Alert.alert('Error', 'Failed to set the budget. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Your Budget</Text>

      {/* Budget Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter budget amount (£)"
        value={budgetAmount}
        onChangeText={setBudgetAmount}
        keyboardType="numeric"
      />

      {/* Start Date Picker */}
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowStartPicker(true)}
      >
        <Text style={styles.datePickerText}>Start Date: {startDate.toDateString()}</Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {/* End Date Picker */}
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowEndPicker(true)}
      >
        <Text style={styles.datePickerText}>End Date: {endDate.toDateString()}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  datePickerButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  datePickerText: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#00509E',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BudgetSetupScreen;

