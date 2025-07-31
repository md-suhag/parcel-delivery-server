import { IParcel } from "./parcel.interface";
import { Parcel } from "./parcel.model";

const createParcel = async (payload: IParcel) => {
  return await Parcel.create(payload);
};

export const ParcelService = {
  createParcel,
};
