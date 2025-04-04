import { deleteSession } from '$lib/server/session/index.js';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load = (({ cookies }) => {
  const sID = cookies.get('sid');

  if (sID) {
    cookies.delete('sid', { path: '/' });
    deleteSession(sID);
  }

  throw redirect(303, '/');
}) satisfies PageServerLoad;