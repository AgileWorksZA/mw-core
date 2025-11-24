import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	redirect,
} from "react-router";
import { Form, useLoaderData, useNavigate, useParams } from "react-router";
import { Navigation } from "~/components/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { type Product, api } from "~/lib/api";

export async function loader({ params }: LoaderFunctionArgs) {
	const { code } = params;

	if (code === "new") {
		return {
			product: null,
			isNew: true,
			error: null,
		};
	}

	try {
		// Since we don't have a single product endpoint, fetch all and find the one
		const response = await api.getProducts({ format: "full" });
		const product = response.data.find((p: Product) => p.Code === code);

		if (!product) {
			throw new Error("Product not found");
		}

		return {
			product,
			isNew: false,
			error: null,
		};
	} catch (error) {
		return {
			product: null,
			isNew: false,
			error: error instanceof Error ? error.message : "Failed to load product",
		};
	}
}

export async function action({ request, params }: ActionFunctionArgs) {
	const { code } = params;
	const formData = await request.formData();
	const intent = formData.get("intent");

	if (intent === "delete" && code !== "new") {
		try {
			await api.deleteProduct(code!);
			return redirect("/products");
		} catch (error) {
			return {
				error:
					error instanceof Error ? error.message : "Failed to delete product",
			};
		}
	}

	const data: Partial<Product> = {
		Code: formData.get("Code") as string,
		Description: formData.get("Description") as string,
		Type: Number.parseInt(formData.get("Type") as string),
		SellPrice: formData.get("SellPrice")
			? Number.parseFloat(formData.get("SellPrice") as string)
			: undefined,
		BuyPrice: formData.get("BuyPrice")
			? Number.parseFloat(formData.get("BuyPrice") as string)
			: undefined,
		Supplier: (formData.get("Supplier") as string) || undefined,
		COGAcct: (formData.get("COGAcct") as string) || undefined,
		SalesAcct: (formData.get("SalesAcct") as string) || undefined,
		StockAcct: (formData.get("StockAcct") as string) || undefined,
		ReorderLevel: formData.get("ReorderLevel")
			? Number.parseFloat(formData.get("ReorderLevel") as string)
			: undefined,
	};

	try {
		if (code === "new") {
			await api.createProduct(data);
		} else {
			await api.updateProduct(code!, data);
		}
		return redirect("/products");
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : "Failed to save product",
		};
	}
}

