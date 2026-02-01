
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, Lightbulb, ChevronRight } from 'lucide-react';
import { Transaction, Category, Budget, TransactionType } from '../types';
import { getFinancialInsights } from '../services/geminiService';

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, categories, budgets }) => {
  const [insights, setInsights] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const stats = React.useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expenses,
      balance: income - expenses
    };
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);

  const fetchInsights = async () => {
    if (transactions.length === 0) {
      setInsights("Add some transactions to get AI-powered financial tips!");
      return;
    }
    setIsLoadingInsights(true);
    const text = await getFinancialInsights(transactions, categories, budgets);
    setInsights(text);
    setIsLoadingInsights(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
        <p className="text-blue-100 text-sm font-medium mb-1">Total Balance</p>
        <h2 className="text-4xl font-bold mb-6">${stats.balance.toLocaleString()}</h2>
        
        <div className="flex justify-between gap-4">
          <div className="flex-1 bg-white/10 rounded-2xl p-3 flex items-center gap-3">
            <div className="bg-emerald-400/20 p-2 rounded-full">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-blue-100 text-[10px] uppercase font-bold tracking-wider">Income</p>
              <p className="font-semibold text-sm">${stats.income.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex-1 bg-white/10 rounded-2xl p-3 flex items-center gap-3">
            <div className="bg-rose-400/20 p-2 rounded-full">
              <TrendingDown className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="text-blue-100 text-[10px] uppercase font-bold tracking-wider">Expenses</p>
              <p className="font-semibold text-sm">${stats.expenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-amber-900">AI Financial Insights</h3>
          </div>
          <button 
            onClick={fetchInsights}
            disabled={isLoadingInsights}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-100 px-2 py-1 rounded-md"
          >
            {isLoadingInsights ? 'Thinking...' : 'Refresh'}
          </button>
        </div>
        <div className="text-sm text-amber-800 space-y-2 leading-relaxed whitespace-pre-line">
          {isLoadingInsights ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-amber-200/50 rounded w-full"></div>
              <div className="h-4 bg-amber-200/50 rounded w-5/6"></div>
              <div className="h-4 bg-amber-200/50 rounded w-4/6"></div>
            </div>
          ) : (
            insights || "Loading your personalized tips..."
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
          <button className="text-sm font-semibold text-blue-600">See All</button>
        </div>
        <div className="space-y-3">
          {recentTransactions.length > 0 ? (
            recentTransactions.map(t => {
              const category = categories.find(c => c.id === t.categoryId);
              return (
                <div key={t.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${category?.color}15` }}
                  >
                    {category?.icon || '❓'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{t.description || category?.name}</h4>
                    <p className="text-xs text-gray-400">
                      {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className={`font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-gray-800'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 bg-white rounded-2xl border-2 border-dashed border-gray-100">
              <p className="text-gray-400 text-sm">No transactions yet. Start tracking!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
