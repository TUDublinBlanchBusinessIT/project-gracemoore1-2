import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [budgetAmount, setBudgetAmount] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        fetchFolders(userId);
        fetchBudget(userId);
      }
    }, [userId])
  );

  const fetchFolders = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().folders) {
        setFolders(userDoc.data().folders);
      } else {
        setFolders([]);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
      Alert.alert('Error', 'Failed to load folders.');
    }
  };

  const fetchBudget = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().budgetAmount) {
        const totalSpent = (userDoc.data().folders || []).reduce(
          (sum, folder) => sum + (folder.spentSoFar || 0),
          0
        );
        const userBudget = userDoc.data().budgetAmount;
        setBudgetAmount(userBudget);
        setRemainingBudget(userBudget - totalSpent);
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
      Alert.alert('Error', 'Failed to load budget information.');
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
    fetchBudget(userId);
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
    fetchBudget(userId);
    setExpenseInputId(null);
  };

  const deleteFolder = async (id) => {
    const updatedFolders = folders.filter((folder) => folder.id !== id);
    setFolders(updatedFolders);

    await saveFoldersToFirestore(updatedFolders);
    fetchBudget(userId);
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

  const renderFolder = ({ item }) => (
    <View style={styles.folderCard}>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteFolder(item.id)}>
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
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
        <TouchableOpacity style={styles.addExpenseButton} onPress={() => setExpenseInputId(item.id)}>
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

      <TouchableOpacity style={styles.plusButton} onPress={() => setShowAddFolder(!showAddFolder)}>
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
  container: { flex: 1, padding: 20, backgroundColor: '#E0F7FA' },
  title: { fontSize: 30, textAlign: 'center', marginBottom: 10, fontFamily:'serif', fontWeight: 'bold'},
  budgetBox: { alignItems: 'center', marginBottom: 15 },
  budgetText: { fontSize: 16 },
  folderCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
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
    color: '#fff', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  folderName: { 
    fontSize: 18, 
    fontWeight: 'bold',
    marginBottom: 5, 
  },
  folderDetail: {
     fontSize: 14, 
  },
  addFolderContainer: {
     marginBottom: 20, 
  },
  input: { 
    padding: 10, 
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor:'#fff', 
  },
  addButton: { 
    padding: 10, 
    backgroundColor: '#00509E', 
    alignItems: 'center' 
  },
  addButtonText: {
   color: '#fff',
   fontWeight: 'bold',
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
  plusText: { fontSize: 28, color: '#fff' },
  expenseInputContainer: { marginTop: 10, width: '100%', marginBottom: 15 },
  expenseInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, paddingHorizontal: 10, marginBottom:15 },
  addExpenseButton: { backgroundColor: '#00509E', borderRadius: 5, padding: 10, alignItems: 'center', marginBottom: 5, marginTop:10 },
  addExpenseText: { color: '#fff', fontSize: 14 },
});

export default FolderScreen;



