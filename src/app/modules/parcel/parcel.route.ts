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
// get Sender's parcels
router.get(
  "/me",
  checkAuth(Role.SENDER, Role.ADMIN),

  ParcelController.getMyParcels
);
router.patch(
  "/:id/cancel",
  checkAuth(Role.SENDER, Role.ADMIN),
  ParcelController.cancelMyParcel
);
router.get(
  "/track/:id",

  ParcelController.trackParcel
);
router.get(
  "/incomming",
  checkAuth(Role.RECEIVER),
  ParcelController.getIncommingParcel
);
router.patch(
  "/:id/confirm",
  checkAuth(Role.RECEIVER),
  ParcelController.confirmDelivery
);
router.get(
  "/delivery-history",
  checkAuth(Role.RECEIVER),
  ParcelController.getDeliveryHistory
);

export const parcelRoutes = router;
