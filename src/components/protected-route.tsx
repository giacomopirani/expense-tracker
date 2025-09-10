import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/use-auth-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore();

  // Mostra loading mentre hydrate() è in corso
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Se non c'è utente (dopo il loading), redirect al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se c'è utente, mostra il contenuto protetto

  return <>{children}</>;
}
