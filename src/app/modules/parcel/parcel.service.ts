import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IParcel, Status } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import httpStatus from "http-status-codes";

const createParcel = async (payload: IParcel) => {
  return await Parcel.create(payload);
};
const getMyParcels = async (id: string) => {
  return await Parcel.find({ sender: id });
};
const cancelMyParcel = async (parcelId: string, userId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }

  if (parcel.sender.toString() !== userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You can't cancel another person's parcel."
    );
  }

  if (parcel.status !== Status.REQUESTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can only cancel a parcel before it is dispatched."
    );
  }

  await Parcel.updateOne(
    { _id: parcelId },
    {
      $set: { status: Status.CANCELLED },
      $push: {
        statusLogs: {
          location: parcel.pickingAddress,
          status: Status.CANCELLED,
          time: new Date(),
          note: "Parcel cancelled by sender",
        },
      },
    }
  );
};

const trackParcel = async (trackingId: string) => {
  const parcelDetails = await Parcel.findOne({ trackingId })
    .select("statusLogs receiver assignedRider")
    .populate("assignedRider", "name phone");
  if (!parcelDetails) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }
  return parcelDetails;
};

const getIncommingParcel = async (decodedToken: JwtPayload) => {
  const incommingParcels = await Parcel.find({
    "receiver.phone": decodedToken.phone,
    status: { $nin: [Status.DELIVERED, Status.CANCELLED] },
  });

  return incommingParcels;
};
const confirmDelivery = async (parcelId: string, decodedToken: JwtPayload) => {
  const parcel = await Parcel.findById(parcelId);

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }

  if (decodedToken.phone !== parcel.receiver.phone) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to confirm delivery"
    );
  }

  if (parcel.status === Status.DELIVERED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel already delivered");
  }
  if (parcel.status !== Status.IN_TRANSIT) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can only confirm parcel when it's status is IN_TRASIT"
    );
  }

  const updatedParcel = await Parcel.findByIdAndUpdate(
    parcelId,
    {
      $set: { status: Status.DELIVERED },
      $push: {
        statusLogs: {
          location: parcel.receiver.address,
          status: Status.DELIVERED,
          time: new Date(),
          note: "Parcel accepted by receiver",
        },
      },
    },
    { runValidators: true, new: true }
  );

  return updatedParcel;
};

const getDeliveryHistory = async (decodedToken: JwtPayload) => {
  return await Parcel.find({
    "receiver.phone": decodedToken.phone,
    status: Status.DELIVERED,
  }).lean();
};
export const ParcelService = {
  createParcel,
  getMyParcels,
  cancelMyParcel,
  trackParcel,
  getIncommingParcel,
  confirmDelivery,
  getDeliveryHistory,
};
