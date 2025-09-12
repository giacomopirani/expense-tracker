import express from "express";
import * as groupController from "../controllers/group.controller";
import { verifyJWT } from "../middleware/verifyJWT";

const r = express.Router();

// ===== GESTIONE GRUPPI =====
// Ottieni tutti i gruppi dell'utente
r.get("/", verifyJWT, groupController.getUserGroups);

// Crea un nuovo gruppo
r.post("/", verifyJWT, groupController.createGroup);

// Ottieni dettagli di un gruppo specifico
r.get("/:id", verifyJWT, groupController.getGroup);

// ===== GESTIONE INVITI =====
// Invita un utente al gruppo
r.post("/:id/invite", verifyJWT, groupController.inviteToGroup);

// Annulla un invito
r.delete("/:id/invite", verifyJWT, groupController.cancelInvite);

// Accetta un invito
r.post("/:id/invite/accept", verifyJWT, groupController.acceptInvite);

// Rifiuta un invito
r.post("/:id/invite/reject", verifyJWT, groupController.rejectInvite);

// ===== GESTIONE MEMBRI =====
// Rimuovi un membro dal gruppo
r.delete("/:id/member", verifyJWT, groupController.removeMember);

// Lascia il gruppo
r.post("/:id/leave", verifyJWT, groupController.leaveGroup);

// ===== GESTIONE SPESE =====
// Ottieni tutte le spese del gruppo
r.get("/:id/expenses", verifyJWT, groupController.getGroupExpenses);

// Aggiungi una spesa al gruppo
r.post("/:id/expenses", verifyJWT, groupController.addExpense);

// Elimina una spesa
r.delete("/expenses/:expenseId", verifyJWT, groupController.deleteExpense);

// ===== RIEPILOGO E BILANCI =====
// Ottieni il riepilogo del gruppo con bilanci
r.get("/:id/summary", verifyJWT, groupController.getGroupSummary);

export default r;
