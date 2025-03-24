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

export interface MoneyWorksQueryParams {
  limit?: number;
  start?: number;
  search?: string;
  sort?: string;
  direction?: 'ascending' | 'descending';
  format?: 'xml' | 'xml-terse' | 'xml-verbose' | string;
}