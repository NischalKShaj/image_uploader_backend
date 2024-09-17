// <====================== file for user authentication ==============>

// importing the required modules
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../model/userModel";
dotenv.config();

// creating the authentication middleware
export const authenticateUserJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies.access_token || req.headers["authorization"] || null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const actualToken = token.startsWith("Bearer ")
    ? token.slice(7, token.length)
    : token;

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("No secret key was provided");
  }

  try {
    const decoded = jwt.verify(actualToken, secret) as IUser;
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    return res.status(401).json({ message: "Invalid Token" });
  }
};
