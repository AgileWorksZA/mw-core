import { type Name, NameFields } from "../../types/interface/tables/name";
import schema from "../../types/optimized/table/name-schema";
import { TableService } from "./base/table.service";

/**
 * Service for interacting with MoneyWorks Name table
 * Names are customers, suppliers, and other contacts
 */
export class NameService extends TableService<Name> {
  constructor() {
    super("name", schema, NameFields);
  }
}