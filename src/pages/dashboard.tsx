import { AddExpenseModal } from "../components/expenses/add-expense-modal";
import Navbar from "../components/layout/navbar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <AddExpenseModal />
        </div>
        {/* Qui andranno i tuoi totali, grafici, ecc. */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-muted/50 rounded-lg p-4 h-48 flex items-center justify-center text-muted-foreground">
            Totali e Grafici
          </div>
          <div className="bg-muted/50 rounded-lg p-4 h-48 flex items-center justify-center text-muted-foreground">
            Sezione Spese
          </div>
          <div className="bg-muted/50 rounded-lg p-4 h-48 flex items-center justify-center text-muted-foreground">
            Altre Informazioni
          </div>
        </div>
      </main>
    </div>
  );
}
