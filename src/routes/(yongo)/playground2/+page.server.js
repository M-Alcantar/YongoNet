import { writeFile } from 'node:fs/promises';
import { extname } from 'path';

/** @type {import('./$types.js').Actions} */
export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const uploadedFile = formData?.get('file');
    if (uploadedFile instanceof File){
    const filename = `/src/lib/assets/uploads/${crypto.randomUUID()}${extname(uploadedFile?.name)}`;
    await writeFile(filename, Buffer.from(await uploadedFile?.arrayBuffer()));
    }
    return { success: true };
  }
};
