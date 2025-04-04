import { getSession } from '$lib/server/session/index.js';
import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
  const { cookies } = event;
  const sid = cookies.get('sid');

  if (typeof sid !== 'undefined') {
    const session = await getSession(sid);
    if (session) {
      event.locals.username = session.username;
    } else {
      cookies.delete('sid', { path: '/' });
    }
  }

  const response = await resolve(event);
  return response;
}) satisfies Handle;