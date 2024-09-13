// <================= file to start the server ==================>

// importing the required modules
import app from "./app";
import { connection } from "./config/database";
import dotenv from "dotenv";
dotenv.config();

// defining the port
const port = process.env.PORT;

// starting the server
const startServer = async () => {
  try {
    await connection();
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  } catch (error) {
    console.error("error", error);
  }
};

startServer();
