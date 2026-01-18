import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const AnalyticsChart = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Adjust margins for mobile vs desktop - minimal margins on mobile
  const chartMargins = isMobile
    ? { top: 20, right: 10, left: 10, bottom: 5 }
    : { top: 20, right: 30, left: 20, bottom: 5 };

  // Calculate minimum width for mobile (approximately 55px per month for 12 months to ensure visibility)
  const minChartWidth = data && data.length > 0 ? Math.max(660, data.length * 55) : 660;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-3.5 py-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Analytics</h3>
      <div className="overflow-x-auto -mx-3.5 sm:mx-0">
        <div 
          className="inline-block sm:block" 
          style={{ minWidth: isMobile ? `${minChartWidth}px` : '100%', width: isMobile ? `${minChartWidth}px` : '100%' }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={chartMargins}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 60 : 30}
                interval={0}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => formatCurrency(value)}
                width={isMobile ? 50 : 60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>{value}</span>
                )}
              />
              <Bar
                dataKey="income"
                fill="#374151"
                name="Income"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                fill="#9ca3af"
                name="Expense"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;

