import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user.model";

const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // If Passport has attached the user, allow access
    if (req.user && req.user._id) {
      return next();
    }

    // If req.user is missing, check for userId in the request body
    const { userId } = req.body;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized: No user ID provided." });
      return;
    }

    // Fetch user from DB synchronously
    UserModel.findById(userId)
      .select("-password")
      .then((user) => {
        if (!user) {
          return res.status(401).json({ success: false, message: "User not found." });
        }

        // Attach user to request
        req.user = user;
        next();
      })
      .catch(() => {
        return res.status(500).json({ success: false, message: "Internal Server Error." });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unexpected error occurred." });
    return;
  }
};

export default isAuthenticated;
