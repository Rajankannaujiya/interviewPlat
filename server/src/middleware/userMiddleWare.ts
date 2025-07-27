import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"


export const userMiddleWare: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const token = JSON.parse(req.headers.authorization?.split(" ")[1]!);

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
    return
  }
};
