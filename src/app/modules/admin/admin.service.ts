import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import {
  parcelSearchableFields,
  ValidStatusFlow,
} from "../parcel/parcel.constant";
import { Status } from "../parcel/parcel.interface";

import { Parcel } from "../parcel/parcel.model";
import { IsActive, Role } from "../user/user.interface";

import { User } from "../user/user.model";
import httpStatus from "http-status-codes";

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);

  const users = await queryBuilder.exclude(["password"]).paginate();

  const [data, meta] = await Promise.all([
    users.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};

const blockUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.role === Role.ADMIN) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Admin block is not possible currently "
    );
  }
  if (user.isActive === IsActive.BLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST, "User aready blocked");
  }
  const blockedUser = await User.findByIdAndUpdate(
    userId,
    {
      isActive: IsActive.BLOCKED,
    },
    { runValidators: true, new: true }
  ).select("name phone  isActive");

  return blockedUser;
};
const unBlockUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.isActive === IsActive.ACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, "User aready active/unblocked");
  }

  const unblockedUser = await User.findByIdAndUpdate(
    userId,
    {
      isActive: IsActive.ACTIVE,
    },
    { runValidators: true, new: true }
  ).select("name phone  isActive");

  return unblockedUser;
};

const getAllParcels = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Parcel.find(), query);

  const parcels = await queryBuilder
    .search(parcelSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    parcels.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};

const blockParcel = async (parcelId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }
  if (parcel.isBlocked === true) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel aready blocked");
  }
  const blockedParcel = await Parcel.findByIdAndUpdate(
    parcelId,
    {
      isBlocked: true,
      $push: {
        statusLogs: {
          status: "BLOCKED",
          location: "Admin Panel",
          note: "Blocked by admin",
          timestamp: new Date(),
        },
      },
    },
    { runValidators: true, new: true }
  ).select("statusLogs isBlocked trackingId");

  return blockedParcel;
};
const unBlockParcel = async (parcelId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }
  if (parcel.isBlocked === false) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel aready unblocked");
  }
  const unblockedParcel = await Parcel.findByIdAndUpdate(
    parcelId,
    {
      isBlocked: false,
      $push: {
        statusLogs: {
          status: "UNBLOCKED",
          location: "Admin Panel",
          note: "Unblocked by admin",
          timestamp: new Date(),
        },
      },
    },
    { runValidators: true, new: true }
  ).select("statusLogs isBlocked trackingId");

  return unblockedParcel;
};

const updateParcelStatus = async (parcelId: string, status: Status) => {
  const parcel = await Parcel.findById(parcelId);

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }
  if (parcel.isBlocked) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "This parcel is currently blocked"
    );
  }

  if (!ValidStatusFlow[parcel.status].includes(status)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Invalid: transition .You can't change status from ${parcel.status} to ${status}`
    );
  }

  const updatedParcel = await Parcel.findByIdAndUpdate(
    parcelId,
    {
      status,
      locationForLog: "Admin Panel",
      noteForLog: `Status updated to ${status} by admin`,
    },
    { runValidators: true, new: true }
  ).select("status statusLogs");
  return updatedParcel;
};

const assignRider = async (parcelId: string, riderId: string) => {
  const parcel = await Parcel.findById(parcelId);

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }
  if (parcel.isBlocked) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "This parcel is currently blocked"
    );
  }
  if (parcel.assignedRider) {
    throw new AppError(httpStatus.CONFLICT, "Rider is already assigned");
  }
  if (!ValidStatusFlow[parcel.status].includes(Status.ASSIGNED)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Invalid: transition .You can't change status from ${parcel.status} to ${Status.ASSIGNED}`
    );
  }
  const updatedParcel = await Parcel.findByIdAndUpdate(
    parcelId,
    {
      status: Status.ASSIGNED,
      assignedRider: riderId,
      locationForLog: "Admin Panel",
      noteForLog: `Rider assigned by admin`,
    },
    { runValidators: true, new: true }
  ).select("status statusLogs assignedRider");
  return updatedParcel;
};
export const AdminService = {
  getAllUsers,
  blockUser,
  unBlockUser,
  getAllParcels,
  blockParcel,
  unBlockParcel,
  updateParcelStatus,
  assignRider,
};
