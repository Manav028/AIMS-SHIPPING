import express from "express";
import multer from "multer";
import { uploadPdf } from "../controllers/upload.controller";

const upload = multer({
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDFs allowed"));
    }
    cb(null, true);
  }
});

const router = express.Router();
router.post("/upload", upload.single("file"),uploadPdf);

export default router;
