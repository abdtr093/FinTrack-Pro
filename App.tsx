
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  LayoutDashboard, 
  ReceiptText, 
  PieChart, 
  Wallet, 
  Search,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { 
  Transaction, 
  Category, 
  Budget, 
  TransactionType, 
  ViewType 
} from './types';
import { DEFAULT_CATEGORIES } from './constants';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import Reports from './components/Reports';
import Budgeting from './components/Budgeting';
import TransactionForm from './components/TransactionForm';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('DASHBOARD');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    const storedBudgets = localStorage.getItem('budgets');
    const storedCategories = localStorage.getItem('categories');

    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('budgets', JSON.stringify(budgets));
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [transactions, budgets, categories]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newTransaction, ...prev]);
    setIsFormOpen(false);
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
    setEditingTransaction(null);
    setIsFormOpen(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = (name: string, type: TransactionType) => {
    const newCategory: Category = {
      id: `cat-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      icon: '📁',
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const setBudget = (categoryId: string, limit: number) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.categoryId === categoryId);
      if (existing) {
        return prev.map(b => b.categoryId === categoryId ? { ...b, limit } : b);
      }
      return [...prev, { categoryId, limit }];
    });
  };

  const renderView = () => {
    switch (activeView) {
      case 'DASHBOARD':
        return <Dashboard 
          transactions={transactions} 
          categories={categories} 
          budgets={budgets} 
        />;
      case 'TRANSACTIONS':
        return <TransactionList 
          transactions={transactions} 
          categories={categories} 
          onEdit={(t) => { setEditingTransaction(t); setIsFormOpen(true); }}
          onDelete={deleteTransaction}
        />;
      case 'REPORTS':
        return <Reports transactions={transactions} categories={categories} />;
      case 'BUDGETS':
        return <Budgeting 
          transactions={transactions} 
          categories={categories} 
          budgets={budgets} 
          onSetBudget={setBudget}
        />;
      default:
        return <Dashboard transactions={transactions} categories={categories} budgets={budgets} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Wallet className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">FinTrack</h1>
        </div>
        <button 
          onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 flex justify-around items-center shadow-lg z-20">
        <NavButton 
          active={activeView === 'DASHBOARD'} 
          onClick={() => setActiveView('DASHBOARD')}
          icon={<LayoutDashboard />}
          label="Home"
        />
        <NavButton 
          active={activeView === 'TRANSACTIONS'} 
          onClick={() => setActiveView('TRANSACTIONS')}
          icon={<ReceiptText />}
          label="History"
        />
        <NavButton 
          active={activeView === 'REPORTS'} 
          onClick={() => setActiveView('REPORTS')}
          icon={<PieChart />}
          label="Charts"
        />
        <NavButton 
          active={activeView === 'BUDGETS'} 
          onClick={() => setActiveView('BUDGETS')}
          icon={<Sparkles />}
          label="Budgets"
        />
      </nav>

      {/* Transaction Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
              </h2>
              <button 
                onClick={() => { setIsFormOpen(false); setEditingTransaction(null); }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-4 max-h-[80vh] overflow-y-auto">
              <TransactionForm 
                categories={categories}
                onAdd={addTransaction}
                onUpdate={updateTransaction}
                editingTransaction={editingTransaction}
                onAddCategory={addCategory}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-20 py-1 rounded-xl transition-all ${
      active ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6 mb-1' })}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export default App;
