import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AdminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await AdminService.getAllUsers(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const result = await AdminService.blockUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User blocked successfully",
    data: result,
  });
});
const unBlockUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const result = await AdminService.unBlockUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User unblocked successfully",
    data: result,
  });
});

const getAllParcels = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await AdminService.getAllParcels(
    query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All parcels retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});
const blockParcel = catchAsync(async (req: Request, res: Response) => {
  const parcelId = req.params.id;
  const result = await AdminService.blockParcel(parcelId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel blocked successfully",
    data: result,
  });
});
const unBlockParcel = catchAsync(async (req: Request, res: Response) => {
  const parcelId = req.params.id;
  const result = await AdminService.unBlockParcel(parcelId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel unblocked successfully",
    data: result,
  });
});

const updateParcelStatus = catchAsync(async (req: Request, res: Response) => {
  const parcelId = req.params.id;
  const status = req.body.status;
  const result = await AdminService.updateParcelStatus(parcelId, status);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Parcel status updated successfully",
    data: result,
  });
});

const assignRider = catchAsync(async (req: Request, res: Response) => {
  const parcelId = req.params.id;
  const riderId = req.body.riderId;
  const result = await AdminService.assignRider(parcelId, riderId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rider assigned in parcel successfully",
    data: result,
  });
});
export const AdminController = {
  getAllUsers,
  blockUser,
  unBlockUser,
  getAllParcels,
  blockParcel,
  unBlockParcel,
  updateParcelStatus,
  assignRider,
};
