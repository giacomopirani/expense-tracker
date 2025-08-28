import { toast } from "sonner"; // 👈 importa qui
import { create } from "zustand";
import { ExpenseService } from "../lib/services/expense-service";
import type { CreateExpense, Expense } from "../types/expense";

type State = {
  expenses: Expense[];
  fetchAll: () => Promise<void>;
  addExpense: (e: CreateExpense) => Promise<void>;
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

    toast.success("Spesa aggiunta correttamente", {
      description: `"${created.description}" per €${created.amount.toFixed(2)}`,
    });
  },

  deleteExpense: async (id: string) => {
    try {
      await ExpenseService.remove(id);
      set((state) => ({
        expenses: state.expenses.filter((e) => e._id !== id), // 👈 usa _id
      }));

      toast.success("Spesa eliminata correttamente 🗑️");
    } catch (err) {
      console.error("Errore durante eliminazione:", err);
      toast.error("Errore durante l'eliminazione della spesa ❌");
    }
  },

  getExpensesByDateRange: (start, end) => {
    const { expenses } = get();

    return expenses.filter((e) => {
      const expenseDate = e.date.split("T")[0];
      return expenseDate >= start && expenseDate <= end;
    });
  },
}));
