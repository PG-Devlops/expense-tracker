import { useState, useEffect } from 'react';
import {
  subscribeToTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transactions';
import { useAuth } from '../context/AuthContext';

export const useTransactions = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToTransactions(currentUser.uid, (data) => {
      setTransactions(data);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const add = async (transactionData) => {
    try {
      if (!currentUser) throw new Error('User not authenticated');
      await addTransaction({
        ...transactionData,
        userId: currentUser.uid,
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const update = async (transactionId, updates) => {
    try {
      await updateTransaction(transactionId, updates);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const remove = async (transactionId) => {
    try {
      await deleteTransaction(transactionId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    transactions,
    loading,
    error,
    add,
    update,
    remove,
  };
};

