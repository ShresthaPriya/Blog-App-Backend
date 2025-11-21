import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface User {
  id: number;
  role: string;
}

export interface JwtPayload extends User {
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const JWT_SECRET: string = process.env.JWT_SECRET || "supersecret";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];


  try {
    const decoded = jwt.verify(token!, JWT_SECRET) as unknown as JwtPayload;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
