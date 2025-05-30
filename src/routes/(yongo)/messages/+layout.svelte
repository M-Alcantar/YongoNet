<script lang="ts">
    import Loader from '$lib/Loader.svelte';
	import type { Snippet } from 'svelte';
    import { page } from '$app/state';
    import type { ActionData, LayoutServerData } from './$types.js';

	let { data, form, children }: { data: LayoutServerData, form: ActionData, children: Snippet<[]> } = $props();

    let addPage = page.url.href.split('/').pop() || '/';
    let showAbout = $state((addPage === "addChat") ? true : false);
    let loading = $state(false);
</script>

<svelte:head>
    <title>Messages</title>
</svelte:head>

{#if loading}
    <Loader></Loader>
{/if}

<div class="flex h-[90lvh]">
    <div class="float-left w-3/14 max-w-1/2 h-full pl-5 py-5 space-y-2 bg-transparent text-white">
        <div class="flex mb-3 items-end px-3 font-bold">
            <p class="flex-1 text-[20px]">Conversations</p>
            <button class="text-[18px] hover:cursor-pointer" 
                onclick={ () => {showAbout = !showAbout} } 
                aria-label="New conversation"
                title="New conversation">+
            </button>
        </div>
        
        
        {#if data.contacts}
            {#each data.contacts as contact}
                <a href="/messages/{contact.chat_url}">
                    <button class="w-full px-5 py-3 mb-1 rounded-md inset-shadow-xs/40 bg-[#091d38] hover:cursor-pointer">
                        <p class="text-left">{contact.username}</p>
                    </button>
                </a>
            {/each}
        {/if}
    </div>

    <div class="flex-auto w-11/14 min-w-1/2 h-full p-5 bg-transparent">
        <div class="h-full bg-[#091d38] rounded-md inset-shadow-xs/40">
            {@render children()}
        </div>
    </div>

</div>

{#if showAbout}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="fixed inset-0 flex justify-center items-center z-[500]" style="background-color: rgba(0,0,0,0.3)" onclick={ () => {showAbout = !showAbout} }>
        <div class="bg-[#091d38] rounded-xl p-6 w-11/12 max-w-md shadow-lg text-white" onclick={ (e) => e.stopPropagation() }>
            <form 
                action="?/addChat" method="POST"
                onsubmit={ () => {loading = !loading} }
            >
                <div>
                    <h2 class="text-xl font-bold text-center mb-4">Start a new conversation</h2>
                    <div>
                        <label for="username" class="sr-only">Username</label>
                        <input class="w-full mx-auto rounded-lg outline-none border-none bg-gray-900 text-white"
                            id="username"
                            name="username"
                            type="text"
                            required
                            placeholder="Username"
                        />
                    </div>
                    {#if form?.userDoesntExist}
                        <div class="w-full mt-2 mx-auto">
                            <p class="error -mt-1 text-sm text-red-500">User doesn't exist.</p>
                        </div>
                    {/if}
                    {#if form?.nameEmpty}
                        <div class="w-full mt-2 mx-auto">
                            <p class="error -mt-1 text-sm text-red-500">Field cannot be empty.</p>
                        </div>
                    {/if}
                    {#if form?.sameUser}
                        <div class="w-full mt-2 mx-auto">
                            <p class="error -mt-1 text-sm text-red-500">Username can't be yours.</p>
                        </div>
                    {/if}
                    {#if form?.chatExists}
                        <div class="w-full mt-2 mx-auto">
                            <p class="error -mt-1 text-sm text-red-500">Conversation already exists.</p>
                        </div>
                    {/if}

                    <div class="flex flex-row w-full space-x-2 mt-4">
                        <button
                            type="submit"
                            class="flex-1 px-4 py-2 rounded bg-[#0087e8] hover:bg-[#046bbf] hover:cursor-pointer text-white font-semibold" 
                        >
                            Add
                        </button>
                        <button
                            class="flex-1 px-4 py-2 rounded bg-[#0087e8] hover:bg-[#046bbf] hover:cursor-pointer text-white font-semibold"
                            onclick={ () => {showAbout = !showAbout} } 
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
{/if}