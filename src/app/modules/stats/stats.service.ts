import { Parcel } from "../parcel/parcel.model";

const getParcelsStats = async () => {
  const totalParcelPromise = Parcel.countDocuments();
  const totalParcelByStatusPromise = Parcel.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
      },
    },
  ]);
  const totalParcelByParcelTypePromise = Parcel.aggregate([
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id",
        count: 1,
      },
    },
  ]);
  const totalDeliveredParcelByMonthsPromise = Parcel.aggregate([
    {
      $match: { status: "DELIVERED" },
    },

    {
      $group: {
        _id: {
          year: { $year: "$deliveryDate" },
          month: { $month: "$deliveryDate" },
        },
        delivered: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },

    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: {
          $arrayElemAt: [
            [
              "",
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            "$_id.month",
          ],
        },
        delivered: 1,
      },
    },
  ]);

  const [
    totalParcel,
    totalParcelByStatus,
    totalParcelByParcelType,
    totalDeliveredParcelByMonths,
  ] = await Promise.all([
    totalParcelPromise,
    totalParcelByStatusPromise,
    totalParcelByParcelTypePromise,
    totalDeliveredParcelByMonthsPromise,
  ]);

  return {
    totalParcel,
    totalParcelByStatus,
    totalParcelByParcelType,
    totalDeliveredParcelByMonths,
  };
};

export const StatsService = {
  getParcelsStats,
};
