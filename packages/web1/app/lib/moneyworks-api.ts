import { useConnection } from "~/contexts/connection-context";
import { useAuth } from "~/hooks/use-auth";
import { useMemo } from "react";

export interface MoneyWorksApiOptions {
  format?: "json" | "xml-terse" | "xml-verbose" | "tsv";
  limit?: number;
  offset?: number;
  fields?: string[];
  filter?: string;
  orderBy?: string;
}

export class MoneyWorksApi {
  private userId: string;
  private connectionId: string;

  constructor(userId: string, connectionId: string) {
    this.userId = userId;
    this.connectionId = connectionId;
  }

  async export(table: string, options: MoneyWorksApiOptions = {}) {
    const formData = new FormData();
    formData.append("userId", this.userId);
    formData.append("connectionId", this.connectionId);
    formData.append("operation", "export");
    formData.append("table", table);
    formData.append("options", JSON.stringify(options));

    const response = await fetch("/api/moneyworks", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch data");
    }

    return result.data;
  }

  async import(table: string, data: any, options: any = {}) {
    const formData = new FormData();
    formData.append("userId", this.userId);
    formData.append("connectionId", this.connectionId);
    formData.append("operation", "import");
    formData.append("table", table);
    formData.append("data", JSON.stringify(data));
    formData.append("options", JSON.stringify(options));

    const response = await fetch("/api/moneyworks", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Failed to import data");
    }

    return result.data;
  }

  async evaluate(expression: string) {
    const formData = new FormData();
    formData.append("userId", this.userId);
    formData.append("connectionId", this.connectionId);
    formData.append("operation", "evaluate");
    formData.append("expression", expression);

    const response = await fetch("/api/moneyworks", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Failed to evaluate expression");
    }

    return result.data;
  }
}

export function useMoneyWorksApi() {
  const { userId } = useAuth();
  const { currentConnection } = useConnection();

  return useMemo(() => {
    if (!userId || !currentConnection) {
      return null;
    }

    return new MoneyWorksApi(userId, currentConnection.id);
  }, [userId, currentConnection?.id]);
}