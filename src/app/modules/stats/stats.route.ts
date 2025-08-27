import express from "express";
import { StatsController } from "./stats.controller";

const router = express.Router();

router.get("/parcels", StatsController.getParcelsStats);

export const statsRoutes = router;
