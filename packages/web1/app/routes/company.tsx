import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { Navigation } from "~/components/navigation";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/lib/api";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  FileText,
  Hash,
} from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const response = await api.getCompany();
    // Extract the actual data from the response
    const company = response.data || response;
    return {
      company,
      error: null,
    };
  } catch (error) {
    return {
      company: null,
      error: error instanceof Error ? error.message : "Failed to load company data",
    };
  }
}

export default function Company() {
  const { company, error } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  if (error) {
    return (
      <>
        <Navigation />
        <main className="container py-8">
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </main>
      </>
    );
  }

  if (!company) {
    return (
      <>
        <Navigation />
        <main className="container py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </>
    );
  }

  const sections = [
    {
      title: "Basic Information",
      icon: Building2,
      fields: [
        { label: "Company Name", value: company.name },
        { label: "Trading As", value: company.tradingAs },
        { label: "Legal Name", value: company.legalName },
        { label: "Company Number", value: company.companyNumber },
      ],
    },
    {
      title: "Contact Information",
      icon: Phone,
      fields: [
        { label: "Phone", value: company.contact?.phone },
        { label: "Fax", value: company.contact?.fax },
        { label: "Email", value: company.contact?.email },
        { label: "Website", value: company.contact?.website },
      ],
    },
    {
      title: "Address",
      icon: MapPin,
      fields: [
        { label: "Address Line 1", value: company.address?.line1 },
        { label: "Address Line 2", value: company.address?.line2 },
        { label: "City", value: company.address?.line3 },
        { label: "State/Province", value: company.address?.line4 },
        { label: "Postal Code", value: company.postalCode },
        { label: "Country", value: company.country },
      ],
    },
    {
      title: "Tax Information",
      icon: FileText,
      fields: [
        { label: "Tax Number", value: company.tax?.gstRegistrationNumber },
        { label: "Tax Registration", value: company.tax?.gstRegistrationNumber },
        { label: "GST Cycle", value: company.tax?.gstCycleMonths ? `${company.tax.gstCycleMonths} months` : null },
        { label: "Tax Basis", value: company.taxBasis },
      ],
    },
    {
      title: "Financial Year",
      icon: Calendar,
      fields: [
        { label: "Start Month", value: company.financialYearStart },
        { label: "Current Period", value: company.accounting?.currentPeriod },
        { label: "Periods in Year", value: company.accounting?.periodsInYear },
      ],
    },
    {
      title: "System Information",
      icon: Hash,
      fields: [
        { label: "MoneyWorks Version", value: company.system?.version },
        { label: "Platform", value: company.system?.platform },
        { label: "Base Currency", value: company.accounting?.baseCurrency },
        { label: "Multi-Currency", value: company.accounting?.multiCurrencyEnabled ? "Enabled" : "Disabled" },
      ],
    },
  ];

  return (
    <>
      <Navigation />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("nav.company")}
          </h1>
          <p className="text-muted-foreground mt-2">
            Company information and configuration details
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-lg border bg-card p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <section.icon className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">{section.title}</h2>
              </div>
              <dl className="space-y-3">
                {section.fields.map((field) => (
                  <div key={field.label} className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">
                      {field.label}
                    </dt>
                    <dd className="text-sm text-right">
                      {field.value || "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-6 rounded-lg border bg-muted/50 p-6">
          <h3 className="mb-4 text-lg font-semibold">Quick Overview</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Version: {company.system?.version || "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Currency: {company.accounting?.baseCurrency || "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Period: {company.accounting?.currentPeriod || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                GST: {company.tax?.gstRegistrationNumber || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}