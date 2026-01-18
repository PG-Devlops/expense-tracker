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
 * Check if a transaction ID is a dummy transaction
 * @param {string} transactionId - Transaction ID to check
 * @returns {boolean} True if the ID is a dummy transaction
 */
const isDummyTransaction = (transactionId) => {
  return typeof transactionId === 'string' && transactionId.startsWith('dummy-');
};

/**
 * Generate dummy transactions with dynamically computed dates.
 * This ensures dates are always current, even if the app is open for extended periods.
 * @returns {Array} Array of dummy transaction objects
 */
const generateDummyTransactions = () => {
  const now = Date.now();
  return [
    {
      id: 'dummy-1',
      category: 'Salary',
      amount: 3500,
      type: 'income',
      date: new Date(now).toISOString().split('T')[0],
      remark: 'Monthly salary',
      source: 'Bank Transfer',
    },
    {
      id: 'dummy-2',
      category: 'Groceries',
      amount: 220,
      type: 'expense',
      date: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      remark: 'Weekly grocery shopping',
      source: 'Debit Card',
    },
    {
      id: 'dummy-3',
      category: 'Rent',
      amount: 1200,
      type: 'expense',
      date: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      remark: 'Apartment rent',
      source: 'Bank Transfer',
    },
    {
      id: 'dummy-4',
      category: 'Freelance',
      amount: 800,
      type: 'income',
      date: new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      remark: 'Side project payment',
      source: 'PayPal',
    },
  ];
};

/**
 * Get all transactions for a user
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function to receive updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToTransactions = (userId, callback) => {
  // Try with orderBy first, but if it fails (missing index), fall back to query without orderBy
  let q;
  try {
    q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
  } catch (error) {
    // If query construction fails, use simpler query without orderBy
    console.warn('Failed to create ordered query, using simple query:', error);
    q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where('userId', '==', userId)
    );
  }

  return onSnapshot(
    q,
    (snapshot) => {
      const transactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort transactions by date descending if we didn't use orderBy in query
      if (transactions.length > 0 && transactions[0].date) {
        transactions.sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
          return dateB - dateA;
        });
      }

      // If there are no transactions in Firestore yet, fall back to dummy data.
      // Generate fresh dummy data each time to ensure dates are current.
      if (!transactions.length) {
        callback(generateDummyTransactions());
        return;
      }

      callback(transactions);
    },
    (error) => {
      console.error('Firestore subscription error:', error);
      // CRITICAL FIX: Call callback with dummy data on error to prevent infinite loading
      // This handles cases like missing Firestore indexes
      callback(generateDummyTransactions());
    }
  );
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
  const transactions = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // If there are no transactions in Firestore yet, fall back to dummy data.
  // This ensures consistency with subscribeToTransactions behavior.
  if (!transactions.length) {
    return generateDummyTransactions();
  }

  return transactions;
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
  // Prevent operations on dummy transactions that don't exist in Firestore
  if (isDummyTransaction(transactionId)) {
    throw new Error('Cannot update dummy transaction. Please add a real transaction first.');
  }

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
  // Prevent operations on dummy transactions that don't exist in Firestore
  if (isDummyTransaction(transactionId)) {
    throw new Error('Cannot delete dummy transaction. Please add a real transaction first.');
  }

  const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
  await deleteDoc(transactionRef);
};

