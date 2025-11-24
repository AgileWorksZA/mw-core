/**
 * MoneyWorks Names CLI Commands
 *
 * Provides commands for managing Names (customers, suppliers, debtors, creditors)
 *
 * @ai-instruction Follows MW terminology: Customer/Debtor, Supplier/Creditor
 */

import { parseArgs } from "node:util";
import type { MoneyWorksName } from "@moneyworks/canonical/entities/names";
import type { GlobalOptions, SmartMoneyWorksClient } from "@moneyworks/data";
import { NameRepository } from "@moneyworks/data";
import { formatJson, formatList, formatTable } from "../utils/formatters";

/**
 * Names command handler
 * Provides subcommands for Name operations
 */
export async function namesCommand(
	client: SmartMoneyWorksClient,
	args: string[],
	globalOptions: GlobalOptions,
): Promise<void> {
	const subcommand = args[0];
	const subArgs = args.slice(1);

	switch (subcommand) {
		case "list":
			return listNames(client, subArgs, globalOptions);
		case "search":
			return searchNames(client, subArgs, globalOptions);
		case "customers":
			return listCustomers(client, subArgs, globalOptions);
		case "debtors":
			return listDebtors(client, subArgs, globalOptions);
		case "suppliers":
			return listSuppliers(client, subArgs, globalOptions);
		case "creditors":
			return listCreditors(client, subArgs, globalOptions);
		case "overdue":
			return listOverdue(client, subArgs, globalOptions);
		case "balances":
			return showBalances(client, subArgs, globalOptions);
		case "show":
			return showName(client, subArgs, globalOptions);
		case "create":
			return createName(client, subArgs, globalOptions);
		case "update":
			return updateName(client, subArgs, globalOptions);
		case "hold":
			return holdName(client, subArgs, globalOptions);
		default:
			showNamesHelp();
			process.exit(1);
	}
}

function showNamesHelp(): void {
	console.error("Usage: mw names <command> [options]");
	console.error("");
	console.error("Commands:");
	console.error("  list                List all names");
	console.error("  search <text>       Search names by text");
	console.error("  customers           List all customers (including debtors)");
	console.error("  debtors             List debtors only (have receivables)");
	console.error(
		"  suppliers           List all suppliers (including creditors)",
	);
	console.error("  creditors           List creditors only (have payables)");
	console.error("  overdue             List names with overdue balances");
	console.error("  balances            Show balance summary");
	console.error("  show <code>         Show details of a specific name");
	console.error("  create              Create a new name");
	console.error("  update <code>       Update an existing name");
	console.error("  hold <code>         Put a name on hold");
	console.error("");
	console.error("Common Options:");
	console.error(
		"  -f, --format <format>     Output format: table, json, list (default: table)",
	);
	console.error("  -l, --limit <number>      Limit number of records");
	console.error("  -s, --sort <field>        Sort by field (default: Name)");
	console.error("  --include-on-hold         Include names on hold");
	console.error("  --with-balances           Only show names with balances");
}

/**
 * List all names
 */
async function listNames(
	client: SmartMoneyWorksClient,
	args: string[],
	globalOptions: GlobalOptions,
): Promise<void> {
	const { values, positionals } = parseArgs({
		args,
		options: {
			format: { type: "string", short: "f", default: "table" },
			limit: { type: "string", short: "l" },
			sort: { type: "string", short: "s", default: "Name" },
			filter: { type: "string" },
		},
		strict: false,
		allowPositionals: true,
	});

	const repo = new NameRepository(client);

	try {
		const names = await repo.find(values.filter as string | undefined, {
			limit: values.limit ? Number.parseInt(values.limit as string) : undefined,
			sort: values.sort as string,
		});

		if (values.format === "json") {
			console.log(formatJson(names));
		} else if (values.format === "list") {
			names.forEach((name) => {
				console.log(`${name.Code} - ${name.Name} (${getNameType(name)})`);
			});
		} else {
			const headers = ["Code", "Name", "Type", "Phone", "Email", "Balance"];
			const rows = names.map((n) => [
				n.Code,
				n.Name,
				getNameType(n),
				n.Phone || "",
				n.email || "",
				formatBalance(n),
			]);
			console.log(formatTable(headers, rows));
		}
	} catch (error) {
		console.error("Error listing names:", error);
		process.exit(1);
	}
}

