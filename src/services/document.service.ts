import mongoose from "mongoose";
import DocumentModel from "../models/document.model";
import { NotFoundException } from "../utils/appError";

/**
 * Fetch documents for a specific cooperative with pagination
 * @param cooperativeId - The ID of the cooperative
 * @param pageSize - Number of documents per page
 * @param pageNumber - Current page number
 * @returns Paginated documents data
 */
export const getDocumentsService = async (
  cooperativeId: string,
  pageSize: number,
  pageNumber: number
) => {
  const totalCount = await DocumentModel.countDocuments({
    cooperativeId: cooperativeId,
  });

  const skip = (pageNumber - 1) * pageSize;

  const documents = await DocumentModel.find({
    cooperativeId: cooperativeId,
  })
    .skip(skip)
    .limit(pageSize)
    .sort({ uploadedDate: -1 });

  const totalPages = Math.ceil(totalCount / pageSize);

  return { documents, totalCount, totalPages, skip };
};

/**
 * Delete a document by documentId and cooperativeId
 * @param documentId - The ID of the document
 * @param cooperativeId - The ID of the cooperative
 */
export const deleteDocumentService = async (
  documentId: string,
  fileUrl: string
) => {
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new NotFoundException("Invalid document ID");
  }

  const document = await DocumentModel.findOneAndDelete({
    _id: documentId,
    fileUrl: fileUrl,
  });

  if (!document) {
    throw new NotFoundException(
      "Document not found or does not belong to the cooperative"
    );
  }

  return { message: "Document deleted successfully" };
};
