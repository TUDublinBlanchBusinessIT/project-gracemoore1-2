import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HomepageScreen = ({ route }) => {
  const { budgetAmount, budgetPeriod } = route.params;

  const formattedStartDate = new Date(budgetPeriod.startDate).toLocaleDateString();
  const formattedEndDate = new Date(budgetPeriod.endDate).toLocaleDateString();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Homepage!</Text>
      <Text style={styles.text}>Budget Amount: £{budgetAmount}</Text>
      <Text style={styles.text}>
        Budget Period: {formattedStartDate} - {formattedEndDate}
      </Text>

            {/* Buttons for Navigation */}
            <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Folders')}
      >
        <Text style={styles.buttonText}>Folders</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('SpendingHistory')}
      >
        <Text style={styles.buttonText}>Spending History</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.buttonText}>My Profile</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    backgroundColor: '#00509E',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomepageScreen;



