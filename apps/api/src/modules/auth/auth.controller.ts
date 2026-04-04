import { Response } from "express";
import { AuthRequest } from "../../types";
import { asyncHandler } from "../../middleware/asyncHandler";
import { signupSchema, loginSchema } from "./auth.validation";
import { signup, login } from "./auth.service";
import { sendSuccess, sendError } from "../../utils/response";
import { BadRequestError } from "../../utils/errors";

export const signupController = asyncHandler(async (req, res, next) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  const data = await signup(result.data);
  sendSuccess(res, 201, data, "Signup successful");
});

export const loginController = asyncHandler(async (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0].message);
  }

  const data = await login(result.data);
  sendSuccess(res, 200, data, "Login successful");
});

export const getMeController = asyncHandler(async (req: AuthRequest, res, next) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new BadRequestError("User ID not found in request");
  }

  const user = await import("./auth.service").then(m => m.getMe(userId));
  sendSuccess(res, 200, user, "User profile retrieved successfully");
});

export const updateProfileController = asyncHandler(async (req: AuthRequest, res, next) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new BadRequestError("User ID not found in request");
  }

  const user = await import("./auth.service").then(m => m.updateProfile(userId, req.body));
  sendSuccess(res, 200, user, "Profile updated successfully");
});

export const changePasswordController = asyncHandler(async (req: AuthRequest, res, next) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new BadRequestError("User ID not found in request");
  }

  await import("./auth.service").then(m => m.changePassword(userId, req.body));
  sendSuccess(res, 200, null, "Password changed successfully");
});
