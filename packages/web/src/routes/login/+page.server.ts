import { fail, redirect } from '@sveltejs/kit';
import { apiPostPublic, ApiError } from '$lib/api/client';
import type { AuthTokenResponse } from '$lib/api/types';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();

		const host = form.get('host') as string;
		const port = Number(form.get('port')) || 6710;
		const dataFile = form.get('dataFile') as string;
		const username = form.get('username') as string;
		const password = form.get('password') as string;

		if (!host || !dataFile || !username || !password) {
			return fail(400, { error: 'All fields are required', host, port, dataFile, username });
		}

		try {
			const result = await apiPostPublic<AuthTokenResponse>('/auth/token', {
				host,
				port,
				dataFile,
				username,
				password
			});

			cookies.set('mw_token', result.accessToken, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 60 * 60 * 24
			});

			cookies.set('mw_refresh', result.refreshToken, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7
			});

			cookies.set('mw_company', result.company.name, {
				path: '/',
				httpOnly: false,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24
			});
		} catch (err) {
			if (err instanceof ApiError) {
				return fail(401, {
					error: 'Invalid credentials or connection failed',
					host,
					port,
					dataFile,
					username
				});
			}
			return fail(500, { error: 'Connection failed', host, port, dataFile, username });
		}

		throw redirect(303, '/names');
	}
};
