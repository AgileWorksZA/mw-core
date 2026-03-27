import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	return {
		company: cookies.get('mw_company') ?? '',
		isLoggedIn: !!cookies.get('mw_token'),
		pathname: url.pathname
	};
};
