import { Response } from "express";
import User from "../models/user";

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id; // preso da verifyJWT
    const { firstName, lastName, bio, avatarUrl } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, bio, avatarUrl },
      { new: true, runValidators: true }
    ).select("-password"); // escludo la password

    res.json(updatedUser);
  } catch (err: any) {
    console.error("❌ Update profile error:", err);
    res.status(500).json({ message: "Errore aggiornamento profilo" });
  }
};
