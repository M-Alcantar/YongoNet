import { WebSocketServer } from 'ws';

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