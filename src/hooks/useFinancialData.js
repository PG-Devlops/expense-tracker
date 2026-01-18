import { useMemo } from 'react';
import { useTransactions } from './useTransactions';

// Dummy data matching the dashboard image
const getDummyFinancialData = () => {
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Monthly data with realistic income and expense values (ranging from 2k to 12k as shown in image)
  const monthlyData = allMonths.map((month, index) => {
    // Create varied but realistic data
    const baseIncome = 5000 + Math.sin(index * 0.5) * 3000;
    const baseExpense = 3000 + Math.cos(index * 0.7) * 2000;
    return {
      month,
      income: Math.max(2000, Math.floor(baseIncome)),
      expense: Math.max(2000, Math.floor(baseExpense)),
    };
  });

  // Category data for expenses - matching the pie chart
  // Total shown in image is 4,568.34, but we'll use realistic distribution
  const categoryData = {
    'Apex Servers': 2000, // Main category
    'Food & Dining': 800,
    'Shopping': 500,
    'Transportation': 300,
    'Bills & Utilities': 150,
    'Entertainment': 73.34,
  };

  return {
    totalBalance: 20456,
    totalIncome: 8345.32,
    totalExpense: 3823,
    monthlyData,
    categoryData,
    currentMonthStats: monthlyData[monthlyData.length - 1],
    lastMonthStats: monthlyData[monthlyData.length - 2],
  };
};

export const useFinancialData = () => {
  const { transactions, loading } = useTransactions();

  const financialData = useMemo(() => {
    // If loading, return empty data
    if (loading) {
      return {
        totalBalance: 0,
        totalIncome: 0,
        totalExpense: 0,
        monthlyData: [],
        categoryData: {},
      };
    }

    // Check if we're using dummy transactions (all have IDs starting with "dummy-")
    const isUsingDummyData = transactions.length > 0 && transactions.every(t => t.id?.startsWith('dummy-'));

    // If no transactions or using dummy transactions, return hardcoded dummy financial data
    if (!transactions.length || isUsingDummyData) {
      return getDummyFinancialData();
    }

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.type?.toLowerCase() === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalExpense = transactions
      .filter((t) => t.type?.toLowerCase() === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalBalance = totalIncome - totalExpense;

    // Group by month for analytics chart
    const monthlyMap = {};
    transactions.forEach((transaction) => {
      const date = transaction.date?.toDate ? transaction.date.toDate() : new Date(transaction.date);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-11
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'short' });

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = {
          month: monthName,
          monthIndex: month,
          year,
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type?.toLowerCase() === 'income') {
        monthlyMap[monthKey].income += transaction.amount || 0;
      } else {
        monthlyMap[monthKey].expense += transaction.amount || 0;
      }
    });

    // Convert to array and sort by year and month index
    const monthlyData = Object.values(monthlyMap).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.monthIndex - b.monthIndex;
    });

    // Ensure we have all 12 months for current year (fill missing months with 0)
    const currentYear = new Date().getFullYear();
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const filledMonthlyData = allMonths.map((month, index) => {
      const existing = monthlyData.find((d) => d.month === month && d.year === currentYear);
      return existing || { month, income: 0, expense: 0 };
    });

    // Group expenses by category
    const categoryMap = {};
    transactions
      .filter((t) => t.type?.toLowerCase() === 'expense')
      .forEach((transaction) => {
        const category = transaction.category || 'Other';
        categoryMap[category] = (categoryMap[category] || 0) + (transaction.amount || 0);
      });

    // Get current and previous month stats
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthKey = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

    const currentMonthStats = monthlyMap[currentKey] || { income: 0, expense: 0 };
    const lastMonthStats = monthlyMap[lastMonthKey] || { income: 0, expense: 0 };

    // Calculate accumulated balance up to end of last month
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    let lastMonthAccumulatedIncome = 0;
    let lastMonthAccumulatedExpense = 0;

    transactions.forEach((t) => {
      const tDate = t.date?.toDate ? t.date.toDate() : new Date(t.date);
      if (tDate < startOfCurrentMonth) {
        const type = t.type?.toLowerCase();
        if (type === 'income') lastMonthAccumulatedIncome += t.amount || 0;
        if (type === 'expense') lastMonthAccumulatedExpense += t.amount || 0;
      }
    });

    const lastMonthBalance = lastMonthAccumulatedIncome - lastMonthAccumulatedExpense;

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      monthlyData: filledMonthlyData,
      categoryData: categoryMap,
      currentMonthStats,
      lastMonthStats,
      lastMonthBalance,
    };
  }, [transactions, loading]);

  return {
    ...financialData,
    loading,
  };
};

