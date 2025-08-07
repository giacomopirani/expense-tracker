import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/use-auth-store";

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const success = login(email, password);
    if (success) navigate("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <input
        className="border w-full p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border w-full p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-black text-white px-4 py-2">
        Entra
      </button>
    </form>
  );
}
