import type { Expense } from "../../types/expense";

const STORAGE_KEY = "expenses";

function getStoredExpenses(): Expense[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveExpenses(expenses: Expense[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export const ExpenseService = {
  getExpenses(): Expense[] {
    return getStoredExpenses();
  },

  addExpense(expense: Expense): void {
    const current = getStoredExpenses();
    const updated = [expense, ...current];
    saveExpenses(updated);
  },

  deleteExpense(id: string): void {
    const current = getStoredExpenses();
    const updated = current.filter((e) => e.id !== id);
    saveExpenses(updated);
  },

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
