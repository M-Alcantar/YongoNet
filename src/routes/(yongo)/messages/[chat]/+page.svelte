<script lang="ts">
    import type { PageProps } from './$types.js';

    let { data }: PageProps = $props();
</script>

<div class="flex flex-col h-full w-full px-5 py-3">
    <div class="flex-1">
        <p class="text-white text-center">{JSON.stringify(data.messages?.at(0))}</p>
    </div>
    <div class="flex-none h-1/15 bg-[#cccccc] w-full">Inputi Hari poti</div>
</div>