/**
 * Search names by text
 */
async function searchNames(
	client: SmartMoneyWorksClient,
	args: string[],
	globalOptions: GlobalOptions,
): Promise<void> {
	if (args.length === 0) {
		console.error("Error: Search text required");
		console.error("Usage: mw names search <text> [options]");
		process.exit(1);
	}

	const searchText = args[0];
	const { values } = parseArgs({
		args: args.slice(1),
		options: {
			format: { type: "string", short: "f", default: "table" },
			limit: { type: "string", short: "l" },
			fields: { type: "string", default: "Code,Name" },
			customerType: { type: "string", default: "all" },
			supplierType: { type: "string", default: "all" },
		},
		strict: false,
	});

	const repo = new NameRepository(client);

	try {
		const names = await repo.search(searchText, {
			searchFields: (values.fields as string).split(",") as (
				| "Code"
				| "Name"
				| "Phone"
				| "email"
				| "Contact"
			)[],
			customerType: values.customerType as
				| "all"
				| "customers"
				| "debtors"
				| "none",
			supplierType: values.supplierType as
				| "all"
				| "suppliers"
				| "creditors"
				| "none",
			limit: values.limit ? Number.parseInt(values.limit as string) : undefined,
		});

		if (values.format === "json") {
			console.log(formatJson(names));
		} else {
			const headers = ["Code", "Name", "Type", "Phone", "Email"];
			const rows = names.map((n) => [
				n.Code,
				n.Name,
				getNameType(n),
				n.Phone || "",
				n.email || "",
			]);
			console.log(formatTable(headers, rows));
		}
	} catch (error) {
		console.error("Error searching names:", error);
		process.exit(1);
	}
}

/**
 * List customers (including debtors)
 */
async function listCustomers(
	client: SmartMoneyWorksClient,
	args: string[],
	globalOptions: GlobalOptions,
): Promise<void> {
	const { values } = parseArgs({
		args,
		options: {
			format: { type: "string", short: "f", default: "table" },
			limit: { type: "string", short: "l" },
			sort: { type: "string", short: "s", default: "Name" },
			includeOnHold: { type: "boolean", default: false },
		},
		strict: false,
	});

	const repo = new NameRepository(client);

	try {
		const customers = await repo.getCustomers({
			includeOnHold: values.includeOnHold as boolean,
			orderBy: values.sort as string,
			limit: values.limit ? Number.parseInt(values.limit as string) : undefined,
		});

		if (values.format === "json") {
			console.log(formatJson(customers));
		} else {
			const headers = [
				"Code",
				"Name",
				"Type",
				"Terms",
				"Credit Limit",
				"Balance",
			];
			const rows = customers.map((c) => [
				c.Code,
				c.Name,
				c.CustomerType === 2 ? "Debtor" : "Customer",
				c.DebtorTerms ? `${c.DebtorTerms} days` : "",
				c.CreditLimit ? `$${c.CreditLimit.toFixed(2)}` : "",
				c.DCurrent ? `$${c.DCurrent.toFixed(2)}` : "",
			]);
			console.log(formatTable(headers, rows));
		}
	} catch (error) {
		console.error("Error listing customers:", error);
		process.exit(1);
	}
}

/**
 * List debtors only
 */
