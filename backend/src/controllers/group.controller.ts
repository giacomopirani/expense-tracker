import { Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../middleware/verifyJWT";
import { Expense } from "../models/expense.group";
import { Group } from "../models/group";
import { computeNetBalances, simplifyDebts } from "../utils/balances";

/**
 * Crea un nuovo gruppo
 */
export async function createGroup(req: AuthRequest, res: Response) {
  try {
    const userId = new Types.ObjectId(req.user!.id);

    const group = new Group({
      name: req.body.name,
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
    res.status(201).json(group);
  } catch (err: any) {
    console.error("❌ createGroup error:", err);
    res.status(500).json({ message: "Errore nella creazione del gruppo" });
  }
}

/**
 * Invita un utente al gruppo
 */
export async function inviteToGroup(req: AuthRequest, res: Response) {
  try {
    const groupId = new Types.ObjectId(req.params.id);
    const userId = new Types.ObjectId(req.user!.id);
    const inviteeId = new Types.ObjectId(req.body.userId);

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // solo owner/admin possono invitare
    if (!group.members.some((m) => m.userId.equals(userId))) {
      return res.status(403).json({ message: "Not authorized" });
    }

    group.invites.push({
      userId: inviteeId,
      invitedAt: new Date(),
    } as any);

    await group.save();
    res.json(group);
  } catch (err: any) {
    console.error("❌ inviteToGroup error:", err);
    res.status(500).json({ message: "Errore nell'invitare l'utente" });
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
    if (!group) return res.status(404).json({ message: "Group not found" });

    // controlla se c'è l'invito
    const inviteIndex = group.invites.findIndex((i: any) =>
      i.userId.equals(userId)
    );
    if (inviteIndex === -1) {
      return res.status(400).json({ message: "No invite found" });
    }

    // aggiungi ai membri
    group.members.push({
      userId,
      role: "member",
      joinedAt: new Date(),
    });

    // rimuovi invito
    group.invites.splice(inviteIndex, 1);

    await group.save();
    res.json(group);
  } catch (err: any) {
    console.error("❌ acceptInvite error:", err);
    res.status(500).json({ message: "Errore nell'accettare l'invito" });
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

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.members.some((m) => m.userId.equals(userId))) {
      return res.status(403).json({ message: "Not a member" });
    }

    if (splits && splits.length) {
      const sum = splits.reduce(
        (s: number, it: any) => s + Number(it.amountCents),
        0
      );
      if (sum !== totalCents) {
        return res.status(400).json({ message: "Splits do not sum to total" });
      }
    }

    const expense = new Expense({
      groupId,
      payerId: new Types.ObjectId(payerId),
      totalCents,
      participants: participants.map((p: string) => new Types.ObjectId(p)),
      splits:
        splits?.map((s: any) => ({
          userId: new Types.ObjectId(s.userId),
          amountCents: s.amountCents,
        })) || [],
      description,
      date: date ? new Date(date) : new Date(),
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err: any) {
    console.error("❌ addExpense error:", err);
    res.status(500).json({ message: "Errore nell'aggiungere la spesa" });
  }
}

/**
 * Riepilogo spese del gruppo
 */
export async function getGroupSummary(req: AuthRequest, res: Response) {
  try {
    const groupId = new Types.ObjectId(req.params.id);
    const userId = new Types.ObjectId(req.user!.id);

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.members.some((m) => m.userId.equals(userId))) {
      return res.status(403).json({ message: "Not a member" });
    }

    const expenses = await Expense.find({ groupId }).lean();

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
    const txs = simplifyDebts(balances);

    res.json({ balances, settlements: txs, expensesCount: expenses.length });
  } catch (err: any) {
    console.error("❌ getGroupSummary error:", err);
    res.status(500).json({ message: "Errore nel riepilogo spese" });
  }
}
export const getGroupExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const groupId = req.params.id; // <-- `:id` arriva da qui
    const userId = req.user?.id; // <-- `req.user` arriva dal verifyJWT

    // qui metti la logica per fetchare le spese
    const expenses: never[] = []; // esempio

    return res.status(200).json(expenses);
  } catch (err) {
    return res.status(500).json({ message: "Errore nel recupero spese", err });
  }
};
