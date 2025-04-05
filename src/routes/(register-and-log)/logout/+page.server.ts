import { deleteSession } from '$lib/server/session/index.js';
import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load = (async ({ cookies }) => {
  const sID = cookies.get('sid');

  if (sID) {
    cookies.delete('sid', { path: '/' });
    try {
      await deleteSession(sID);
    } catch (error) {
      console.error('Error during user logout:', error);
      return fail(500, { error: 'Internal server error' });
    }
  }

  throw redirect(303, '/');
}) satisfies PageServerLoad;