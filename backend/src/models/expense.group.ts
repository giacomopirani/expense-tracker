import { Document, Schema, Types, model } from "mongoose";

export interface ISplit {
  userId: Types.ObjectId;
  amountCents: number; // amount owed by this user in cents
}

export interface IExpense extends Document {
  groupId: Types.ObjectId;
  payerId: Types.ObjectId; // chi ha pagato
  totalCents: number; // in cents
  currency: string;
  description?: string;
  date: Date;
  participants: Types.ObjectId[]; // utenti coinvolti
  splits: ISplit[]; // se presente, override equal split
  createdAt: Date;
  receiptUrl?: string;
}

const SplitSchema = new Schema<ISplit>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  amountCents: { type: Number, required: true },
});

const ExpenseSchema = new Schema<IExpense>({
  groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  payerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  totalCents: { type: Number, required: true },
  currency: { type: String, default: "EUR" },
  description: String,
  date: { type: Date, default: Date.now },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  splits: { type: [SplitSchema], default: [] },
  receiptUrl: String,
  createdAt: { type: Date, default: Date.now },
});

ExpenseSchema.index({ groupId: 1 });
ExpenseSchema.index({ payerId: 1 });

export const Expense = model<IExpense>("Expense", ExpenseSchema);
