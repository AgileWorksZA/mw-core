import { type Log, LogFields } from "../../types/interface/tables/log";
import schema from "../../types/optimized/table/log-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Log table
 * Log entries in MoneyWorks
 */
export class LogService extends TableService<Log> {
  constructor() {
    super("log", schema, LogFields);
  }
}
