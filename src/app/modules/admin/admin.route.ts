import express from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.use(checkAuth(Role.ADMIN));

router.get("/users", AdminController.getAllUsers);
router.patch("/users/:id/block", AdminController.blockUser);
router.patch("/users/:id/unblock", AdminController.unBlockUser);

export const adminRoutes = router;
