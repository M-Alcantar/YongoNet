import { writeFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export const POST = async ({ request }) => {
    const formData = await request.formData();
    const fileEntry = formData.get('file');

    // Validation checks
    if (!fileEntry) {
        return new Response(JSON.stringify({ 
            success: false,
            error: 'fileMissing'
        }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!(fileEntry instanceof Blob)) {
        return new Response(JSON.stringify({
            success: false,
            error: 'invalidFile'
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const fileName = fileEntry.name || 'uploaded_file';
        const fileExtension = extname(fileName).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt', 
                                   '.docx', '.xlsx', '.mp3', '.wav', '.flac', '.avi',
                                   '.mp4', '.mov', '.webp', '.pptx', '.ogg', '.flv'];
        
        if (!allowedExtensions.includes(fileExtension)) {
            return new Response(JSON.stringify({
                success: false,
                error: 'invalidFileType',
                allowedTypes: allowedExtensions.join(', ')
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const fileBuffer = await fileEntry.arrayBuffer();
        const fileSize = fileBuffer.byteLength;

        if (fileSize === 0) {
            return new Response(JSON.stringify({
                success: false,
                error: 'fileEmpty'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (fileSize > 10 * 1024 * 1024) {
            return new Response(JSON.stringify({
                success: false,
                error: 'fileTooLarge',
                maxSize: '10MB'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Use static/uploads for better accessibility
        const uploadDir = join(process.cwd(), 'src/lib/assets/chat-media');
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }

        const uniqueFilename = `${crypto.randomUUID()}${fileExtension}`;
        const filePath = join(uploadDir, uniqueFilename);

        await writeFile(filePath, Buffer.from(fileBuffer));
        
        return new Response(JSON.stringify({
            success: true,
            filename: uniqueFilename,
            url: `/chat-media/${uniqueFilename}`,
            size: fileSize
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('Upload failed:', err);
        return new Response(JSON.stringify({
            success: false,
            error: 'serverError',
            message: err instanceof Error ? err.message : 'Upload failed'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};