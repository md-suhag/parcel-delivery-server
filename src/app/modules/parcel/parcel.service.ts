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
          location: "Sender Cancelled",
          status: Status.CANCELLED,
          time: new Date(),
          note: "Parcel cancelled by sender before dispatch",
        },
      },
    }
  );
};

export const ParcelService = {
  createParcel,
  getMyParcels,
  cancelMyParcel,
};
