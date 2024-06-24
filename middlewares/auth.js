import jwt from "jsonwebtoken";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Admin } from "../models/admin.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return next(new ErrorHandler("Please Login to access this", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await Admin.findById(decoded._id);

  next();
});
