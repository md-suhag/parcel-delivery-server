import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { UserController } from "./user.controller";

const router = express.Router();

router.get("/me", checkAuth(...Object.values(Role)), UserController.getMe);
export const userRoutes = router;
