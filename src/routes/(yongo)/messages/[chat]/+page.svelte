<script lang="ts">
    import type { PageProps } from './$types.js';

    let { data }: PageProps = $props();
</script>

<div class="flex flex-col h-full w-full px-5 py-3">
    <div class="flex flex-col flex-1 w-full min-w-md ">
        {#if data.messages}
            {#each data.messages as message}
                <div class="w-auto mb-2 align-middle">
                    <span class="p-1 -ml-1 bg-[#03142b] text-sm text-white rounded-sm align-middle">{message.sender}</span>
                    {#if message.message.text !== ""}
                        <p class="w-full text-white text-md" title={new Date(message.datetime * 1000).toLocaleString()}>
                            {message.message.text}
                        </p>
                    {/if}
                </div>
            {/each}
        {/if}
    </div>
    <div class="flex flex-none w-full rounded-md h-1/15 bg-[#969696]/40 text-white items-center px-3">Send a massage...</div>
</div>