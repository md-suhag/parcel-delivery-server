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
  if (parcel.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel is blocked");
  }

  if (parcel.status !== Status.REQUESTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can only cancel a parcel before it is dispatched."
    );
  }

  const updatedData = await Parcel.findByIdAndUpdate(
    parcelId,
    {
      status: Status.CANCELLED,
      locationForLog: parcel.pickingAddress,
      noteForLog: "Parcel cancelled by sender",
    },
    { runValidators: true, new: true }
  );
  return updatedData;
};
const getStatusLogs = async (parcelId: string, userId: string) => {
  const parcel = await Parcel.findById(parcelId).select("statusLogs sender");
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }

  if (parcel.sender.toString() !== userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You can't see another person's parcel log."
    );
  }

  return parcel;
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
    isBlocked: false,
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

  if (parcel.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel is blocked");
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
      status: Status.DELIVERED,
      noteForLog: "Parcel accepted by receiver",
      locationForLog: parcel.receiver.address,
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
  getStatusLogs,
  trackParcel,
  getIncommingParcel,
  confirmDelivery,
  getDeliveryHistory,
};
