export type Expense = {
  _id: string;
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  userId: string; // chiave esterna per collegare l'utente
};

export type ExpenseState = {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  getExpensesByDateRange: (startDate: Date, endDate: Date) => Expense[];
};

export type CreateExpense = Omit<Expense, "_id" | "id" | "userId">;
