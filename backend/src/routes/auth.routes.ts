import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller";
import { verifyJWT } from "../middleware/verifyJWT";

const r = Router();
r.post("/register", register);
r.post("/login", login);
r.get("/me", verifyJWT, me);
export default r;
