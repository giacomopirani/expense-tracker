import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import AuthLayout from "../../components/layouts/authLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {};

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-stone-800">Benvenuto</h3>
        <p className="text-xs text-stone-600 mt-[5px] mb-6">
          Inserisci i tuoi dati per effettuare il login
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            type="text"
            placeholder="giacomopirani@example.com"
          />
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
