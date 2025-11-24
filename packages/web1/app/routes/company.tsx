import {
	AlertCircle,
	Building2,
	Calendar,
	Clock,
	Database,
	DollarSign,
	FileText,
	Globe,
	Hash,
	Mail,
	MapPin,
	Phone,
	Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	type LoaderFunctionArgs,
	data as json,
	useLoaderData,
} from "react-router";
import { AuthGuard } from "~/components/auth-guard";
import { Navigation } from "~/components/navigation";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	createMoneyWorksClientWithRepositories,
	requireAuthAndConnection,
} from "~/lib/server-utils";

interface CompanyData {
	Company?: {
		// Basic Information
		Name?: string;
		Address1?: string;
		Address2?: string;
		Address3?: string;
		Address4?: string;
		Country?: string;
		Phone?: string;
		Fax?: string;
		Email?: string;
		Web?: string;
		WebURL?: string;

		// Tax & Legal
		TaxNumber?: string;
		GstNum?: string;
		CompanyNumber?: string;

		// Accounting Periods
		PeriodStart?: string;
		PeriodEnd?: string;
		YearStart?: string;
		YearEnd?: string;
		PeriodLength?: number;
		PeriodsInYear?: number;
		CurrentPeriod?: number;
		CurrentPer?: number;

		// Currency & Settings
		BaseCurrency?: string;
		MultiCurrencyEnabled?: boolean;
		ExtendedJobCosting?: boolean;

		// GST/Tax Settings
		GSTCycleMonths?: number;
		GSTEnabled?: boolean;
		GSTCashBasis?: boolean;

		// System Information
		Version?: string;
		Platform?: string;
		Locale?: string;
		TimeZone?: string;
		DateFormat?: string;
		NumberFormat?: string;

		[key: string]: any;
	};
	errors?: string[];
}

interface LoaderData {
	company: CompanyData;
	connectionId: string;
}

/**
 * Server-side data loader - runs before component renders
 */
export async function loader({ request }: LoaderFunctionArgs) {
	try {
		const { userId, connection } = await requireAuthAndConnection(request);
		const { repositories } = createMoneyWorksClientWithRepositories(connection);

		// Use the company information repository
		const companyData =
			await repositories.companyInformation.getCompanyInformation();

		console.log("[Company Loader] Company data from repository:", companyData);

		// If we got no data at all, show an error
		if (Object.keys(companyData).length === 0) {
			throw new Error("Unable to fetch any company information");
		}

		return json<LoaderData>({
			company: { Company: companyData },
			connectionId: connection.id,
		});
	} catch (error) {
		if (error instanceof Response) {
			throw error; // Re-throw Response objects (401, 400, etc)
		}
		console.error("[Company Loader] Error:", error);
		throw new Response("Failed to load company data", { status: 500 });
	}
}

export default function Company() {
	return (
		<AuthGuard requireConnection={true}>
			<CompanyContent />
		</AuthGuard>
	);
}

