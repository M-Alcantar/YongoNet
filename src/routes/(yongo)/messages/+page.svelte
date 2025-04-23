<script>
    let showAbout = $state(false);
    function toggleAbout() {
        showAbout = !showAbout;
    }
</script>

<svelte:head>
    <title>Messages</title>
</svelte:head>

<div class="flex h-[90lvh]">
    <div class="float-left w-xs max-w-1/2 h-full pl-5 py-5 space-y-2 bg-transparent text-white">
        <div class="flex mb-3 items-end px-3 font-bold">
            <p class="flex-1 text-[20px]">Messages</p>
            <button class="text-[18px] hover:cursor-pointer" onclick={toggleAbout} aria-label="New conversation">+</button>
        </div>

        <div class="bg-[#091d38] rounded-md inset-shadow-xs/40 px-5 py-3">
            <p>Mensagem 1</p>
        </div>
        <div class="bg-[#091d38] rounded-md inset-shadow-xs/40 px-5 py-3">
            <p>Mensagem 2</p>
        </div>
    </div>

    <div class="flex-auto h-full p-5 bg-transparent">
        <div class="h-full bg-[#091d38] rounded-md inset-shadow-xs/40 px-5 py-3">
            <p class="text-white" style="text-align:center">
                This will be messages in 2027.
            </p>
        </div>
    </div>

</div>

{#if showAbout}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="fixed inset-0 flex justify-center items-center z-[1000]" style="background-color: rgba(0,0,0,0.3)" onclick={toggleAbout}>
        <div class="bg-[#091d38] rounded-xl p-6 w-11/12 max-w-md shadow-lg text-white" onclick={e => e.stopPropagation()}>
            <h2 class="text-xl font-bold mb-4">Oh you wanna find someone huh?</h2>
            <p class="text-justify space-y-">
                Good Frickin Luck
                <br>
                <br>
            </p>

            <div class="mt-4 text-sm leading-relaxed">
                <strong>Referencias:</strong><br>
                El pepe. <a href="https://www.youtube.com/watch?v=gvf4cnAXYDc" class="underline" target="_blank" rel="noopener noreferrer">Ver PDF</a>
            </div>
            <button
                class="mt-6 px-4 py-2 rounded bg-[#0087e8] hover:bg-[#046bbf] hover:cursor-pointer text-white font-semibold"
                onclick={toggleAbout}
            >
                Cancel
            </button>
        </div>
    </div>
{/if}