import type { CreateExpense, Expense } from "../../types/expense";

const BASE_URL = "http://localhost:5001/api/expenses";

// Funzione helper per ottenere il token correttamente
const getToken = (): string | null => {
  const authData = localStorage.getItem("auth");
  if (!authData) return null;

  try {
    const parsed = JSON.parse(authData);
    return parsed.token || null;
  } catch (error) {
    console.error("Errore parsing auth data:", error);
    return null;
  }
};

export const ExpenseService = {
  list: async (): Promise<Expense[]> => {
    const token = getToken(); // ← Usa la funzione helper

    const res = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch expenses: ${res.status} ${res.statusText}`
      );
    }

    return res.json();
  },

  add: async (expense: CreateExpense): Promise<Expense> => {
    const token = getToken(); // ← Usa la funzione helper

    if (!token) {
      throw new Error("Token di autenticazione non trovato");
    }

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(expense),
    });

    if (!res.ok) {
      throw new Error(`Failed to add expense: ${res.status} ${res.statusText}`);
    }

    return res.json();
  },

  remove: async (id: string): Promise<void> => {
    const token = getToken(); // ← Usa la funzione helper

    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to delete expense: ${res.status} ${res.statusText}`
      );
    }
  },
};
