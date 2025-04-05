import { z } from "zod";

export const paymentsZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.date(),
  InvoiceID: z.number(),
  CashTrans: z.number(),
  Date: z.date(),
  GSTCycle: z.number(),
  Amount: z.number(),
});

export type PaymentsZod = z.infer<typeof paymentsZod>;