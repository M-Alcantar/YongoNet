<script lang="ts">
    import type { PageProps } from './$types.js';
    import { onMount, onDestroy } from 'svelte';
    import { connectWebSocket } from '$lib/sockets/index.js';
    import type { MessageObj } from '$lib/types/types.js';
	import { afterNavigate } from '$app/navigation';
    import { enhance } from "$app/forms";
    import type { SubmitFunction } from '@sveltejs/kit';
    import attach from '$lib/assets/attach.png';
    import send from '$lib/assets/send.png';
    import download from '$lib/assets/download.png';

    let { data }: PageProps = $props();
    let chat = $derived(data.chat);
    let prevChat = data.chat;
    
    let newText = $state("");
    let username = data.username ?? "";

    let selectedFile: File | null = $state(null);
    let isUploading = false;
    let uploadResult: {
        success: boolean;
        filename?: string;
        url?: string;
        error?: string;
    } | null = null;

    let messages: MessageObj[] = $state<MessageObj[]>(data.messages ?? []);
    let socket: WebSocket;

    onMount(async () => {
        socket = await connectWebSocket(messages, chat);
    });

    afterNavigate(async () => {
        if (chat !== prevChat) {
            prevChat = chat;
            newText = "";
            messages = data.messages ?? [];
            if (socket) socket.close();
            socket = await connectWebSocket(messages, chat);
        }
    });

    onDestroy(() => {
        socket?.close();
    });
    
    function handleSend() {
        if (newText.trim() || selectedFile) {
            if (socket && socket.readyState === WebSocket.OPEN) {
                const newMessage: MessageObj = { sender: username, datetime: Math.floor(Date.now() / 1000), 
                                                 message: { text: newText, media: selectedFile?.name ?? "" } };
                socket.send(JSON.stringify({ chatUrl: chat, msgType: 'msg', message: newMessage }));
                messages.push(newMessage);
                newText = "";
                selectedFile = null;
            } else {
                alert("WebSocket is not connected!");
            }
        }
    }

    const handleSubmit: SubmitFunction = () => {
        isUploading = true;
        uploadResult = null;
        
        return async ({ update }) => {
            if (selectedFile) {
                try {
                    handleSend();
                    update();
                } catch (error) {
                    uploadResult = {
                        success: false,
                        error: 'Network error occurred'
                    };
                } finally {
                    isUploading = false;
                }
            } else {
                handleSend();
            }
        };
    };

    function downloadFile(url: string, filename?: string) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || url.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (!target?.files) return;
        selectedFile = target.files[0];
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
                            <a 
                                href={getMediaUrl(message.message.media)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                <img src={getMediaUrl(message.message.media)} 
                                    class="max-w-1/2 min-w-[50px] p-0.5 mt-1 rounded-md" alt=""
                                    title={new Date(message.datetime * 1000).toLocaleString()}/>
                            </a>
                        {:else}
                        {#if message.message.text === ""}
                            <br>
                        {/if}
                            <button 
                                onclick={() => downloadFile(getMediaUrl(message.message.media), message.message.media)}
                                class="flex flex-row text-white mt-1.5 px-2 py-1 h-auto bg-gray-700 rounded-sm cursor-pointer items-center"
                                title="Download file (at your own risk!!)"
                            >
                                {message.message.media} <img src={download} alt="Download file" class="h-4 ml-1.5 mt-0.5 -mr-1"/>
                            </button>
                        {/if}
                    {/if}
                </div>
            {/each}
        {/if}
    </div>
    <div class="flex flex-none w-full rounded-md h-1/15 bg-gray-900 text-white items-center mt-2 pr-3">
        {#if selectedFile}
            <div class="p-1 ml-1.5 rounded-sm bg-gray-400/50 text-white text-sm align-center">{selectedFile.name}</div>
        {/if}
        <input class="flex-1 outline-none border-none bg-transparent text-white focus:ring-transparent focus:ring-offset-0"
			bind:value={newText}
			onkeydown={(e) => e.key === 'Enter' && handleSend()}
			placeholder="Send a message..."
		/>
        <form
            method="POST"
		    action="/api/upload-file"
            enctype="multipart/form-data"
            class="flex flex-row h-full items-center"
            use:enhance={handleSubmit}
        >
            <input
                id="file-upload"
                name="file"
                type="file"
                class="hidden"
        		onchange={handleFileChange}
            >
            <label for="file-upload" class="h-2/3 mr-2.5 cursor-pointer">
                <img src={attach} title="Attach file" alt="upload-file" class="h-full cursor-pointer">
            </label>
            
		    <button type="submit" class="h-3/4 cursor-pointer mr-0.5">
                <img src={send} title="Send" alt="send-message" class="h-3/4">
            </button>
        </form>
    </div>
</div>