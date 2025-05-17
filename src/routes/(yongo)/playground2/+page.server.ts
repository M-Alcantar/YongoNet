import type { Snippet } from 'svelte';
import { page } from '$app/state';
import type { Action, ActionData } from './$types.ts';
let { form, children }: { form: ActionData, children: Snippet<[]> } = $props();
import { writeFile } from 'node:fs/promises';
import { extname } from 'path';

export const prerender = false;

/** @type {import('./$types').Actions} */
const addFile: Action = async ({request}) => {
    const formData = await request.formData();
    const uploadedFile = formData?.get('file');
    const filename = `/src/lib/assets/uploads/${crypto.randomUUID()}${extname(uploadedFile?.name)}`;
    await writeFile(filename, Buffer.from(await uploadedFile?.arrayBuffer()));
    return { success: true };
  };


  const addChat: Action = async ({ request, locals }) => {
    const data = await request.formData();
    const username = data.get('username');
    const thisUser = locals.username;
    const contacts = await getContacts();

    if (!username || !thisUser) {
        return fail(400, { nameEmpty: true })
    }

    if (typeof username !== 'string') {
        return error(400, 'Username must be a string');
    }

    if (thisUser === username) {
        return fail(400, { sameUser: true })
    }

    if (!await usernameTaken(username)) {
        return fail(400, { userDoesntExist: true });
    }

    if (contacts) {
        for (const contact of contacts) {
            if (contact.username === username) {
                return fail(400, { chatExists: true })
            }
        }
    }

    try {
        const chatLog = await createChat(thisUser, username);
        console.log(`New chat from ${ thisUser } and ${ username } at ${ chatLog }`)
    } catch (error) {
        console.error('Error during chat creation:', error);
        return fail(500, { error: 'Internal server error' });
    }

    return redirect(303, '/messages');
};

export const actions: Actions = { addChat };