<script lang="ts">
    import { onMount } from 'svelte';

    let socket: WebSocket;
    let message = "";
    let messages = [];

    const sendMessage = () => {
        if (message.trim() === '') return;

        socket.send(message);
        messages.push({ text: message, sender: "You" });
        message = "";
    };

    onMount(() => {
        socket = new WebSocket("https://localhost:5000");

        socket.addEventListener("open", () => {
            console.log("Connected to the server");
        });

        socket.addEventListener("message", (message) => {
            console.log("Received message:", message);
            messages.push({ text: message, sender: 'Other User' });
        });

        return () => {
            socket.close();
        };
    });
</script>