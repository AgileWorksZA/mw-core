import type { ApiGetConfig } from "../types";

export type ApiGetDocument = ApiGetConfig;

export type ApiGetState = {
  activeEndpoint?: string;
  isTestingConnection?: boolean;
  testResults?: {
    success: boolean;
    data?: any;
    error?: string;
    timestamp: string;
  };
};