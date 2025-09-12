import express from "express";
import * as groupController from "../controllers/group.controller";
import { verifyJWT } from "../middleware/verifyJWT";

const router = express.Router();

router.post("/", verifyJWT, groupController.createGroup);
router.post("/:id/invite", verifyJWT, groupController.inviteToGroup);
router.post("/:id/invite/accept", verifyJWT, groupController.acceptInvite);
router.get("/:id/expenses", verifyJWT, groupController.getGroupExpenses);
router.post("/:id/expenses", verifyJWT, groupController.addExpense);
router.get("/:id/summary", verifyJWT, groupController.getGroupSummary);

export default router;
