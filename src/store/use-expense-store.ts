import { create } from "zustand";
import { ExpenseService } from "../lib/services/expense-service";
import type { Expense } from "../types/expense";

type ExpenseState = {
  expenses: Expense[];
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, "id" | "userId">) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
};

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],

  fetchExpenses: async () => {
    const expenses = await ExpenseService.getExpenses();
    set({ expenses });
  },

  addExpense: async (expense) => {
    const newExpense = await ExpenseService.addExpense(expense);
    set((s) => ({ expenses: [...s.expenses, newExpense] }));
  },

  deleteExpense: async (id) => {
    await ExpenseService.deleteExpense(id);
    set((s) => ({
      expenses: s.expenses.filter((e) => e.id !== id),
    }));
  },
}));
