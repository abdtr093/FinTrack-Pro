
import React from 'react';
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend
} from 'recharts';
import { Transaction, Category, TransactionType } from '../types';

interface ReportsProps {
  transactions: Transaction[];
  categories: Category[];
}

const Reports: React.FC<ReportsProps> = ({ transactions, categories }) => {
  const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
  
  const categoryData = React.useMemo(() => {
    const data: Record<string, { name: string, value: number, color: string }> = {};
    expenseTransactions.forEach(t => {
      const cat = categories.find(c => c.id === t.categoryId);
      if (cat) {
        if (!data[cat.id]) {
          data[cat.id] = { name: cat.name, value: 0, color: cat.color };
        }
        data[cat.id].value += t.amount;
      }
    });
    return Object.values(data).sort((a, b) => b.value - a.value);
  }, [expenseTransactions, categories]);

  const monthlyData = React.useMemo(() => {
    const months: Record<string, { month: string, income: number, expense: number }> = {};
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleDateString(undefined, { month: 'short' });
    }).reverse();

    last6Months.forEach(m => months[m] = { month: m, income: 0, expense: 0 });

    transactions.forEach(t => {
      const m = new Date(t.date).toLocaleDateString(undefined, { month: 'short' });
      if (months[m]) {
        if (t.type === TransactionType.INCOME) months[m].income += t.amount;
        else months[m].expense += t.amount;
      }
    });

    return Object.values(months);
  }, [transactions]);

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Spending by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={categoryData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spent']}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {categoryData.slice(0, 4).map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs font-semibold text-gray-600 truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Income vs Expense</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Top Spending Categories</h3>
        <div className="space-y-4">
          {categoryData.map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-gray-700">{item.name}</span>
                <span className="font-bold text-gray-900">${item.value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${(item.value / categoryData[0].value) * 100}%`,
                    backgroundColor: item.color 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
