import {z} from "zod";

export const pagingSchema = z.object({
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  next: z.number(),
  prev: z.number(),
});

export type PagingSchema = z.infer<typeof pagingSchema>;