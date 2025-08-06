export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string; // Formato 'YYYY-MM-DD' per semplicità di confronto
};

export type ExpenseState = {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  getExpensesByDateRange: (startDate: string, endDate: string) => Expense[];
};
