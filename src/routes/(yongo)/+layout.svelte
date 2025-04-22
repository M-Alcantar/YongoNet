<script lang="ts">
    import Loader from '$lib/Loader.svelte';
	import type { Snippet } from 'svelte';
	import '../../app.css';
	import type { LayoutServerData } from './$types.js';

	let loading = $state(false);
	let { data, children }: { data: LayoutServerData, children: Snippet<[]> } = $props();
</script>

<header>
	<nav class="flex float-top px-4 py-3 items-center text-white bg-[#091d38] rounded-b-2xl" aria-label="main navigation">
	  	<div class="max-w-md pl-2 pr-10">
			<a href="/" class="text-[35px] font-semibold">YongoNet</a>
	  	</div>
	  	<div class="flex-1 mt-1">
		  	<a href="/playground" class="text-[20px]">Playground</a>
	  	</div>
  
	  	<div class="mr-2">
	  		<div>
				{#if data?.username}
				<p>Hello {data.username}! | <a 
					href="/logout" data-sveltekit-preload-data="off" data-sveltekit-reload
					onclick={() => {loading = !loading}}>
						Log out
					</a>
				</p>
				
				{:else}
				<a href="/login" class="button is-primary">Log in</a>
				{/if}
		  	</div>  
		</div>
	</nav>
</header>

{#if loading}
    <Loader></Loader>
{/if}

{@render children()}
