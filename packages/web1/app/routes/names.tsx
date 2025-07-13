import { Plus, Search, Truck, Users, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router";
import {
	type LoaderFunctionArgs,
	data as json,
	useLoaderData,
} from "react-router";
import { AuthGuard } from "~/components/auth-guard";
import { Navigation } from "~/components/navigation";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import {
	createMoneyWorksClient,
	requireAuthAndConnection,
} from "~/lib/server-utils";

interface Name {
	Code: string;
	Name: string;
	CustomerType?: number;
	SupplierType?: number;
	RecAccount?: string;
	PayAccount?: string;
	Phone?: string;
	email?: string;
	Contact?: string;
	CreditLimit?: number;
	DCurrent?: number;
	CCurrent?: number;
	Hold?: boolean;
	[key: string]: unknown;
}

interface LoaderData {
	names: Name[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	filters: {
		search?: string;
		customerType?: string;
		supplierType?: string;
		onHold?: string;
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
		const page = Number.parseInt(searchParams.get("page") || "1");
		const limit = Number.parseInt(searchParams.get("limit") || "50");
		const search = searchParams.get("search") || "";
		const customerType = searchParams.get("customerType") || "";
		const supplierType = searchParams.get("supplierType") || "";
		const onHold = searchParams.get("onHold") || "";
		const sort = searchParams.get("sort") || "Code";
		const order = (searchParams.get("order") || "asc") as "asc" | "desc";

		// Build MoneyWorks query options
		const queryOptions: Record<string, unknown> = {
			format: "json",
			limit,
			offset: (page - 1) * limit,
			sort: `${sort}${order === "desc" ? " DESC" : ""}`,
		};

		// Build filter conditions
		const filterConditions: string[] = [];

		// Add search filter if provided
		if (search) {
			filterConditions.push(
				`Code CONTAINS[cd] "${search}" OR Name CONTAINS[cd] "${search}" OR Contact CONTAINS[cd] "${search}"`,
			);
		}

		// Add customer type filter if provided
		if (customerType) {
			filterConditions.push(`CustomerType = ${customerType}`);
		}

		// Add supplier type filter if provided
		if (supplierType) {
			filterConditions.push(`SupplierType = ${supplierType}`);
		}

		// Add hold status filter if provided
		if (onHold === "true") {
			filterConditions.push("Hold = true");
		} else if (onHold === "false") {
			filterConditions.push("Hold = false");
		}

		// Combine all filter conditions
		if (filterConditions.length > 0) {
			queryOptions.filter = filterConditions.join(" AND ");
		}

		console.log("[Names Loader] Fetching with options:", queryOptions);

		// Fetch names using smartExport for object format
		const names = await client.smartExport("Name", {
			...queryOptions,
			exportFormat: "full",
		});

		// For now, we'll estimate total count (in production, you'd want a separate count query)
		const total =
			names.length < limit
				? (page - 1) * limit + names.length
				: page * limit + 1;
		const totalPages = Math.ceil(total / limit);

		return json<LoaderData>({
			names: names || [],
			pagination: {
				page,
				limit,
				total,
				totalPages,
			},
			filters: {
				search,
				customerType,
				supplierType,
				onHold,
				sort,
				order,
			},
		});
	} catch (error) {
		if (error instanceof Response) {
			throw error;
		}
		console.error("[Names Loader] Error:", error);
		throw new Response("Failed to load names", { status: 500 });
	}
}

export default function Names() {
	return (
		<AuthGuard requireConnection={true}>
			<NamesContent />
		</AuthGuard>
	);
}

function NamesContent() {
	const { t } = useTranslation();
	const { names, pagination, filters } = useLoaderData<typeof loader>();
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchValue, setSearchValue] = useState(filters.search || "");

	// Helper to update URL params
	const updateParam = useCallback(
		(key: string, value: string | null) => {
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
		},
		[searchParams, setSearchParams],
	);

	// Debounce search
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (searchValue !== filters.search) {
				updateParam("search", searchValue || null);
			}
		}, 300);
		return () => clearTimeout(timeoutId);
	}, [searchValue, filters.search, updateParam]);

	// Get customer type display name
	const getCustomerTypeDisplay = (type?: number) => {
		switch (type) {
			case 1:
				return "Customer";
			case 2:
				return "Debtor";
			default:
				return null;
		}
	};

	// Get supplier type display name
	const getSupplierTypeDisplay = (type?: number) => {
		switch (type) {
			case 1:
				return "Supplier";
			case 2:
				return "Creditor";
			default:
				return null;
		}
	};

	// Get name type badges
	const getNameTypeBadges = (name: Name) => {
		const badges = [];
		const customerType = getCustomerTypeDisplay(name.CustomerType);
		const supplierType = getSupplierTypeDisplay(name.SupplierType);

		if (customerType) {
			badges.push(
				<Badge key="customer" variant="secondary" className="text-xs">
					<Users className="mr-1 h-3 w-3" />
					{customerType}
				</Badge>,
			);
		}

		if (supplierType) {
			badges.push(
				<Badge key="supplier" variant="outline" className="text-xs">
					<Truck className="mr-1 h-3 w-3" />
					{supplierType}
				</Badge>,
			);
		}

		return badges;
	};

	// Format currency
	const formatCurrency = (amount?: number) => {
		if (amount === undefined || amount === null) return "-";
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
		}).format(amount);
	};

	return (
		<>
			<Navigation />
			<main className="container py-8">
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Names</h1>
						<p className="text-muted-foreground mt-2">
							Manage customers, suppliers, debtors, and creditors
						</p>
					</div>
					<Button asChild>
						<Link to="/names/new">
							<Plus className="mr-2 h-4 w-4" />
							New Name
						</Link>
					</Button>
				</div>

				{/* Search and filter controls */}
				<div className="mb-6 flex flex-col gap-4">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
						<div className="relative flex-1 max-w-sm">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search names, codes, or contacts..."
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
					</div>

					<div className="flex flex-wrap gap-2">
						{/* Customer Type filter */}
						<select
							className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
							value={filters.customerType || ""}
							onChange={(e) =>
								updateParam("customerType", e.target.value || null)
							}
						>
							<option value="">All Customer Types</option>
							<option value="0">Not Customer</option>
							<option value="1">Customer</option>
							<option value="2">Debtor</option>
						</select>

						{/* Supplier Type filter */}
						<select
							className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
							value={filters.supplierType || ""}
							onChange={(e) =>
								updateParam("supplierType", e.target.value || null)
							}
						>
							<option value="">All Supplier Types</option>
							<option value="0">Not Supplier</option>
							<option value="1">Supplier</option>
							<option value="2">Creditor</option>
						</select>

						{/* Hold Status filter */}
						<select
							className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
							value={filters.onHold || ""}
							onChange={(e) => updateParam("onHold", e.target.value || null)}
						>
							<option value="">All Hold Status</option>
							<option value="false">Active</option>
							<option value="true">On Hold</option>
						</select>
					</div>
				</div>

				{(filters.search ||
					filters.customerType ||
					filters.supplierType ||
					filters.onHold) && (
					<div className="mb-4">
						<Alert>
							<AlertDescription>
								Showing filtered results
								{filters.search && ` for: "${filters.search}"`}
								{filters.customerType &&
									` | Customer Type: ${getCustomerTypeDisplay(Number.parseInt(filters.customerType)) || "Not Customer"}`}
								{filters.supplierType &&
									` | Supplier Type: ${getSupplierTypeDisplay(Number.parseInt(filters.supplierType)) || "Not Supplier"}`}
								{filters.onHold &&
									` | ${filters.onHold === "true" ? "On Hold" : "Active"}`}
							</AlertDescription>
						</Alert>
					</div>
				)}

				{names.length === 0 ? (
					<div className="rounded-lg border bg-muted/50 p-8 text-center">
						<p className="text-muted-foreground">
							{filters.search ||
							filters.customerType ||
							filters.supplierType ||
							filters.onHold
								? "No names found matching the current filters"
								: "No names found"}
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
												if (filters.sort === "Code") {
													updateParam(
														"order",
														filters.order === "asc" ? "desc" : "asc",
													);
												} else {
													updateParam("sort", "Code");
													updateParam("order", "asc");
												}
											}}
										>
											Code
											{filters.sort === "Code" && (
												<span className="ml-1">
													{filters.order === "asc" ? "↑" : "↓"}
												</span>
											)}
										</TableHead>
										<TableHead
											className="cursor-pointer hover:text-foreground"
											onClick={() => {
												if (filters.sort === "Name") {
													updateParam(
														"order",
														filters.order === "asc" ? "desc" : "asc",
													);
												} else {
													updateParam("sort", "Name");
													updateParam("order", "asc");
												}
											}}
										>
											Name
											{filters.sort === "Name" && (
												<span className="ml-1">
													{filters.order === "asc" ? "↑" : "↓"}
												</span>
											)}
										</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Contact</TableHead>
										<TableHead className="text-right">Balance</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{names.map((name) => (
										<TableRow key={name.Code}>
											<TableCell className="font-medium">{name.Code}</TableCell>
											<TableCell>
												<div className="flex flex-col">
													<span className="font-medium">
														{name.Name || "-"}
													</span>
													{name.email && (
														<span className="text-xs text-muted-foreground">
															{name.email}
														</span>
													)}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex flex-wrap gap-1">
													{getNameTypeBadges(name)}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex flex-col">
													{name.Contact && (
														<span className="text-sm">{name.Contact}</span>
													)}
													{name.Phone && (
														<span className="text-xs text-muted-foreground">
															{name.Phone}
														</span>
													)}
												</div>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex flex-col">
													{name.DCurrent !== undefined &&
														name.DCurrent !== 0 && (
															<span className="text-sm text-green-600">
																DR: {formatCurrency(name.DCurrent)}
															</span>
														)}
													{name.CCurrent !== undefined &&
														name.CCurrent !== 0 && (
															<span className="text-sm text-orange-600">
																CR: {formatCurrency(name.CCurrent)}
															</span>
														)}
													{(!name.DCurrent || name.DCurrent === 0) &&
														(!name.CCurrent || name.CCurrent === 0) && (
															<span className="text-sm text-muted-foreground">
																-
															</span>
														)}
												</div>
											</TableCell>
											<TableCell>
												{name.Hold ? (
													<Badge variant="destructive">On Hold</Badge>
												) : (
													<Badge variant="default">Active</Badge>
												)}
											</TableCell>
											<TableCell className="text-right">
												<Button variant="ghost" size="sm" asChild>
													<Link to={`/names/${name.Code}`}>Edit</Link>
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
										onClick={() =>
											updateParam("page", String(pagination.page - 1))
										}
										disabled={pagination.page <= 1}
									>
										Previous
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											updateParam("page", String(pagination.page + 1))
										}
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
