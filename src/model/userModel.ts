// <================ file to create the schema for the user ================>

// importing the required modules
import { Document, Schema, model } from "mongoose";

// creating the interface for the schema
interface IImage {
  title: string;
  imageUrl: string;
  order: number;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  images: IImage[];
  createdAt: Date;
}

// creating the schema
const userSchema: Schema<IUser> = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  images: [
    {
      title: {
        type: String,
      },
      imageUrl: {
        type: String,
      },
      order: {
        type: Number,
        default: 0,
      },
    },
  ],
});

// creating the models for the schema
const userModel = model<IUser>("user", userSchema);

export default userModel;
