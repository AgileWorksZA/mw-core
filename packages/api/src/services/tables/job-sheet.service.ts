import { type JobSheet, JobSheetFields } from "../../types/interface/tables/jobsheet";
import schema from "../../types/optimized/table/jobsheet-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks JobSheet table
 * Job sheets represent work sheets for jobs
 */
export class JobSheetService extends TableService<JobSheet> {
  constructor() {
    super("jobsheet", schema, JobSheetFields);
  }
}