import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('mw_token');
	event.locals.token = token ?? '';

	if (!token && !event.url.pathname.startsWith('/login')) {
		throw redirect(303, '/login');
	}

	return resolve(event);
};
