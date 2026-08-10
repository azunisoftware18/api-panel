import { Router } from "express";
import AuthMiddleware from "../middleware/auth.middleware.js";
import DashboardController from "../controller/dashboard.controller.js";
import asyncHandler from "../utils/AsyncHandler.js";

const router = Router();

router.get(
  "/",
  AuthMiddleware.isAuthenticated,
  asyncHandler(DashboardController.getDashboard)
);

export default router;
