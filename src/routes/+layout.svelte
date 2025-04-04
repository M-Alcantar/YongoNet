<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import type { LayoutServerData } from './$types.js';

	let { data, children }: { data: LayoutServerData, children: Snippet<[]> } = $props();
</script>

<svelte:head>
    <style>
        body {background-color: rgb(3, 20, 43);}
    </style>
</svelte:head>

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
					href="/logout" data-sveltekit-preload-data="off" data-sveltekit-reload>
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

<nav class="flex w-3/20 bg-[#969696]/40 p-[20px] pl-[40px] absolute bottom-0 left-0 ">
	<ul class="p-0 list-disc">
		<li><a href="/">Home</a></li>
		<li><a href="/playground">Playground</a></li>
		<li><a href="/register">Sign up</a></li>
		<li><a href="/login">Log in</a></li>
	</ul>
</nav>


{@render children()}
