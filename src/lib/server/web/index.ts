import fs from 'node:fs';

export async function getWebContent() {
    const html = "src/lib/assets/playground.html"
    try {
        const data = await fs.promises.readFile(html);
        const content = data.toString();
        return content;
    } catch(err) {
        throw err;
    }
}