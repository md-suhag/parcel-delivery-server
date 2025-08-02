import express from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  credentialsLoginZodSchema,
  registerZodSchema,
} from "./auth.validation";

const router = express.Router();

router.post(
  "/register",
  validateRequest(registerZodSchema),
  AuthController.register
);
router.post(
  "/login",
  validateRequest(credentialsLoginZodSchema),
  AuthController.credentialsLogin
);

router.post("/logout", AuthController.logout);
router.post("/refresh-token", AuthController.getNewAccessToken);

export const authRoutes = router;
