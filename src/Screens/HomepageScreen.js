import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const HomepageScreen = ({ navigation }) => {
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [budgetPeriod, setBudgetPeriod] = useState({ startDate: '', endDate: '' });

  const fetchBudgetData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setBudgetAmount(userData.budgetAmount);
        setBudgetPeriod(userData.budgetPeriod || { startDate: '', endDate: '' });
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
      Alert.alert('Error', 'Failed to fetch budget information.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBudgetData();
    }, [])
  );

  const formattedStartDate = budgetPeriod.startDate
    ? new Date(budgetPeriod.startDate).toLocaleDateString()
    : 'N/A';
  const formattedEndDate = budgetPeriod.endDate
    ? new Date(budgetPeriod.endDate).toLocaleDateString()
    : 'N/A';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Penny Planner</Text>
      <View style={styles.oval}>
        <Text style={styles.budgetText}>Budget Amount: £{budgetAmount}</Text>
        <Text style={styles.budgetText}>
          Budget Period: {formattedStartDate} - {formattedEndDate}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Folders')}>
          <Text style={styles.buttonText}>Folders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.buttonText}>My Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 50,
    textAlign: 'center',
    marginTop: Platform.OS === 'ios' ? -50 : 20,
    fontFamily: 'serif',
  },
  oval: {
    width: Platform.OS === 'web' ? '30%' : '80%',
    padding: 20,
    borderRadius: 50,
    backgroundColor: '#B3E5FC',
    borderColor: '#00509E',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'serif',
  },
  buttonContainer: {
    marginTop: Platform.OS === 'ios' ? 40 : 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: Platform.OS === 'ios' ? '60%' : '40%',
  },
  button: {
    width: Platform.OS === 'ios' ? '90%' : '80%',
    alignItems: 'center',
    backgroundColor: '#00509E',
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: Platform.OS === 'ios' ? 20 : 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomepageScreen;
