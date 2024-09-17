// <================== file to generate the token =============>

// importing the required modules
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// generating the token
export const generateToken = (user: { email: string }) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("No secret key was provided");
  }

  // Only pass necessary user data to the token payload (e.g., id and email)
  const tokenPayload = {
    email: user.email,
  };

  // Generate and return the token
  return jwt.sign(tokenPayload, secret, { expiresIn: "4h" });
};
