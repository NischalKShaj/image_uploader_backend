// <==================== file for defining the routes ==================>

// importing the required modules
import { Router } from "express";
import userController from "../controller/userController";
import { authenticateUserJwt } from "../middleware/userAuth";

//creating the router
const router = Router();

// router for getting the initial page
router.get("/", userController.getHome);

// router for sign-up
router.post("/signup", userController.signupUser);

// router for login
router.post("/login", userController.loginUser);

// router for getting the home
router.get("/user-home/:_id", authenticateUserJwt, userController.getUserPage);

export default router;
