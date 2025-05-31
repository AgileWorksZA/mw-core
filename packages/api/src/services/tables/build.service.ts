import { type Build, BuildFields } from "../../types/interface/tables/build";
import schema from "../../types/optimized/table/build-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Ubuild table
 * Ubuild entries in MoneyWorks
 */
export class BuildService extends TableService<Build> {
  constructor() {
    super("build", schema, BuildFields);
  }
}
