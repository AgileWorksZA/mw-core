import {
  type Stickies,
  StickiesFields,
} from "../../types/interface/tables/stickies";
import schema from "../../types/optimized/table/stickies-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Stickies table
 * Stickies entries in MoneyWorks
 */
export class StickiesService extends TableService<Stickies> {
  constructor() {
    super("stickies", schema, StickiesFields);
  }
}
