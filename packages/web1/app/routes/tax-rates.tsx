import { Link, useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { Navigation } from "~/components/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/lib/api";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export async function loader() {
  try {
    const response = await api.getTaxRates({ format: "full" });
    return {
      taxRates: response.data || [],
      error: null,
    };
  } catch (error) {
    return {
      taxRates: [],
      error: error instanceof Error ? error.message : "Failed to fetch tax rates",
    };
  }
}

export default function TaxRates() {
  const { taxRates, error } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

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

        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!error && taxRates.length === 0 && (
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
            <p className="text-muted-foreground">
              {t("taxRates.noTaxRates")}
            </p>
          </div>
        )}

        {!error && taxRates.length > 0 && (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("taxRates.code")}</TableHead>
                  <TableHead>{t("taxRates.description")}</TableHead>
                  <TableHead className="text-right">
                    {t("taxRates.rate")}
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
                    <TableCell>
                      {rate.Type === 1
                        ? "Sales"
                        : rate.Type === 2
                        ? "Purchase"
                        : rate.Type === 3
                        ? "Both"
                        : "-"}
                    </TableCell>
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
        )}
      </main>
    </>
  );
}