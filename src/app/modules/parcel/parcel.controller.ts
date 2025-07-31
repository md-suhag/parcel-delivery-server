import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ParcelService } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createParcel = catchAsync(async (req: Request, res: Response) => {
  const result = await ParcelService.createParcel(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parcel created successfully",
    data: result,
  });
});

export const ParcelController = {
  createParcel,
};
