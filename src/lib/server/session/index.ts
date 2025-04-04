import { randomBytes} from 'node:crypto';
import { deleteDbSession, getDbSession, insertDbSession } from '../db/index.js';
import type { SessionInfo } from '../db/types.js';
import type { Cookies } from '@sveltejs/kit';

type Sid = string;

const sessionStore = new Map<Sid, SessionInfo>();

function getSid(): Sid {
  return randomBytes(32).toString('hex');
}

export async function createSession(username: string): Promise<string> {
  let sid: Sid = '';
  
  do {
    sid = getSid();
  } while (sessionStore.has(sid));

  const data: SessionInfo = { username, };
  // try/catch
  await insertDbSession(sid, data);

  sessionStore.set(sid, {
    username,
  });

  return sid;
}

export async function performLogin(cookies: Cookies, username: string) {
  const sid = await createSession(username);

  cookies.set('sid', sid, { path: '/' });
}

export async function getSession(sid: Sid): Promise<SessionInfo | undefined> {
  if (sessionStore.has(sid)) {
    return sessionStore.get(sid);
  } else {
    const session = await getDbSession(sid);
    if (session) {
      sessionStore.set(sid, session);
      return session;
    }
  }

  console.log('session not found', sid);
  return undefined;
}

export async function deleteSession(sid: Sid): Promise<void> {
  sessionStore.delete(sid);
  await deleteDbSession(sid);
}