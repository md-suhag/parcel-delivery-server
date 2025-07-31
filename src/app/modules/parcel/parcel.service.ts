import { IParcel } from "./parcel.interface";
import { Parcel } from "./parcel.model";

const createParcel = async (payload: IParcel) => {
  return await Parcel.create(payload);
};
const getMyParcels = async (id: string) => {
  return await Parcel.find({ sender: id });
};

export const ParcelService = {
  createParcel,
  getMyParcels,
};
