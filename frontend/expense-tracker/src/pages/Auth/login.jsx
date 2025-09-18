import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import AuthLayout from "../../components/layouts/authLayout";
import { validateEmail } from "../../utils/helper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Per favore inserisci un'email valida.");
      return;
    }

    if (!password) {
      setError("Per favore inserisci la password.");
      return;
    }

    setError("");

    //API call login
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 flex flex-col justify-start mt-10 mx-auto">
        <h3 className="text-2xl font-semibold text-stone-800">Benvenuto</h3>
        <p className="text-xm text-stone-600 mt-[5px] mb-6">
          Inserisci i tuoi dati per effettuare il login
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email"
            type="text"
            placeholder="giacomopirani@example.com"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            type="password"
            placeholder="Minimo 8 caratteri"
          />

          {error && <p className="text-red-500 text-sm my-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg mt-6 hover:bg-stone-500 transition"
          >
            Login
          </button>

          <p className="text-[13px] text-stone-800 mt-3">
            Non hai un account?{" "}
            <Link className="font-medium hover:underline " to="/signup">
              Clicca qui
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
