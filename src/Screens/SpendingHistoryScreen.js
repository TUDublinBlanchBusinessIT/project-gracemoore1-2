import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SpendingHistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending History</Text>
      <Text style={styles.text}>This is the Spending History Screen.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default SpendingHistoryScreen;
