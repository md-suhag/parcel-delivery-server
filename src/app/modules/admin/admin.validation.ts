import z from "zod";

export const updateStatusZodSchema = z.object({
  status: z.string({ message: "invalid string. status is mandatory" }),
});
export const assignRiderZodSchema = z.object({
  riderId: z.string({ message: "invalid string. riderId is mandatory" }),
});
