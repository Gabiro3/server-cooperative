import { z } from "zod";

// Validation schemas for individual fields
export const fullNameSchema = z.string().trim().min(1).max(255);
export const phoneNumberSchema = z.string().trim().min(10).max(15);
export const emailSchema = z.string().trim().email();
export const landAreaSchema = z.number().min(0); // Assuming land area must be a positive number
export const avgYieldSoldToMarketSchema = z.string().trim().min(0); // Assuming yield must be non-negative
export const nationalIdSchema = z.string().trim().min(1).max(100);
export const cooperativeIdSchema = z.string().trim().min(1); // Assuming cooperativeId is a valid ObjectId string
export const memberTypeSchema = z.enum(["farmer", "animal rearer"]);
export const joinedDateSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      return !val || !isNaN(Date.parse(val)); // Validate the date format if provided
    },
    {
      message: "Invalid date format. Please provide a valid date string.",
    }
  );

// Validation for creating a new farmer
export const createFarmerSchema = z.object({
  fullName: fullNameSchema,
  phoneNumber: phoneNumberSchema,
  email: emailSchema,
  landArea: landAreaSchema,
  avgYieldSoldToMarket: avgYieldSoldToMarketSchema,
  nationalId: nationalIdSchema,
  cooperativeId: cooperativeIdSchema,
  memberType: memberTypeSchema,
  joinedDate: joinedDateSchema.default(new Date().toISOString()), // Default current date if not provided
});

// Validation for updating an existing farmer
export const updateFarmerSchema = z.object({
  fullName: fullNameSchema.optional(),
  phoneNumber: phoneNumberSchema.optional(),
  email: emailSchema.optional(),
  landArea: landAreaSchema.optional(),
  avgYieldSoldToMarket: avgYieldSoldToMarketSchema.optional(),
  nationalId: nationalIdSchema.optional(),
  cooperativeId: cooperativeIdSchema.optional(),
  memberType: memberTypeSchema.optional(),
  joinedDate: joinedDateSchema.optional(),
});

// Validation for farmerId
export const farmerIdSchema = z.string().trim().min(1);
