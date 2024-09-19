// <==================== file for defining the routes ==================>

// importing the required modules
import { Router } from "express";
import userController from "../controller/userController";
import { authenticateUserJwt } from "../middleware/userAuth";
import { upload } from "../middleware/multer";

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

// router for uploading the images
router.patch(
  "/uploads/:id",
  authenticateUserJwt,
  upload.single("image"),
  userController.uploadImage
);

// router for deleting the image
router.delete(
  "/image/:id/:_id",
  authenticateUserJwt,
  userController.deleteImage
);

// router for editing the image
router.patch(
  "/image/edit/:id/:_id",
  authenticateUserJwt,
  upload.single("image"),
  userController.editImage
);

// router for logging out the user
router.get("/logout", authenticateUserJwt, userController.logoutUser);

export default router;