async function listDebtors(
	client: SmartMoneyWorksClient,
	args: string[],
	globalOptions: GlobalOptions,
): Promise<void> {
	const { values } = parseArgs({
		args,
		options: {
			format: { type: "string", short: "f", default: "table" },
			limit: { type: "string", short: "l" },
			sort: { type: "string", short: "s", default: "Name" },
			includeOnHold: { type: "boolean", default: false },
			withBalancesOnly: { type: "boolean", default: false },
		},
		strict: false,
	});

	const repo = new NameRepository(client);

	try {
		const debtors = await repo.getDebtors({
			includeOnHold: values.includeOnHold as boolean,
			withBalancesOnly: values.withBalancesOnly as boolean,
			orderBy: values.sort as string,
			limit: values.limit ? Number.parseInt(values.limit as string) : undefined,
		});

		if (values.format === "json") {
			console.log(formatJson(debtors));
		} else {
			const headers = ["Code", "Name", "Current", "30+", "60+", "90+", "Total"];
			const rows = debtors.map((d) => [
				d.Code,
				d.Name,
				formatCurrency(d.DCurrent),
				formatCurrency(d.D30Plus),
				formatCurrency(d.D60Plus),
				formatCurrency(d.D90Plus),
				formatCurrency(
					(d.DCurrent || 0) +
						(d.D30Plus || 0) +
						(d.D60Plus || 0) +
						(d.D90Plus || 0),
				),
			]);
			console.log(formatTable(headers, rows));
		}
	} catch (error) {
		console.error("Error listing debtors:", error);
		process.exit(1);
	}
}

/**
 * List suppliers (including creditors)
 */
async function listSuppliers(
	client: SmartMoneyWorksClient,
	args: string[],
	globalOptions: GlobalOptions,
): Promise<void> {
	const { values } = parseArgs({
		args,
		options: {
			format: { type: "string", short: "f", default: "table" },
			limit: { type: "string", short: "l" },
			sort: { type: "string", short: "s", default: "Name" },
		},
		strict: false,
	});

	const repo = new NameRepository(client);

	try {
		const suppliers = await repo.getSuppliers({
			orderBy: values.sort as string,
			limit: values.limit ? Number.parseInt(values.limit as string) : undefined,
		});

		if (values.format === "json") {
			console.log(formatJson(suppliers));
		} else {
			const headers = ["Code", "Name", "Type", "Terms", "Balance"];
			const rows = suppliers.map((s) => [
				s.Code,
				s.Name,
				s.SupplierType === 2 ? "Creditor" : "Supplier",
				s.CreditorTerms ? `${s.CreditorTerms} days` : "",
				s.CCurrent ? `$${s.CCurrent.toFixed(2)}` : "",
			]);
			console.log(formatTable(headers, rows));
		}
	} catch (error) {
		console.error("Error listing suppliers:", error);
		process.exit(1);
	}
}

/**
 * List creditors only
 */
async function listCreditors(
	client: SmartMoneyWorksClient,
	args: string[],
	globalOptions: GlobalOptions,
): Promise<void> {
	const { values } = parseArgs({
		args,
		options: {
			format: { type: "string", short: "f", default: "table" },
			limit: { type: "string", short: "l" },
			sort: { type: "string", short: "s", default: "Name" },
			withBalancesOnly: { type: "boolean", default: false },
		},
		strict: false,
	});

	const repo = new NameRepository(client);

	try {
		const creditors = await repo.getCreditors({
			withBalancesOnly: values.withBalancesOnly as boolean,
			orderBy: values.sort as string,
			limit: values.limit ? Number.parseInt(values.limit as string) : undefined,
		});

		if (values.format === "json") {
			console.log(formatJson(creditors));
		} else {
			const headers = ["Code", "Name", "Terms", "Balance"];
			const rows = creditors.map((c) => [
				c.Code,
				c.Name,
				c.CreditorTerms ? `${c.CreditorTerms} days` : "",
				formatCurrency(c.CCurrent),
			]);
			console.log(formatTable(headers, rows));
		}
	} catch (error) {
		console.error("Error listing creditors:", error);
		process.exit(1);
	}
}

/**
 * List overdue debtors
 */
async function listOverdue(
	client: SmartMoneyWorksClient,
	args: string[],
	globalOptions: GlobalOptions,
): Promise<void> {
	const { values } = parseArgs({
		args,
		options: {
			format: { type: "string", short: "f", default: "table" },
			days: { type: "string", default: "0" },
		},
		strict: false,
	});

	const repo = new NameRepository(client);

	try {
		const overdue = await repo.getOverdueDebtors(
			Number.parseInt(values.days as string),
		);

		if (values.format === "json") {
			console.log(formatJson(overdue));
		} else {
			const headers = [
				"Code",
				"Name",
				"Phone",
				"30+ Days",
				"60+ Days",
				"90+ Days",
				"Total Overdue",
			];
			const rows = overdue.map((d) => [
				d.Code,
				d.Name,
				d.Phone || "",
				formatCurrency(d.D30Plus),
				formatCurrency(d.D60Plus),
				formatCurrency(d.D90Plus),
				formatCurrency((d.D30Plus || 0) + (d.D60Plus || 0) + (d.D90Plus || 0)),
			]);
			console.log(formatTable(headers, rows));
		}
	} catch (error) {
		console.error("Error listing overdue debtors:", error);
		process.exit(1);
	}
}

