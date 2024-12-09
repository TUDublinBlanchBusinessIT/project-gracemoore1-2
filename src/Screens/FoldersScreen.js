import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { auth, db } from '../firebaseConfig'; // Import your Firebase configuration
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore methods

const FolderScreen = () => {
  const [folders, setFolders] = useState([]);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newAllocatedBudget, setNewAllocatedBudget] = useState('');
  const [userId, setUserId] = useState(null);
  const [expenseInputId, setExpenseInputId] = useState(null);
  const [expenseValue, setExpenseValue] = useState('');
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [budgetAmount, setBudgetAmount] = useState(0);

  // Fetch user ID on component mount
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      fetchFolders(user.uid);
      fetchBudget(user.uid);
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

  // Fetch budget amount and calculate remaining budget
  const fetchBudget = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().budgetAmount) {
        const totalSpent = userDoc
          .data()
          .folders.reduce((sum, folder) => sum + folder.spentSoFar, 0);
        const userBudget = userDoc.data().budgetAmount;
        setBudgetAmount(userBudget);
        setRemainingBudget(userBudget - totalSpent);
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
      Alert.alert('Error', 'Failed to load budget information.');
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
    fetchBudget(userId); // Update the remaining budget
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
    fetchBudget(userId); // Update the remaining budget
    setExpenseInputId(null); // Close the input after submission
  };

  // Delete a folder
  const deleteFolder = async (id) => {
    const updatedFolders = folders.filter((folder) => folder.id !== id);
    setFolders(updatedFolders);

    // Save updated folders to Firestore
    await saveFoldersToFirestore(updatedFolders);
    fetchBudget(userId); // Update the remaining budget
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
    <View style={styles.folderCard}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteFolder(item.id)}
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
      <Text style={styles.folderName}>{item.name}</Text>
      <Text style={styles.folderDetail}>
        Allocated: £{item.allocatedBudget}
      </Text>
      <Text style={styles.folderDetail}>Spent So Far: £{item.spentSoFar}</Text>
      <Text style={styles.folderDetail}>
        Remaining: £{item.allocatedBudget - item.spentSoFar}
      </Text>
      {expenseInputId === item.id ? (
        <View style={styles.expenseInputContainer}>
          <TextInput
            style={styles.expenseInput}
            placeholder="Enter Expense"
            value={expenseValue}
            onChangeText={setExpenseValue}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.addExpenseButton}
            onPress={() => {
              const expense = parseFloat(expenseValue);
              if (!isNaN(expense)) {
                updateFolder(item.id, expense);
                setExpenseValue('');
              } else {
                Alert.alert('Error', 'Please enter a valid number.');
              }
            }}
          >
            <Text style={styles.addExpenseText}>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addExpenseButton}
          onPress={() => setExpenseInputId(item.id)}
        >
          <Text style={styles.addExpenseText}>+ Add Expense</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Folders</Text>

      <View style={styles.budgetBox}>
        <Text style={styles.budgetText}>Total Budget: £{budgetAmount}</Text>
        <Text style={styles.budgetText}>Remaining: £{remainingBudget}</Text>
      </View>

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
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 20,
        }}
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
    marginTop: Platform.OS === 'web' ? 20 : 90,
    fontFamily: 'serif',
  },
  budgetBox: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  budgetText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  folderCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    paddingHorizontal: 5,
    zIndex: 1,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
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
  expenseInputContainer: {
    marginTop: 10,
    width: '100%',
  },
  expenseInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },
  addExpenseButton: {
    backgroundColor: '#00509E',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  addExpenseText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default FolderScreen;
