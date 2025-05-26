<script>
    import dinoImg from '$lib/assets/dinosaur.jpg';

    let showDino = false;
</script>

<svelte:head>
    <title>The Playground</title>
</svelte:head>

<button
    style="width:20%;color:white;cursor:pointer"
    class="absolute top-36 left-36 rounded-lg py-2"
    class:bg-red-500={showDino}
    class:bg-green-500={!showDino}
    on:click=
        {
            () => {showDino = !showDino}
        }
>
    {#if showDino}
        Why is it spinning
    {:else}
        Ok I wanna see a cool dinosaur
    {/if}
</button>

<img src={dinoImg} alt="RAAAAAAARRRRRRRRRRRR" title="RAAAAAAARRRRRRRRRRRR" 
    class="absolute top-30 right-70 h-[500px] spinnin" hidden={!showDino} 
/>

<style>
    .spinnin {
        animation: 2s linear 0s infinite normal none running rotate;
    }
    @keyframes rotate {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>