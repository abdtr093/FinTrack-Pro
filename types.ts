
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string; // ISO string
}

export interface Budget {
  categoryId: string;
  limit: number;
}

export type ViewType = 'DASHBOARD' | 'TRANSACTIONS' | 'REPORTS' | 'BUDGETS';
