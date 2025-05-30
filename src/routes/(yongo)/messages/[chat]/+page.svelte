<script lang="ts">
    import type { PageProps } from './$types.js';
    import { onMount, onDestroy } from 'svelte';
    import { connectWebSocket } from '$lib/sockets/index.js';
    import type { MessageObj } from '$lib/types/types.js';
	import { afterNavigate } from '$app/navigation';

    let { data }: PageProps = $props();
    let chat = $derived(data.chat);
    let prevChat = data.chat;

    let messages: MessageObj[] = $state<MessageObj[]>(data.messages ?? []);
    let socket: WebSocket;

    onMount(() => {
        socket = connectWebSocket(messages, chat);
    });

    afterNavigate(() => {
        if (chat !== prevChat) {
            prevChat = chat;
            messages = data.messages ?? [];
            if (socket) socket.close();
            socket = connectWebSocket(messages, chat);
        }
    });

    onDestroy(() => {
        socket?.close();
    });

    let newText = $state("");
    let newMedia = "";
    let username = data.username ?? "";
    
    function handleSend() {
        if (newText.trim() || newMedia !== "") {
            if (socket && socket.readyState === WebSocket.OPEN) {
                const newMessage: MessageObj = { sender: username, datetime: Math.floor(Date.now() / 1000), message: { text: newText, media: newMedia } };
                socket.send(JSON.stringify({ chatUrl: chat, msgType: 'msg', message: newMessage }));
                messages.push(newMessage);
                newText = "";
                newMedia = "";
            } else {
                alert("WebSocket is not connected!");
            }
        }
    }

    var container: HTMLElement | null;
    var observer: MutationObserver;
    function containerLoad(){
        container = document.getElementById("main-chat-container");
        observer = new MutationObserver(scrollToBottom);
        if (container) observer.observe(container, {childList: true});
    }
    function scrollToBottom() {
        if (container) container.scrollTop = container.scrollHeight;
    }

    function getMediaUrl(media: string) {
        return "../src/lib/assets/chat-media/" + media;
    }

    function isImage(media: string) {
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
		if (allowedExtensions.exec(media)) {
            return true
        } else {
            return false
        }
    }
</script>

<div class="flex flex-col h-full w-full p-3">
    <div class="flex flex-col-reverse flex-1 w-full min-w-md overflow-y-auto scroll-snap-y-container"
        id="main-chat-container" onloadeddata={containerLoad}>
        {#if messages}
            {#each [...messages].reverse() as message}
                <div class="w-auto mb-2 align-middle text-pretty">
                    <span class="p-1 bg-[#03142b] text-sm text-white rounded-sm align-middle">{message.sender}</span>
                    {#if message.message.text !== ""}
                        <p class="w-full p-0.5 text-white text-md" title={new Date(message.datetime * 1000).toLocaleString()}>
                            {message.message.text}
                        </p>
                    {/if} 
                    {#if message.message.media !== ""}
                        {#if isImage(message.message.media)}
                            <img src={getMediaUrl(message.message.media)} 
                                class="max-w-1/2 min-w-[50px] p-0.5 mt-1 rounded-md" alt=""
                                title={new Date(message.datetime * 1000).toLocaleString()}/>
                        {/if}
                    {/if}
                </div>
            {/each}
        {/if}
    </div>
    <div class="flex flex-none w-full rounded-md h-1/15 bg-[#969696]/40 text-white items-center mt-2 pr-3">
        <input class="flex-1 outline-none border-none bg-transparent text-white focus:ring-transparent focus:ring-offset-0"
			bind:value={newText}
			onkeydown={(e) => e.key === 'Enter' && handleSend()}
			placeholder="Send a message..."
		/>
		<button onclick={handleSend}>Send</button>
    </div>
</div>