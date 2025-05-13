<script>
	let files = $state();


	$effect(() => {
		if (files) {
			// Note that `files` is of type `FileList`, not an Array:
			// https://developer.mozilla.org/en-US/docs/Web/API/FileList
			console.log(files);

			for (const file of files) {
				console.log(`${file.name}: ${file.size} bytes`);
			}
		}
	});
</script>


<svelte:head>
    <title>The Playground TWO BABY!</title>
</svelte:head>

<form method="post" enctype="multipart/form-data">
	<input type="file" name="file" />
	<button>Upload</button>
  </form>  

<label style="width:20%;color:white;cursor:pointer" for="avatar">Upload a picture:</label>
<input accept="image/png, image/jpeg" bind:files id="avatar" name="avatar" type="file" />

<label style="width:20%;color:white;cursor:pointer" for="many">Upload multiple files of any type:</label>
<input bind:files id="many" multiple type="file" />

{#if files}
	<h2> <label style="width:20%;color:white;cursor:pointer">Selected files:</label></h2>
	{#each Array.from(files) as file}
		<p> <label style="width:20%;color:white;cursor:pointer">{file.name} ({file.size} bytes)</label></p>
	{/each}
{/if}
