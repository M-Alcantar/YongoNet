import fs from 'node:fs';
import { randomBytes} from 'node:crypto';
import { insertDbChat, getDbContacts } from '../db/index.js';
import { getRequestEvent } from '$app/server';

function getChatUrl(): string {
    return randomBytes(12).toString('hex');
}

async function checkUrlExists(url: string) {
    const full_url = "src/lib/assets/chat-logs/" + url + ".json";

    try {
        await fs.promises.access(full_url, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

export async function createChat(user1: string, user2: string): Promise<string> {
    let url = ""

    do {
        url = getChatUrl();
    } while (await checkUrlExists(url));

    const full_url = "src/lib/assets/chat-logs/" + url + ".json"
    fs.writeFile(full_url, "", (err) => {
        if (err) {
            console.error('Error creating chat log:', err);
            return;
        }
    });

    // try/catch
    await insertDbChat(user1, user2, url);

    return url;
}

export async function getContacts() {
    const { locals } = getRequestEvent();

    if (!locals.username) {
        return;
    }

    try {
        const contacts =  await getDbContacts(locals.username);
        return contacts;
    } catch {
        return;
    }
}