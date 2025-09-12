import { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

// dichiaralo come RequestHandler così TypeScript accetta l'uso come middleware
export const verifyJWT: RequestHandler = (req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
    return; // importantissimo: return void (non return res)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    // cast qui: Request -> AuthRequest
    (req as AuthRequest).user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    console.error("❌ Errore JWT:", err);
    res.sendStatus(403);
  }
};
