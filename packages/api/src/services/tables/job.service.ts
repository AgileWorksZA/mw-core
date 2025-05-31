import { type Job, JobFields } from "../../types/interface/tables/job";
import schema from "../../types/optimized/table/job-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Job table
 * Job entries in MoneyWorks
 */
export class JobService extends TableService<Job> {
  constructor() {
    super("job", schema, JobFields);
  }
}