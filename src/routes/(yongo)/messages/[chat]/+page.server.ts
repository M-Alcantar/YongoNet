import { error, fail, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types.ts';
import { retrieveMessages } from '$lib/server/chat/index.js';

export const prerender = false;
//export const ssr = false;

export const load: PageServerLoad = async ({ cookies, params }) => {
    var sessionData = cookies.get('sid');
    if (!sessionData) {
        return redirect(303, '/');
    }

    let messages = await retrieveMessages(params.chat);

    return {
        messages: messages,
        chat: params.chat
    };
};
