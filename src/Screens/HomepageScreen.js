import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomepageScreen = ({ route }) => {
  const { budgetAmount, budgetPeriod } = route.params || {}; // Handle the case when no params are passed

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Homepage!</Text>

      {/* Display budget details */}
      {budgetAmount && budgetPeriod ? (
        <View>
          <Text style={styles.text}>Budget Amount: £{budgetAmount}</Text>
          <Text style={styles.text}>
            Budget Period: {budgetPeriod.startDate} - {budgetPeriod.endDate}
          </Text>
        </View>
      ) : (
        <Text style={styles.text}>No budget information available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E0F7FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default HomepageScreen;


