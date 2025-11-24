/**
 * Examples of using the YYYYMMDD tagged template literal
 * This file demonstrates the improved developer experience
 */

import type { YYYYMMDD as YYYYMMDDType } from "../types";
import { addDaysToYYYYMMDD, d, formatYYYYMMDD } from "./yyyymmdd";

// Basic usage - much cleaner than createYYYYMMDD("20250115")
const date1 = d`20250115`;

// Works with various formats
const date2 = d`2025-01-15`;
const date3 = d`2025/01/15`;

// Dynamic values
const today = d`${new Date()}`;
const tomorrow = d`${new Date(Date.now() + 60 * 60 * 24 * 1000)}`; // 1 day later

// Interpolation
const year = 2025;
const month = "01";
const day = "15";
const composed = d`${year}${month}${day}`;

// Clean syntax with the d tagged template
const invoice = {
	id: 1001,
	transDate: d`20250115`,
	dueDate: d`20250215`,
	description: "Test invoice",
};

// Type-safe operations
function processTransaction(date: YYYYMMDDType) {
	const nextMonth = addDaysToYYYYMMDD(date, 30);
	return {
		original: formatYYYYMMDD(date),
		nextMonth: formatYYYYMMDD(nextMonth),
	};
}

// Using with the tagged template
const result = processTransaction(d`20250115`);

// Array of dates
const holidays = [
	d`20250101`, // New Year
	d`20250704`, // Independence Day
	d`20251225`, // Christmas
];

// Conditional dates
const effectiveDate = d`${
	new Date().getMonth() === 0
		? new Date(new Date().getFullYear(), 0, 1) // Jan 1st if January
		: new Date() // Today otherwise
}`;

// With error handling (invalid dates throw)
try {
	const invalid = d`20251301`; // Invalid month
} catch (error) {
	console.error("Invalid date");
}

// Comparison remains simple
if (d`20250115` < d`20250120`) {
	console.log("First date is earlier");
}

// Works seamlessly with JSON
const jsonData = JSON.stringify({
	startDate: d`20250101`,
	endDate: d`20251231`,
});
// Output: {"startDate":"20250101","endDate":"20251231"}
