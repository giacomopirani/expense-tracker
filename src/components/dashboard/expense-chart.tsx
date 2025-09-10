import { useMemo } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useExpenseStore } from "../../store/use-expense-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

import { endOfMonth, format, startOfMonth } from "date-fns";
import type { Expense } from "../../types/expense";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF1957",
  "#19FFD4",
];

type ExpenseChartProps = {
  selectedMonth: Date | null;
};

export function ExpenseChart({ selectedMonth }: ExpenseChartProps) {
  const expenses = useExpenseStore((state) => state.expenses);
  const getExpensesByDateRange = useExpenseStore(
    (state) => state.getExpensesByDateRange
  );

  const data = useMemo(() => {
    const today = selectedMonth ?? new Date();

    const monthExpenses: Expense[] = getExpensesByDateRange(
      format(startOfMonth(today), "yyyy-MM-dd"),
      format(endOfMonth(today), "yyyy-MM-dd")
    );

    const categoryTotals: Record<string, number> = {};
    monthExpenses.forEach((expense) => {
      const category = expense.category || "Senza categoria";
      categoryTotals[category] =
        (categoryTotals[category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses, getExpensesByDateRange, selectedMonth]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Spese per Categoria</CardTitle>
        <CardDescription>
          Ripartizione delle spese di questo mese.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        {data.length === 0 ? (
          <p className="text-muted-foreground">
            Nessuna spesa da visualizzare nel grafico.
          </p>
        ) : (
          <ChartContainer
            config={{
              ...Object.fromEntries(
                data.map((item, index) => [
                  item.name.toLowerCase().replace(/\s/g, "-"),
                  { label: item.name, color: COLORS[index % COLORS.length] },
                ])
              ),
            }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                >
                  {data.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="name" />}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
