import fs from 'node:fs';
import { randomBytes} from 'node:crypto';
import { insertDbChat, getDbContacts } from '../db/index.js';
import type { MessageObj } from '../db/types.js';
import { getRequestEvent } from '$app/server';

let zeroMessage : MessageObj[] = [ { sender: "", datetime: 0, message: { text: "", media: "" } } ]
let dir = "src/lib/assets/chat-logs/"

function getChatUrl(): string {
    return randomBytes(12).toString('hex');
}

async function checkUrlExists(url: string) {
    const full_url = dir + url + ".json";

    try {
        await fs.promises.access(full_url, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

export async function createChat(user1: string, user2: string): Promise<string> {
    let url = ""

    if (!fs.existsSync(dir)) {
        fs.mkdir(dir, (err) => { if (err) throw err; })
    }

    do {
        url = getChatUrl();
    } while (await checkUrlExists(url));

    const full_url = dir + url + ".json"
    fs.writeFile(full_url, "", (err) => {
        if (err) {
            console.error('Error creating chat log:', err);
            throw err;
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

export async function retrieveMessages(chatUrl: string) {
    if (!(await checkUrlExists(chatUrl))) {
        return;
    }

    const full_url = dir + chatUrl + ".json"
    let messageData: MessageObj[] = zeroMessage
    try {
        const data = await fs.promises.readFile(full_url)
        messageData = JSON.parse(data.toString())
    } catch(err) {
        throw err;
    }
    
    return messageData;
}