import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },

    // campi opzionali di profilo
    bio: { type: String, trim: true, default: "" },
    avatarUrl: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);
