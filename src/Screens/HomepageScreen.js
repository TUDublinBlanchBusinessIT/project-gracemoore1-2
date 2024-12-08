import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomepageScreen = ({ route }) => {
  const { budgetAmount, budgetPeriod } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Homepage!</Text>
      <Text style={styles.text}>Budget Amount: £{budgetAmount}</Text>
      <Text style={styles.text}>
        Budget Period: {budgetPeriod.startDate} - {budgetPeriod.endDate}
      </Text>
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
  },
});

export default HomepageScreen;



