import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import AuthLayout from "../../components/layouts/authLayout";
import LoadingOverlay from "../../components/loader/loadingOverlay";
import { UserContext } from "../../context/userContext";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { validateEmail } from "../../utils/helper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");

    //API call login
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
        setIsLoading(false);
      } else {
        setError("Something went wrong. Please try again.");
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 flex flex-col justify-start mt-10 mx-auto">
        <LoadingOverlay isVisible={isLoading} message="Accesso in corso..." />
        <h3 className="text-2xl font-semibold text-stone-800">Welcome</h3>
        <p className="text-xm text-stone-600 mt-[5px] mb-6">
          Enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email"
            type="text"
            disabled={isLoading}
            placeholder="jack@example.com"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            type="password"
            disabled={isLoading}
            placeholder="Minimum 8 characters"
          />

          {error && <p className="text-red-500 text-sm my-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg mt-6 hover:bg-stone-500 transition"
            disabled={isLoading}
          >
            {isLoading ? "Accesso in corso..." : "Login"}
          </button>

          <p className="text-[13px] text-stone-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium hover:underline " to="/signup">
              Register
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
