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
import { AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { useExpenseStore } from "../../store/use-expense-store";
import { ExpenseCard } from "../expenses/expense-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function ExpenseList() {
  const { expenses, getExpensesByDateRange } = useExpenseStore();
  const [activeTab, setActiveTab] = useState("today"); // 'today', 'week', 'month'

  const filteredExpenses = useMemo(() => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (activeTab) {
      case "today":
        startDate = startOfDay(today);
        endDate = endOfDay(today);
        break;
      case "week":
        startDate = startOfWeek(today, { locale: it }); // Inizia la settimana di lunedì per l'Italia
        endDate = endOfWeek(today, { locale: it });
        break;
      case "month":
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        break;
      default:
        startDate = startOfDay(today);
        endDate = endOfDay(today);
    }

    // Formatta le date per la funzione getExpensesByDateRange dello store
    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");

    return getExpensesByDateRange(formattedStartDate, formattedEndDate);
  }, [expenses, activeTab, getExpensesByDateRange]); // Dipendenze per useMemo

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today" className="hover:cursor-pointer">
            Oggi
          </TabsTrigger>
          <TabsTrigger value="week" className="hover:cursor-pointer">
            Settimana
          </TabsTrigger>
          <TabsTrigger value="month" className="hover:cursor-pointer">
            Mese
          </TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="mt-4">
          {filteredExpenses.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nessuna spesa per oggi.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredExpenses.map((expense) => (
                  <ExpenseCard key={expense._id} expense={expense} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
        <TabsContent value="week" className="mt-4">
          {filteredExpenses.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nessuna spesa per questa settimana.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredExpenses.map((expense) => (
                  <ExpenseCard key={expense._id} expense={expense} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
        <TabsContent value="month" className="mt-4">
          {filteredExpenses.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nessuna spesa per questo mese.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredExpenses.map((expense) => (
                  <ExpenseCard key={expense._id} expense={expense} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
