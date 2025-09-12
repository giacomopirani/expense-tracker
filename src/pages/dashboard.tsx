import { useEffect, useState } from "react";
import { DashboardSummary } from "../components/dashboard/dashboard-summary";
import { ExpenseChart } from "../components/dashboard/expense-chart";
import { AddExpenseModal } from "../components/expenses/add-expense-modal";
import { ExpenseList } from "../components/expenses/expense-list";
import Navbar from "../components/layout/navbar";
import { useExpenseStore } from "../store/use-expense-store";

import { MonthPicker } from "../components/dashboard/month-picker";

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
      <main className="flex-1 p-4 md:p-6 w-full max-w-full">
        {/* Header responsive */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard Personale</h1>

            {/* Container per i controlli - colonna su mobile, riga da sm in su */}
            <div className="flex flex-col gap-2 items-end sm:flex-row sm:items-center sm:gap-2">
              {/* Selettore mese */}
              <MonthPicker
                value={selectedMonth}
                onChange={setSelectedMonth}
                placeholder="Seleziona mese"
              />

              {/* Pulsante aggiungi spesa */}
              <AddExpenseModal />
            </div>
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
