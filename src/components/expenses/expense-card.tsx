import { format } from "date-fns";
import { it } from "date-fns/locale"; // Importa la locale italiana
import { Trash2 } from "lucide-react";
import { useExpenseStore } from "../../store/expense-store";
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

  const handleDelete = () => {
    deleteExpense(expense.id);
  };

  // Formatta la data per la visualizzazione
  const formattedDate = format(new Date(expense.date), "PPP", { locale: it });

  return (
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
        <p className="text-2xl font-bold mt-2">€{expense.amount.toFixed(2)}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Data:{" "}
          <span className="font-medium text-foreground">{formattedDate}</span>
        </p>
      </CardContent>
    </Card>
  );
}
