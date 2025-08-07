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

// Colori statici per le categorie (puoi espanderli o generarli dinamicamente)
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF1957",
  "#19FFD4",
];

export function ExpenseChart() {
  const expenses = useExpenseStore((state) => state.expenses);

  const data = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach((expense) => {
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.keys(categoryTotals).map((category) => ({
      name: category,
      value: categoryTotals[category],
    }));
  }, [expenses]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Spese per Categoria</CardTitle>
        <CardDescription>
          Una ripartizione delle tue spese per categoria.
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
              // Configurazione colori per ChartTooltipContent (opzionale, ma utile per coerenza)
              ...Object.fromEntries(
                data.map((item, index) => [
                  item.name.toLowerCase().replace(/\s/g, "-"), // Genera una chiave CSS valida
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
                  fill="#8884d8"
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
