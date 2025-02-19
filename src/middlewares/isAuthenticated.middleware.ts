import { NextFunction, Request, Response } from "express";

const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || !req.user._id) {
    res.status(401).json({
      success: false,
      message: "Unauthorized. Please log in.",
    });
    return; // Stop execution without returning a value
  }
  next();
};

export default isAuthenticated;

