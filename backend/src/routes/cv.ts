/**
 * CV Routes
 */

import { Router } from "express";
import multer from "multer";
import {
  createCV,
  listCVs,
  getCV,
  deleteCV,
  analyzeCV,
  uploadCV,
} from "@/controllers/cv.js";

export const cvRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [".pdf", ".docx"];
    const fileName = file.originalname.toLowerCase();

    const hasAllowedExtension = allowedExtensions.some((extension) =>
      fileName.endsWith(extension),
    );

    if (allowedMimeTypes.includes(file.mimetype) || hasAllowedExtension) {
      callback(null, true);
      return;
    }

    callback(new Error("Only PDF and DOCX files are supported"));
  },
});

cvRouter.post("/cvs", createCV);
cvRouter.post("/cvs/upload", upload.single("file"), uploadCV);
cvRouter.get("/cvs", listCVs);
cvRouter.get("/cvs/:id", getCV);
cvRouter.delete("/cvs/:id", deleteCV);
cvRouter.post("/cvs/:id/analyze", analyzeCV);
