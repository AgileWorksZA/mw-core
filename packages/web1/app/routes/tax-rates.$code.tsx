import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	redirect,
} from "react-router";
import { Form, useLoaderData, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
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
import { type TaxRate, api } from "~/lib/api";

export async function loader({ params }: LoaderFunctionArgs) {
	const { code } = params;

	if (code === "new") {
		return {
			taxRate: null,
			isNew: true,
			error: null,
		};
	}

	try {
		// Since we don't have a single tax rate endpoint, fetch all and find the one
		const response = await api.getTaxRates({ format: "full" });
		const taxRate = response.data.find((tr: TaxRate) => tr.TaxCode === code);

		if (!taxRate) {
			throw new Error("Tax rate not found");
		}

		return {
			taxRate,
			isNew: false,
			error: null,
		};
	} catch (error) {
		return {
			taxRate: null,
			isNew: false,
			error: error instanceof Error ? error.message : "Failed to load tax rate",
		};
	}
}

export async function action({ request, params }: ActionFunctionArgs) {
	const { code } = params;
	const formData = await request.formData();
	const intent = formData.get("intent");

	if (intent === "delete" && code !== "new") {
		try {
			await api.deleteTaxRate(code!);
			return redirect("/tax-rates");
		} catch (error) {
			return {
				error:
					error instanceof Error ? error.message : "Failed to delete tax rate",
			};
		}
	}

	const data: Partial<TaxRate> = {
		TaxCode: formData.get("TaxCode") as string,
		Rate1: Number.parseFloat(formData.get("TaxRate") as string) / 100,
		Type: Number.parseInt(formData.get("TaxType") as string),
		RecAccount: formData.get("TaxAccount") as string,
		Ratename: formData.get("TaxDescription") as string,
	};

	try {
		if (code === "new") {
			await api.createTaxRate(data);
		} else {
			await api.updateTaxRate(code!, data);
		}
		return redirect("/tax-rates");
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : "Failed to save tax rate",
		};
	}
}

export default function TaxRateDetail() {
	const { taxRate, isNew, error } = useLoaderData<typeof loader>();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const params = useParams();
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
						onClick={() => navigate("/tax-rates")}
						className="mt-4"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Tax Rates
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
						onClick={() => navigate("/tax-rates")}
						className="mb-4"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Tax Rates
					</Button>
					<h1 className="text-3xl font-bold tracking-tight">
						{isNew ? t("taxRates.newTaxRate") : t("taxRates.editTaxRate")}
					</h1>
					{!isNew && (
						<p className="text-muted-foreground mt-2">
							Editing tax rate: {params.code}
						</p>
					)}
				</div>

				<Form method="post" className="space-y-6">
					<div className="rounded-lg border bg-card p-6">
						<div className="grid gap-6">
							<div className="grid gap-2">
								<Label htmlFor="TaxCode">{t("taxRates.code")}</Label>
								<Input
									id="TaxCode"
									name="TaxCode"
									defaultValue={taxRate?.TaxCode || ""}
									required
									disabled={!isNew}
									placeholder="e.g., GST"
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="TaxRate">{t("taxRates.rate")} (%)</Label>
								<Input
									id="TaxRate"
									name="TaxRate"
									type="number"
									step="0.01"
									defaultValue={
										taxRate?.Rate1 ? (taxRate.Rate1 * 100).toFixed(2) : ""
									}
									required
									placeholder="e.g., 15.00"
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="TaxType">{t("taxRates.type")}</Label>
								<Select
									name="TaxType"
									defaultValue={taxRate?.Type?.toString() || "3"}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="1">Sales</SelectItem>
										<SelectItem value="2">Purchase</SelectItem>
										<SelectItem value="3">Both</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="TaxAccount">{t("taxRates.account")}</Label>
								<Input
									id="TaxAccount"
									name="TaxAccount"
									defaultValue={taxRate?.RecAccount || ""}
									placeholder="e.g., 2150"
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="TaxDescription">
									{t("taxRates.description")}
								</Label>
								<Input
									id="TaxDescription"
									name="TaxDescription"
									defaultValue={taxRate?.Ratename || ""}
									placeholder="e.g., Goods and Services Tax"
								/>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div>
							{!isNew &&
								(showDeleteConfirm ? (
									<div className="flex items-center gap-2">
										<p className="text-sm text-destructive">
											{t("taxRates.deleteConfirm")}
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
										{t("common.delete")}
									</Button>
								))}
						</div>
						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/tax-rates")}
							>
								{t("common.cancel")}
							</Button>
							<Button type="submit" name="intent" value="save">
								<Save className="mr-2 h-4 w-4" />
								{t("common.save")}
							</Button>
						</div>
					</div>
				</Form>
			</main>
		</>
	);
}
