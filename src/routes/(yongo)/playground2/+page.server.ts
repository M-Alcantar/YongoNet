import { writeFile } from 'node:fs/promises';
import { extname } from 'path';
import { fail } from '@sveltejs/kit';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export const prerender = false;

/** @type {import('./$types').Actions} */
export const actions = {
    addFile: async ({ request }) => {
        const formData = await request.formData();
        const fileEntry = formData.get('file');

        // Check for an entry file
        if (!fileEntry) {
            return fail(400, { fileMissing: true });
        }

        // Blob to verify if is file
        if (!(fileEntry instanceof Blob)) {
            return fail(400, { invalidFile: true });
        }

        // Safely get file name
        const fileName = fileEntry.name || 'uploaded_file';
        const fileExtension = extname(fileName).toLowerCase();
        
        // Check file type
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.txt'];
        if (!allowedExtensions.includes(fileExtension)) {
            return fail(400, { 
                invalidFileType: true,
                allowedTypes: allowedExtensions.join(', ')
            });
        }

        // Processing
        try {
            const fileBuffer = await fileEntry.arrayBuffer();
            const fileSize = fileBuffer.byteLength;

            // Validate size
            if (fileSize === 0) {
                return fail(400, { fileEmpty: true });
            }

            if (fileSize > 10 * 1024 * 1024) { // Max: 10MB
                return fail(400, { 
                    fileTooLarge: true,
                    maxSize: '10MB'
                });
            }

            // Prepare upload directory
            const uploadDir = join(process.cwd(), 'src', 'lib', 'assets', 'uploads');
            if (!existsSync(uploadDir)) {
                mkdirSync(uploadDir, { recursive: true });
            }

            // Generate unique filename
            const uniqueFilename = `${crypto.randomUUID()}${fileExtension}`;
            const filePath = join(uploadDir, uniqueFilename);

            await writeFile(filePath, Buffer.from(fileBuffer));
            
            return { 
                success: true,
                filename: uniqueFilename,
                size: fileSize
            };

        } catch (err) {
            console.error('File processing error:', err);
            return fail(500, { 
                error: true,
                message: err instanceof Error ? err.message : 'File processing failed'
            });
        }
    }
};