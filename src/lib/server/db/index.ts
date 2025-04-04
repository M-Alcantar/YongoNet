import db from '$lib/server/db/database.js';
import bcrypt from 'bcryptjs';

export async function usernameTaken(username: string): Promise<boolean> {
    const existingUser = await db`select username from users where username like ${ username }`

    return existingUser.length ? true : false;
}

export async function createUser(username: string, password: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, 12);

    const new_user = {
        username: username,
        password_hash: passwordHash,
    }
      
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

export async function getUserID(username: string): Promise<string> {
    const userRow = await db`select user_id from users where username like ${ username }`

    if (!userRow.length) {
        return "";
    } else {
        let userID = userRow.at(0)
        if (!userID) {
            return "";
        } else { 
            return userID.user_id;
        }
    }
}