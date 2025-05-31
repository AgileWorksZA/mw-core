import {
  type Payments,
  PaymentsFields,
} from "../../types/interface/tables/payments";
import schema from "../../types/optimized/table/payments-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Payments table
 * Payments entries in MoneyWorks
 */
export class PaymentsService extends TableService<Payments> {
  constructor() {
    super("payments", schema, PaymentsFields);
  }
}
