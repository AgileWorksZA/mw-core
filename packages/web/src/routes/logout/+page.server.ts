import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ cookies }) => {
		cookies.delete('mw_token', { path: '/' });
		cookies.delete('mw_refresh', { path: '/' });
		cookies.delete('mw_company', { path: '/' });
		throw redirect(303, '/login');
	}
};
