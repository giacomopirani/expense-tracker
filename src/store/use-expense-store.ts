import { create } from "zustand";
import { ExpenseService } from "../lib/services/expense-service";
import type { Expense } from "../types/expense";

type State = {
  expenses: Expense[];
  fetchAll: () => Promise<void>;
  add: (e: Omit<Expense, "id" | "userId">) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useExpenseStore = create<State>((set) => ({
  expenses: [],
  fetchAll: async () => {
    const list = await ExpenseService.list();
    set({ expenses: list });
  },
  add: async (e) => {
    const created = await ExpenseService.add(e);
    set((s) => ({ expenses: [created, ...s.expenses] }));
  },
  remove: async (id) => {
    await ExpenseService.remove(id);
    set((s) => ({
      expenses: s.expenses.filter((x) => x._id !== id && x.id !== id),
    }));
  },
}));
