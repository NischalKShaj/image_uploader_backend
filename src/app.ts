// <=================== file to start the server ==================>

// importing the required modules
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import router from "./routes/route";
dotenv.config();

// creating the app
const app = express();

// for the parsing the data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enabling the cookie-parser
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// setting the routes
app.use("/", router);

// // 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Not Found" });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
