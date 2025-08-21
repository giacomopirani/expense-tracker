import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller";
import { verifyJWT } from "../middleware/verifyJWT";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyJWT, me);

export default router;
