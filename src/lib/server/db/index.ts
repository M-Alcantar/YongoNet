import db from '../db/database.js';
import type { SessionInfo } from '../db/types.js';
import bcrypt from 'bcryptjs';

export async function usernameTaken(username: string): Promise<boolean> {
    const existingUser = await db`select username from users where username = ${ username }`

    return existingUser.length ? true : false;
}

export async function createUser(username: string, password: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, 12);

    const new_user = {
        username: username,
        password_hash: passwordHash,
    }
    
    // probably should add some try/catch 
    await db`insert into users (username, password_hash) values (${ username }, ${ passwordHash })`
}

export async function checkUserCredentials(username: string, password: string): Promise<boolean> {
    const realUser = await db`select password_hash from users where username like ${ username }`

    if (!realUser.length) {
        return false;
    } else {
        let userHash = realUser.at(0)
        if (!userHash) {
            return false;
        } else { 
            return bcrypt.compare(password, userHash.password_hash);
        }
    }
}

export async function insertDbSession(sid: string, sessionInfo: SessionInfo) {
    const sessionData = JSON.stringify(sessionInfo);
    // try/catch
    await db`insert into sessions (ses_id, ses_data) values (${ sid }, ${ sessionData })`
}

export async function deleteDbSession(sid: string) {
    // try/catch
    await db`delete from sessions where ses_id = ${ sid }`
}

export async function getDbSession(sid: string): Promise<SessionInfo | undefined> {
    const sessionData = await db`select ses_data from sessions where ses_id = ${ sid }`

    if (!sessionData.length) {
        return undefined;
    } else {
        let sessionRow = sessionData.at(0)
        if (typeof sessionRow === 'undefined') {
            return undefined;
        } else { 
            const data = JSON.parse(sessionRow.ses_data);
            return data as SessionInfo;
        }
    }
}