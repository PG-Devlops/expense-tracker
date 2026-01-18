import Layout from '../components/layout/Layout';
import SummaryCard from '../components/dashboard/SummaryCard';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import ExpensesChart from '../components/dashboard/ExpensesChart';
import TransactionsTable from '../components/dashboard/TransactionsTable';
import { useFinancialData } from '../hooks/useFinancialData';
import { useTransactions } from '../hooks/useTransactions';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { totalBalance, totalIncome, totalExpense, monthlyData, categoryData, loading } =
    useFinancialData();
  const { transactions, loading: transactionsLoading } = useTransactions();

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

        {/* Transactions Table */}
        <TransactionsTable transactions={transactions} loading={transactionsLoading} />
      </div>
    </Layout>
  );
};

export default Dashboard;

