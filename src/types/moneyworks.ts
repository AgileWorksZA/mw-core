export interface MoneyWorksConfig {
  host: string;
  port: number;
  dataFile: string;
  username: string;
  password: string;
  folderAuth?: {
    folderName: string;
    password: string;
  };
}

export interface MoneyWorksQueryParams<T extends object = object> {
  limit?: number;
  start?: number;
  search?: Partial<T>;
  sort?: string;
  direction?: "ascending" | "descending";
  format?: "xml" | "xml-terse" | "xml-verbose" | string;
}
