<script lang="ts">
	export let data: {
        userIp: string | null
    };
</script>

<svelte:head>
    <title>Welcome to YongoNet!</title>
</svelte:head>

<br>
<p style="text-align:center" class="text-white text-xl">
    <strong>Welcome to YongoNet!</strong>
    <br>
    {#if data.userIp}
        Your IP is {data.userIp}
    {:else}
        You sly dog, we can't see your IP
    {/if}
</p>

<!-- svelte-ignore a11y-media-has-caption -->
<video src="http://localhost:5001/stream/Rain.mp4" controls></video>
<br>
<embed
  src="http://localhost:5001/stream/dummy.pdf"
  type="application/pdf"
  width="100%"
  height="600px"
/>