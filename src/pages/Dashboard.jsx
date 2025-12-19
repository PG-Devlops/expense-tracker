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

  // Calculate percentage changes (mock data for now - in real app, compare with previous period)
  const balancePercentage = 9; // Mock: +9%
  const incomePercentage = 5; // Mock: +5%
  const expensePercentage = -29; // Mock: -29%

  if (loading) {
    return (
      <Layout title="Dashboard">
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

