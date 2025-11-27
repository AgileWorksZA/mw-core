/**
 * Diff Engine
 * Compares two snapshots and identifies changes
 *
 * @moneyworks-dsl PURE
 */

import type {
	DiffResult,
	DiffOptions,
	DiffSummary,
	TableDiff,
	RecordDiff,
	FieldChange,
	AddedRecord,
	DeletedRecord,
	LoadedSnapshot,
} from "./diff-types";
import { getPrimaryKeyField, type TableSnapshot } from "./types";

/**
 * Default output directory for snapshots
 */
const DEFAULT_SNAPSHOT_DIR = ".snapshots";

/**
 * Load a snapshot from disk
 */
export async function loadSnapshot(
	label: string,
	snapshotDir: string = DEFAULT_SNAPSHOT_DIR,
): Promise<LoadedSnapshot> {
	const snapshotPath = `${snapshotDir}/${label}`;
	const tables = new Map<string, Record<string, unknown>[]>();
	const availableTables: string[] = [];

	// Read metadata to get table list
	const metadataPath = `${snapshotPath}/metadata.json`;
	const metadataFile = Bun.file(metadataPath);

	if (!(await metadataFile.exists())) {
		throw new Error(`Snapshot not found: ${label} (no metadata.json at ${metadataPath})`);
	}

	const metadata = await metadataFile.json();

	// Load each table's data
	for (const tableName of metadata.tables) {
		const tablePath = `${snapshotPath}/${tableName}.json`;
		const tableFile = Bun.file(tablePath);

		if (await tableFile.exists()) {
			const tableSnapshot: TableSnapshot = await tableFile.json();
			tables.set(tableName, tableSnapshot.records);
			availableTables.push(tableName);
		}
	}

	return {
		label,
		path: snapshotPath,
		tables,
		availableTables,
	};
}

/**
 * Compare two values for equality
 * Handles null, undefined, and type coercion
 */
function valuesEqual(a: unknown, b: unknown): boolean {
	// Handle null/undefined
	if (a === null && b === null) return true;
	if (a === undefined && b === undefined) return true;
	if (a === null || a === undefined || b === null || b === undefined) return false;

	// Handle arrays
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if (!valuesEqual(a[i], b[i])) return false;
		}
		return true;
	}

	// Handle objects
	if (typeof a === "object" && typeof b === "object") {
		const keysA = Object.keys(a as object);
		const keysB = Object.keys(b as object);
		if (keysA.length !== keysB.length) return false;
		for (const key of keysA) {
			if (!valuesEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
				return false;
			}
		}
		return true;
	}

	// Primitive comparison
	return a === b;
}

/**
 * Compare records in a single table
 */
function compareTableRecords(
	tableName: string,
	beforeRecords: Record<string, unknown>[],
	afterRecords: Record<string, unknown>[],
	options: DiffOptions = {},
): TableDiff {
	const pkField = getPrimaryKeyField(tableName);
	const ignoreFields = new Set(options.ignoreFields || ["_primaryKey"]);
	ignoreFields.add("_primaryKey"); // Always ignore internal field

	// Build lookup maps by primary key
	const beforeMap = new Map<string | number, Record<string, unknown>>();
	const afterMap = new Map<string | number, Record<string, unknown>>();

	for (const record of beforeRecords) {
		const pk = record[pkField] as string | number;
		if (pk !== undefined && pk !== null) {
			beforeMap.set(pk, record);
		}
	}

	for (const record of afterRecords) {
		const pk = record[pkField] as string | number;
		if (pk !== undefined && pk !== null) {
			afterMap.set(pk, record);
		}
	}

	const added: AddedRecord[] = [];
	const deleted: DeletedRecord[] = [];
	const modified: RecordDiff[] = [];
	let unchanged = 0;

	// Find added records (in after, not in before)
	const afterEntries = Array.from(afterMap.entries());
	for (let i = 0; i < afterEntries.length; i++) {
		const [pk, record] = afterEntries[i];
		if (!beforeMap.has(pk)) {
			added.push({ primaryKey: pk, record });
		}
	}

	// Find deleted records (in before, not in after)
	const beforeEntries = Array.from(beforeMap.entries());
	for (let i = 0; i < beforeEntries.length; i++) {
		const [pk, record] = beforeEntries[i];
		if (!afterMap.has(pk)) {
			deleted.push({ primaryKey: pk, record });
		}
	}

	// Find modified records (in both, but different)
	for (let i = 0; i < beforeEntries.length; i++) {
		const [pk, beforeRecord] = beforeEntries[i];
		const afterRecord = afterMap.get(pk);
		if (!afterRecord) continue;

		// Compare all fields
		const changes: FieldChange[] = [];
		const allFieldsArr = Object.keys(beforeRecord).concat(Object.keys(afterRecord));
		const allFields = Array.from(new Set(allFieldsArr));

		for (let j = 0; j < allFields.length; j++) {
			const field = allFields[j];
			if (ignoreFields.has(field)) continue;

			const oldValue = beforeRecord[field];
			const newValue = afterRecord[field];

			if (!valuesEqual(oldValue, newValue)) {
				changes.push({ field, oldValue, newValue });
			}
		}

		if (changes.length > 0) {
			modified.push({
				primaryKey: pk,
				primaryKeyField: pkField,
				changes,
			});
		} else {
			unchanged++;
		}
	}

	return {
		tableName,
		added,
		deleted,
		modified,
		counts: {
			added: added.length,
			deleted: deleted.length,
			modified: modified.length,
			unchanged,
		},
	};
}

/**
 * Compare two snapshots and return detailed diff
 */
export async function compareSnapshots(
	beforeLabel: string,
	afterLabel: string,
	options: DiffOptions = {},
	snapshotDir: string = DEFAULT_SNAPSHOT_DIR,
): Promise<DiffResult> {
	// Load both snapshots
	const beforeSnapshot = await loadSnapshot(beforeLabel, snapshotDir);
	const afterSnapshot = await loadSnapshot(afterLabel, snapshotDir);

	// Determine tables to compare
	let tablesToCompare: string[];
	if (options.tables) {
		tablesToCompare = options.tables;
	} else {
		const allTables = beforeSnapshot.availableTables.concat(afterSnapshot.availableTables);
		tablesToCompare = Array.from(new Set(allTables));
	}

	const tableDiffs: TableDiff[] = [];
	const summary: DiffSummary = {
		tablesCompared: 0,
		tablesWithChanges: 0,
		totalAdded: 0,
		totalDeleted: 0,
		totalModified: 0,
		totalUnchanged: 0,
	};

	// Compare each table
	for (const tableName of tablesToCompare) {
		const beforeRecords = beforeSnapshot.tables.get(tableName) || [];
		const afterRecords = afterSnapshot.tables.get(tableName) || [];

		const tableDiff = compareTableRecords(
			tableName,
			beforeRecords,
			afterRecords,
			options,
		);

		tableDiffs.push(tableDiff);

		// Update summary
		summary.tablesCompared++;
		if (
			tableDiff.counts.added > 0 ||
			tableDiff.counts.deleted > 0 ||
			tableDiff.counts.modified > 0
		) {
			summary.tablesWithChanges++;
		}
		summary.totalAdded += tableDiff.counts.added;
		summary.totalDeleted += tableDiff.counts.deleted;
		summary.totalModified += tableDiff.counts.modified;
		summary.totalUnchanged += tableDiff.counts.unchanged;
	}

	return {
		beforeLabel,
		afterLabel,
		computedAt: new Date().toISOString(),
		tables: tableDiffs,
		summary,
	};
}
