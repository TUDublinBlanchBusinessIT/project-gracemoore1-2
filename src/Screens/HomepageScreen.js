import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

const HomepageScreen = ({ route, navigation }) => {
  const { budgetAmount, budgetPeriod } = route.params;

  const formattedStartDate = new Date(budgetPeriod.startDate).toLocaleDateString();
  const formattedEndDate = new Date(budgetPeriod.endDate).toLocaleDateString();

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Penny Planner</Text>

      {/* Decorative Oval for Budget Information */}
      <View style={styles.oval}>
        <Text style={styles.budgetText}>Budget Amount: £{budgetAmount}</Text>
        <Text style={styles.budgetText}>
          Budget Period: {formattedStartDate} - {formattedEndDate}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
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
    marginBottom: 50, // Space between title and oval
    textAlign: 'center',
    marginTop: Platform.OS === 'ios' ? -50 : 20,
    fontFamily:'serif',
  },
  oval: {
    width: Platform.OS === 'web' ? '30%' : '80%',
    padding: 20,
    borderRadius: 50, // Makes it an oval
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