import express from "express";
import multer from "multer";
import { uploadPdf } from "../controllers/upload.controller";
import { authMiddleware } from "../middleware/auth";

const upload = multer({
  fileFilter: (
    _: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF allowed"));
    } else {
      cb(null, true);
    }
  }
});

const router = express.Router();
router.post("/upload", authMiddleware, upload.single("file"), uploadPdf);

export default router;
