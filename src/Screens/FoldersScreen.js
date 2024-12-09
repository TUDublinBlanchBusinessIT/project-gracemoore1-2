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
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const FolderScreen = () => {
  const [folders, setFolders] = useState([]);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newAllocatedBudget, setNewAllocatedBudget] = useState('');
  const [userId, setUserId] = useState(null);
  const [expenseInputId, setExpenseInputId] = useState(null);
  const [expenseValue, setExpenseValue] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      fetchFolders(user.uid);
    }
  }, []);

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

  const addFolder = async () => {
    if (!newFolderName || !newAllocatedBudget) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      allocatedBudget: parseFloat(newAllocatedBudget),
      spentSoFar: 0,
    };

    const updatedFolders = [...folders, newFolder];

    setFolders(updatedFolders);
    setNewFolderName('');
    setNewAllocatedBudget('');
    setShowAddFolder(false);

    await saveFoldersToFirestore(updatedFolders);
  };

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

    await saveFoldersToFirestore(updatedFolders);
    setExpenseInputId(null);
  };

  const saveFoldersToFirestore = async (updatedFolders) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { folders: updatedFolders });
    } catch (error) {
      console.error('Error saving folders:', error);
      Alert.alert('Error', 'Failed to save folder data.');
    }
  };

  const calculateRemainingBudget = () => {
    const totalAllocated = folders.reduce((sum, folder) => sum + folder.allocatedBudget, 0);
    const totalSpent = folders.reduce((sum, folder) => sum + folder.spentSoFar, 0);
    return totalAllocated - totalSpent;
  };

  const renderFolder = ({ item }) => (
    <View style={styles.folderCard}>
      <Text style={styles.folderName}>{item.name}</Text>
      <Text style={styles.folderDetail}>Allocated: £{item.allocatedBudget}</Text>
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

      {/* Box displaying the remaining budget */}
      <View style={styles.remainingBudgetBox}>
        <Text style={styles.remainingBudgetText}>Remaining Budget:</Text>
        <Text style={styles.remainingBudgetValue}>£{calculateRemainingBudget()}</Text>
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
  remainingBudgetBox: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  remainingBudgetText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  remainingBudgetValue: {
    fontSize: 16,
    color: '#555',
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
