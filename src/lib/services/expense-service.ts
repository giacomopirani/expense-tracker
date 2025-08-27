// src/lib/services/expense-service.ts
import type { CreateExpense, Expense } from "../../types/expense";

const base = "/api/expenses"; // oppure la tua base url

export const ExpenseService = {
  async list(): Promise<Expense[]> {
    const res = await fetch(base);
    if (!res.ok) throw new Error(`Failed to list expenses: ${res.status}`);
    return (await res.json()) as Expense[];
  },

  async add(payload: CreateExpense): Promise<Expense> {
    const res = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to add expense: ${res.status} ${text}`);
    }
    return (await res.json()) as Expense;
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${base}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Failed to delete expense ${id}`);
  },
};

export default ExpenseService; // opzionale se vuoi default export
