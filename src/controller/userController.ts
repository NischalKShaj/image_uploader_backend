// <============================ file to define the user controller ===============>

// importing the required modules
import { Request, Response } from "express";
import userModel from "../model/userModel";
import bcrypt, { compare, hashSync } from "bcryptjs";
import { generateToken } from "../middleware/generateToken";

// creating the controller for the user

const userController = {
  // controller for getting the home page
  getHome: async (req: Request, res: Response) => {
    try {
      res.status(202).json("home page");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // controller for the signup
  signupUser: async (req: Request, res: Response) => {
    try {
      const { username, email, phone, password } = req.body;

      const existingUser = await userModel.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json("user already exists");
      }

      const hashedPassword = hashSync(password, 10);

      const newUser = new userModel({
        username,
        email,
        phone,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json("user created");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // controller for login for the user
  loginUser: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email: email });

      if (!user) {
        return res.status(400).json("invalid user");
      }

      const matchPassword = compare(password, user.password);
      if (!matchPassword) {
        return res.status(400).json("invalid user");
      }

      const token = generateToken({ email: user.email });
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(202)
        .json({ data: user, token: token });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // controller for getting the user homepage
  getUserPage: async (req: Request, res: Response) => {
    try {
      const id = req.params._id;
      const user = await userModel.findById({ _id: id });
      if (!user) {
        return res.status(400).json("invalid user");
      }
      res.status(202).json({ data: user });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  uploadImage: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const imageNames = req.body.imageNames; // Ensure this is correctly parsed
      const imageOrders = req.body.imageOrders; // Get the orders from request body

      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json("No files uploaded");
      }

      if (
        !imageNames ||
        imageNames.length !== req.files.length ||
        !imageOrders ||
        imageOrders.length !== req.files.length
      ) {
        return res
          .status(400)
          .json(
            "Image names and orders must match the number of files uploaded"
          );
      }

      const user = await userModel.findById({ _id: id });
      if (!user) {
        return res.status(400).json("Invalid user");
      }

      // Get current images and determine the highest existing order
      const currentImages = user.images || [];
      const highestOrder = currentImages.reduce(
        (max, image) => Math.max(max, image.order),
        -1
      );

      const images = (req.files as Express.Multer.File[]).map(
        (file, index) => ({
          title: imageNames[index] || "Untitled", // Fallback to "Untitled" if the name is missing
          imageUrl: `http://localhost:4000/uploads/img/${file.filename}`,
          order: highestOrder + 1 + index, // Start from highest order + 1
        })
      );
      const updatedUser = await userModel.findByIdAndUpdate(
        { _id: id },
        { $push: { images: { $each: images } } },
        { new: true }
      );

      res.status(201).json({ data: updatedUser });
    } catch (error) {
      console.error("error", error);
      res.status(500).json(error);
    }
  },

  // controller for deleting the image
  deleteImage: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const imageId = req.params._id;
      const updatedUser = await userModel.findByIdAndUpdate(
        { _id: id },
        { $pull: { images: { _id: imageId } } },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(400).json("invalid user");
      }

      // Reorder remaining images after deletion
      const reorderedImages = updatedUser.images
        .sort((a, b) => a.order - b.order) // Sort by current order
        .map((image, index) => ({
          _id: image._id,
          title: image.title,
          imageUrl: image.imageUrl,
          order: index, // Reassign order based on the new index
        }));

      // Update the user's images with reordered list
      updatedUser.images = reorderedImages;
      await updatedUser.save();

      res.status(202).json({ data: updatedUser });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // controller for editing the image
  editImage: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const imageId = req.params._id;

      const { imageNames } = req.body;
      const file = req.file
        ? `http://localhost:4000/uploads/img/${req.file.filename}`
        : null;

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Find the image index within the images array
      const imageIndex = user.images.findIndex(
        (img) => img._id.toString() === imageId
      );
      if (imageIndex === -1) {
        return res.status(404).json({ message: "Image not found" });
      }

      // Update the image
      user.images[imageIndex].title = imageNames;
      if (file) {
        user.images[imageIndex].imageUrl = file;
      }

      // Save the updated user document
      const updatedUser = await user.save();

      // Return the updated images array
      res.status(200).json({ data: updatedUser });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // controller for image rearranging
  rearrangeImage: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { reorderedIds } = req.body;

      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update the order of images
      reorderedIds.forEach((id: any, index: number) => {
        const image = user.images.find((img) => img._id.toString() === id);
        if (image) {
          image.order = index;
        }
      });

      // Sort the images array based on the new order
      user.images.sort((a, b) => a.order - b.order);

      await user.save();

      res.status(200).json({
        message: "Image order updated successfully",
        images: user.images,
      });
    } catch (error) {
      console.error("Error updating image order:", error);
      res.status(500).json({ message: "Failed to update image order" });
    }
  },

  // controller for user logout
  logoutUser: async (req: Request, res: Response) => {
    try {
      res.clearCookie("access_token").status(202).json("user logged out");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default userController;
