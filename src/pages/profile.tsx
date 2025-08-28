import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAuthStore } from "../store/use-auth-store";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Nessun utente loggato.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="absolute top-4 left-4 border-2 rounded-xl ">
        <Button
          className="bg-stone-700 hover:bg-stone-500"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-20 w-20 text-amber-50" />
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
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          {user.createdAt && (
            <div>
              <p className="text-sm text-gray-500">Registrato il</p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString("it-IT")}
              </p>
            </div>
          )}

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
