import Layout from '../components/layout/Layout';

const HelpSupport = () => {
  return (
    <Layout title="Help & Support">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Help & Support</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Getting Started</h3>
              <p className="text-gray-600">
                Welcome to Finance Management! This application helps you track your income and expenses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How to Add Transactions</h3>
              <p className="text-gray-600">
                Navigate to the Transactions page and click "Add Transaction" to record your income or expenses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Contact Support</h3>
              <p className="text-gray-600">
                If you need assistance, please contact our support team at support@financeapp.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpSupport;

