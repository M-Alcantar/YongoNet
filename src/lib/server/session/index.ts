import { getUserID } from '../db/index.js';
import type { Cookies } from '@sveltejs/kit';

type SessionInfo = {
  username: string;
};

const sessionStore = new Map<string, SessionInfo>();

export async function createSession(username: string): Promise<string> {
  const sID = await getUserID(username);

  sessionStore.set(sID, {
    username,
  });

  return sID;
}

export async function performLogin(cookies: Cookies, username: string) {
  const maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
  const sID = await createSession(username);

  cookies.set('sid', sID, {
    maxAge,
    path: '/'
  });
}

export function getSession(sID: string): SessionInfo | undefined {
  const session = sessionStore.get(sID);

  if (session) {
    return session;
  } else {
    console.log('session not found', sID);
    return undefined;
  }
}

export function deleteSession(sID: string): void {
  sessionStore.delete(sID);
  //deleteDbSession(sid);
}