import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { auth, db } from '../firebaseConfig'; // Import your Firebase configuration
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; // Firestore methods

const FolderScreen = () => {
  const [folders, setFolders] = useState([]);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newAllocatedBudget, setNewAllocatedBudget] = useState('');
  const [userId, setUserId] = useState(null);

  // Fetch user ID on component mount
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      fetchFolders(user.uid);
    }
  }, []);

  // Fetch folders from Firestore
  const fetchFolders = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().folders) {
        setFolders(userDoc.data().folders);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
      Alert.alert('Error', 'Failed to load folders.');
    }
  };

  // Add a new folder
  const addFolder = async () => {
    if (!newFolderName || !newAllocatedBudget) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const newFolder = {
      id: Date.now().toString(), // Unique ID
      name: newFolderName,
      allocatedBudget: parseFloat(newAllocatedBudget),
      spentSoFar: 0, // Initialize spent amount
    };

    const updatedFolders = [...folders, newFolder];

    setFolders(updatedFolders);
    setNewFolderName('');
    setNewAllocatedBudget('');
    setShowAddFolder(false);

    // Save updated folders to Firestore
    await saveFoldersToFirestore(updatedFolders);
  };

  // Update folder expense
  const updateFolder = async (id, expense) => {
    const updatedFolders = folders.map((folder) =>
      folder.id === id
        ? {
            ...folder,
            spentSoFar: folder.spentSoFar + expense,
          }
        : folder
    );

    setFolders(updatedFolders);

    // Save updated folders to Firestore
    await saveFoldersToFirestore(updatedFolders);
  };

  // Save folders to Firestore
  const saveFoldersToFirestore = async (updatedFolders) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { folders: updatedFolders });
    } catch (error) {
      console.error('Error saving folders:', error);
      Alert.alert('Error', 'Failed to save folder data.');
    }
  };

  // Render each folder
  const renderFolder = ({ item }) => (
    <TouchableOpacity
      style={styles.folderCard}
      onPress={() =>
        Alert.prompt(
          `Add Expense to ${item.name}`,
          'Enter the expense amount:',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Submit',
              onPress: (expense) => {
                const expenseValue = parseFloat(expense);
                if (!isNaN(expenseValue)) {
                  updateFolder(item.id, expenseValue);
                } else {
                  Alert.alert('Error', 'Please enter a valid number.');
                }
              },
            },
          ],
          'plain-text'
        )
      }
    >
      <Text style={styles.folderName}>{item.name}</Text>
      <Text style={styles.folderDetail}>
        Allocated: £{item.allocatedBudget}
      </Text>
      <Text style={styles.folderDetail}>Spent So Far: £{item.spentSoFar}</Text>
      <Text style={styles.folderDetail}>
        Remaining: £{item.allocatedBudget - item.spentSoFar}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Folders</Text>

      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => setShowAddFolder(!showAddFolder)}
      >
        <Text style={styles.plusText}>{showAddFolder ? '-' : '+'}</Text>
      </TouchableOpacity>

      {showAddFolder && (
        <View style={styles.addFolderContainer}>
          <TextInput
            style={styles.input}
            placeholder="Folder Name"
            value={newFolderName}
            onChangeText={setNewFolderName}
          />
          <TextInput
            style={styles.input}
            placeholder="Allocated Budget"
            value={newAllocatedBudget}
            onChangeText={setNewAllocatedBudget}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.addButton} onPress={addFolder}>
            <Text style={styles.addButtonText}>Add Folder</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={folders}
        renderItem={renderFolder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  folderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  folderName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  folderDetail: {
    fontSize: 14,
    color: '#555',
  },
  addFolderContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#00509E',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  plusButton: {
    alignSelf: 'center',
    marginVertical: 10,
    backgroundColor: '#00509E',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    fontSize: 28,
    color: '#FFFFFF',
  },
});

export default FolderScreen;
