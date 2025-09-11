import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.register(req.body);
    res.json(user);
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await AuthService.login(req.body);
    res.json({ user, token });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const me = async (req: Request, res: Response) => {
  res.json((req as any).user);
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // preso da verifyJWT
    const updatedUser = await AuthService.updateProfile(userId, req.body);
    res.json({ user: updatedUser });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
