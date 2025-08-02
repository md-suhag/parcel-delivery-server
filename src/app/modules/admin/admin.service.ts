import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import {
  parcelSearchableFields,
  ValidStatusFlow,
} from "../parcel/parcel.constant";
import { Status } from "../parcel/parcel.interface";

import { Parcel } from "../parcel/parcel.model";
import { IsActive } from "../user/user.interface";

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
  if (user.isActive === IsActive.BLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST, "User aready blocked");
  }
  await User.findByIdAndUpdate(
    userId,
    {
      isActive: IsActive.BLOCKED,
    },
    { runValidators: true }
  );

  return null;
};
const unBlockUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.isActive === IsActive.ACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, "User aready active");
  }
  await User.findByIdAndUpdate(
    userId,
    {
      isActive: IsActive.ACTIVE,
    },
    { runValidators: true }
  );

  return null;
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
  await Parcel.findByIdAndUpdate(
    parcelId,
    {
      isBlocked: true,
      $push: {
        statusLogs: {
          status: "BLOCKED",
          location: "Unknown location",
          note: "Blocked by admin",
          timestamp: new Date(),
        },
      },
    },
    { runValidators: true }
  );

  return null;
};
const unBlockParcel = async (parcelId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }
  if (parcel.isBlocked === false) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel aready unblocked");
  }
  await Parcel.findByIdAndUpdate(
    parcelId,
    {
      isBlocked: false,
      $push: {
        statusLogs: {
          status: "UNBLOCKED",
          location: "Unknown location",
          note: "Unblocked by admin",
          timestamp: new Date(),
        },
      },
    },
    { runValidators: true }
  );

  return null;
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
      httpStatus.BAD_REQUEST,
      `Invalid: transition .You can't change status from ${parcel.status} to ${status}`
    );
  }

  await Parcel.findByIdAndUpdate(
    parcelId,
    {
      status,
      locationForLog: "Admin Panel",
      notForLog: `Status updated to ${status} by admin`,
    },
    { runValidators: true }
  );
  return null;
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
  if (!ValidStatusFlow[parcel.status].includes(Status.ASSIGNED)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid: transition .You can't change status from ${parcel.status} to ${status}`
    );
  }
  await Parcel.findByIdAndUpdate(
    parcelId,
    {
      status: Status.ASSIGNED,
      assignedRider: riderId,
      locationForLog: "Admin Panel",
      noteForLog: `Rider assigned by admin`,
    },
    { runValidators: true }
  );
  return null;
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