function CompanyContent() {
	const { t } = useTranslation();
	const { company, connectionId } = useLoaderData<typeof loader>();

	if (!company?.Company) {
		return (
			<>
				<Navigation />
				<main className="container py-8">
					<div className="rounded-lg border bg-muted/50 p-8 text-center">
						<p className="text-muted-foreground">No company data available</p>
					</div>
				</main>
			</>
		);
	}

	const companyInfo = company.Company;

	const InfoRow = ({
		icon: Icon,
		label,
		value,
		type = "text",
	}: {
		icon: any;
		label: string;
		value?: string | number | boolean;
		type?: "text" | "boolean" | "currency" | "number";
	}) => {
		// Only skip if truly empty - allow 0, false, etc.
		if (
			value === undefined ||
			value === null ||
			(typeof value === "string" && value === "")
		)
			return null;

		const renderValue = () => {
			switch (type) {
				case "boolean":
					return value ? (
						<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
							Enabled
						</span>
					) : (
						<span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800">
							Disabled
						</span>
					);
				case "currency":
					return <span className="font-mono">{value}</span>;
				case "number":
					return <span className="font-mono">{value}</span>;
				default:
					return <span>{value}</span>;
			}
		};

		return (
			<div className="flex items-start space-x-3 py-2">
				<Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
				<div className="flex-1">
					<p className="text-sm font-medium text-muted-foreground">{label}</p>
					<div className="mt-0.5">{renderValue()}</div>
				</div>
			</div>
		);
	};

	const formatAddress = () => {
		const parts = [
			companyInfo.Address1,
			companyInfo.Address2,
			companyInfo.Address3,
			companyInfo.Address4,
			companyInfo.Country,
		].filter(Boolean);
		return parts.length > 0 ? parts.join("\n") : null;
	};

	const formatPeriodInfo = () => {
		const period = companyInfo.CurrentPeriod || companyInfo.CurrentPer;
		const total = companyInfo.PeriodLength || companyInfo.PeriodsInYear || 12;
		if (period) {
			return `Period ${period} of ${total}`;
		}
		return null;
	};

	return (
		<>
			<Navigation />
			<main className="container py-8 max-w-7xl">
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								{companyInfo.Name || t("company.title")}
							</h1>
							<p className="text-muted-foreground mt-2">
								{t("company.description")}
							</p>
						</div>
						{companyInfo.Version && (
							<span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
								MoneyWorks {companyInfo.Version}
							</span>
						)}
					</div>
				</div>

				{/* Warnings if any */}
				{company?.errors && company.errors.length > 0 && (
					<Alert className="mb-6">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>
							Some company information could not be loaded. The available data
							is shown below.
						</AlertDescription>
					</Alert>
				)}

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{/* Company Details */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center text-base">
								<Building2 className="mr-2 h-4 w-4" />
								Company Details
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-1">
							<InfoRow
								icon={Building2}
								label="Company Name"
								value={companyInfo.Name}
							/>
							{formatAddress() && (
								<div className="flex items-start space-x-3 py-2">
									<MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
									<div className="flex-1">
										<p className="text-sm font-medium text-muted-foreground">
											Address
										</p>
										<pre className="mt-0.5 text-sm whitespace-pre-wrap font-sans">
											{formatAddress()}
										</pre>
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Contact Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center text-base">
								<Phone className="mr-2 h-4 w-4" />
								Contact Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-1">
							<InfoRow icon={Phone} label="Phone" value={companyInfo.Phone} />
							<InfoRow icon={Phone} label="Fax" value={companyInfo.Fax} />
							<InfoRow icon={Mail} label="Email" value={companyInfo.Email} />
							<InfoRow
								icon={Globe}
								label="Website"
								value={companyInfo.Web || companyInfo.WebURL}
							/>
						</CardContent>
					</Card>

					{/* Tax & Legal */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center text-base">
								<FileText className="mr-2 h-4 w-4" />
								Tax & Legal
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-1">
							<InfoRow
								icon={Hash}
								label="Tax Number"
								value={companyInfo.TaxNumber || companyInfo.GstNum}
							/>
							<InfoRow
								icon={Hash}
								label="Company Number"
								value={companyInfo.CompanyNumber}
							/>
							<InfoRow
								icon={Calendar}
								label="GST Cycle"
								value={
									companyInfo.GSTCycleMonths
										? `${companyInfo.GSTCycleMonths} months`
										: undefined
								}
							/>
							<InfoRow
								icon={DollarSign}
								label="GST Enabled"
								value={companyInfo.GSTEnabled}
								type="boolean"
							/>
							<InfoRow
								icon={DollarSign}
								label="Cash Basis GST"
								value={companyInfo.GSTCashBasis}
								type="boolean"
							/>
						</CardContent>
					</Card>

					{/* Accounting Periods */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center text-base">
								<Calendar className="mr-2 h-4 w-4" />
								Accounting Periods
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-1">
							<InfoRow
								icon={Clock}
								label="Current Period"
								value={formatPeriodInfo() || undefined}
							/>
							<InfoRow
								icon={Calendar}
								label="Period Start"
								value={companyInfo.PeriodStart}
							/>
							<InfoRow
								icon={Calendar}
								label="Period End"
								value={companyInfo.PeriodEnd}
							/>
							<InfoRow
								icon={Calendar}
								label="Year Start"
								value={companyInfo.YearStart}
							/>
							<InfoRow
								icon={Calendar}
								label="Year End"
								value={companyInfo.YearEnd}
							/>
						</CardContent>
					</Card>

					{/* Currency & Features */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center text-base">
								<DollarSign className="mr-2 h-4 w-4" />
								Currency & Features
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-1">
							<InfoRow
								icon={DollarSign}
								label="Base Currency"
								value={companyInfo.BaseCurrency}
								type="currency"
							/>
							<InfoRow
								icon={Settings}
								label="Multi-Currency"
								value={companyInfo.MultiCurrencyEnabled}
								type="boolean"
							/>
							<InfoRow
								icon={Settings}
								label="Extended Job Costing"
								value={companyInfo.ExtendedJobCosting}
								type="boolean"
							/>
						</CardContent>
					</Card>

					{/* System Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center text-base">
								<Database className="mr-2 h-4 w-4" />
								System Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-1">
							<InfoRow
								icon={Database}
								label="Version"
								value={companyInfo.Version}
							/>
							<InfoRow icon={Globe} label="Locale" value={companyInfo.Locale} />
							<InfoRow
								icon={Settings}
								label="Platform"
								value={companyInfo.Platform}
							/>
							<InfoRow
								icon={Clock}
								label="Time Zone"
								value={companyInfo.TimeZone}
							/>
							<InfoRow
								icon={FileText}
								label="Date Format"
								value={companyInfo.DateFormat}
							/>
							<InfoRow
								icon={Hash}
								label="Number Format"
								value={companyInfo.NumberFormat}
							/>
						</CardContent>
					</Card>
				</div>
			</main>
		</>
	);
}
