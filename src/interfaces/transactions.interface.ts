export interface Transactions {
  balance: Balance;
  transactions: Transaction[];
}

export interface Balance {
  income: number;
  outcome: number;
  total: number;
}

export interface Transaction {
  id: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category_id: string;
  created_at: string;
  updated_at: string;
  category: Category;
}

export interface Category {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}
