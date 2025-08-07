import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { it } from "date-fns/locale"; // Importa la locale italiana
import { Calendar, ChartNoAxesCombined } from "lucide-react";
import { useMemo } from "react";
import { useExpenseStore } from "../../store/use-expense-store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function DashboardSummary() {
  const expenses = useExpenseStore((state) => state.expenses);
  const { getExpensesByDateRange } = useExpenseStore();

  const { totalToday, totalWeek, totalMonth } = useMemo(() => {
    const today = new Date();

    // Totale Oggi
    const expensesToday = getExpensesByDateRange(
      format(startOfDay(today), "yyyy-MM-dd"),
      format(endOfDay(today), "yyyy-MM-dd")
    );
    const totalToday = expensesToday.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Totale Settimana
    const expensesWeek = getExpensesByDateRange(
      format(startOfWeek(today, { locale: it }), "yyyy-MM-dd"),
      format(endOfWeek(today, { locale: it }), "yyyy-MM-dd")
    );
    const totalWeek = expensesWeek.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Totale Mese
    const expensesMonth = getExpensesByDateRange(
      format(startOfMonth(today), "yyyy-MM-dd"),
      format(endOfMonth(today), "yyyy-MM-dd")
    );
    const totalMonth = expensesMonth.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return { totalToday, totalWeek, totalMonth };
  }, [expenses, getExpensesByDateRange]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Spese Oggi</CardTitle>
          <span className="text-muted-foreground">
            <Calendar size={20} />
          </span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{totalToday.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Totale delle spese registrate oggi.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Spese Settimana</CardTitle>
          <span className="text-muted-foreground">
            <Calendar size={20} />
          </span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{totalWeek.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Totale delle spese registrate questa settimana.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Spese Mese</CardTitle>
          <span className="text-muted-foreground">
            <ChartNoAxesCombined size={20} />
          </span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{totalMonth.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Totale delle spese registrate questo mese.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
