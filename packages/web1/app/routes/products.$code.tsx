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
		const product = response.data.find((p: Product) => p.code === code);

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
		code: formData.get("code") as string,
		description: formData.get("description") as string,
		type: formData.get("type") as string, // 'P', 'S', or 'A'
		sellprice: formData.get("sellprice")
			? Number.parseFloat(formData.get("sellprice") as string)
			: undefined,
		buyprice: formData.get("buyprice")
			? Number.parseFloat(formData.get("buyprice") as string)
			: undefined,
		supplier: (formData.get("supplier") as string) || undefined,
		cogacct: (formData.get("cogacct") as string) || undefined,
		salesacct: (formData.get("salesacct") as string) || undefined,
		stockacct: (formData.get("stockacct") as string) || undefined,
		reorderlevel: formData.get("reorderlevel")
			? Number.parseFloat(formData.get("reorderlevel") as string)
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

	// Get product type display name - MoneyWorks uses character codes
	const getProductTypeDisplay = (type?: string) => {
		switch (type) {
			case "P":
				return "Stock";
			case "S":
				return "Service";
			case "A":
				return "Assembly";
			default:
				return type || "-";
		}
	};

	// Check if product is inventoried (flags >= 8)
	const isInventoried = (flags?: number) => {
		return flags !== undefined && flags >= 8;
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
							{isInventoried(product?.flags) && (
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
								<Label htmlFor="code">Product Code</Label>
								<Input
									id="code"
									name="code"
									defaultValue={product?.code || ""}
									required
									disabled={!isNew}
									placeholder="e.g., PROD-001"
								/>
								<p className="text-sm text-muted-foreground">
									Unique identifier for the product
								</p>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="description">Description</Label>
								<Input
									id="description"
									name="description"
									defaultValue={product?.description || ""}
									required
									placeholder="e.g., Widget Premium 2000"
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="type">Product Type</Label>
								<Select name="type" defaultValue={product?.type || "P"}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="P">Stock (Physical Inventory)</SelectItem>
										<SelectItem value="S">Service (Non-Physical)</SelectItem>
										<SelectItem value="A">Assembly (Build-to-Order)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					<div className="rounded-lg border bg-card p-6">
						<h2 className="text-lg font-semibold mb-4">Pricing</h2>
						<div className="grid gap-6 sm:grid-cols-2">
							<div className="grid gap-2">
								<Label htmlFor="sellprice">Sell Price</Label>
								<Input
									id="sellprice"
									name="sellprice"
									type="number"
									step="0.01"
									defaultValue={product?.sellprice?.toString() || ""}
									placeholder="0.00"
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="buyprice">Buy Price (Cost)</Label>
								<Input
									id="buyprice"
									name="buyprice"
									type="number"
									step="0.01"
									defaultValue={product?.buyprice?.toString() || ""}
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
								<Label htmlFor="supplier">Supplier Code</Label>
								<Input
									id="supplier"
									name="supplier"
									defaultValue={product?.supplier || ""}
									placeholder="e.g., SUP-001"
								/>
								<p className="text-sm text-muted-foreground">
									Code of the default supplier
								</p>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="reorderlevel">Reorder Level</Label>
								<Input
									id="reorderlevel"
									name="reorderlevel"
									type="number"
									step="0.01"
									defaultValue={product?.reorderlevel?.toString() || ""}
									placeholder="0.00"
								/>
								<p className="text-sm text-muted-foreground">
									Minimum stock level before reordering
								</p>
							</div>

							{!isNew && isInventoried(product?.flags) && (
								<div className="rounded-lg bg-muted p-4">
									<div className="flex items-center gap-2 mb-2">
										<span className="text-lg">📦</span>
										<p className="font-medium">Current Stock Level</p>
									</div>
									<p className="text-2xl font-bold">
										{product?.stockonhand?.toFixed(2) || "0.00"}
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
								<Label htmlFor="cogacct">COGS Account</Label>
								<Input
									id="cogacct"
									name="cogacct"
									defaultValue={product?.cogacct || ""}
									placeholder="e.g., 5000"
								/>
								<p className="text-xs text-muted-foreground">
									Cost of Goods Sold
								</p>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="salesacct">Sales Account</Label>
								<Input
									id="salesacct"
									name="salesacct"
									defaultValue={product?.salesacct || ""}
									placeholder="e.g., 4000"
								/>
								<p className="text-xs text-muted-foreground">Revenue account</p>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="stockacct">Stock Account</Label>
								<Input
									id="stockacct"
									name="stockacct"
									defaultValue={product?.stockacct || ""}
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
