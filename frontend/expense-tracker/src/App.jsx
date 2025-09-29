import { Toaster } from "react-hot-toast";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { LoadingProvider } from "./context/loaderContext";
import UserProvider from "./context/userContext";
import Login from "./pages/Auth/login";
import SignUp from "./pages/Auth/signUp";
import Expense from "./pages/Dashboard/expense";
import Home from "./pages/Dashboard/home";
import Income from "./pages/Dashboard/income";

const App = () => {
  return (
    <UserProvider>
      <LoadingProvider>
        <div>
          <Router>
            <Routes>
              <Route path="/" element={<Root />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/income" element={<Income />} />
              <Route path="/expense" element={<Expense />} />
            </Routes>
          </Router>
        </div>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </LoadingProvider>
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
