import { Response } from "express";
import { AuthRequest } from "../middleware/verifyJWT";
import Expense from "../models/expense";

export const list = async (req: AuthRequest, res: Response) => {
  const expenses = await Expense.find({ userId: req.user!.id }).sort({
    date: -1,
  });
  res.json(expenses);
};

export const create = async (req: AuthRequest, res: Response) => {
  const { description, amount, category, date } = req.body;
  const e = await Expense.create({
    userId: req.user!.id,
    description,
    amount,
    category,
    date: new Date(date),
  });
  res.status(201).json(e);
};

export const remove = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const e = await Expense.findOneAndDelete({ _id: id, userId: req.user!.id });
  if (!e) return res.sendStatus(404);
  res.sendStatus(204);
};
