import { BadRequestException, NotFoundException } from "../utils/appError";
import FarmerModel from "../models/farmer.model"; // Ensure correct import path for FarmerModel

// Create a new farmer
export const createFarmerService = async (
  body: {
    fullName: string;
    phoneNumber: string;
    email: string;
    landArea: number;
    memberType: 'farmer' | 'animal rearer';
    avgYieldSoldToMarket: number;
    nationalId: string;
    cooperativeId: string;
  }
) => {
  const { fullName, phoneNumber, email, landArea, memberType, avgYieldSoldToMarket, nationalId, cooperativeId } = body;

  // Check if the farmer already exists using email or nationalId
  const existingFarmer = await FarmerModel.findOne({ $or: [{ nationalId }] });
  if (existingFarmer) {
    throw new BadRequestException("Farmer with this email or national ID already exists.");
  }

  const newFarmer = new FarmerModel({
    fullName,
    phoneNumber,
    email,
    landArea,
    memberType,
    avgYieldSoldToMarket,
    nationalId,
    cooperativeId,
  });

  await newFarmer.save();

  return { newFarmer };
};

// Update a farmer's information
export const updateFarmerService = async (
  farmerId: string,
  body: {
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    landArea?: number;
    memberType?: 'farmer' | 'animal rearer';
    avgYieldSoldToMarket?: number;
    nationalId?: string;
    cooperativeId?: string;
  }
) => {
  const farmer = await FarmerModel.findById(farmerId);
  
  if (!farmer) {
    throw new NotFoundException("Farmer not found");
  }

  const updatedFarmer = await FarmerModel.findByIdAndUpdate(
    farmerId,
    { ...body },
    { new: true }
  );

  if (!updatedFarmer) {
    throw new BadRequestException("Failed to update farmer");
  }

  return { updatedFarmer };
};

// Get all farmers with optional filters and pagination
export const getAllFarmersService = async (
  filters: {
    cooperativeId?: string;
    memberType?: 'farmer' | 'animal rearer';
    keyword?: string;
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  const query: Record<string, any> = {};

  if (filters.cooperativeId) {
    query.cooperativeId = filters.cooperativeId;
  }

  if (filters.memberType) {
    query.memberType = filters.memberType;
  }

  if (filters.keyword && filters.keyword !== undefined) {
    query.fullName = { $regex: filters.keyword, $options: "i" }; // Search by fullName
  }

  // Pagination setup
  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const [farmers, totalCount] = await Promise.all([
    FarmerModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 }) // Sort by creation date (newest first)
      .populate("cooperativeId", "_id name"), // Assuming you have a 'Cooperative' model to populate
    FarmerModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    farmers,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

// Delete a farmer
export const deleteFarmerService = async (farmerId: string) => {
  const farmer = await FarmerModel.findById(farmerId);

  if (!farmer) {
    throw new NotFoundException("Farmer not found");
  }

  await FarmerModel.findByIdAndDelete(farmerId);

  return { message: "Farmer deleted successfully" };
};
