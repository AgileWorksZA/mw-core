/**
 * YYYYMMDD with Methods - Real-world Examples
 *
 * This demonstrates how branded types with methods provide
 * an amazing developer experience for date handling
 */

import { d } from "@moneyworks/utilities";

// ===== Basic Usage =====
const invoiceDate = d`20250115`;

// Clean comparison syntax
if (invoiceDate.gt(new Date())) {
	console.log("Invoice is post-dated");
}

// Natural date arithmetic
const dueDate = invoiceDate.addDays(30);
const lateFeeDate = dueDate.addDays(7);

// ===== Real-world Invoice Processing =====
function processInvoice(invoice: {
	date: ReturnType<typeof d>;
	terms: number;
	amount: number;
}) {
	const today = d`${new Date()}`;
	const dueDate = invoice.date.addDays(invoice.terms);

	// Check payment status
	if (today.gt(dueDate)) {
		const daysLate = today.subtract(dueDate);
		const lateFee = invoice.amount * 0.02 * Math.ceil(daysLate / 30);

		return {
			status: "overdue",
			daysLate,
			lateFee,
			totalDue: invoice.amount + lateFee,
		};
	}

	// Check for early payment discount
	const discountDeadline = invoice.date.addDays(10);
	if (today.lte(discountDeadline)) {
		return {
			status: "discount_eligible",
			discount: invoice.amount * 0.02,
			discountDeadline: discountDeadline.format(),
		};
	}

	return {
		status: "current",
		daysUntilDue: dueDate.subtract(today),
	};
}

// ===== Financial Period Calculations =====
function getFiscalQuarter(date: ReturnType<typeof d>, fiscalYearStart = 4) {
	const period = date.toPeriod();
	const month = period % 100;

	// Adjust for fiscal year
	const fiscalMonth = (month - fiscalYearStart + 12) % 12;
	const quarter = Math.floor(fiscalMonth / 3) + 1;

	return {
		quarter,
		period,
		isYearEnd: fiscalMonth === 11,
	};
}

// ===== Working Days Calculation =====
function addWorkingDays(startDate: ReturnType<typeof d>, days: number) {
	let current = startDate;
	let workingDays = 0;

	while (workingDays < days) {
		current = current.addDays(1);
		if (!current.isWeekend()) {
			workingDays++;
		}
	}

	return current;
}

// Usage
const orderDate = d`20250115`;
const deliveryDate = addWorkingDays(orderDate, 5);
console.log(`Delivery by: ${deliveryDate.format()}`);

// ===== Date Range Validation =====
function isWithinRange(
	date: ReturnType<typeof d>,
	start: Date | string,
	end: Date | string,
): boolean {
	return date.gte(start) && date.lte(end);
}

// Clean usage
const transDate = d`20250615`;
const isQ2 = isWithinRange(transDate, "20250401", "20250630");

// ===== Reporting Periods =====
function getReportingPeriods(year: number) {
	const periods = [];

	for (let month = 1; month <= 12; month++) {
		const startDate = d`${year}${String(month).padStart(2, "0")}01`;
		const endDate = startDate.addMonths(1).addDays(-1); // Last day of month

		periods.push({
			period: startDate.toPeriod(),
			startDate: startDate.format(),
			endDate: endDate.format(),
			quarter: Math.ceil(month / 3),
			isLeapMonth: month === 2 && startDate.isLeapYear(),
		});
	}

	return periods;
}

// ===== Complex Business Rules =====
class PaymentSchedule {
	private baseDate: ReturnType<typeof d>;

	constructor(startDate: string | Date) {
		this.baseDate = d`${startDate}`;
	}

	getSchedule(months: number, dayOfMonth = 15) {
		const payments = [];
		let current = this.baseDate;

		for (let i = 0; i < months; i++) {
			// Ensure payment is on a weekday
			let paymentDate = current;
			while (paymentDate.isWeekend()) {
				paymentDate = paymentDate.addDays(1);
			}

			payments.push({
				dueDate: paymentDate.format(),
				period: paymentDate.toPeriod(),
				isFirstPayment: i === 0,
				isLastPayment: i === months - 1,
			});

			current = current.addMonths(1);
		}

		return payments;
	}
}

// ===== Chaining for Complex Logic =====
const contractStart = d`20250115`;

const milestone1 = contractStart.addMonths(3).addDays(-7); // 7 days before 3 months

const milestone2 = milestone1.addMonths(3).addDays(14); // 2 weeks after milestone 1 + 3 months

// Validate milestones
if (milestone2.subtract(contractStart) > 365) {
	console.warn("Project exceeds one year");
}

// ===== Integration with MoneyWorks =====
const transaction = {
	TransDate: d`20250115`,
	Period: d`20250115`.toPeriod(),
	DueDate: d`20250115`.addDays(30),
	isUrgent: d`20250115`
		.addDays(30)
		.lt(d`${new Date().setDate(new Date().getDate() + 7)}`),
};

// The beauty: It reads like natural language!
// "If transaction date is greater than today"
if (transaction.TransDate.gt(new Date())) {
	console.log("Future-dated transaction");
}

// "Add 30 days to get due date"
const payByDate = transaction.TransDate.addDays(30);

// "Check if it's within this fiscal year"
const fiscalYearEnd = d`20250331`;
const isCurrentFiscalYear = transaction.TransDate.lte(fiscalYearEnd);
