import { ArrowBigLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // 👈 importa sonner
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAuthStore } from "../store/use-auth-store";

export default function ProfilePage() {
  const { user, token, setUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Nessun utente loggato.</p>
      </div>
    );
  }

  const handleUpdate = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password: password || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUser(data.user); // aggiorna lo stato globale

      // ✅ toast di successo
      toast.success("Profilo aggiornato con successo!");
    } catch (err: any) {
      // ❌ toast di errore
      toast.error(err.message || "Errore durante l'aggiornamento del profilo");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="absolute top-4 left-4 border-2 rounded-xl ">
        <Button
          className="bg-stone-700 hover:bg-stone-500"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowBigLeft className="h-20 w-20 text-amber-50" />
        </Button>
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Profilo Utente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Nome</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Cognome</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">
              Nuova Password (opzionale)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <Button onClick={handleUpdate} className="w-full mt-4">
            Aggiorna Profilo
          </Button>

          <Button
            onClick={logout}
            variant="destructive"
            className="w-full mt-6"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