/**
 * Show balance summary
 */
async function showBalances(
	client: SmartMoneyWorksClient,
	args: string[],
	globalOptions: GlobalOptions,
): Promise<void> {
	const { values } = parseArgs({
		args,
		options: {
			format: { type: "string", short: "f", default: "table" },
		},
		strict: false,
	});

	const repo = new NameRepository(client);

	try {
		const summary = await repo.getBalancesSummary();

		if (values.format === "json") {
			console.log(formatJson(summary));
		} else {
			console.log("MoneyWorks Balance Summary");
			console.log("=========================");
			console.log(`Total Debtors: ${summary.totalDebtors}`);
			console.log(`Total Creditors: ${summary.totalCreditors}`);
			console.log("");
			console.log("Debtor Balances:");
			console.log(`  Current: ${formatCurrency(summary.debtorsCurrent)}`);
			console.log(`  30+ Days: ${formatCurrency(summary.debtors30Plus)}`);
			console.log(`  60+ Days: ${formatCurrency(summary.debtors60Plus)}`);
			console.log(`  90+ Days: ${formatCurrency(summary.debtors90Plus)}`);
			console.log(
				`  Total: ${formatCurrency(
					summary.debtorsCurrent +
						summary.debtors30Plus +
						summary.debtors60Plus +
						summary.debtors90Plus,
				)}`,
			);
			console.log("");
			console.log("Creditor Balances:");
			console.log(`  Total: ${formatCurrency(summary.creditorsTotal)}`);
		}
	} catch (error) {
		console.error("Error getting balance summary:", error);
		process.exit(1);
	}
}

/**
 * Show details of a specific name
 */
async function showName(
	client: SmartMoneyWorksClient,
	args: string[],
	globalOptions: GlobalOptions,
): Promise<void> {
	if (args.length === 0) {
		console.error("Error: Name code required");
		console.error("Usage: mw names show <code>");
		process.exit(1);
	}

	const code = args[0];
	const { values } = parseArgs({
		args: args.slice(1),
		options: {
			format: { type: "string", short: "f", default: "detail" },
		},
		strict: false,
	});

	const repo = new NameRepository(client);

	try {
		const name = await repo.findByKey(code);

		if (!name) {
			console.error(`Error: Name with code '${code}' not found`);
			process.exit(1);
		}

		if (values.format === "json") {
			console.log(formatJson(name));
		} else {
			console.log(`Name: ${name.Name} (${name.Code})`);
			console.log(`Type: ${getNameType(name)}`);
			console.log("");
			console.log("Contact Information:");
			console.log(`  Address: ${formatAddress(name)}`);
			console.log(`  Phone: ${name.Phone || "N/A"}`);
			console.log(`  Email: ${name.email || "N/A"}`);
			console.log(`  Contact: ${name.Contact || "N/A"}`);
			console.log("");

			if (name.CustomerType > 0) {
				console.log("Customer Information:");
				console.log(
					`  Type: ${name.CustomerType === 2 ? "Debtor" : "Customer"}`,
				);
				if (name.CustomerType === 2) {
					console.log(`  Receivables Account: ${name.RecAccount || "N/A"}`);
					console.log(`  Credit Limit: ${formatCurrency(name.CreditLimit)}`);
					console.log(
						`  Terms: ${name.DebtorTerms ? `${name.DebtorTerms} days` : "N/A"}`,
					);
					console.log(`  Current Balance: ${formatCurrency(name.DCurrent)}`);
					if (
						(name.D30Plus || 0) + (name.D60Plus || 0) + (name.D90Plus || 0) >
						0
					) {
						console.log(`  30+ Days: ${formatCurrency(name.D30Plus)}`);
						console.log(`  60+ Days: ${formatCurrency(name.D60Plus)}`);
						console.log(`  90+ Days: ${formatCurrency(name.D90Plus)}`);
					}
				}
			}

			if (name.SupplierType > 0) {
				console.log("");
				console.log("Supplier Information:");
				console.log(
					`  Type: ${name.SupplierType === 2 ? "Creditor" : "Supplier"}`,
				);
				if (name.SupplierType === 2) {
					console.log(`  Payables Account: ${name.PayAccount || "N/A"}`);
					console.log(
						`  Terms: ${name.CreditorTerms ? `${name.CreditorTerms} days` : "N/A"}`,
					);
					console.log(`  Current Balance: ${formatCurrency(name.CCurrent)}`);
				}
			}

			if (name.Hold) {
				console.log("");
				console.log("⚠️  This name is ON HOLD");
			}
		}
	} catch (error) {
		console.error("Error showing name:", error);
		process.exit(1);
	}
}

