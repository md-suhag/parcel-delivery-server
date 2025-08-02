import { Status } from "./parcel.interface";

export const parcelSearchableFields = ["status"];

export const ValidStatusFlow: Record<Status, Status[]> = {
  REQUESTED: [Status.CANCELLED, Status.ASSIGNED],
  CANCELLED: [],
  ASSIGNED: [Status.PICKED],
  PICKED: [Status.IN_TRANSIT],
  IN_TRANSIT: [Status.RETURNED, Status.DELIVERED],
  RETURNED: [],
  DELIVERED: [],
};
