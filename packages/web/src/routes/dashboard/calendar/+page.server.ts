import { apiGet } from '$lib/api/client';
import type { ApiResponse, TransactionRecord } from '$lib/api/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const token = locals.token;
	const now = new Date();
	const yearParam = parseInt(url.searchParams.get('year') || '') || now.getFullYear();
	const monthParam = parseInt(url.searchParams.get('month') || '') || (now.getMonth() + 1);

	// Build calendar grid
	const firstDay = new Date(yearParam, monthParam - 1, 1);
	const lastDay = new Date(yearParam, monthParam, 0);
	const startOffset = firstDay.getDay(); // 0=Sun
	const daysInMonth = lastDay.getDate();

	const monthName = firstDay.toLocaleString('en', { month: 'long' });

	// Fetch transactions for this month to show activity indicators
	const startDate = `${yearParam}-${String(monthParam).padStart(2, '0')}-01`;
	const endDate = `${yearParam}-${String(monthParam).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

	let txRes: ApiResponse<TransactionRecord[]>;
	try {
		txRes = await apiGet<ApiResponse<TransactionRecord[]>>('/tables/transaction', {
			token, filter: `Transdate>="${startDate}" AND Transdate<="${endDate}"`, limit: 1000
		});
	} catch {
		txRes = { data: [] } as any;
	}

	// Count transactions per day
	const dayCounts = new Map<number, number>();
	for (const t of (txRes.data ?? [])) {
		const date = t.Transdate ?? '';
		const day = parseInt(date.split('-')[2] || '0');
		if (day > 0) dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
	}

	// Build calendar cells
	const cells: { day: number; inMonth: boolean; count: number; isToday: boolean }[] = [];
	// Previous month padding
	const prevMonthLast = new Date(yearParam, monthParam - 1, 0).getDate();
	for (let i = startOffset - 1; i >= 0; i--) {
		cells.push({ day: prevMonthLast - i, inMonth: false, count: 0, isToday: false });
	}
	// Current month
	const todayStr = now.toISOString().split('T')[0];
	for (let d = 1; d <= daysInMonth; d++) {
		const dateStr = `${yearParam}-${String(monthParam).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
		cells.push({ day: d, inMonth: true, count: dayCounts.get(d) ?? 0, isToday: dateStr === todayStr });
	}
	// Next month padding
	const remaining = 42 - cells.length; // 6 rows x 7
	for (let d = 1; d <= remaining; d++) {
		cells.push({ day: d, inMonth: false, count: 0, isToday: false });
	}

	// Nav links
	const prevMonth = monthParam === 1 ? 12 : monthParam - 1;
	const prevYear = monthParam === 1 ? yearParam - 1 : yearParam;
	const nextMonth = monthParam === 12 ? 1 : monthParam + 1;
	const nextYear = monthParam === 12 ? yearParam + 1 : yearParam;

	return {
		year: yearParam, month: monthParam, monthName, cells,
		prevLink: `?year=${prevYear}&month=${prevMonth}`,
		nextLink: `?year=${nextYear}&month=${nextMonth}`,
		weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	};
};
