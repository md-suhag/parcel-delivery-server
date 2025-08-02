import express from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  assignRiderZodSchema,
  updateStatusZodSchema,
} from "./admin.validation";

const router = express.Router();

router.use(checkAuth(Role.ADMIN));

router.get("/users", AdminController.getAllUsers);
router.patch("/users/:id/block", AdminController.blockUser);
router.patch("/users/:id/unblock", AdminController.unBlockUser);

router.get("/parcels", AdminController.getAllParcels);
router.patch("/parcels/:id/block", AdminController.blockParcel);
router.patch("/parcels/:id/unblock", AdminController.unBlockParcel);

router.patch(
  "/parcels/:id/status",
  validateRequest(updateStatusZodSchema),
  AdminController.updateParcelStatus
);

router.patch(
  "/parcels/:id/assign",
  validateRequest(assignRiderZodSchema),
  AdminController.assignRider
);
export const adminRoutes = router;
