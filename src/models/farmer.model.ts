import mongoose, { Document, Schema } from 'mongoose';

export interface FarmerDocument extends Document {
  fullName: string;
  phoneNumber: string;
  email: string;
  landArea: number;
  memberType: 'farmer' | 'animal rearer';
  avgYieldSoldToMarket: number;
  nationalId: string;
  cooperativeId: mongoose.Types.ObjectId;
  joinedDate: Date;
}

const farmerSchema = new Schema<FarmerDocument>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    landArea: {
      type: Number,
      required: true, // Assuming this is a required field
    },
    memberType: {
      type: String,
      enum: ['farmer', 'animal rearer'],
      required: true,
    },
    avgYieldSoldToMarket: {
      type: Number,
      required: true, // Assuming this is a required field
    },
    nationalId: {
      type: String,
      required: true,
      unique: true,
    },
    cooperativeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace', // Reference to the Cooperative model
      required: true,
    },
    joinedDate: {
      type: Date,
      default: Date.now, // Automatically set to current date if not provided
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Create the farmer model
const FarmerModel = mongoose.model<FarmerDocument>('Farmer', farmerSchema);

export default FarmerModel;
