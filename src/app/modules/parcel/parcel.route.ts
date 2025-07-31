import express from "express";
import { ParcelController } from "./parcel.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createParcelZodSchma } from "./parcel.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.post(
  "/",
  checkAuth(Role.SENDER, Role.ADMIN),
  validateRequest(createParcelZodSchma),
  ParcelController.createParcel
);

export const parcelRoutes = router;
