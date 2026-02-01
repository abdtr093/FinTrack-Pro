
import React, { useState } from 'react';
import { Search, Edit2, Trash2, SlidersHorizontal } from 'lucide-react';
import { Transaction, Category, TransactionType } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, categories, onEdit, onDelete 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');

  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categories.find(c => c.id === t.categoryId)?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const groupedByDate = filtered.reduce((acc, t) => {
    const dateStr = new Date(t.date).toLocaleDateString(undefined, { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="sticky top-14 bg-gray-50 z-10 py-2 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-none rounded-2xl shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2">
          {(['ALL', TransactionType.EXPENSE, TransactionType.INCOME] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filterType === type 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-500 border border-gray-100'
              }`}
            >
              {type === 'ALL' ? 'All' : type === TransactionType.EXPENSE ? 'Expenses' : 'Income'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedByDate).length > 0 ? (
          // Added explicit type cast to resolve the 'unknown' type error for 'items'
          (Object.entries(groupedByDate) as [string, Transaction[]][]).map(([date, items]) => (
            <div key={date} className="space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">{date}</h3>
              <div className="space-y-2">
                {items.map(t => {
                  const category = categories.find(c => c.id === t.categoryId);
                  return (
                    <div key={t.id} className="group flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${category?.color}15` }}
                      >
                        {category?.icon || '❓'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm truncate">{t.description || category?.name}</h4>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{category?.name}</p>
                      </div>
                      <div className={`font-bold text-sm ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-gray-800'}`}>
                        {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit(t)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDelete(t.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium">No matches found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
