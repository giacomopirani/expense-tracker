import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import ProfilePhotoSelect from "../../components/inputs/profilePhotoSelect";
import AuthLayout from "../../components/layouts/authLayout";
import { validateEmail } from "../../utils/helper";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Per favore inserisci il tuo nome");
      return;
    }

    if (!validateEmail(email)) {
      setError("Per favore inserisci una email valida.");
    }

    if (!password) {
      setError("Per favore inserisci la password");
      return;
    }

    setError("");

    // API call signp
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-stone-800">
          Crea il tuo Account
        </h3>
        <p className="text-xm text-stone-600 mt-[5px] mb-6">
          Entra oggi e inserisci i tuoi dettagli qui sotto.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelect image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Nome"
              placeholder="Giacomo"
              type="text"
            />
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email"
              type="text"
              placeholder="giacomopirani@example.com"
            />

            <div className="col-span-2">
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                type="password"
                placeholder="Minimo 8 caratteri"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm my-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg mt-6 hover:bg-stone-500 transition"
          >
            Sign Up
          </button>

          <p className="text-[13px] text-stone-800 mt-3">
            Possiedi già un account?{" "}
            <Link className="font-medium hover:underline " to="/login">
              Clicca qui
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
