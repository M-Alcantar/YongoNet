<script>
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
    <style>
        body {background-color: rgb(171,210,247);}
		header {
  			padding: 5px;
  			text-align: center;
  			font-size: 35px;
			font-weight: bold;
  			color: black;
		}
    </style>
</svelte:head>

<ul class="absolute bottom-4 left-5">
	<li><a href="/">• Home</a></li>
	<li><a href="/playground">• Playground</a></li>
</ul>

{@render children()}
