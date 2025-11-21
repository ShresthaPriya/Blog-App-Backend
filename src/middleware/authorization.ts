import type { Request, Response, NextFunction } from "express";

export const authorize =
  (...allowedRoles: string[]) => //rest parameter where we can send multiple roles
  (req: Request, res: Response, next: NextFunction) => {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data found" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied!" });
    }

    next();
  };
