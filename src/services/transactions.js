import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const TRANSACTIONS_COLLECTION = 'transactions';

/**
 * Get all transactions for a user
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function to receive updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToTransactions = (userId, callback) => {
  const q = query(
    collection(db, TRANSACTIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(transactions);
  });
};

/**
 * Get all transactions for a user (one-time fetch)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of transactions
 */
export const getTransactions = async (userId) => {
  const q = query(
    collection(db, TRANSACTIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Add a new transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<string>} Document ID
 */
export const addTransaction = async (transactionData) => {
  const transaction = {
    ...transactionData,
    date: transactionData.date ? Timestamp.fromDate(new Date(transactionData.date)) : Timestamp.now(),
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), transaction);
  return docRef.id;
};

/**
 * Update a transaction
 * @param {string} transactionId - Transaction ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateTransaction = async (transactionId, updates) => {
  const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
  const updateData = { ...updates };
  
  if (updates.date) {
    updateData.date = Timestamp.fromDate(new Date(updates.date));
  }

  await updateDoc(transactionRef, updateData);
};

/**
 * Delete a transaction
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<void>}
 */
export const deleteTransaction = async (transactionId) => {
  const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
  await deleteDoc(transactionRef);
};

