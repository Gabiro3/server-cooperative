import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user.model";

const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Check if userId is provided in the headers
    const userId = req.headers["userid"] as string;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized: No user ID in headers." });
      return;
    }

    // Fetch user from DB
    UserModel.findById(userId)
      .select("-password") // Exclude password from the user data
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