/**
 * Create a new name (interactive)
 */
async function createName(
	client: SmartMoneyWorksClient,
	args: string[],
	globalOptions: GlobalOptions,
): Promise<void> {
	console.error("Error: Create name command not yet implemented");
	console.error("This will provide an interactive prompt to create new names");
	process.exit(1);
}

/**
 * Update an existing name (interactive)
 */
async function updateName(
	client: SmartMoneyWorksClient,
	args: string[],
	globalOptions: GlobalOptions,
): Promise<void> {
	if (args.length === 0) {
		console.error("Error: Name code required");
		console.error("Usage: mw names update <code>");
		process.exit(1);
	}

	console.error("Error: Update name command not yet implemented");
	console.error("This will provide an interactive prompt to update names");
	process.exit(1);
}

/**
 * Put a name on hold or release from hold
 */
async function holdName(
	client: SmartMoneyWorksClient,
	args: string[],
	globalOptions: GlobalOptions,
): Promise<void> {
	if (args.length === 0) {
		console.error("Error: Name code required");
		console.error("Usage: mw names hold <code> [--release]");
		process.exit(1);
	}

	const code = args[0];
	const { values } = parseArgs({
		args: args.slice(1),
		options: {
			release: { type: "boolean", default: false },
		},
		strict: false,
	});

	const repo = new NameRepository(client);

	try {
		// @ts-expect-error - code is a string but needs to be NameCode branded type
		const name = await repo.putOnHold(code, !values.release);
		const status = values.release ? "released from hold" : "put on hold";
		console.log(`✓ Name ${name.Code} - ${name.Name} has been ${status}`);
	} catch (error) {
		console.error("Error updating hold status:", error);
		process.exit(1);
	}
}

// Helper functions
function getNameType(name: MoneyWorksName): string {
	const types: string[] = [];

	if (name.CustomerType === 2) types.push("Debtor");
	else if (name.CustomerType === 1) types.push("Customer");

	if (name.SupplierType === 2) types.push("Creditor");
	else if (name.SupplierType === 1) types.push("Supplier");

	return types.length > 0 ? types.join("/") : "Contact";
}

function formatBalance(name: MoneyWorksName): string {
	const debtorBalance =
		(name.DCurrent || 0) +
		(name.D30Plus || 0) +
		(name.D60Plus || 0) +
		(name.D90Plus || 0);
	const creditorBalance = name.CCurrent || 0;

	if (debtorBalance > 0) return formatCurrency(debtorBalance);
	if (creditorBalance > 0) return `(${formatCurrency(creditorBalance)})`;
	return "";
}

function formatCurrency(amount?: number | null): string {
	if (amount === null || amount === undefined) return "";
	return `$${amount.toFixed(2)}`;
}

function formatAddress(name: MoneyWorksName): string {
	const parts = [
		name.DeliveryAddress1,
		name.DeliveryAddress2,
		name.DeliveryAddress3,
		name.DeliveryAddress4,
	].filter(Boolean);

	return parts.length > 0 ? parts.join(", ") : "N/A";
}
