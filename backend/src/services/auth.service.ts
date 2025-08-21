import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type User = { id: string; email: string; password: string };

const users: User[] = []; // TEMPORANEO

export const register = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const existing = users.find((u) => u.email === email);
  if (existing) throw new Error("Email already in use");

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: String(users.length + 1), email, password: hashed };
  users.push(user);

  return { id: user.id, email: user.email };
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );

  return { user: { id: user.id, email: user.email }, token };
};
