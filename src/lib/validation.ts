import { z } from "zod";

export const expenseSchema = z.object({
  description: z.string(),
  amount: z.number(),
  category: z.string(),
  date: z.date(),
});
export type ExpenseFormValues = z.infer<typeof expenseSchema>;
