import { Router } from "express";
import { SystemSettingController } from "../controller/system-setting.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
import { createSystemSettingValidation, updateSystemSettingValidation } from "../validation/system-setting.validation.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ValidateRequest from "../middleware/validateRequest.middleware.js";

const router = Router();

const controller = new SystemSettingController();

router.post(
  "/",
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  ValidateRequest.validate({
    body: createSystemSettingValidation,
  }),
  asyncHandler(controller.create)
);

router.get("/", asyncHandler(controller.get));

router.patch(
  "/",
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  ValidateRequest.validate({ body: updateSystemSettingValidation }),
  asyncHandler(controller.update)
);

export default router;
