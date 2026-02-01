
import React, { useState } from 'react';
import { Target, TrendingUp, AlertCircle } from 'lucide-react';
import { Transaction, Category, Budget, TransactionType } from '../types';

interface BudgetingProps {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  onSetBudget: (categoryId: string, limit: number) => void;
}

const Budgeting: React.FC<BudgetingProps> = ({ transactions, categories, budgets, onSetBudget }) => {
  const [editingBudget, setEditingBudget] = useState<{ id: string, value: string } | null>(null);

  const expenseCategories = categories.filter(c => c.type === TransactionType.EXPENSE);
  
  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const getSpendingForCategory = (categoryId: string) => {
    return currentMonthTransactions
      .filter(t => t.categoryId === categoryId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleSaveBudget = (id: string) => {
    if (editingBudget && editingBudget.value) {
      onSetBudget(id, parseFloat(editingBudget.value));
      setEditingBudget(null);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Monthly Budgets</h3>
            <p className="text-blue-100 text-xs">Set goals to control your spending</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {expenseCategories.map(cat => {
          const budget = budgets.find(b => b.categoryId === cat.id);
          const spending = getSpendingForCategory(cat.id);
          const percent = budget ? Math.min((spending / budget.limit) * 100, 100) : 0;
          const isOver = budget ? spending > budget.limit : false;

          return (
            <div key={cat.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h4 className="font-bold text-gray-800">{cat.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {budget ? `Limit: $${budget.limit.toLocaleString()}` : 'No limit set'}
                    </p>
                  </div>
                </div>
                {editingBudget?.id === cat.id ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      autoFocus
                      className="w-20 px-2 py-1 text-sm border rounded-lg"
                      value={editingBudget.value}
                      onChange={(e) => setEditingBudget({ ...editingBudget, value: e.target.value })}
                    />
                    <button 
                      onClick={() => handleSaveBudget(cat.id)}
                      className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold"
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setEditingBudget({ id: cat.id, value: budget?.limit.toString() || '' })}
                    className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full"
                  >
                    {budget ? 'Edit' : 'Set Limit'}
                  </button>
                )}
              </div>

              {budget && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className={isOver ? 'text-rose-500' : 'text-gray-500'}>
                      Spent: ${spending.toLocaleString()}
                    </span>
                    <span className="text-gray-400">
                      Remaining: ${Math.max(0, budget.limit - spending).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent >= 90 ? 'bg-rose-500' : percent >= 70 ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  {isOver && (
                    <div className="flex items-center gap-1 text-rose-500 text-[10px] font-bold">
                      <AlertCircle className="w-3 h-3" />
                      BUDGET EXCEEDED BY ${(spending - budget.limit).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Budgeting;
