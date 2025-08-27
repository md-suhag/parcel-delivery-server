import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { parcelRoutes } from "../modules/parcel/parcel.route";
import { adminRoutes } from "./../modules/admin/admin.route";
import { statsRoutes } from "../modules/stats/stats.route";

export const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/parcels",
    route: parcelRoutes,
  },
  {
    path: "/stats",
    route: statsRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
