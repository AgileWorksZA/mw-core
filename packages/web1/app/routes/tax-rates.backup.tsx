import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	Download,
	Edit,
	Filter,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import { Navigation } from "~/components/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { type TaxRate, api } from "~/lib/api";

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const format = url.searchParams.get("format") || "full";
	const page = Number.parseInt(url.searchParams.get("page") || "1");
	const pageSize = Number.parseInt(url.searchParams.get("pageSize") || "20");

	try {
		const response = await api.getTaxRates({
			format: format as any,
			limit: pageSize,
			offset: (page - 1) * pageSize,
		});

		return {
			taxRates: response.data,
			meta: response.metadata || { total: 0, page, pageSize },
			error: null,
		};
	} catch (error) {
		return {
			taxRates: [],
			meta: { total: 0, page: 1, pageSize: 20 },
			error:
				error instanceof Error ? error.message : "Failed to load tax rates",
		};
	}
}

export default function TaxRates() {
	const data = useLoaderData<typeof loader>();
	const { taxRates = [], meta, error } = data || {};
	const { t } = useTranslation();

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");

	const columns: ColumnDef<TaxRate>[] = [
		{
			accessorKey: "Code",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="-ml-4"
					>
						{t("taxRates.code")}
						{column.getIsSorted() === "asc" ? (
							<ArrowUp className="ml-2 h-4 w-4" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowDown className="ml-2 h-4 w-4" />
						) : (
							<ArrowUpDown className="ml-2 h-4 w-4" />
						)}
					</Button>
				);
			},
			cell: ({ row }) => (
				<Link
					to={`/tax-rates/${row.original.Code}`}
					className="font-medium text-primary hover:underline"
				>
					{row.original.Code}
				</Link>
			),
		},
		{
			accessorKey: "Rate",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="-ml-4"
					>
						{t("taxRates.rate")}
						{column.getIsSorted() === "asc" ? (
							<ArrowUp className="ml-2 h-4 w-4" />
						) : column.getIsSorted() === "desc" ? (
							<ArrowDown className="ml-2 h-4 w-4" />
						) : (
							<ArrowUpDown className="ml-2 h-4 w-4" />
						)}
					</Button>
				);
			},
			cell: ({ row }) => {
				const rate = Number.parseFloat(row.original.Rate || "0");
				return `${rate.toFixed(2)}%`;
			},
		},
		{
			accessorKey: "Type",
			header: t("taxRates.type"),
			cell: ({ row }) => {
				return row.original.Type || "-";
			},
		},
		{
			accessorKey: "Account",
			header: t("taxRates.account"),
		},
		{
			accessorKey: "Description",
			header: t("taxRates.description"),
			cell: ({ row }) => (
				<span className="max-w-[300px] truncate block">
					{row.original.Description}
				</span>
			),
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" asChild>
						<Link to={`/tax-rates/${row.original.Code}`}>
							<Edit className="h-4 w-4" />
						</Link>
					</Button>
					<Button variant="ghost" size="icon">
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			),
		},
	];

	const table = useReactTable({
		data: taxRates,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			columnFilters,
			globalFilter,
		},
	});

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
							Manage tax rates and accounting configurations
						</p>
					</div>
					<Button asChild>
						<Link to="/tax-rates/new">
							<Plus className="mr-2 h-4 w-4" />
							{t("taxRates.newTaxRate")}
						</Link>
					</Button>
				</div>

				{/* Toolbar */}
				<div className="mb-6 flex flex-col gap-4 rounded-lg border bg-card p-4">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-1 items-center gap-4">
							<div className="relative flex-1 max-w-sm">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder={t("common.search")}
									value={globalFilter}
									onChange={(e) => setGlobalFilter(e.target.value)}
									className="pl-9"
								/>
							</div>
							<Button variant="outline" size="icon">
								<Filter className="h-4 w-4" />
							</Button>
						</div>
						<div className="flex items-center gap-2">
							<Select defaultValue="20">
								<SelectTrigger className="w-[100px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="10">10</SelectItem>
									<SelectItem value="20">20</SelectItem>
									<SelectItem value="50">50</SelectItem>
									<SelectItem value="100">100</SelectItem>
								</SelectContent>
							</Select>
							<Button variant="outline">
								<Download className="mr-2 h-4 w-4" />
								{t("common.export")}
							</Button>
						</div>
					</div>
				</div>

				{/* Table */}
				<div className="rounded-lg border bg-card">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										{t("common.noData")}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{/* Pagination */}
				<div className="mt-4 flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Showing {taxRates.length} of {meta?.total || 0} results
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronLeft className="h-4 w-4" />
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</main>
		</>
	);
}
