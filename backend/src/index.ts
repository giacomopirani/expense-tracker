import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { verifyJWT } from "./middleware/verifyJWT";
import authRoutes from "./routes/auth.routes";
import expenseRoutes from "./routes/expense.routes";

dotenv.config();

const app = express();
console.log("Server starting...");
app.use(cors());
app.use(express.json()); // 👈 importantissimo per leggere il body JSON

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/expenses", verifyJWT, expenseRoutes); // tutte protette

mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT, () =>
    console.log(`Server on http://localhost:${process.env.PORT}`)
  );
});
