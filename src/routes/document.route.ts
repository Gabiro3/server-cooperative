import { Router } from "express";
import { getDocuments, deleteDocument } from "../controllers/document.controller"; // Ensure the correct import path

const documentRoutes = Router();

// Route to get all documents for a specific workspace
documentRoutes.get(
  "/documents",
  async (req, res, next) => {
    try {
      await getDocuments(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

// Route to delete a document by ID in a specific workspace
documentRoutes.delete(
  "/workspace/:workspaceId/documents/:id",
  async (req, res, next) => {
    try {
      await deleteDocument(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

export default documentRoutes;
