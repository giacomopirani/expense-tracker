import { Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../middleware/verifyJWT";
import { Expense } from "../models/expense.group";
import { Group } from "../models/group";
import { User } from "../models/user"; // Assumendo che esporti User dal model
import { computeNetBalances, simplifyDebts } from "../utils/balances";

/**
 * Crea un nuovo gruppo
 */
export async function createGroup(req: AuthRequest, res: Response) {
  try {
    const userId = new Types.ObjectId(req.user!.id);
    const { name } = req.body;

    // Validazione input
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Nome del gruppo richiesto" });
    }

    const group = new Group({
      name: name.trim(),
      createdBy: userId,
      members: [
        {
          userId,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
      invites: [],
    });

    await group.save();

    // Popola i dati utente per la risposta
    await group.populate("members.userId", "firstName lastName email");

    res.status(201).json(group);
  } catch (err: any) {
    console.error("❌ createGroup error:", err);
    res.status(500).json({ message: "Errore nella creazione del gruppo" });
  }
}

/**
 * Ottiene tutti i gruppi dell'utente
 */
export async function getUserGroups(req: AuthRequest, res: Response) {
  try {
    const userId = new Types.ObjectId(req.user!.id);

    const groups = await Group.find({
      "members.userId": userId,
    })
      .populate("members.userId", "firstName lastName email")
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (err: any) {
    console.error("❌ getUserGroups error:", err);
    res.status(500).json({ message: "Errore nel recupero dei gruppi" });
  }
}

/**
 * Ottiene dettagli di un gruppo specifico
 */
export async function getGroup(req: AuthRequest, res: Response) {
  try {
    const groupId = new Types.ObjectId(req.params.id);
    const userId = new Types.ObjectId(req.user!.id);

    const group = await Group.findById(groupId)
      .populate("members.userId", "firstName lastName email")
      .populate("invites.userId", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");

    if (!group) {
      return res.status(404).json({ message: "Gruppo non trovato" });
    }

    // Verifica che l'utente sia membro
    if (!group.members.some((m) => m.userId._id.equals(userId))) {
      return res
        .status(403)
        .json({ message: "Non sei membro di questo gruppo" });
    }

    res.json(group);
  } catch (err: any) {
    console.error("❌ getGroup error:", err);
    res.status(500).json({ message: "Errore nel recupero del gruppo" });
  }
}

/**
 * Invita un utente al gruppo (può essere per email o userId)
 */
export async function inviteToGroup(req: AuthRequest, res: Response) {
  try {
    const groupId = new Types.ObjectId(req.params.id);
    const userId = new Types.ObjectId(req.user!.id);
    const { userId: inviteeId, email } = req.body;

    // Deve fornire o userId o email
    if (!inviteeId && !email) {
      return res.status(400).json({ message: "userId o email richiesto" });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Gruppo non trovato" });

    // Solo owner/admin possono invitare
    const member = group.members.find((m) => m.userId.equals(userId));
    if (!member || (member.role !== "owner" && member.role !== "admin")) {
      return res
        .status(403)
        .json({ message: "Solo owners/admin possono invitare" });
    }

    let targetUserId: Types.ObjectId;

    if (inviteeId) {
      targetUserId = new Types.ObjectId(inviteeId);
    } else {
      // Cerca utente per email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({ message: "Utente non trovato" });
      }
      targetUserId = user._id as Types.ObjectId;
    }

    // Verifica che non sia già membro
    if (group.members.some((m) => m.userId.equals(targetUserId))) {
      return res
        .status(400)
        .json({ message: "L'utente è già membro del gruppo" });
    }

    // Verifica che non ci sia già un invito
    if (group.invites.some((i: any) => i.userId.equals(targetUserId))) {
      return res.status(400).json({ message: "Invito già inviato" });
    }

    group.invites.push({
      userId: targetUserId,
      invitedAt: new Date(),
    } as any);

    await group.save();
    await group.populate("invites.userId", "firstName lastName email");

    res.json(group);
  } catch (err: any) {
    console.error("❌ inviteToGroup error:", err);
    res.status(500).json({ message: "Errore nell'invitare l'utente" });
  }
}

/**
 * Annulla un invito al gruppo
 */
export async function cancelInvite(req: AuthRequest, res: Response) {
  try {
    const groupId = new Types.ObjectId(req.params.id);
    const userId = new Types.ObjectId(req.user!.id);
    const { inviteeId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Gruppo non trovato" });

    // Solo owner/admin possono annullare inviti
    const member = group.members.find((m) => m.userId.equals(userId));
    if (!member || (member.role !== "owner" && member.role !== "admin")) {
      return res.status(403).json({ message: "Non autorizzato" });
    }

    const inviteIndex = group.invites.findIndex((i: any) =>
      i.userId.equals(new Types.ObjectId(inviteeId))
    );

    if (inviteIndex === -1) {
      return res.status(404).json({ message: "Invito non trovato" });
    }

    group.invites.splice(inviteIndex, 1);
    await group.save();

    res.json({ message: "Invito annullato" });
  } catch (err: any) {
    console.error("❌ cancelInvite error:", err);
    res.status(500).json({ message: "Errore nell'annullare l'invito" });
  }
}

/**
 * Accetta un invito al gruppo
 */
export async function acceptInvite(req: AuthRequest, res: Response) {
  try {
    const groupId = new Types.ObjectId(req.params.id);
    const userId = new Types.ObjectId(req.user!.id);

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Gruppo non trovato" });

    // Controlla se c'è l'invito
    const inviteIndex = group.invites.findIndex((i: any) =>
      i.userId.equals(userId)
    );
    if (inviteIndex === -1) {
      return res.status(400).json({ message: "Nessun invito trovato" });
    }

    // Verifica che non sia già membro (safety check)
    if (group.members.some((m) => m.userId.equals(userId))) {
      return res.status(400).json({ message: "Già membro del gruppo" });
    }

    // Aggiungi ai membri
    group.members.push({
      userId,
      role: "member",
      joinedAt: new Date(),
    });

    // Rimuovi invito
    group.invites.splice(inviteIndex, 1);

    await group.save();
    await group.populate("members.userId", "firstName lastName email");

    res.json(group);
  } catch (err: any) {
    console.error("❌ acceptInvite error:", err);
    res.status(500).json({ message: "Errore nell'accettare l'invito" });
  }
}

/**
 * Rifiuta un invito al gruppo
 */
export async function rejectInvite(req: AuthRequest, res: Response) {
  try {
    const groupId = new Types.ObjectId(req.params.id);
    const userId = new Types.ObjectId(req.user!.id);

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Gruppo non trovato" });

    const inviteIndex = group.invites.findIndex((i: any) =>
      i.userId.equals(userId)
    );

    if (inviteIndex === -1) {
      return res.status(400).json({ message: "Nessun invito trovato" });
    }

    group.invites.splice(inviteIndex, 1);
    await group.save();

    res.json({ message: "Invito rifiutato" });
  } catch (err: any) {
    console.error("❌ rejectInvite error:", err);
    res.status(500).json({ message: "Errore nel rifiutare l'invito" });
  }
}

/**
 * Rimuove un membro dal gruppo
 */
export async function removeMember(req: AuthRequest, res: Response) {
  try {
    const groupId = new Types.ObjectId(req.params.id);
    const userId = new Types.ObjectId(req.user!.id);
    const { memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Gruppo non trovato" });

    const requester = group.members.find((m) => m.userId.equals(userId));
    if (!requester || requester.role !== "owner") {
      return res
        .status(403)
        .json({ message: "Solo il proprietario può rimuovere membri" });
    }

    const memberToRemove = group.members.find((m) =>
      m.userId.equals(new Types.ObjectId(memberId))
    );

    if (!memberToRemove) {
      return res.status(404).json({ message: "Membro non trovato" });
    }

    if (memberToRemove.role === "owner") {
      return res
        .status(400)
        .json({ message: "Non puoi rimuovere il proprietario" });
    }

    // Rimuovi il membro
    group.members = group.members.filter(
      (m) => !m.userId.equals(new Types.ObjectId(memberId))
    );

    await group.save();
    res.json({ message: "Membro rimosso dal gruppo" });
  } catch (err: any) {
    console.error("❌ removeMember error:", err);
    res.status(500).json({ message: "Errore nella rimozione del membro" });
  }
}

/**
 * Lascia il gruppo
 */
export async function leaveGroup(req: AuthRequest, res: Response) {
  try {
    const groupId = new Types.ObjectId(req.params.id);
    const userId = new Types.ObjectId(req.user!.id);

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Gruppo non trovato" });

    const member = group.members.find((m) => m.userId.equals(userId));
    if (!member) {
      return res
        .status(400)
        .json({ message: "Non sei membro di questo gruppo" });
    }

    if (member.role === "owner") {
      return res.status(400).json({
        message:
          "Il proprietario non può lasciare il gruppo. Trasferisci la proprietà prima.",
      });
    }

    // Rimuovi l'utente dal gruppo
    group.members = group.members.filter((m) => !m.userId.equals(userId));
    await group.save();

    res.json({ message: "Hai lasciato il gruppo" });
  } catch (err: any) {
    console.error("❌ leaveGroup error:", err);
    res.status(500).json({ message: "Errore nel lasciare il gruppo" });
  }
}

/**
 * Aggiunge una spesa al gruppo
 */
export async function addExpense(req: AuthRequest, res: Response) {
  try {
    const groupId = new Types.ObjectId(req.params.id);
    const userId = new Types.ObjectId(req.user!.id);

    const { payerId, totalCents, participants, splits, description, date } =
      req.body;

    // Validazione input
    if (!payerId || !totalCents || !participants || participants.length === 0) {
      return res.status(400).json({
        message: "payerId, totalCents e participants sono richiesti",
      });
    }

    if (totalCents <= 0) {
      return res
        .status(400)
        .json({ message: "L'importo deve essere maggiore di 0" });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Gruppo non trovato" });

    if (!group.members.some((m) => m.userId.equals(userId))) {
      return res
        .status(403)
        .json({ message: "Non sei membro di questo gruppo" });
    }

    // Verifica che il pagatore sia membro del gruppo
    const memberIds = group.members.map((m) => m.userId.toString());
    if (!memberIds.includes(payerId)) {
      return res
        .status(400)
        .json({ message: "Il pagatore deve essere membro del gruppo" });
    }

    // Verifica che tutti i partecipanti siano membri del gruppo
    for (const participantId of participants) {
      if (!memberIds.includes(participantId)) {
        return res.status(400).json({
          message: "Tutti i partecipanti devono essere membri del gruppo",
        });
      }
    }

    let finalSplits;

    if (splits && splits.length > 0) {
      // Validazione splits custom
      const sum = splits.reduce(
        (s: number, it: any) => s + Number(it.amountCents),
        0
      );
      if (sum !== totalCents) {
        return res
          .status(400)
          .json({ message: "La somma degli splits non corrisponde al totale" });
      }

      // Verifica che tutti gli userId negli splits siano nei participants
      for (const split of splits) {
        if (!participants.includes(split.userId)) {
          return res.status(400).json({
            message:
              "Tutti gli utenti negli splits devono essere nei participants",
          });
        }
      }

      finalSplits = splits.map((s: any) => ({
        userId: new Types.ObjectId(s.userId),
        amountCents: s.amountCents,
      }));
    } else {
      // Divisione equa automatica
      const splitAmount = Math.floor(totalCents / participants.length);
      const remainder = totalCents % participants.length;

      finalSplits = participants.map(
        (participantId: string, index: number) => ({
          userId: new Types.ObjectId(participantId),
          amountCents: splitAmount + (index < remainder ? 1 : 0),
        })
      );
    }

    const expense = new Expense({
      groupId,
      payerId: new Types.ObjectId(payerId),
      totalCents,
      participants: participants.map((p: string) => new Types.ObjectId(p)),
      splits: finalSplits,
      description: description || "",
      date: date ? new Date(date) : new Date(),
    });

    await expense.save();

    // Popola per la risposta
    await expense.populate([
      { path: "payerId", select: "firstName lastName email" },
      { path: "participants", select: "firstName lastName email" },
      { path: "splits.userId", select: "firstName lastName email" },
    ]);

    res.status(201).json(expense);
  } catch (err: any) {
    console.error("❌ addExpense error:", err);
    res.status(500).json({ message: "Errore nell'aggiungere la spesa" });
  }
}

/**
 * Ottiene tutte le spese del gruppo
 */
export const getGroupExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const groupId = new Types.ObjectId(req.params.id);
    const userId = new Types.ObjectId(req.user!.id);

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Gruppo non trovato" });

    if (!group.members.some((m) => m.userId.equals(userId))) {
      return res
        .status(403)
        .json({ message: "Non sei membro di questo gruppo" });
    }

    const expenses = await Expense.find({ groupId })
      .populate("payerId", "firstName lastName email")
      .populate("participants", "firstName lastName email")
      .populate("splits.userId", "firstName lastName email")
      .sort({ date: -1 });

    return res.status(200).json(expenses);
  } catch (err) {
    console.error("❌ getGroupExpenses error:", err);
    return res.status(500).json({ message: "Errore nel recupero spese" });
  }
};

/**
 * Elimina una spesa
 */
export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { expenseId } = req.params;
    const userId = new Types.ObjectId(req.user!.id);

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Spesa non trovata" });
    }

    const group = await Group.findById(expense.groupId);
    if (!group) return res.status(404).json({ message: "Gruppo non trovato" });

    // Solo il pagatore o un admin/owner possono eliminare la spesa
    const member = group.members.find((m) => m.userId.equals(userId));
    const canDelete =
      expense.payerId.equals(userId) ||
      (member && (member.role === "owner" || member.role === "admin"));

    if (!canDelete) {
      return res.status(403).json({
        message: "Solo il pagatore o un admin può eliminare questa spesa",
      });
    }

    await Expense.findByIdAndDelete(expenseId);
    res.json({ message: "Spesa eliminata" });
  } catch (err) {
    console.error("❌ deleteExpense error:", err);
    res.status(500).json({ message: "Errore nell'eliminare la spesa" });
  }
};

/**
 * Riepilogo spese del gruppo con bilanci
 */
export async function getGroupSummary(req: AuthRequest, res: Response) {
  try {
    const groupId = new Types.ObjectId(req.params.id);
    const userId = new Types.ObjectId(req.user!.id);

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Gruppo non trovato" });

    if (!group.members.some((m) => m.userId.equals(userId))) {
      return res
        .status(403)
        .json({ message: "Non sei membro di questo gruppo" });
    }

    const expenses = await Expense.find({ groupId }).lean();

    if (expenses.length === 0) {
      return res.json({
        balances: {},
        settlements: [],
        expensesCount: 0,
        totalSpent: 0,
      });
    }

    const simple = expenses.map((e) => ({
      payerId: e.payerId.toString(),
      totalCents: e.totalCents,
      participants: (e.participants || []).map((p: any) => p.toString()),
      splits: (e.splits || []).map((s: any) => ({
        userId: s.userId.toString(),
        amountCents: s.amountCents,
      })),
    }));

    const balances = computeNetBalances(simple);
    const settlements = simplifyDebts(balances);
    const totalSpent = expenses.reduce((sum, e) => sum + e.totalCents, 0);

    res.json({
      balances,
      settlements,
      expensesCount: expenses.length,
      totalSpent,
    });
  } catch (err: any) {
    console.error("❌ getGroupSummary error:", err);
    res.status(500).json({ message: "Errore nel riepilogo spese" });
  }
}
