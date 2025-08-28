import { format } from "date-fns";
import { it } from "date-fns/locale";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useExpenseStore } from "../../store/use-expense-store";
import type { Expense } from "../../types/expense";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface ExpenseCardProps {
  expense: Expense;
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);

  const handleDelete = async () => {
    await deleteExpense(expense._id); //  lo store mostra già il toast
  };

  const formattedDate = format(new Date(expense.date), "PPP", { locale: it });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">
            {expense.description}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            aria-label={`Elimina spesa ${expense.description}`}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-muted-foreground">
            Categoria:{" "}
            <span className="font-medium text-foreground">
              {expense.category}
            </span>
          </CardDescription>
          <p className="text-2xl font-bold mt-2">
            €{expense.amount.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Data:{" "}
            <span className="font-medium text-foreground">{formattedDate}</span>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
