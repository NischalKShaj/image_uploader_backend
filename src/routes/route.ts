// <==================== file for defining the routes ==================>

// importing the required modules
import { Router, Request, Response } from "express";

//creating the router
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json("inside");
});

export default router;
