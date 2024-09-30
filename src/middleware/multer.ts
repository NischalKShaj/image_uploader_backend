// <======================== file for implementing multer ================>

// importing the required modules
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

// defining the allowed file types
const allowedFileType = /jpeg|jpg|png/;

// for storing the image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/img"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// image type and image size validation
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const extname = allowedFileType.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileType.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({ storage: storage, fileFilter: fileFilter });
