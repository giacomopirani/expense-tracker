import { create } from "zustand";
import { ExpenseService } from "../lib/services/expense-service";
import type { CreateExpense, Expense } from "../types/expense";

type State = {
  expenses: Expense[];
  fetchAll: () => Promise<void>;
  addExpense: (e: CreateExpense) => Promise<void>; // ✅ qui usa CreateExpense
  remove: (id: string) => Promise<void>;
  getExpensesByDateRange: (start: string, end: string) => Expense[];
};

export const useExpenseStore = create<State>((set, get) => ({
  expenses: [],
  fetchAll: async () => {
    const list = await ExpenseService.list();
    set({ expenses: list });
  },
  addExpense: async (e) => {
    const created = await ExpenseService.add(e);
    set((s) => ({ expenses: [created, ...s.expenses] }));
  },
  remove: async (id) => {
    await ExpenseService.remove(id);
    set((s) => ({
      expenses: s.expenses.filter((x) => x._id !== id && x.id !== id),
    }));
  },
  getExpensesByDateRange: (start, end) => {
    const { expenses } = get();
    return expenses.filter((e) => e.date >= start && e.date <= end);
  },
}));
