<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
    <style>
        body {background-color: rgb(3, 20, 43);}
    </style>
</svelte:head>

<nav class="flex w-3/20 bg-[#969696]/40 p-[20px] pl-[40px] absolute bottom-0 left-0 ">
	<ul class="p-0 list-disc">
		<li><a href="/">Home</a></li>
		<li><a href="/playground">Playground</a></li>
		<li><a href="/register">Sign up</a></li>
		<li><a href="/login">Log in</a></li>
	</ul>
</nav>


{@render children()}
