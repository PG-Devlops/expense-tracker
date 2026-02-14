import { useMemo, useState, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import SummaryCard from '../components/dashboard/SummaryCard';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import ExpensesChart from '../components/dashboard/ExpensesChart';
import TransactionFilters from '../components/dashboard/TransactionFilters';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import { useFinancialData } from '../hooks/useFinancialData';
import { useTransactions } from '../hooks/useTransactions';
import LoadingSpinner from '../components/common/LoadingSpinner';

const getTransactionDate = (t) => {
  if (t.date?.toDate) return t.date.toDate();
  if (typeof t.date === 'string') return new Date(t.date);
  if (t.date instanceof Date) return t.date;
  return null;
};

const Dashboard = () => {
  const { totalBalance, totalIncome, totalExpense, monthlyData, categoryData, loading } =
    useFinancialData();
  const { transactions, loading: transactionsLoading } = useTransactions();

  const [filterType, setFilterType] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredTransactions = useMemo(() => {
    let list = transactions || [];
    if (filterType !== 'all') {
      const typeLower = filterType.toLowerCase();
      list = list.filter((t) => (t.type || '').toLowerCase() === typeLower);
    }
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      list = list.filter((t) => {
        const d = getTransactionDate(t);
        return d && d >= from;
      });
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      list = list.filter((t) => {
        const d = getTransactionDate(t);
        return d && d <= to;
      });
    }
    return list;
  }, [transactions, filterType, dateFrom, dateTo]);

  const clearFilters = useCallback(() => {
    setFilterType('all');
    setDateFrom('');
    setDateTo('');
  }, []);

  const getChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const latest = monthlyData?.[monthlyData.length - 1] || { income: 0, expense: 0 };
  const previous = monthlyData?.[monthlyData.length - 2] || { income: 0, expense: 0 };

  const incomePercentage = getChange(latest.income, previous.income);
  const expensePercentage = getChange(latest.expense, previous.expense);
  const balancePercentage = getChange(
    latest.income - latest.expense,
    previous.income - previous.expense
  );

  if (loading) {
    return (
      <Layout title="Dashboard">
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-4 sm:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <SummaryCard
            title="Total balance"
            amount={totalBalance}
            percentage={balancePercentage}
            period="Last month"
            isPositive={balancePercentage >= 0}
          />
          <SummaryCard
            title="Income"
            amount={totalIncome}
            percentage={incomePercentage}
            period="Last month"
            isPositive={incomePercentage >= 0}
          />
          <SummaryCard
            title="Expense"
            amount={totalExpense}
            percentage={expensePercentage}
            period="Last month"
            isPositive={expensePercentage >= 0}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <AnalyticsChart data={monthlyData} />
          <ExpensesChart categoryData={categoryData} />
        </div>

        {/* Transactions: filters + table in one card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Transactions</h3>
          <TransactionFilters
            filterType={filterType}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onTypeChange={setFilterType}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onClear={clearFilters}
          />
          <TransactionsTable
            transactions={filteredTransactions}
            loading={transactionsLoading}
            embedded
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

