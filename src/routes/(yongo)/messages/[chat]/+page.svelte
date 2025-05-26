<script lang="ts">
    import type { PageProps } from './$types.js';

    let { data }: PageProps = $props();

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

<div class="flex flex-col h-full w-full px-5 py-3">
    <div class="flex flex-col flex-1 w-full min-w-md overflow-y-auto scroll-snap-y-container">
        {#await data.messages}
            <p class="text-sm text-white text-center">Loading messages...</p>
        {:then}
            {#if data.messages}
                {#each data.messages as message}
                    <div class="w-auto mb-2 align-middle text-pretty">
                        <span class="p-1 bg-[#03142b] text-sm text-white rounded-sm align-middle">{message.sender}</span>
                        {#if message.message.text !== ""}
                            <p class="w-full text-white text-md" title={new Date(message.datetime * 1000).toLocaleString()}>
                                {message.message.text}
                            </p>
                        {/if}
                        {#if message.message.media !== ""}
                            {#if isImage(message.message.media)}
                                <img src={getMediaUrl(message.message.media)} 
                                    class="max-w-1/2 min-w-[50px] mt-1 rounded-md" alt=""/>
                            {/if}
                        {/if}
                    </div>
                {/each}
            {/if}
        {/await}
    </div>
    <div class="flex flex-none w-full rounded-md h-1/15 bg-[#969696]/40 text-white items-center mt-2 px-3">Send a massage...</div>
</div>