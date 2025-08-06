import { create } from "zustand";
import type { ExpenseState } from "../types/expense";

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [], // Inizializza con un array vuoto di spese

  addExpense: (expense) => {
    set((state) => ({
      expenses: [...state.expenses, expense],
    }));
  },

  deleteExpense: (id) => {
    set((state) => ({
      expenses: state.expenses.filter((expense) => expense.id !== id),
    }));
  },

  getExpensesByDateRange: (startDate, endDate) => {
    const allExpenses = get().expenses;
    const start = new Date(startDate);
    const end = new Date(endDate);

    return allExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });
  },
}));
