import type { LayoutServerLoad } from './$types.ts';
import { getContacts } from '$lib/server/chat/index.js';

export const prerender = false;
export const load: LayoutServerLoad = async ({ locals }) => {
    if (locals) {
        return {
            contacts: await getContacts()
        };
    }
};