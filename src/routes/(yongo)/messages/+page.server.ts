import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.ts';

export const prerender = false;
export const load: PageServerLoad = async (session) => {
    var sessionData = session.cookies.get('sid');
    if (!sessionData) {
        return redirect(303, '/');
    }
    return {};
};