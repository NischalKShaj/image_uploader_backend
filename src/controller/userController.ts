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
      res.status(202).json(user);
    } catch (error) {
      console.error("error", error);
      res.status(500).json(error);
    }
  },
};

export default userController;
