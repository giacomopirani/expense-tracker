import { useEffect } from "react";
import { DashboardSummary } from "../components/dashboard/dashboard-summary";
import { ExpenseChart } from "../components/dashboard/expense-chart";
import { AddExpenseModal } from "../components/expenses/add-expense-modal";
import { ExpenseList } from "../components/expenses/expense-list";
import Navbar from "../components/layout/navbar";
import { useExpenseStore } from "../store/use-expense-store";

export default function DashboardPage() {
  const { fetchAll } = useExpenseStore();

  // ← Aggiungi questo useEffect
  useEffect(() => {
    console.log("🔍 Dashboard mounted - caricando spese dal database");
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
          <AddExpenseModal />
        </div>

        {/* Riepilogo Dashboard */}
        <section className="mb-8">
          <DashboardSummary />
        </section>

        {/* Grafico Spese */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Analisi Spese</h2>
          <ExpenseChart />
        </section>

        {/* Lista Spese */}
        <section>
          <h2 className="text-xl font-bold mb-4">Le tue Spese</h2>
          <ExpenseList />
        </section>
      </main>
    </div>
  );
}