export default function ProductDetail() {
	const { product, isNew, error } = useLoaderData<typeof loader>();
	const navigate = useNavigate();
	const params = useParams();
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

	if (error && !isNew) {
		return (
			<>
				<Navigation />
				<main className="container py-8">
					<div className="rounded-lg border border-destructive bg-destructive/10 p-4">
						<p className="text-sm text-destructive">{error}</p>
					</div>
					<Button
						variant="outline"
						onClick={() => navigate("/products")}
						className="mt-4"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Products
					</Button>
				</main>
			</>
		);
	}

	return (
		<>
			<Navigation />
			<main className="container py-8 max-w-2xl">
				<div className="mb-8">
					<Button
						variant="ghost"
						onClick={() => navigate("/products")}
						className="mb-4"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Products
					</Button>
					<h1 className="text-3xl font-bold tracking-tight">
						{isNew ? "New Product" : "Edit Product"}
					</h1>
					{!isNew && (
						<div className="mt-2 flex items-center gap-2">
							<p className="text-muted-foreground">
								Editing product: {params.code}
							</p>
							{isInventoried(product?.Hash) && (
								<span
									className="text-xs text-muted-foreground"
									title="Inventoried"
								>
									📦
								</span>
							)}
						</div>
					)}
				</div>

				<Form method="post" className="space-y-6">
					<div className="rounded-lg border bg-card p-6">
						<h2 className="text-lg font-semibold mb-4">Basic Information</h2>
						<div className="grid gap-6">
							<div className="grid gap-2">
								<Label htmlFor="Code">Product Code</Label>
								<Input
									id="Code"
									name="Code"
									defaultValue={product?.Code || ""}
									required
									disabled={!isNew}
									placeholder="e.g., PROD-001"
								/>
								<p className="text-sm text-muted-foreground">
									Unique identifier for the product
								</p>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="Description">Description</Label>
								<Input
									id="Description"
									name="Description"
									defaultValue={product?.Description || ""}
									required
									placeholder="e.g., Widget Premium 2000"
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="Type">Product Type</Label>
								<Select name="Type" defaultValue={product?.Type?.toString() || "0"}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="0">Stock (Physical Inventory)</SelectItem>
										<SelectItem value="1">Service (Non-Physical)</SelectItem>
										<SelectItem value="2">Assembly (Build-to-Order)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					<div className="rounded-lg border bg-card p-6">
						<h2 className="text-lg font-semibold mb-4">Pricing</h2>
						<div className="grid gap-6 sm:grid-cols-2">
							<div className="grid gap-2">
								<Label htmlFor="SellPrice">Sell Price</Label>
								<Input
									id="SellPrice"
									name="SellPrice"
									type="number"
									step="0.01"
									defaultValue={product?.SellPrice?.toString() || ""}
									placeholder="0.00"
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="BuyPrice">Buy Price (Cost)</Label>
								<Input
									id="BuyPrice"
									name="BuyPrice"
									type="number"
									step="0.01"
									defaultValue={product?.BuyPrice?.toString() || ""}
									placeholder="0.00"
								/>
							</div>
						</div>
					</div>

					<div className="rounded-lg border bg-card p-6">
						<h2 className="text-lg font-semibold mb-4">
							Inventory & Supplier
						</h2>
						<div className="grid gap-6">
							<div className="grid gap-2">
								<Label htmlFor="Supplier">Supplier Code</Label>
								<Input
									id="Supplier"
									name="Supplier"
									defaultValue={product?.Supplier || ""}
									placeholder="e.g., SUP-001"
								/>
								<p className="text-sm text-muted-foreground">
									Code of the default supplier
								</p>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="ReorderLevel">Reorder Level</Label>
								<Input
									id="ReorderLevel"
									name="ReorderLevel"
									type="number"
									step="0.01"
									defaultValue={product?.ReorderLevel?.toString() || ""}
									placeholder="0.00"
								/>
								<p className="text-sm text-muted-foreground">
									Minimum stock level before reordering
								</p>
							</div>

							{!isNew && isInventoried(product?.Hash) && (
								<div className="rounded-lg bg-muted p-4">
									<div className="flex items-center gap-2 mb-2">
										<span className="text-lg">📦</span>
										<p className="font-medium">Current Stock Level</p>
									</div>
									<p className="text-2xl font-bold">
										{product?.StockLevel?.toFixed(2) || "0.00"}
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										This product is tracked in inventory
									</p>
								</div>
							)}
						</div>
					</div>

					<div className="rounded-lg border bg-card p-6">
						<h2 className="text-lg font-semibold mb-4">Account Codes</h2>
						<div className="grid gap-6 sm:grid-cols-3">
							<div className="grid gap-2">
								<Label htmlFor="COGAcct">COGS Account</Label>
								<Input
									id="COGAcct"
									name="COGAcct"
									defaultValue={product?.COGAcct || ""}
									placeholder="e.g., 5000"
								/>
								<p className="text-xs text-muted-foreground">
									Cost of Goods Sold
								</p>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="SalesAcct">Sales Account</Label>
								<Input
									id="SalesAcct"
									name="SalesAcct"
									defaultValue={product?.SalesAcct || ""}
									placeholder="e.g., 4000"
								/>
								<p className="text-xs text-muted-foreground">Revenue account</p>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="StockAcct">Stock Account</Label>
								<Input
									id="StockAcct"
									name="StockAcct"
									defaultValue={product?.StockAcct || ""}
									placeholder="e.g., 1400"
								/>
								<p className="text-xs text-muted-foreground">
									Inventory asset
								</p>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div>
							{!isNew &&
								(showDeleteConfirm ? (
									<div className="flex items-center gap-2">
										<p className="text-sm text-destructive">
											Are you sure you want to delete this product?
										</p>
										<Button
											type="submit"
											name="intent"
											value="delete"
											variant="destructive"
											size="sm"
										>
											Yes, Delete
										</Button>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => setShowDeleteConfirm(false)}
										>
											Cancel
										</Button>
									</div>
								) : (
									<Button
										type="button"
										variant="ghost"
										onClick={() => setShowDeleteConfirm(true)}
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Delete
									</Button>
								))}
						</div>
						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/products")}
							>
								Cancel
							</Button>
							<Button type="submit" name="intent" value="save">
								<Save className="mr-2 h-4 w-4" />
								Save Product
							</Button>
						</div>
					</div>
				</Form>
			</main>
		</>
	);
}
