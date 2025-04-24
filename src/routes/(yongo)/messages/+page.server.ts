import { error, fail, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types.ts';
import { usernameTaken, createChat } from '$lib/server/db/index.js';

export const prerender = false;
export const load: PageServerLoad = async (session) => {
    var sessionData = session.cookies.get('sid');
    if (!sessionData) {
        return redirect(303, '/');
    }
    return {};
};

const addChat: Action = async ({ request, locals }) => {
    const data = await request.formData();
    const username = data.get('username');
    const thisUser = locals.username;

    if (!username || !thisUser) {
        return fail(400, { nameEmpty: true })
    }

    if (typeof username !== 'string') {
        return error(400, 'Username must be a string');
    }

    if (thisUser === username) {
        return fail(400, { sameUser: true })
    }

    if (!await usernameTaken(username)) {
        return fail(400, { userDoesntExist: true });
    }

    try {
        const chatLog = await createChat(thisUser, username);
        console.log(`New chat from ${ thisUser } and ${ username } at ${ chatLog }`)
    } catch (error) {
        console.error('Error during chat creation:', error);
        return fail(500, { error: 'Internal server error' });
    }

    return redirect(303, '/messages');
};

export const actions: Actions = { addChat };