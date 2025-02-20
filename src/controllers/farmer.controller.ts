import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  createFarmerSchema,
  updateFarmerSchema,
  farmerIdSchema,
} from "../validation/farmer.validation"; // Ensure you have the validation schemas
import {
  createFarmerService,
  deleteFarmerService,
  getAllFarmersService,
  updateFarmerService,
} from "../services/farmer.service"; // Ensure the correct import path for farmer service
import { HTTPSTATUS } from "../config/http.config";

// Create a new farmer
export const createFarmerController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.headers["userid"] as string;
    
    // Validate request body
    const body = createFarmerSchema.parse(req.body);
    const workspaceId = req.params.workspaceId;

    const { newFarmer } = await createFarmerService({
      ...body,
      avgYieldSoldToMarket: parseFloat(body.avgYieldSoldToMarket),
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Farmer created successfully",
      farmer: newFarmer,
    });
  }
);

// Update an existing farmer
export const updateFarmerController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.headers["userid"] as string;

    // Validate request body
    const body = updateFarmerSchema.parse(req.body);

    const farmerId = farmerIdSchema.parse(req.params.id);
    const workspaceId = req.params.workspaceId;

    const { updatedFarmer } = await updateFarmerService(farmerId, {
      ...body,
      avgYieldSoldToMarket: body.avgYieldSoldToMarket ? parseFloat(body.avgYieldSoldToMarket) : undefined,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Farmer updated successfully",
      farmer: updatedFarmer,
    });
  }
);

// Get all farmers with filters and pagination
export const getAllFarmersController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.headers["userid"] as string;

    const workspaceId = req.params.workspaceId;

    const filters = {
      cooperativeId: req.query.cooperativeId as string | undefined,
      memberType: req.query.memberType as "farmer" | "animal rearer" | undefined,
      keyword: req.query.keyword as string | undefined,
    };

    const pagination = {
      pageSize: parseInt(req.query.pageSize as string) || 10,
      pageNumber: parseInt(req.query.pageNumber as string) || 1,
    };


    const result = await getAllFarmersService(filters, pagination);

    return res.status(HTTPSTATUS.OK).json({
      message: "All farmers fetched successfully",
      ...result,
    });
  }
);

// Delete a farmer
export const deleteFarmerController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.headers["userid"] as string;

    const farmerId = farmerIdSchema.parse(req.params.id);
    const workspaceId = req.params.workspaceId;

    await deleteFarmerService(farmerId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Farmer deleted successfully",
    });
  }
);
