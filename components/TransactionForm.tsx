
import React, { useState, useEffect } from 'react';
import { Transaction, Category, TransactionType } from '../types';
import { Calendar, Tag, CreditCard, Type as TypeIcon, PlusCircle } from 'lucide-react';

interface TransactionFormProps {
  categories: Category[];
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onUpdate: (t: Transaction) => void;
  onAddCategory: (name: string, type: TransactionType) => void;
  editingTransaction: Transaction | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  categories, onAdd, onUpdate, editingTransaction, onAddCategory 
}) => {
  const [type, setType] = useState<TransactionType>(editingTransaction?.type || TransactionType.EXPENSE);
  const [amount, setAmount] = useState<string>(editingTransaction?.amount.toString() || '');
  const [categoryId, setCategoryId] = useState<string>(editingTransaction?.categoryId || '');
  const [description, setDescription] = useState<string>(editingTransaction?.description || '');
  const [date, setDate] = useState<string>(
    editingTransaction?.date ? new Date(editingTransaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategoryId(editingTransaction.categoryId);
      setDescription(editingTransaction.description);
      setDate(new Date(editingTransaction.date).toISOString().split('T')[0]);
    }
  }, [editingTransaction]);

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) return;

    const data = {
      type,
      amount: parseFloat(amount),
      categoryId,
      description,
      date: new Date(date).toISOString(),
    };

    if (editingTransaction) {
      onUpdate({ ...data, id: editingTransaction.id });
    } else {
      onAdd(data);
    }
  };

  const handleAddCategory = () => {
    if (newCatName.trim()) {
      onAddCategory(newCatName.trim(), type);
      setNewCatName('');
      setIsAddingCat(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type Selector */}
      <div className="flex p-1 bg-gray-100 rounded-xl">
        <button
          type="button"
          onClick={() => setType(TransactionType.EXPENSE)}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            type === TransactionType.EXPENSE 
              ? 'bg-white text-rose-600 shadow-sm' 
              : 'text-gray-500'
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType(TransactionType.INCOME)}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            type === TransactionType.INCOME 
              ? 'bg-white text-emerald-600 shadow-sm' 
              : 'text-gray-500'
          }`}
        >
          Income
        </button>
      </div>

      {/* Amount Input */}
      <div className="space-y-2 text-center">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</label>
        <div className="relative">
          <span className="absolute left-1/2 -translate-x-[110%] top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full text-center text-5xl font-bold bg-transparent border-none focus:ring-0 text-gray-800 placeholder:text-gray-200"
            required
            autoFocus
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* Category Picker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
              <Tag className="w-4 h-4" /> Category
            </label>
            <button 
              type="button"
              onClick={() => setIsAddingCat(true)}
              className="text-xs font-bold text-blue-600 flex items-center gap-1"
            >
              <PlusCircle className="w-3 h-3" /> New Category
            </button>
          </div>

          {isAddingCat && (
            <div className="flex gap-2 mb-2 animate-in fade-in slide-in-from-top-1">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name..."
                className="flex-1 text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                type="button"
                onClick={handleAddCategory}
                className="bg-blue-600 text-white px-3 rounded-lg text-sm font-bold"
              >
                Add
              </button>
              <button 
                type="button"
                onClick={() => setIsAddingCat(false)}
                className="bg-gray-200 text-gray-600 px-3 rounded-lg text-sm font-bold"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                  categoryId === cat.id 
                    ? 'border-blue-500 bg-blue-50 text-blue-600' 
                    : 'border-gray-50 bg-gray-50 text-gray-500'
                }`}
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className="text-[10px] font-bold text-center truncate w-full">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date Input */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
            <Calendar className="w-4 h-4" /> Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-xl p-3 text-gray-800 font-medium"
            required
          />
        </div>

        {/* Description Input */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
            <TypeIcon className="w-4 h-4" /> Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this for?"
            className="w-full bg-gray-50 border-none rounded-xl p-3 text-gray-800 font-medium placeholder:text-gray-300"
          />
        </div>
      </div>

      <button
        type="submit"
        className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all active:scale-[0.98] ${
          type === TransactionType.INCOME ? 'bg-emerald-500 shadow-emerald-200' : 'bg-blue-600 shadow-blue-200'
        }`}
      >
        {editingTransaction ? 'Update Transaction' : 'Save Transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;
