import { useMemo } from 'react';
import { useTransactions } from './useTransactions';

export const useFinancialData = () => {
  const { transactions, loading } = useTransactions();

  const financialData = useMemo(() => {
    if (loading || !transactions.length) {
      return {
        totalBalance: 0,
        totalIncome: 0,
        totalExpense: 0,
        monthlyData: [],
        categoryData: {},
      };
    }

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
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

      if (transaction.type === 'income') {
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
      .filter((t) => t.type === 'expense')
      .forEach((transaction) => {
        const category = transaction.category || 'Other';
        categoryMap[category] = (categoryMap[category] || 0) + (transaction.amount || 0);
      });

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      monthlyData: filledMonthlyData,
      categoryData: categoryMap,
    };
  }, [transactions, loading]);

  return {
    ...financialData,
    loading,
  };
};

