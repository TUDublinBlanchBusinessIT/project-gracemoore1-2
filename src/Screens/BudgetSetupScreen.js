import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth, db } from '../firebaseConfig'; // Firebase configuration
import { doc, updateDoc } from 'firebase/firestore'; // Firestore methods


import DatePicker from 'react-datepicker';
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

      if (!user) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

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

      const formattedStartDate = startDate.toLocaleDateString();
      const formattedEndDate = endDate.toLocaleDateString();

      console.log("Formatted Start Date:", formattedStartDate);
      console.log("Formatted End Date:", formattedEndDate);

      // Navigate to HomepageScreen and pass the updated budget data
      navigation.navigate('Main', {
        screen: 'Homepage',
        params: {
          budgetAmount: parseFloat(budgetAmount),
          budgetPeriod: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        },
      });

    } catch (error) {
      console.error('Error setting budget:', error.message);
      Alert.alert('Error', 'Failed to set the budget. Please try again.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Your Budget!</Text>

      {/* Budget Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter budget amount (£)"
        value={budgetAmount}
        onChangeText={setBudgetAmount}
        keyboardType="numeric"
      />

      {/* Start Date Picker */}
      {Platform.OS === 'web' ? (
        <View style={styles.row}>
          <Text style={styles.label}>Start Date:</Text>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy/MM/dd"
            className="date-picker-input"
            popperPlacement="bottom-start" // Ensures dropdown opens below
            portalId="root-portal"
          />
  
        </View>
      ) : (
      <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.input}>
        <Text style={styles.dateText}>Start Date: {startDate.toDateString()}</Text>
      </TouchableOpacity>
      )}
      {showStartPicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'} 
          onChange={(_, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}


      {/* End Date Picker */}
      {Platform.OS === 'web' ? (
        <View style={styles.row}>
          <Text style={styles.label}>End Date:</Text>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy/MM/dd"
            className="date-picker-input"
            popperPlacement="bottom-start"
            portalId="root-portal"
          />
        </View>
      ) : (
      <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.input}>
        <Text style={styles.dateText}>End Date: {endDate.toDateString()}</Text>
      </TouchableOpacity>
      )}
      {showEndPicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'} 
          onChange={(_, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
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
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 50 : 130,
    backgroundColor: '#E0F7FA',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: Platform.OS === 'web' ? 50 : 60,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  input: {
    height: 40,
    width: Platform.OS === 'web' ? '40%' : '80%', // Adjust width for web vs mobile
    alignSelf: 'center',
    borderColor: '#ccc',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: Platform.OS === 'web' ? 20 : 30,
    paddingHorizontal: 10,
    fontFamily: 'serif',
  },
  dateText: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    borderWidth: 0,
    borderColor: '#ccc',
    marginBottom: 0,
    fontFamily: 'serif',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'web' ? 20 : 20,
  },
  label: {
    fontSize: Platform.OS === 'web' ? 16 : 14, // Smaller font for mobile
    fontWeight: 'bold',
    marginRight: 10,
    fontFamily: 'serif',
  },

  button: {
    width: Platform.OS === 'web' ? '40%' : '60%', // Wider button for mobile
    backgroundColor: '#00509E',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 50,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BudgetSetupScreen;