<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
    <style>
        body {background-color: rgb(3, 20, 43);}
    </style>
</svelte:head>

{@render children()}
