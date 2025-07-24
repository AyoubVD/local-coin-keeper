import { useState, useEffect } from 'react';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', color: '#10b981' },
  { id: '2', name: 'Utilities', color: '#3b82f6' },
  { id: '3', name: 'Transport', color: '#f59e0b' },
  { id: '4', name: 'Entertainment', color: '#8b5cf6' },
  { id: '5', name: 'Healthcare', color: '#ef4444' },
  { id: '6', name: 'Shopping', color: '#06b6d4' },
  { id: '7', name: 'Other', color: '#6b7280' },
];

const STORAGE_KEY = 'costTracker';

interface StorageData {
  expenses: Expense[];
  categories: Category[];
  income: number;
}

export const useExpenseStore = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [income, setIncome] = useState(5000);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: StorageData = JSON.parse(stored);
        setExpenses(data.expenses || []);
        setCategories(data.categories || DEFAULT_CATEGORIES);
        setIncome(data.income || 5000);
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    const data: StorageData = {
      expenses,
      categories,
      income,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [expenses, categories, income]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, ...updates } : expense
    ));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updates } : category
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  const getCurrentMonthExpenses = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
  };

  const getMonthlyTotal = (month: number, year: number) => {
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getCategoryTotals = () => {
    const currentMonthExpenses = getCurrentMonthExpenses();
    const totals: Record<string, number> = {};
    
    currentMonthExpenses.forEach(expense => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    });
    
    return totals;
  };

  return {
    expenses,
    categories,
    income,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    setIncome,
    getCurrentMonthExpenses,
    getMonthlyTotal,
    getCategoryTotals,
  };
};