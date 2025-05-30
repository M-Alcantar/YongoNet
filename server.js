import { WebSocketServer } from 'ws';
import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';

const wss = new WebSocketServer({ port: 5000 });
const chats = new Map(); // chatUrl -> Set of sockets

wss.on('connection', (ws) => {
    let currentChat = null;

    ws.on('message', (data) => {
        let msg;
        try {
            msg = JSON.parse(data);
        } catch {
            return;
        }
        const { chatUrl, msgType, message } = msg;

        if (msgType === 'join') {
            currentChat = chatUrl;
            if (!chats.has(chatUrl)) chats.set(chatUrl, new Set());
            chats.get(chatUrl).add(ws);
        }

        if (msgType === 'msg' && currentChat) {
            // Broadcast to all in the room except sender
            let delivered = false;
            for (const client of chats.get(currentChat)) {
                if (client !== ws && client.readyState === ws.OPEN) {
                    client.send(JSON.stringify({ chatUrl, msgType: 'msg', message }));
                    delivered = true;
                }
            }
            // Send ack to sender
            ws.send(JSON.stringify({ chatUrl, msgType: 'ack', delivered }));
        }
    });

    ws.on('close', () => {
        if (currentChat && chats.has(currentChat)) {
            chats.get(currentChat).delete(ws);
        }
    });
});

console.log('WebSocket server running on ws://localhost:5000');

const mediaDir = path.join(process.cwd(), 'src', 'lib', 'assets', 'chat-media');

const mimeTypes = {
    '.mp4': 'video/mp4',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png'
};

const httpServer = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    // Ruta: /stream/filename.ext
    if (parsedUrl.pathname.startsWith('/stream/')) {
        const fileName = decodeURIComponent(parsedUrl.pathname.replace('/stream/', ''));
        const filePath = path.join(mediaDir, fileName);

        if (!fs.existsSync(filePath)) {
            res.writeHead(404);
            res.end('Archivo no encontrado');
            return;
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const ext = path.extname(fileName).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        // Soporte de rangos para video
        if (ext === '.mp4' && req.headers.range) {
            const range = req.headers.range;
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = (end - start) + 1;
            const file = fs.createReadStream(filePath, { start, end });
            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': contentType,
            });
            file.pipe(res);
        } else {
            res.writeHead(200, {
                'Content-Length': fileSize,
                'Content-Type': contentType,
            });
            fs.createReadStream(filePath).pipe(res);
        }
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

httpServer.listen(5001, () => {
    console.log('HTTP streaming server running on http://localhost:5001');
});