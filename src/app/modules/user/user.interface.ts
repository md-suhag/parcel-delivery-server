import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
  RIDER = "RIDER",
}
export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}
export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  password?: string;
  address: string;
  role: Role;
  auths: IAuthProvider[];
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
