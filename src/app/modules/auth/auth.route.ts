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

export const authRoutes = router;
