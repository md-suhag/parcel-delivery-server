import { model, Schema } from "mongoose";
import {
  Division,
  IParcel,
  IReceiver,
  IStatusLog,
  Status,
} from "./parcel.interface";

const statusLogsSchema = new Schema<IStatusLog>(
  {
    location: {
      type: String,
    },
    time: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: Status,
      required: true,
    },
    note: {
      type: String,
    },
  },
  {
    versionKey: false,
    _id: false,
  }
);
const receiverSchema = new Schema<IReceiver>(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },

    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      enum: Division,
      required: true,
    },
  },
  {
    versionKey: false,
    _id: false,
  }
);
const parcelSchema = new Schema<IParcel>(
  {
    trackingId: {
      type: String,
      unique: true,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: receiverSchema,
    assignedRider: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    pickingAddress: { type: String, required: true },
    deliveryDate: {
      type: Date,
      required: true,
    },
    status: { type: String, enum: Status, default: Status.REQUESTED },
    statusLogs: [statusLogsSchema],
    isBlocked: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IParcel>("Parcel", parcelSchema);
