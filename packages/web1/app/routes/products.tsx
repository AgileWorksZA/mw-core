import { Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
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

interface Product {
	Code: string;
	Description: string;
	Type: number;
	SellPrice?: number;
	StockLevel?: number;
	Supplier?: string;
	Hash?: number;
	[key: string]: any;
}

interface LoaderData {
	products: Product[];
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
		const page = Number.parseInt(searchParams.get("page") || "1");
		const limit = Number.parseInt(searchParams.get("limit") || "50");
		const search = searchParams.get("search") || "";
		const type = searchParams.get("type") || "";
		const sort = searchParams.get("sort") || "Code";
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
			queryOptions.filter = `Code CONTAINS[cd] "${search}" OR Description CONTAINS[cd] "${search}"`;
		}

		// Add type filter if provided
		if (type) {
			const typeFilter = `Type = ${type}`;
			queryOptions.filter = queryOptions.filter
				? `(${queryOptions.filter}) AND ${typeFilter}`
				: typeFilter;
		}

		console.log("[Products Loader] Fetching with options:", queryOptions);

		// Fetch products using smartExport for object format
		const products = await client.smartExport("Product", {
			...queryOptions,
			exportFormat: "full",
		});

		// For now, we'll estimate total count (in production, you'd want a separate count query)
		const total =
			products.length < limit
				? (page - 1) * limit + products.length
				: page * limit + 1;
		const totalPages = Math.ceil(total / limit);

		return json<LoaderData>({
			products: products || [],
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
		console.error("[Products Loader] Error:", error);
		throw new Response("Failed to load products", { status: 500 });
	}
}

export default function Products() {
	return (
		<AuthGuard requireConnection={true}>
			<ProductsContent />
		</AuthGuard>
	);
}

function ProductsContent() {
	const { t } = useTranslation();
	const { products, pagination, filters } = useLoaderData<typeof loader>();
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

	// Get product type display name
	const getProductTypeDisplay = (type?: number) => {
		switch (type) {
			case 0:
				return "Stock";
			case 1:
				return "Service";
			case 2:
				return "Assembly";
			default:
				return "-";
		}
	};

	// Check if product is inventoried (Hash >= 8)
	const isInventoried = (hash?: number) => {
		return hash !== undefined && hash >= 8;
	};

	// Format currency
	const formatCurrency = (amount?: number) => {
		if (amount === undefined || amount === null) return "-";
		return `$${amount.toFixed(2)}`;
	};

	return (
		<>
			<Navigation />
			<main className="container py-8">
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Products</h1>
						<p className="text-muted-foreground mt-2">
							Stock, service, and assembly items in your inventory
						</p>
					</div>
					<Button asChild>
						<Link to="/products/new">
							<Plus className="mr-2 h-4 w-4" />
							New Product
						</Link>
					</Button>
				</div>

				{/* Search and filter controls */}
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search products by code or description..."
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
						<option value="0">Stock</option>
						<option value="1">Service</option>
						<option value="2">Assembly</option>
					</select>
				</div>

				{filters.search && (
					<div className="mb-4">
						<Alert>
							<AlertDescription>
								Showing results for: "{filters.search}"
								{filters.type &&
									` (${getProductTypeDisplay(Number.parseInt(filters.type))} only)`}
							</AlertDescription>
						</Alert>
					</div>
				)}

				{products.length === 0 ? (
					<div className="rounded-lg border bg-muted/50 p-8 text-center">
						<p className="text-muted-foreground">
							{filters.search
								? `No products found matching "${filters.search}"`
								: "No products found"}
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
												if (filters.sort === "Description") {
													updateParam(
														"order",
														filters.order === "asc" ? "desc" : "asc",
													);
												} else {
													updateParam("sort", "Description");
													updateParam("order", "asc");
												}
											}}
										>
											Description
											{filters.sort === "Description" && (
												<span className="ml-1">
													{filters.order === "asc" ? "↑" : "↓"}
												</span>
											)}
										</TableHead>
										<TableHead>Type</TableHead>
										<TableHead
											className="text-right cursor-pointer hover:text-foreground"
											onClick={() => {
												if (filters.sort === "SellPrice") {
													updateParam(
														"order",
														filters.order === "asc" ? "desc" : "asc",
													);
												} else {
													updateParam("sort", "SellPrice");
													updateParam("order", "asc");
												}
											}}
										>
											Sell Price
											{filters.sort === "SellPrice" && (
												<span className="ml-1">
													{filters.order === "asc" ? "↑" : "↓"}
												</span>
											)}
										</TableHead>
										<TableHead className="text-right">Stock Level</TableHead>
										<TableHead>Supplier</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{products.map((product) => (
										<TableRow key={product.Code}>
											<TableCell className="font-medium">
												{product.Code}
												{isInventoried(product.Hash) && (
													<span
														className="ml-2 text-xs text-muted-foreground"
														title="Inventoried"
													>
														📦
													</span>
												)}
											</TableCell>
											<TableCell>{product.Description || "-"}</TableCell>
											<TableCell>
												{getProductTypeDisplay(product.Type)}
											</TableCell>
											<TableCell className="text-right">
												{formatCurrency(product.SellPrice)}
											</TableCell>
											<TableCell className="text-right">
												{isInventoried(product.Hash)
													? product.StockLevel?.toFixed(2) || "0.00"
													: "N/A"}
											</TableCell>
											<TableCell>{product.Supplier || "-"}</TableCell>
											<TableCell className="text-right">
												<Button variant="ghost" size="sm" asChild>
													<Link to={`/products/${product.Code}`}>View</Link>
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
