import type { RequestHandler } from './$types.js';
import { saveNewMessages } from '$lib/server/chat/index.js';

export const POST: RequestHandler = async ({ request }) => {
    const { chatUrl, messages } = await request.json();
    try {
        await saveNewMessages(messages, chatUrl);
        return new Response('OK');
    } catch (e) {
        return new Response('Error', { status: 500 });
    }
};