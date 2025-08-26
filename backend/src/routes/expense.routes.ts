import { Router } from "express";
import { create, list, remove } from "../controllers/expense.controller";

const r = Router();
r.get("/", list);
r.post("/", create);
r.delete("/:id", remove);
export default r;
