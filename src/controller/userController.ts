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
      console.error("error", error);
      res.status(500).json(error);
    }
  },

  // controller for the signup
  signupUser: async (req: Request, res: Response) => {
    try {
      const { username, email, phone, password } = req.body;
      console.log("username", username);

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
    console.log(req.params._id);
    try {
      const id = req.params._id;
      console.log("inside", id);
      const user = await userModel.findById({ _id: id });
      if (!user) {
        return res.status(400).json("invalid user");
      }
      res.status(202).json({ data: user });
    } catch (error) {
      console.error("error", error);
      res.status(500).json(error);
    }
  },

  // controller for uploading the image
  uploadImage: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { imageName } = req.body;
      const file = req.file
        ? `http://localhost:4000/uploads/img/${req.file.filename}`
        : null;
      console.log(file);
      const user = await userModel.findById({ _id: id });
      if (!user) {
        return res.status(400).json("invalid user");
      }

      const image = {
        title: imageName,
        imageUrl: file,
      };

      const updatedUser = await userModel.findByIdAndUpdate(
        { _id: id },
        { $push: { images: image } },
        { new: true }
      );

      console.log("updated user", updatedUser);

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
      res.status(202).json({ data: updatedUser });
    } catch (error) {
      console.error("error", error);
      res.status(500).json(error);
    }
  },

  // controller for editing the image
  editImage: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const imageId = req.params._id;

      const { imageName } = req.body;
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
      user.images[imageIndex].title = imageName;
      if (file) {
        user.images[imageIndex].imageUrl = file;
      }

      // Save the updated user document
      const updatedUser = await user.save();

      // Return the updated images array
      res.status(200).json({ data: updatedUser });
    } catch (error) {
      console.error("error", error);
    }
  },
};

export default userController;
