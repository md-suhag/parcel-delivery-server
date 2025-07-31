import { Types } from "mongoose";

export enum Status {
  REQUESTED = "REQUESTED",
  ASSIGNED = "ASSIGNED",
  PICKED = "PICKED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
}

export interface IReceiver {
  name: string;
  phone: string;
  email?: string;
  address: string;
}

export interface IStatusLog {
  location?: string;
  time: Date;
  status: Status;
  note?: string;
}
export enum ParcelType {
  DOCUMENT = "DOCUMENT",
  REGULAR = "REGULAR",
}

export interface IParcel {
  trackingId: string;
  type: ParcelType;
  weight: number;
  deliveryFee: number;
  sender: Types.ObjectId;
  receiver: IReceiver;
  assignedRider?: Types.ObjectId;
  pickingAddress: string;
  deliveryDate: Date;
  status: Status;
  statusLogs: IStatusLog[];
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
