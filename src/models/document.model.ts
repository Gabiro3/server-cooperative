import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface UploadedDocument extends Document {
  uuid: string;
  fileId: string;
  fileUrl: string;
  cooperativeId: mongoose.Types.ObjectId;
  uploadedBy: string;
  uploadedDate: Date;
}

const documentSchema = new Schema<UploadedDocument>(
  {
    uuid: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    fileId: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    cooperativeId: {
      type: Schema.Types.ObjectId,
      ref: "Cooperative",
      required: true,
    },
    uploadedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const DocumentModel = mongoose.model<UploadedDocument>("Document", documentSchema);
export default DocumentModel;
