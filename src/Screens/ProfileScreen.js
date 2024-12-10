import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker'; // Native picker for iOS/Android
import DatePicker from 'react-datepicker'; // Web picker
import 'react-datepicker/dist/react-datepicker.css';

const ProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [newStartDate, setNewStartDate] = useState(new Date());
  const [newEndDate, setNewEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || 'User');
          setBudgetAmount(userData.budgetAmount || 0);
          setStartDate(userData.budgetPeriod?.startDate.split('T')[0] || ''); // Extract only date
          setEndDate(userData.budgetPeriod?.endDate.split('T')[0] || ''); // Extract only date
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load profile information.');
      }
    };

    fetchUserData();
  }, []);

  const saveBudgetDetails = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        budgetAmount: parseFloat(newBudgetAmount),
        budgetPeriod: {
          startDate: newStartDate.toISOString(),
          endDate: newEndDate.toISOString(),
        },
      });

      setBudgetAmount(parseFloat(newBudgetAmount));
      setStartDate(newStartDate.toISOString().split('T')[0]);
      setEndDate(newEndDate.toISOString().split('T')[0]);
      setIsEditing(false);
      Alert.alert('Success', 'Budget updated successfully!');
    } catch (error) {
      console.error('Error updating budget details:', error);
      Alert.alert('Error', 'Failed to update budget details.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Success', 'Logged out successfully!');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const renderDatePicker = (isStartDate) => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.datePickerRow}>
          <Text style={styles.dateLabel}>
            {isStartDate ? 'New Start Date:' : 'New End Date:'}
          </Text>
          <DatePicker
            selected={isStartDate ? newStartDate : newEndDate}
            onChange={(date) =>
              isStartDate ? setNewStartDate(date) : setNewEndDate(date)
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
              ? `New Start Date: ${newStartDate.toDateString()}`
              : `New End Date: ${newEndDate.toDateString()}`}
          </Text>
          {(isStartDate && showStartPicker) ||
          (!isStartDate && showEndPicker) ? (
            <DateTimePicker
              value={isStartDate ? newStartDate : newEndDate}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                if (isStartDate) {
                  setShowStartPicker(false);
                  if (selectedDate) setNewStartDate(selectedDate);
                } else {
                  setShowEndPicker(false);
                  if (selectedDate) setNewEndDate(selectedDate);
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
      <Text style={styles.title}>My Profile</Text>
      <Text style={styles.text}>Hello, {userName}!</Text>
      <Text style={styles.text}>Your budget is: £{budgetAmount}</Text>
      <Text style={styles.text}>Your budget has to last from {"\n"}  {startDate} until {endDate}</Text>

      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Budget Amount"
            value={newBudgetAmount}
            onChangeText={setNewBudgetAmount}
            keyboardType="numeric"
          />

          {/* Render Start Date Picker */}
          {renderDatePicker(true)}

          {/* Render End Date Picker */}
          {renderDatePicker(false)}

          <TouchableOpacity style={styles.saveButton} onPress={saveBudgetDetails}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setNewBudgetAmount(budgetAmount.toString());
            setNewStartDate(new Date(startDate));
            setNewEndDate(new Date(endDate));
            setIsEditing(true);
          }}
        >
          <Text style={styles.buttonText}>Change Budget</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    fontFamily: 'serif',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: 'serif',
    textAlign: 'center',
  },
  editContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
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
  editButton: {
    backgroundColor: '#00509E',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#007F5F',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#00509E',
    padding: 10,
    borderRadius: 5,
    marginTop: 50,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileScreen;


