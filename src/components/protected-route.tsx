import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/use-auth-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore();

  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinTimeElapsed(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !isMinTimeElapsed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-800">
        <div className="text-center">
          <img
            src="/src/assets/logo.png"
            alt="App Logo"
            className="h-26 w-26 rounded-full animate-bounce border-2 border-stone-500"
          />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
