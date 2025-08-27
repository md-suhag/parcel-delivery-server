import express from "express";
import { StatsController } from "./stats.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.get("/parcels", checkAuth(Role.ADMIN), StatsController.getParcelsStats);

export const statsRoutes = router;
