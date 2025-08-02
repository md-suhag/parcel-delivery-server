import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ParcelService } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const createParcel = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user;
  const result = await ParcelService.createParcel(
    req.body,
    decodedToken as JwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Parcel created successfully",
    data: result,
  });
});
const getMyParcels = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const result = await ParcelService.getMyParcels(decodedToken.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Parcel retrieved successfully",
    data: result,
  });
});
const cancelMyParcel = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const parcelId = req.params.id;
  const result = await ParcelService.cancelMyParcel(
    parcelId,
    decodedToken.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parcel Cancelled successfully",
    data: result,
  });
});

const getStatusLogs = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const parcelId = req.params.id;
  const result = await ParcelService.getStatusLogs(
    parcelId,
    decodedToken.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parcel's status logs retrieved successfully",
    data: result,
  });
});

const trackParcel = catchAsync(async (req: Request, res: Response) => {
  const result = await ParcelService.trackParcel(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parcel's details retrieved successfully",
    data: result,
  });
});

const getIncommingParcel = catchAsync(async (req: Request, res: Response) => {
  const parcels = await ParcelService.getIncommingParcel(
    req.user as JwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Incomming parcels retrieved successfully",
    data: parcels,
  });
});
const confirmDelivery = catchAsync(async (req: Request, res: Response) => {
  const parcelId = req.params.id;
  const decodedToken = req.user;
  const result = await ParcelService.confirmDelivery(
    parcelId,
    decodedToken as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Delivery confirmed successfully",
    data: result,
  });
});
const getDeliveryHistory = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user;
  const result = await ParcelService.getDeliveryHistory(
    decodedToken as JwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All delivery  history of receiver retrieved successfully",
    data: result,
  });
});

export const ParcelController = {
  createParcel,
  getMyParcels,
  cancelMyParcel,
  getStatusLogs,
  trackParcel,
  getIncommingParcel,
  confirmDelivery,
  getDeliveryHistory,
};
