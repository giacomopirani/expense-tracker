import { useEffect, useState } from "react";
import { DashboardSummary } from "../components/dashboard/dashboard-summary";
import { ExpenseChart } from "../components/dashboard/expense-chart";
import { AddExpenseModal } from "../components/expenses/add-expense-modal";
import { ExpenseList } from "../components/expenses/expense-list";
import Navbar from "../components/layout/navbar";
import { useExpenseStore } from "../store/use-expense-store";

// 📅 libreria shadcn/ui
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

export default function DashboardPage() {
  const { fetchAll } = useExpenseStore();

  const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date());

  useEffect(() => {
    fetchAll().catch((error) => {
      console.error("❌ Errore caricamento spese:", error);
    });
  }, [fetchAll]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            {/* Selettore mese */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {selectedMonth
                    ? selectedMonth.toLocaleDateString("it-IT", {
                        month: "long",
                        year: "numeric",
                      })
                    : "Seleziona mese"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={selectedMonth || undefined}
                  onSelect={(date) => setSelectedMonth(date ?? null)}
                />
              </PopoverContent>
            </Popover>

            <AddExpenseModal />
          </div>
        </div>

        {/* Riepilogo Dashboard */}
        <section className="mb-8">
          <DashboardSummary selectedMonth={selectedMonth} />
        </section>

        {/* Grafico Spese */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Analisi Spese</h2>
          <ExpenseChart selectedMonth={selectedMonth} />
        </section>

        {/* Lista Spese */}
        <section>
          <h2 className="text-xl font-bold mb-4">Le tue Spese</h2>
          <ExpenseList selectedMonth={selectedMonth} />
        </section>
      </main>
    </div>
  );
}
