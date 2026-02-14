const TRANSACTION_TYPES = [
  { value: 'all', label: 'All' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

const TransactionFilters = ({ filterType, dateFrom, dateTo, onTypeChange, onDateFromChange, onDateToChange, onClear }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-4 flex-wrap mb-4 sm:mb-6">
        {/* Transaction type */}
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label htmlFor="filter-type" className="text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="filter-type"
            value={filterType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            {TRANSACTION_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Date from */}
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label htmlFor="filter-date-from" className="text-sm font-medium text-gray-700">
            From date
          </label>
          <input
            id="filter-date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Date to */}
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label htmlFor="filter-date-to" className="text-sm font-medium text-gray-700">
            To date
          </label>
          <input
            id="filter-date-to"
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {(filterType !== 'all' || dateFrom || dateTo) && (
          <button
            type="button"
            onClick={onClear}
            className="self-end sm:self-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Clear filters
          </button>
        )}
    </div>
  );
};

export default TransactionFilters;
