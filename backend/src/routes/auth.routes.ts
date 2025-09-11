import { Router } from "express";
import {
  login,
  me,
  register,
  updateProfile,
} from "../controllers/auth.controller";
import { verifyJWT } from "../middleware/verifyJWT";

const r = Router();
r.post("/register", register);
r.post("/login", login);
r.get("/me", verifyJWT, me);
r.put("/update-profile", verifyJWT, updateProfile);
export default r;
