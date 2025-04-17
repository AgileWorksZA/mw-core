import { z } from "zod";

export const paymentsZod = z.object({
  SequenceNumber: z.number(),
  LastModifiedTime: z.string(),
  InvoiceID: z.number(),
  CashTrans: z.number(),
  Date: z.string(),
  GSTCycle: z.number(),
  Amount: z.number(),
});

export type PaymentsZod = z.infer<typeof paymentsZod>;
