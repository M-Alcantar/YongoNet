<script>
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
    <style>
        body {background-color: rgb(171,210,247);}
		header {
  			padding: 8px;
  			text-align: center;
  			font-size: 35px;
			font-weight: bold;
  			color: black;
		}
		nav {
			float: left;
			width: 15%;
			background: rgba(150,150,150,0.4);
			padding: 20px;
			padding-left: 40px;
			}
		nav ul {
			list-style-type: disc;
			padding: 0;
		}
    </style>
</svelte:head>

<nav class="absolute bottom-0 left-0">
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/playground">Playground</a></li>
		<li><a href="/Register">Sign up</a></li>
	</ul>
</nav>


{@render children()}
