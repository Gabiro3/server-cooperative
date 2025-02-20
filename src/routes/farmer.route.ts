import { Router } from "express";
import {
  createFarmerController,
  deleteFarmerController,
  getAllFarmersController,
  updateFarmerController,
} from "../controllers/farmer.controller";

const farmerRoutes = Router();

// Route to create a new farmer
farmerRoutes.post(
  "/workspace/:workspaceId/create",
  createFarmerController
);

// Route to delete a farmer by ID
farmerRoutes.delete(
  "/:id/workspace/:workspaceId/delete",
  deleteFarmerController
);

// Route to update a farmer by ID
farmerRoutes.put(
  "/:id/workspace/:workspaceId/update",
  updateFarmerController
);

// Route to get all farmers in a workspace
farmerRoutes.get(
  "/workspace/:workspaceId/all",
  getAllFarmersController
);

export default farmerRoutes;
