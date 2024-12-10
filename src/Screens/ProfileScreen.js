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
import DateTimePicker from '@react-native-community/datetimepicker'; // Use native date picker

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

      navigation.navigate('Main', { screen: 'Homepage' });

      Alert.alert('Success', 'Budget updated successfully!');
    } catch (error) {
      console.error('Error updating budget details:', error);
      Alert.alert('Error', 'Failed to update budget details.');
    }
  }; 
    } catch (error) {
      console.error('Error updating budget details:', error);
      Alert.alert('Error', 'Failed to update budget details.');
    }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Success', 'Logged out successfully!');
      navigation.replace('Login'); // Redirect to Login screen
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <Text style={styles.text}>Hello, {userName}!</Text>
      <Text style={styles.text}>Your budget is: £{budgetAmount}</Text>
      <Text style={styles.text}>
        It has to last from {startDate} until {endDate}
      </Text>

      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Budget Amount"
            value={newBudgetAmount}
            onChangeText={setNewBudgetAmount}
            keyboardType="numeric"
          />

          <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateInput}>
            <Text>New Start Date: {newStartDate.toDateString()}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={newStartDate}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) setNewStartDate(selectedDate);
              }}
            />
          )}

          <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateInput}>
            <Text>New End Date: {newEndDate.toDateString()}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={newEndDate}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) setNewEndDate(selectedDate);
              }}
            />
          )}

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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'serif',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'serif',
    justifyContent:'center'
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
    alignItems: 'center',
    width: '100%',
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
    marginTop: 20,
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
