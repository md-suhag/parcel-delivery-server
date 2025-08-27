import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { StatsService } from "./stats.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const getParcelsStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await StatsService.getParcelsStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parcels stats fetched successfully",
    data: stats,
  });
});

export const StatsController = {
  getParcelsStats,
};
