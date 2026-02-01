
import { Category, TransactionType } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Salary', icon: '💰', type: TransactionType.INCOME, color: '#10b981' },
  { id: 'cat-2', name: 'Freelance', icon: '💻', type: TransactionType.INCOME, color: '#3b82f6' },
  { id: 'cat-3', name: 'Gifts', icon: '🎁', type: TransactionType.INCOME, color: '#8b5cf6' },
  { id: 'cat-4', name: 'Food', icon: '🍔', type: TransactionType.EXPENSE, color: '#f59e0b' },
  { id: 'cat-5', name: 'Rent', icon: '🏠', type: TransactionType.EXPENSE, color: '#ef4444' },
  { id: 'cat-6', name: 'Transport', icon: '🚗', type: TransactionType.EXPENSE, color: '#6366f1' },
  { id: 'cat-7', name: 'Entertainment', icon: '🍿', type: TransactionType.EXPENSE, color: '#ec4899' },
  { id: 'cat-8', name: 'Utilities', icon: '⚡', type: TransactionType.EXPENSE, color: '#06b6d4' },
  { id: 'cat-9', name: 'Shopping', icon: '🛍️', type: TransactionType.EXPENSE, color: '#8b5cf6' },
];
