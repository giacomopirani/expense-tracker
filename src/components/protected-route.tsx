import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/use-auth-store";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  return user ? children : <Navigate to="/login" />;
}
