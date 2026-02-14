import { formatCurrency, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

const CARD_CLASS = 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6';
const TITLE_CLASS = 'text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6';

const TransactionsTable = ({ transactions, loading, embedded }) => {
  const wrapper = (content) =>
    embedded ? content : <div className={CARD_CLASS}><h3 className={TITLE_CLASS}>Transactions</h3>{content}</div>;

  if (loading) {
    return wrapper(<LoadingSpinner />);
  }

  if (!transactions || transactions.length === 0) {
    return wrapper(
      <div className="text-center py-8 text-gray-500">No transactions found</div>
    );
  }

  // Show only recent transactions (last 10)
  const recentTransactions = transactions.slice(0, 10);

  const tableContent = (
    <div className="overflow-x-auto -mx-4 sm:-mx-6 md:mx-0">
        <div className="inline-block min-w-full md:w-full align-middle px-4 sm:px-6 md:px-0">
          <table className="min-w-[600px] md:min-w-0 md:w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Price
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Remark
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.category || 'N/A'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.amount || 0)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 md:max-w-[200px] truncate">
                    {transaction.remark || '-'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.source || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );

  return wrapper(tableContent);
};

export default TransactionsTable;

