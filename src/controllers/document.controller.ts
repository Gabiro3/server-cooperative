import { Request, Response, NextFunction } from "express";
import {
  getDocumentsService,
  deleteDocumentService,
} from "../services/document.service";

/**
 * Controller to get all documents for a specific cooperative
 */
export const getDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pageSize = 10, pageNumber = 1 } = req.query;
    const { cooperativeId } = req.body;

    if (!cooperativeId) {
      return res.status(400).json({ error: "cooperativeId is required" });
    }

    const data = await getDocumentsService(
      String(cooperativeId),
      Number(pageSize),
      Number(pageNumber)
    );

    res.json(data);
  } catch (error) {
    console.error("Error fetching documents:", error);
    next(error);
  }
};

/**
 * Controller to delete a document by ID and cooperativeId
 */
export const deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { documentId, fileUrl } = req.body;

    if (!documentId || !fileUrl) {
      return res.status(400).json({ error: "documentId and cooperativeId are required" });
    }

    const result = await deleteDocumentService(documentId, fileUrl);
    res.json(result);
  } catch (error) {
    console.error("Error deleting document:", error);
    next(error);
  }
};
