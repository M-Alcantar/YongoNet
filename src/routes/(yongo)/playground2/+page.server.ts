import type { Snippet } from 'svelte';
import { page } from '$app/state';
import type { Action, ActionData } from './$types.ts';
let { form, children }: { form: ActionData, children: Snippet<[]> } = $props();
import { writeFile } from 'node:fs/promises';
import { extname } from 'path';
import { error, fail, redirect } from '@sveltejs/kit';

export const prerender = false;

/** @type {import('./$types').Actions} */
const addFile: Action = async ({request}) => {
    const formData = await request.formData();
    const uploadedFile = formData?.get('file');
    const filename = `/src/lib/assets/uploads/${crypto.randomUUID()}${extname(uploadedFile?.name)}`;
    await writeFile(filename, Buffer.from(await uploadedFile?.arrayBuffer()));
    return { success: true };
  }


  /**const addFile: Action = async ({ request, locals }) => {
    const data = await request.formData();
    const uploadedFile = data.get('file');
    const fileName = `/src/lib/assets/uploads/${crypto.randomUUID()}${extname(uploadedFile?.name)}`;
    const contacts = await getContacts();

    if (!fileName) {
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
        const fileLog = await addFile;
        console.log(`Added file at ${fileName}`)
    } catch (error) {
        console.error('Error during chat creation:', error);
        return fail(500, { error: 'Internal server error' });
    }

    return redirect(303, '/messages');
};

export const actions: Actions = { addFile };*/