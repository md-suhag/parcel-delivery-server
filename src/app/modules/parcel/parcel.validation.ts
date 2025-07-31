import z from "zod";

export const createParcelZodSchma = z.object({
  type: z.string(),
  weight: z.number(),
  sender: z.string(),
  receiver: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().optional(),
    address: z.string(),
  }),
  pickingAddress: z.string(),
});
