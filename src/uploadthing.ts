import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import mongoose from "mongoose";
import DocumentModel from "./models/document.model";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

// Configure multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

export const uploadDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { cooperativeId, uploadedBy } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(cooperativeId)) {
      return res.status(400).json({ error: "Invalid cooperativeId or uploadedBy" });
    }

    const file = req.file;
    const fileName = file.originalname;
    const contentType = file.mimetype;
    const fileBuffer = file.buffer;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("cooperative") // Ensure this is the correct bucket name
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: false,
      });

    if (error) throw new Error(`Supabase Upload Failed: ${error.message}`);

    const fileId = data.path; // Path acts as file ID in Supabase
    const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/cooperative/${fileName}`;

    // Save document details in MongoDB
    const newDocument = new DocumentModel({
      fileId,
      fileUrl,
      cooperativeId,
      uploadedBy,
    });

    await newDocument.save();

    res.json({
      message: "File uploaded successfully",
      file: {
        fileId,
        fileUrl,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    next(error);
  }
};

export const getAllFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, error } = await supabase.storage
        .from("cooperative") // Change this to your bucket name
        .list("", { limit: 100, offset: 0, sortBy: { column: "created_at", order: "desc" } });
  
      if (error) throw new Error(`Failed to fetch files: ${error.message}`);
  
      const files = data.map(file => ({
        name: file.name,
        url: `${process.env.SUPABASE_URL}/storage/v1/object/public/cooperative/${file.name}`,
        createdAt: file.created_at,
      }));
  
      res.json({ files });
    } catch (error) {
      console.error("Fetch error:", error);
      next(error);
    }
  };
  