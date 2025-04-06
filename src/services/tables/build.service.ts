import type { ANY } from "../../types/hack";
import { enforceType } from "../../types/helpers";
import { type Build, type BuildField, BuildFields } from "../../types/interface/tables/build";
import type {
  MoneyWorksConfig,
  MoneyWorksQueryParams,
} from "../../types/moneyworks";
import schema from "../../types/optimized/table/build-schema";
import { MoneyWorksApiService } from "../moneyworks-api.service";

/**
 * Service for interacting with MoneyWorks Ubuild table
 * Ubuild entries in MoneyWorks
 */
export class BuildService {
  private api: MoneyWorksApiService;

  constructor(config: MoneyWorksConfig) {
    this.api = new MoneyWorksApiService(config);
  }

  dataCenterJsonToUbuild(data: ANY): Build {
    return BuildFields.reduce((acc, key) => {
      if (data[key.toLowerCase()] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Ubuild record`,
        );
      }
      const value = enforceType(
        data[key.toLowerCase()],
        schema[key] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Build);
  }

  dataCenterJsonToUbuildUsingFields(
    fields: BuildField[],
    data: ANY,
  ): Build {
    return fields.reduce((acc, key) => {
      if (data[key] === undefined) {
        console.error(
          `Missing key ${key} in data center json for Ubuild record`,
        );
      }
      const value = enforceType(
        data[key],
        schema[key as keyof typeof schema] as "string",
      );
      (acc as ANY)[key] = value === "" ? null : value;
      return acc;
    }, {} as Build);
  }

  /**
   * Get builds from MoneyWorks with pagination and filtering
   *
   * @param params Query parameters
   * @returns Parsed build data with pagination metadata
   */
  async getBuilds(params: {
    limit?: number;
    offset?: number;
    search?: Partial<Build>;
    sort?: string;
    order?: "asc" | "desc";
    fields?: string[];
  }) {
    try {
      // Validate fields if provided
      if (params.fields && params.fields.length > 0) {
        for (const field of params.fields) {
          if (!BuildFields.includes(field as BuildField)) {
            throw new Error(
              `Invalid field '${field}' for Build table. Valid fields are: ${BuildFields.join(", ")}`,
            );
          }
        }
      }

      // Convert from our API params to MoneyWorks params
      const mwParams: MoneyWorksQueryParams<Build> = {
        limit: params.limit,
        start: params.offset,
        search: params.search,
        sort: params.sort,
        direction: params.order === "desc" ? "descending" : "ascending",
        format: params.fields ? undefined : "xml-verbose",
        fields: params.fields,
      };

      // Call MoneyWorks API
      const { data, pagination } = await this.api.export("build", mwParams);

      // Parse the response
      const builds = params.fields
        ? data.map((d) =>
            this.dataCenterJsonToUbuildUsingFields(
              params.fields as BuildField[],
              d,
            ),
          )
        : data.map(this.dataCenterJsonToUbuild);

      return {
        data: builds,
        pagination,
      };
    } catch (error) {
      console.error("Error fetching builds:", error);
      throw error;
    }
  }
}
