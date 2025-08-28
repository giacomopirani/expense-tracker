import { create } from "zustand";
import { ExpenseService } from "../lib/services/expense-service";
import type { CreateExpense, Expense } from "../types/expense";

type State = {
  expenses: Expense[];
  fetchAll: () => Promise<void>;
  addExpense: (e: CreateExpense) => Promise<void>; // ✅ qui usa CreateExpense
  deleteExpense: (id: string) => Promise<void>;
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
  deleteExpense: async (id: string) => {
    try {
      await ExpenseService.remove(id);
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
        message: "La tua spesa è stata eliminata correttamente ✅",
      }));
    } catch (err) {
      console.error("Errore durante eliminazione:", err);
    }
  },

  getExpensesByDateRange: (start, end) => {
    const { expenses } = get();

    return expenses.filter((e) => {
      // Estrai solo la parte della data (YYYY-MM-DD)
      const expenseDate = e.date.split("T")[0]; // Rimuove l'orario se presente
      return expenseDate >= start && expenseDate <= end;
    });
  },
}));
