import { error, fail, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types.ts';
import { usernameTaken, createUser } from '$lib/server/db/index.js';

export const prerender = false;
export const load: PageServerLoad = async (session) => {
    var sessionData = session.cookies.get('sid');
    if (sessionData) {
        return redirect(303, '/');
    }
    return {};
};

const register: Action = async ({ request }) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    if (!username) {
        return fail(400, { nameEmpty: true })
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
        return error(400, 'Username and Password must be a string');
    }

    if (username.length > 64) {
        return fail(400, { nameLen: true })
    }
    if (password.length < 8 || password.length > 50) {
        return fail(400, { passLen: true })
    }

    try {
        if (await usernameTaken(username)) {
            return fail(400, { userExists: true });
        }

        await createUser(username, password);
    } catch (error) {
        console.error('Error during user registration:', error);
        return fail(500, { error: 'Internal server error' });
    }

    console.log(`New user registered: ${ username }`)
    return redirect(303, '../');
};

export const actions: Actions = { register };