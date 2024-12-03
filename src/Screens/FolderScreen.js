import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FolderScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Folder Screen Placeholder</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default FolderScreen;
