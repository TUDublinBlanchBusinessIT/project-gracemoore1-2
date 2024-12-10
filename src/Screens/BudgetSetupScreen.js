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
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth, db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
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
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);

      await updateDoc(userDocRef, {
        budgetSet: true,
        budgetAmount: parseFloat(budgetAmount),
        budgetPeriod: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      Alert.alert('Success', 'Budget setup is complete!');
      navigation.navigate('Main', {
        screen: 'Homepage',
        params: {
          budgetAmount: parseFloat(budgetAmount),
          budgetPeriod: {
            startDate: startDate.toLocaleDateString(),
            endDate: endDate.toLocaleDateString(),
          },
        },
      });
    } catch (error) {
      console.error('Error setting budget:', error.message);
      Alert.alert('Error', 'Failed to set the budget. Please try again.');
    }
  };

  const renderDatePicker = (isStartDate) => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.datePickerRow}>
          <Text style={styles.dateLabel}>
            {isStartDate ? 'Start Date:' : 'End Date:'}
          </Text>
          <DatePicker
            selected={isStartDate ? startDate : endDate}
            onChange={(date) =>
              isStartDate ? setStartDate(date) : setEndDate(date)
            }
            dateFormat="yyyy-MM-dd"
            className="date-picker-input"
            popperPlacement="bottom-start"
            portalId="root-portal"
          />
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() =>
            isStartDate
              ? setShowStartPicker(true)
              : setShowEndPicker(true)
          }
          style={styles.dateInput}
        >
          <Text>
            {isStartDate
              ? `Start Date: ${startDate.toDateString()}`
              : `End Date: ${endDate.toDateString()}`}
          </Text>
          {(isStartDate && showStartPicker) ||
          (!isStartDate && showEndPicker) ? (
            <DateTimePicker
              value={isStartDate ? startDate : endDate}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                if (isStartDate) {
                  setShowStartPicker(false);
                  if (selectedDate) setStartDate(selectedDate);
                } else {
                  setShowEndPicker(false);
                  if (selectedDate) setEndDate(selectedDate);
                }
              }}
            />
          ) : null}
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Your Budget!</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter budget amount (£)"
        value={budgetAmount}
        onChangeText={setBudgetAmount}
        keyboardType="numeric"
      />

      {/* Start Date Picker */}
      {renderDatePicker(true)}

      {/* End Date Picker */}
      {renderDatePicker(false)}

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
    width: Platform.OS === 'web' ? '40%' : '80%',
    alignSelf: 'center',
    borderColor: '#ccc',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: Platform.OS === 'web' ? 20 : 30,
    paddingHorizontal: 10,
    fontFamily: 'serif',
  },
  dateInput: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  button: {
    width: Platform.OS === 'web' ? '40%' : '60%',
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
