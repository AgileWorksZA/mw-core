import { Link, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Navigation } from "~/components/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Plus, Search, X } from "lucide-react";
import { AuthGuard } from "~/components/auth-guard";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { data as json, type LoaderFunctionArgs, useLoaderData } from "react-router";
import { requireAuthAndConnection, createMoneyWorksClient } from "~/lib/server-utils";

interface TaxRate {
  TaxCode: string;
  Ratename: string;
  Rate1: number;
  Rate2?: number;
  Type?: number;
  RecAccount?: string;
  PaidAccount?: string;
  [key: string]: any;
}

interface LoaderData {
  taxRates: TaxRate[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search?: string;
    type?: string;
    sort?: string;
    order?: "asc" | "desc";
  };
}

/**
 * Server-side data loader with URL state management
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const { userId, connection } = await requireAuthAndConnection(request);
    const { client } = createMoneyWorksClient(connection);
    
    // Parse URL search params for filtering/sorting
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    // Extract filters from URL
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const sort = searchParams.get("sort") || "TaxCode";
    const order = (searchParams.get("order") || "asc") as "asc" | "desc";
    
    // Build MoneyWorks query options
    const queryOptions: any = {
      format: "json",
      limit,
      offset: (page - 1) * limit,
      sort: `${sort}${order === "desc" ? " DESC" : ""}`,
    };
    
    // Add search filter if provided
    if (search) {
      queryOptions.filter = `TaxCode CONTAINS[cd] "${search}" OR Ratename CONTAINS[cd] "${search}"`;
    }
    
    // Add type filter if provided
    if (type) {
      const typeFilter = `Type = ${type}`;
      queryOptions.filter = queryOptions.filter 
        ? `(${queryOptions.filter}) AND ${typeFilter}`
        : typeFilter;
    }
    
    console.log("[TaxRates Loader] Fetching with options:", queryOptions);
    
    // Fetch tax rates using smartExport for object format
    const taxRates = await client.smartExport("TaxRate", {
      ...queryOptions,
      exportFormat: 'full'
    });
    
    // For now, we'll estimate total count (in production, you'd want a separate count query)
    const total = taxRates.length < limit ? (page - 1) * limit + taxRates.length : page * limit + 1;
    const totalPages = Math.ceil(total / limit);
    
    return json<LoaderData>({
      taxRates: taxRates || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      filters: {
        search,
        type,
        sort,
        order,
      },
    });
    
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("[TaxRates Loader] Error:", error);
    throw new Response("Failed to load tax rates", { status: 500 });
  }
}

export default function TaxRates() {
  return (
    <AuthGuard requireConnection={true}>
      <TaxRatesContent />
    </AuthGuard>
  );
}

function TaxRatesContent() {
  const { t } = useTranslation();
  const { taxRates, pagination, filters } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(filters.search || "");
  
  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue !== filters.search) {
        updateParam("search", searchValue || null);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);
  
  // Helper to update URL params
  const updateParam = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 when filters change
    if (key !== "page") {
      newParams.set("page", "1");
    }
    setSearchParams(newParams);
  };
  
  // Get tax type display name
  const getTaxTypeDisplay = (type?: number) => {
    switch (type) {
      case 1: return "Sales";
      case 2: return "Purchase";
      case 3: return "Both";
      default: return "-";
    }
  };

  return (
    <>
      <Navigation />
      <main className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("taxRates.title")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("taxRates.description")}
            </p>
          </div>
          <Button asChild>
            <Link to="/tax-rates/new">
              <Plus className="mr-2 h-4 w-4" />
              {t("taxRates.newTaxRate")}
            </Link>
          </Button>
        </div>

        {/* Search and filter controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tax codes or descriptions..."
              className="pl-9 pr-9"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                onClick={() => {
                  setSearchValue("");
                  updateParam("search", null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Type filter dropdown */}
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={filters.type || ""}
            onChange={(e) => updateParam("type", e.target.value || null)}
          >
            <option value="">All Types</option>
            <option value="1">Sales</option>
            <option value="2">Purchase</option>
            <option value="3">Both</option>
          </select>
        </div>

        {filters.search && (
          <div className="mb-4">
            <Alert>
              <AlertDescription>
                Showing results for: "{filters.search}"
                {filters.type && ` (${getTaxTypeDisplay(parseInt(filters.type))} only)`}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {taxRates.length === 0 ? (
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
            <p className="text-muted-foreground">
              {filters.search 
                ? `No tax rates found matching "${filters.search}"`
                : t("taxRates.noTaxRates")
              }
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:text-foreground"
                      onClick={() => {
                        if (filters.sort === "TaxCode") {
                          updateParam("order", filters.order === "asc" ? "desc" : "asc");
                        } else {
                          updateParam("sort", "TaxCode");
                          updateParam("order", "asc");
                        }
                      }}
                    >
                      {t("taxRates.code")}
                      {filters.sort === "TaxCode" && (
                        <span className="ml-1">
                          {filters.order === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-foreground"
                      onClick={() => {
                        if (filters.sort === "Ratename") {
                          updateParam("order", filters.order === "asc" ? "desc" : "asc");
                        } else {
                          updateParam("sort", "Ratename");
                          updateParam("order", "asc");
                        }
                      }}
                    >
                      {t("taxRates.description")}
                      {filters.sort === "Ratename" && (
                        <span className="ml-1">
                          {filters.order === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer hover:text-foreground"
                      onClick={() => {
                        if (filters.sort === "Rate1") {
                          updateParam("order", filters.order === "asc" ? "desc" : "asc");
                        } else {
                          updateParam("sort", "Rate1");
                          updateParam("order", "asc");
                        }
                      }}
                    >
                      {t("taxRates.rate")}
                      {filters.sort === "Rate1" && (
                        <span className="ml-1">
                          {filters.order === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </TableHead>
                    <TableHead>{t("taxRates.type")}</TableHead>
                    <TableHead>{t("taxRates.account")}</TableHead>
                    <TableHead className="text-right">
                      {t("common.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxRates.map((rate) => (
                    <TableRow key={rate.TaxCode}>
                      <TableCell className="font-medium">{rate.TaxCode}</TableCell>
                      <TableCell>{rate.Ratename || "-"}</TableCell>
                      <TableCell className="text-right">
                        {rate.Rate1?.toFixed(2) || "0.00"}%
                      </TableCell>
                      <TableCell>{getTaxTypeDisplay(rate.Type)}</TableCell>
                      <TableCell>{rate.RecAccount || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/tax-rates/${rate.TaxCode}`}>
                            {t("common.edit")}
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateParam("page", String(pagination.page - 1))}
                    disabled={pagination.page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateParam("page", String(pagination.page + 1))}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}