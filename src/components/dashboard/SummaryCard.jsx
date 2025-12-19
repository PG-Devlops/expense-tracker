import { formatCurrency } from '../../utils/formatters';

const SummaryCard = ({ title, amount, percentage, period = 'Last month', isPositive = true }) => {
  const percentageColor = isPositive ? 'text-green-600' : 'text-red-600';
  const percentageSign = isPositive ? '+' : '';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-bold text-gray-900">{formatCurrency(amount)}</p>
        {percentage !== undefined && (
          <span className={`text-sm font-medium ${percentageColor}`}>
            {percentageSign}{percentage}%
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">{period}</p>
    </div>
  );
};

export default SummaryCard;

