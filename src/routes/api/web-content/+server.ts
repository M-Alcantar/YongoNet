import type { RequestHandler } from './$types.js';
import { getWebContent } from '$lib/server/web/index.js';

export const GET: RequestHandler = async ({}) => {
    try {
        const content = await getWebContent();
        return new Response(content);
    } catch (e) {
        return new Response('Error', { status: 500 });
    }
};