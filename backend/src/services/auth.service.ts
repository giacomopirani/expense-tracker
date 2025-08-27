import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const register = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const { firstName, lastName, email, password } = data;

  // Controllo se l'utente esiste già
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email già registrata");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Creo il nuovo utente
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  await user.save();

  return {
    message: "Registrazione completata con successo",
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
};

export const login = async (data: { email: string; password: string }) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email o password non validi");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Email o password non validi");
  }

  console.log("🔍 === AUTH SERVICE DEBUG ===");
  console.log(
    "JWT_SECRET nel service:",
    JSON.stringify(process.env.JWT_SECRET)
  );
  console.log(
    "JWT_SECRET hash nel service:",
    require("crypto")
      .createHash("md5")
      .update(process.env.JWT_SECRET || "")
      .digest("hex")
  );

  // Genero token JWT
  const token = jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  console.log("✅ Token creato nel service:", token);

  return {
    user: {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
};
