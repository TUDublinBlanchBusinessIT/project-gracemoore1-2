import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { auth, db } from '../firebaseConfig'; // Import Firebase configuration
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore methods

const ProfileScreen = () => {
  const [userName, setUserName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  // Fetch user data on mount
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
          setStartDate(userData.budgetPeriod?.startDate || '');
          setEndDate(userData.budgetPeriod?.endDate || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load profile information.');
      }
    };

    fetchUserData();
  }, []);

  // Save updated budget details
  const saveBudgetDetails = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        budgetAmount: parseFloat(newBudgetAmount),
        budgetPeriod: {
          startDate: newStartDate,
          endDate: newEndDate,
        },
      });

      setBudgetAmount(parseFloat(newBudgetAmount));
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      setIsEditing(false);
      Alert.alert('Success', 'Budget updated successfully!');
    } catch (error) {
      console.error('Error updating budget details:', error);
      Alert.alert('Error', 'Failed to update budget details.');
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
          <TextInput
            style={styles.input}
            placeholder="New Start Date"
            value={newStartDate}
            onChangeText={setNewStartDate}
          />
          <TextInput
            style={styles.input}
            placeholder="New End Date"
            value={newEndDate}
            onChangeText={setNewEndDate}
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveBudgetDetails}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setNewBudgetAmount(budgetAmount.toString());
            setNewStartDate(startDate);
            setNewEndDate(endDate);
            setIsEditing(true);
          }}
        >
          <Text style={styles.buttonText}>Change Budget</Text>
        </TouchableOpacity>
      )}
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
  },
  editContainer: {
    marginTop: 20,
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
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
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileScreen;

