import type { Expense } from "../../types/expense";
import api from "../api/client";

export const ExpenseService = {
  async list(): Promise<Expense[]> {
    const { data } = await api.get("/expenses");
    return data;
  },
  async add(payload: Omit<Expense, "id" | "userId">): Promise<Expense> {
    const { data } = await api.post("/expenses", payload);
    return data;
  },
  async remove(id: string) {
    await api.delete(`/expenses/${id}`);
  },
};
