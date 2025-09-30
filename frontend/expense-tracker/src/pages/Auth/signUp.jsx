import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import ProfilePhotoSelect from "../../components/inputs/profilePhotoSelect";
import AuthLayout from "../../components/layouts/authLayout";
import LoadingOverlay from "../../components/loader/loadingOverlay";
import { UserContext } from "../../context/userContext";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { validateEmail } from "../../utils/helper";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your name.");
      return;
    }

    const cleanedEmail = email.trim().toLowerCase();
    if (!validateEmail(cleanedEmail)) {
      setError("Please enter a valid email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");

    // API call sigUp
    try {
      //Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email: cleanedEmail,
        password,
        profileImageUrl,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      } else {
        setError("Registration successful but no token received");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
        setIsLoading(false);
      } else {
        setError("Something went wrong, Please try again.");
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto mt-10 md:mt-10 flex flex-col justify-start">
        <LoadingOverlay isVisible={isLoading} message="Accesso in corso..." />
        <h3 className="text-xl font-semibold text-stone-800">
          Create your Account
        </h3>
        <p className="text-xm text-stone-600 mt-[5px] mb-6">
          Enter today and enter your details below.
        </p>

        <form onSubmit={handleSignUp} className="mb-6">
          <ProfilePhotoSelect image={profilePic} setImage={setProfilePic} />

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                label="Name"
                disabled={isLoading}
                placeholder="Jack"
                type="text"
              />
              <Input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email"
                type="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                disabled={isLoading}
                placeholder="jack@example.com"
              />
            </div>

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              type="password"
              disabled={isLoading}
              placeholder="Minimum 8 characters"
            />
          </div>
          {error && <p className="text-red-500 text-sm my-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg mt-6 hover:bg-stone-500 transition"
            disabled={isLoading}
          >
            {isLoading ? "Accesso in corso..." : "Sign Up"}
          </button>

          <p className="text-[13px] text-stone-800 mt-3">
            Do you already have an account?{" "}
            <Link className="font-medium hover:underline " to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
