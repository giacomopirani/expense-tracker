import { Router } from "express";
import { updateProfile } from "../controllers/user.controller";
import { verifyJWT } from "../middleware/verifyJWT";

const r = Router();

// protetto da JWT
r.put("/profile", verifyJWT, updateProfile);

export default r;
