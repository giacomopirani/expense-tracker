import { create } from "zustand";
import { ExpenseService } from "../lib/services/expense-service"; // lo aggiungiamo dopo
import type { Expense, ExpenseState } from "../types/expense";

export const useExpenseStore = create<
  ExpenseState & {
    loadExpenses: () => void;
  }
>((set, get) => ({
  expenses: [],

  loadExpenses: () => {
    const loaded = ExpenseService.getExpenses();
    set({ expenses: loaded });
  },

  addExpense: (expense: Expense) => {
    ExpenseService.addExpense(expense);
    set((state) => ({
      expenses: [...state.expenses, expense],
    }));
  },

  deleteExpense: (id: string) => {
    ExpenseService.deleteExpense(id);
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
