import {
  type General,
  GeneralFields,
} from "../../types/interface/tables/general";
import schema from "../../types/optimized/table/general-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks General table
 * General entries in MoneyWorks
 */
export class GeneralService extends TableService<General> {
  constructor() {
    super("general", schema, GeneralFields);
  }
}
