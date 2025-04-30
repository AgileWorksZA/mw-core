import { type Link, LinkFields } from "../../types/interface/tables/link";
import schema from "../../types/optimized/table/link-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Link table
 * Link entries in MoneyWorks
 */
export class LinkService extends TableService<Link> {
  constructor() {
    super("link", schema, LinkFields);
  }
}
