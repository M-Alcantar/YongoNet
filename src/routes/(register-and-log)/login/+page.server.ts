import { error, fail, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types.js';
import { checkUserCredentials } from '$lib/server/db/index.js';
import { performLogin } from '$lib/server/session/index.js';

export const prerender = false;
export const load: PageServerLoad = async (session) => {
    var sessionData = session.cookies.get('sid');
    if (sessionData) {
        return redirect(303, '/');
    }
    return {};
};

const login: Action = async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    if (!username || !password) {
        return fail(400, { emptyFields: true })
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
        return error(400, 'Username and Password must be a string');
    }

    if (username.length > 64 || password.length < 8 || password.length > 50) {
        return fail(400, { wrongFields: true })
    }

    const correctCreds = await checkUserCredentials(username, password)
    if (!correctCreds) {
        return fail(400, { wrongFields: true })
    }

    try {
        await performLogin(cookies, username);
    } catch (error) {
        console.error('Error during user login:', error);
        return fail(500, { error: 'Internal server error' });
    }

    console.log(`User logged in: ${ username }`)
    return redirect(303, '../');
};

export const actions: Actions = { login };