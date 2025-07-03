import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Navigation } from "~/components/navigation";
import { Button } from "~/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useMoneyWorksApi } from "~/lib/moneyworks-api";
import { AuthGuard } from "~/components/auth-guard";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

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

export default function TaxRates() {
  return (
    <AuthGuard requireConnection={true}>
      <TaxRatesContent />
    </AuthGuard>
  );
}

function TaxRatesContent() {
  const { t } = useTranslation();
  const api = useMoneyWorksApi();
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaxRates = async () => {
      if (!api) {
        setError("No connection selected");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await api.export("TaxRate", { format: "json" });
        console.log("[TaxRates] API Response:", response);
        setTaxRates(response || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch tax rates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaxRates();
  }, [api]);

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

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && !isLoading && taxRates.length === 0 && (
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
            <p className="text-muted-foreground">
              {t("taxRates.noTaxRates")}
            </p>
          </div>
        )}

        {!error && !isLoading && taxRates.length > 0 && (
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