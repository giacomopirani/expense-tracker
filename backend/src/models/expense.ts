import { model, Schema, Types } from "mongoose";

const ExpenseSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default model("Expense", ExpenseSchema);
