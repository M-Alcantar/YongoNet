import type { MessageObj } from '$lib/types/types.js';

export async function connectWebSocket(
    messages: MessageObj[],
    chatUrl: string
) {
    const socket = new WebSocket("ws://192.168.1.69:5000"); // your own ip here
    socket.onopen = () => {
        socket.send(JSON.stringify({ msgType: 'join', chatUrl }));
    };
    socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.chatUrl === chatUrl && data.msgType === 'msg') {
            messages.push(data.message);
        }
        if (data.chatUrl === chatUrl && data.msgType === 'ack' && !data.delivered) {
            // No one else online, save to server
            await fetch(`/api/save-message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatUrl, messages })
            });
        }
    };
    socket.onclose = async () => {
        await fetch(`/api/save-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatUrl, messages })
        });
    }

    return socket;
}