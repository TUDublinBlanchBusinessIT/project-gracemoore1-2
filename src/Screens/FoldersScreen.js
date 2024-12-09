import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FoldersScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Folders</Text>
      <Text style={styles.text}>This is the Folders Screen.</Text>
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

export default FoldersScreen;

