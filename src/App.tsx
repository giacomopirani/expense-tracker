import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/protected-route";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Register from "./pages/register";
import { useAuthStore } from "./store/use-auth-store";

function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Redirect to dashboard if user is already logged in and hits root */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all: puoi fare una 404 page qui */}
        <Route
          path="*"
          element={
            <div className="text-center mt-10 text-2xl">
              404 - Pagina non trovata
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
