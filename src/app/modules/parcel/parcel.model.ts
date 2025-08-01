import { model, Schema } from "mongoose";
import {
  IParcel,
  IReceiver,
  IStatusLog,
  ParcelType,
  Status,
} from "./parcel.interface";
import { calculateDeliveryFee } from "../../utils/calculateDeliveryFee";
import { calculateDeliveryDate } from "../../utils/calculateDeliveryDate";

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
    },
    type: {
      type: String,
      enum: ParcelType,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
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

parcelSchema.pre("save", async function (next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const baseTrackingId = `TRK-${year}${month}${day}`;
    let randomPart = Math.floor(100000 + Math.random() * 900000);
    let uniqueTrackingId = `${baseTrackingId}-${randomPart}`;

    while (await Parcel.exists({ trackingId: uniqueTrackingId })) {
      randomPart = Math.floor(100000 + Math.random() * 900000);
      uniqueTrackingId = `${baseTrackingId}-${randomPart}`;
    }

    this.trackingId = uniqueTrackingId;

    this.deliveryFee = calculateDeliveryFee(this.type, this.weight);

    this.deliveryDate = calculateDeliveryDate(this.type);

    this.statusLogs = [
      {
        status: this.status,
        location: this.pickingAddress || "Sender location",
        time: new Date(),
      },
    ];
  }

  next();
});

export const Parcel = model<IParcel>("Parcel", parcelSchema);
